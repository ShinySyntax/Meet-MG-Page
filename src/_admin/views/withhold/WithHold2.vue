<template>
  <div class="commonright container">
    <!-- 筛选 -->
    <div class="filter">
      <!-- <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" clearable>
                    <el-option v-for="item in typeSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">搜索</button>
            </div> -->
    </div>
    <!-- 数据表格 -->
    <div>
      <el-table :data="data.list">
<!--        <el-table-column label="ID" width="50">-->
<!--          <template slot-scope="scope">-->

<!--            {{ scope.row.id }}-->

<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="昵称" :align="$protovar.align" width="220">
          <template slot-scope="scope">
              昵称：{{ scope.row.nick }}<br/>
              ID:{{ scope.row.uid }}<br />
              手机号：{{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="提现金额" :align="$protovar.align" width="100">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
          <el-table-column label="手续费" :align="$protovar.align" width="100">
          <template slot-scope="scope">
              {{ scope.row.othercny }}
          </template>
      </el-table-column>
        <el-table-column label="到账金额" :align="$protovar.align" width="100">
          <template slot-scope="scope">
            {{ scope.row.realamount }}
          </template>
        </el-table-column>
        <el-table-column label="方式" :align="$protovar.align" width="200">
          <template slot-scope="scope">

            {{ scope.row.paytype == 1? '微信' : scope.row.paytype == 2? '支付宝':scope.row.paytype == 3 ?'银行卡':''}}
            {{ scope.row.remark}}
          </template>
        </el-table-column>
        <el-table-column label="支付状态" :align="$protovar.align" width="150">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? '处理中' : '处理完成' }}
          </template>
        </el-table-column>
        <el-table-column label="审批状态" :align="$protovar.align" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.checkstatus == 1">未审批</div>
            <div v-else-if="scope.row.checkstatus == 2">已审批</div>
            <div v-else>审批拒绝</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" :align="$protovar.align" width="200">
          <template slot-scope="scope">
            {{ scope.row.createtime }}

          </template>
        </el-table-column>
        <el-table-column label="操作" :align="$protovar.align" width="150">
          <template slot-scope="scope"  v-if="scope.row.checkstatus==1 &&scope.row.status == 1">
            <button class="primarybtn search" @click="checked(scope.row)">
              审核通过
            </button>
            <br />
            <button class="primarybtn search" @click="refused(scope.row)">
              审核拒绝
            </button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagecontainer" v-show="data.totalRow > 0">
      <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="data.pageSize"
        :page-sizes="data.pagesizes" :total="data.totalRow" :current-page="data.pageNumber"
        @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { withhold, msgTips } from '@_/axios/path';
export default {
  data() {
    return {

      filters: {
        searchkey: '',
        type: ''
      },
      data: {//数据表格
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0,//总条数
        loading: false,//表单loading
        list: [],//列表
        pagesizes: [10, 20, 30, 40],
        vars: null,
      }
    }
  },
  mounted() {
    this.curroute = this.$route.path;
    this.filters.searchkey = this.$route.query.uid || '';
    this.getData();
  },
  watch: {
    '$route'(to, from) {
      if (to.path == this.curroute) {
        let query = to.query;
        if (query.uid) {
          Object.assign(this.$data, this.$options.data());
          this.filters.searchkey = query.uid || '';
          this.curroute = this.$route.path;
          this.getData();
          return;
        }
        if (this.$protovar.routehasopen != -1 && !query.random) {
          return;
        }
        Object.assign(this.$data, this.$options.data());
        this.curroute = this.$route.path;
        this.getData();
      }
    }
  },
  //封号解封
  methods: {

    // this.$refs.form.validate(async (valid) => {

    checked(id) {
      console.log(id);
      withhold.setChecked(id).then(res => {
        if (res.ok == true) {
          this.getData();
        } else {
          msgTips(res.msg);
        }
      })
    },
    refused(id) {
      console.log(id);
      withhold.refuseChecked(id).then(res => {
        if (res.ok == true) {
          this.getData();
        } else {
          msgTips(res.msg);
        }
      })
    },

    /* 用户账户 */
    getData(item) {

      if (item) {
        this.data.pageNumber = item;
      }
      this.data.loading = true;
      let { pageNumber, pageSize } = this.data;
      var searchkey=1;
      let ptdata = { searchkey,pageNumber, pageSize };
      withhold.getList(ptdata).then(res => {
        if (res.ok) {
          let data = res.data;
          if (data) {
            this.data.totalRow = data.totalRow;
            this.data.list = data.list;
          }
        } else {
          msgTips(res);
        }
        this.data.loading = false;
      })
    },
    /* 切换分页 */
    handleCurrentChange(val) {
      this.data.pageNumber = val;
      this.getData();
    },
    /* 调整每页显示条数 */
    handleSizeChange(val) {
      this.data.pageNumber = 1;
      this.data.pageSize = val;
      this.getData();
    },

    /* 切换分页 */
    handleCurrentReport(val) {
      this.report.pageNumber = val;
      this.getreportlist();
    },
    /* 调整每页显示条数 */
    handleSizeReport(val) {
      this.report.pageNumber = 1;
      this.report.pageSize = val;
      this.getreportlist();
    },

  },
}
</script>
<style scoped></style>