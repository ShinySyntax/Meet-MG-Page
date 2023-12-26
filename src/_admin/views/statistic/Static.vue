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
      <div style="margin-top: 15px;margin-bottom: 10px"><h2>每月充值数据</h2></div>
      <el-table fit style="width: 100%" border  stripe :data="data.rechargeList">
        <el-table-column label="微信充值" :align="$protovar.align" >
          <template slot-scope="scope">
            {{ scope.row.wxcny }}<br />
          </template>
        </el-table-column>
        <el-table-column label="支付宝充值" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.alicny }}
          </template>
        </el-table-column>
        <el-table-column label="转账充值" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.transcny }}
          </template>
        </el-table-column>
        <el-table-column label="后台充值" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.backcny }}
          </template>
        </el-table-column>
        <el-table-column label="总计充值" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.totalcny}}
          </template>
        </el-table-column>
        <el-table-column label="月份" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.months}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <div style="margin-top: 25px;margin-bottom: 10px"><h2>每月提现数据</h2></div>
      <el-table fit style="width: 100%" border  stripe :data="data.withholdList">
        <el-table-column label="微信提现" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.wxcny }}<br />
          </template>
        </el-table-column>
        <el-table-column label="支付宝提现" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.alicny }}
          </template>
        </el-table-column>
        <el-table-column label="转账支出" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.transcny }}
          </template>
        </el-table-column>
        <el-table-column label="后台扣款" :align="$protovar.align" >
          <template slot-scope="scope">
            {{ scope.row.backcny }}
          </template>
        </el-table-column>
        <el-table-column label="总计提现" :align="$protovar.align" >
          <template slot-scope="scope">
            {{ scope.row.totalcny}}
          </template>
        </el-table-column>
        <el-table-column label="月份" :align="$protovar.align">
          <template slot-scope="scope">
            {{ scope.row.months}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { rechargeStatis, withholdStatis } from '@_/axios/path';
export default {
  name: "Static",
  data() {
    return {
      filters: {
        searchkey: '',
        type: ''
      },
      data: {//数据表格
        rechargeList: [],//列表
        withholdList: [],
        loading: false,//表单loading
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
  methods: {
    getData(){
      rechargeStatis().then(res=>{
        console.log("res==",res)
        if (res.ok){
          let data = res.data;
          if (data) {
            this.data.rechargeList = data;
          }else {
            msgTips(res);
          }
        }
        this.data.loading = false;
      })

      withholdStatis().then(res=>{
        console.log("res2==",res)
        if (res.ok){
          let data = res.data;
          if (data) {
            this.data.withholdList = data;
          }else {
            msgTips(res);
          }
        }
        this.data.loading = false;
      })
    }
  }

}
</script>

<style scoped>

</style>