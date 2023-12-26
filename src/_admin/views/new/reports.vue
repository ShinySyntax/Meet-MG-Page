<template>
  <div class="commonright container">
    <!-- 筛选 -->
    <!-- <div class="filter">


            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" clearable>
                    <el-option v-for="item in typeSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>


            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)">查询</button>
            </div>
        </div> -->
    <!-- 数据表格 -->
    <div class="contentpad">
      <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
        <el-table-column label="用户" :align="$protovar.align" width="200">
          <template slot-scope="scope">
            ID：{{ scope.row.u1tiono }}<br />
              昵称：{{ scope.row.u1nick }}<br />

             <span v-if="scope.row.u1phone!=null">
                 手机号：{{scope.row.u1phone}}<br />
             </span>

          </template>
        </el-table-column>

        <el-table-column align="center" prop="credentialImg" width="100">
          <template slot-scope="scope"  label="反馈图片/视频">
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar2 == 'picture'">
              <img :src="scope.row.picurl" width="100%" />
              <img slot="reference" :src="scope.row.picurl" style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar2 == 'mp4'">
              <video :src="scope.row.videourl" width="100%" autoplay="ture" controls="ture" loop="ture" muted="false" />
              <video slot="reference" :src="scope.row.videourl" style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="反馈理由" :align="$protovar.align" width="150">
          <template slot-scope="scope">
            <p v-if="scope.row.reason != null && scope.row.reason != ''" style="color: blue">
              {{ scope.row.reason }}
            </p>
            <p v-if="scope.row.srctext != null &&
              scope.row.srctext != '' &&
              scope.row.avatar3 != 'picture' &&
              scope.row.avatar3 != 'mp4'
              " style="color: firebrick">
              内容：{{ scope.row.srctext }}
            </p>
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar3 == 'picture'">
              <img :src="sentout(scope.row.srctext)" width="100%" />
              <img slot="reference" :src="sentout(scope.row.srctext)"
                style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar3 == 'mp4'">
              <video :src="sentout(scope.row.srctext)" width="100%" autoplay="ture" controls="ture" loop="ture"
                muted="false" />
              <video slot="reference" :src="sentout(scope.row.srctext)"
                style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="credentialImg" width="100">
          <template slot-scope="scope">
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar1 == 'picture'">
              <img :src="scope.row.imgs" width="100%" />
              <img slot="reference" :src="scope.row.imgs" style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
            <el-popover placement="left" trigger="click" width="300" :key="index" v-if="scope.row.avatar1 == 'mp4'">
              <video :src="scope.row.imgs" width="100%" autoplay="ture" controls="ture" loop="ture" muted="false" />
              <video slot="reference" :src="scope.row.imgs" style="max-height: 70px; max-width: 70px; padding: 5px" />
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="处理状态" :align="$protovar.align" width="200">
          <template slot-scope="scope">
            <span>{{
              scope.row.status == 1
              ? "处理中"
              : scope.row.status == 2
                ? "初始化"
                : scope.row.status == 3
                  ? "已处理"
                  : "异常"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="设备/版本号" :align="$protovar.align" width="200"><template slot-scope="scope">设备：{{
          scope.row.devicetype }}<br />版本号：{{
    scope.row.appversion
  }}</template></el-table-column>
        <el-table-column label="记录创建时间" :align="$protovar.align" width="200"><template slot-scope="scope">{{
          scope.row.createtime
        }}</template></el-table-column>
        <el-table-column label="记录更新时间" :align="$protovar.align" width="200"><template slot-scope="scope">{{
          scope.row.updatetime
        }}</template></el-table-column>


          <el-table-column label="操作" :align="$protovar.align" width="200">
              <template slot-scope="scope">
                  <span class="tmopera" @click="deletemain1(scope.row.id)">删除</span>
              </template>
          </el-table-column>

      </el-table>



    </div>
      <el-dialog :visible.sync="visible.dialog" :width="$protovar.dwidth"  class="tmdialog" :before-close="setOriginal">
          <div class="title">确定删除？</div>
          <div class="tmdialog-footer pb60">
              <button class="primarybtn search" @click="visible.dialog=false">取消</button>
              <button class="primarybtn" @click="deletemain2" :disabled="loading">删除</button>
          </div>
      </el-dialog>
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
import { report, msgTips } from "@_/axios/path";
import { resUrl, btDate } from "@_/utils/common.js";
export default {
  data() {
    return {
      names: 0,
      filters: {
        searchkey: "",
        walletid: "",
        type: "",
      },
      typeSelect: [
        { id: 1, label: "用户" },
        { id: 2, label: "群" },
        { id: 3, label: "消息" },
        { id: 4, label: "建议" },
        { id: 5, label: "朋友圈" },
      ],
      data: {
        //数据表格
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        loading: false, //表单loading
        list: [], //列表
        pagesizes: [10, 20, 30, 40],
      },
      curroute: "",
      visible: {
        complaintShow: false, //投诉记录
          dialog:false,
          id:'',
      },
      groupid: "", //群id
      grouprowdata: {}, //选中的群消息
      refresh: false,
      report: {
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        list: [],
        loading: false,
        status: "",
        type: "",
      },
    };
  },
  mounted() {
    this.curroute = this.$route.path;
    this.filters.searchkey = this.$route.query.uid || "";
    this.getData();
  },
  watch: {
    $route(to, from) {
      if (to.path == this.curroute) {
        let query = to.query;
        if (query.uid) {
          Object.assign(this.$data, this.$options.data());
          this.filters.searchkey = query.uid || "";
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
    },
  },
  //封号解封
  methods: {
    sentout(id) {
      return "http://res.dezhougujiang.cn/" + id;
    },

    // this.$refs.form.validate(async (valid) => {

    closure(id, status) {
      let closures = { id, status };
      report.closure(closures).then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.ok == true) {
          this.getData();
        } else {
          msgTips(res.msg);
        }
      });
    },

    delmid(id) {
      console.log(id);
      let mid = { id };

      console.log(id);
      report.delmid(mid).then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.ok == true) {
          this.getData();
        } else {
          msgTips(res.msg);
        }
      });
    },
    /* 用户账户 */
    getData(item) {
      if (item) {
        this.data.pageNumber = item;
      }
      this.data.loading = true;
      let { pageNumber, pageSize } = this.data;
      let ptdata = { ...this.filters, pageNumber, pageSize };
      ptdata.type = 4;
      report.openlist(ptdata).then((res) => {
        if (res.ok) {
          console.log(res);
          for (var i = 0; i < pageSize; i++) {
            try {
              if (res.data.list[i].imgs != "") {
                if (res.data.list[i].imgs.search(".mp4") != -1) {
                  res.data.list[i].avatar1 = "mp4";
                } else {
                  res.data.list[i].avatar1 = "picture";
                }
              }
            } catch (err) {
              console.log("不存在imgs");
            }
            try {
              if (res.data.list[i].videourl != null) {
                if (res.data.list[i].videourl.search(".mp4") != -1) {
                  res.data.list[i].avatar2 = "mp4";
                } else {
                  res.data.list[i].avatar2 = "picture";
                }
              }
            } catch (err) {
              console.log("不存在videourl");
            }
            try {
              if (res.data.list[i].srctext != null) {
                if (res.data.list[i].srctext.search(".mp4") != -1) {
                  res.data.list[i].avatar3 = "mp4";
                } else if (res.data.list[i].srctext.search(".jpg") != -1) {
                  console.log(res.data.list[i].srctext + ">>>>>>>>>>>>>>3");
                  res.data.list[i].avatar3 = "picture";
                }
              }
            } catch (err) {
              console.log("不存在srctext");
            }
          }

          console.log(res.data);
          let data = res.data;
          if (data) {
            this.data.totalRow = data.totalRow;
            let list = data.list;
            list.map((item) => {
              item.avatar = resUrl(item.avatar);
              item.useravatar = resUrl(item.useravatar);
              item.forbiddenflag = item.forbiddenflag == 1 ? "已开启" : "关闭";
              item.createtimeday = btDate(item.createtime);
            });
            this.data.list = list || [];
            window.scrollTo(0, 0);
          }
        } else {
          msgTips(res);
        }
        this.data.loading = false;
      });
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
    /**查看红包明细 */
    seereportList(data) {
      this.visible.complaintShow = true;
      this.grouprowdata = data;
      this.uid = data.uid;
      this.getreportlist();
    },

    getreportlist(number) {
      let data = {
        pageNumber: this.report.pageNumber,
        uid: this.uid,
        status: this.report.status,
        pageSize: this.report.pageSize,
      };
      if (number) {
        data.pageNumber = number;
      }
      this.report.loading = true;
      report.coinlist(data).then((res) => {
        if (res.ok) {
          this.report.totalRow = res.data.totalRow;
          let list = res.data.list;
          list.map((item) => {
            item.avatar = resUrl(item.avatar);
            item.createtimeday = btDate(item.createtime);
          });
          this.report.list = list || [];
        }
        this.report.loading = false;
      });
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
    /* 关闭弹框 */
    closeMsg(value) {
      this.dialog.visible = value;
    },
      deletemain1(id){
          this.visible.id=id;
          this.visible.dialog=true;
      },
      deletemain2(){
          report.deletemain({id:this.visible.id}).then((res)=>{
              if (res.ok ) {
                  this.getData();
                  this.visible.dialog=false;
              } else {
                  msgTips(res.msg);
              }
          })
      },
  },
};
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/PurseComm.less";
</style>