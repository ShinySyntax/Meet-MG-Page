<template>
  <div class="commonright container">
    <!-- 筛选 -->
    <div class="filter">
      <div class="filter-item">
        <label class="filter-label">用户</label>
        <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称/账号/ID"></el-input>
      </div>
      <div class="filter-item">
        <label class="filter-label">状态</label>
        <el-select v-model="filters.status" clearable>
          <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
        </el-select>
      </div>
      <div class="filter-btn">
        <button class="primarybtn search" @click="getData(1)">查询</button>
      </div>
        <div class="filter-item">
            共存在{{main.data[0]['count(*)']}}用户
        </div>
    </div>
    <!-- 数据表格 -->
    <div class="contentpad">
      <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
        <el-table-column label="用户" :align="$protovar.align" width="210px">
          <template slot-scope="scope">
            <div class="user">
              <div>
                <el-image :src="scope.row.avatar" class="imgcol tmopera" @click="seeInfo(scope.row)"></el-image>
              </div>
              <div class="userInfo">
                <span class="userInfo-nick color_666">{{ scope.row.nick }}
                </span>
                <span class="color_999">UID:{{ scope.row.id }} </span>
                <span class="color_999">ID:{{ scope.row.tiono }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="账号/邮箱/手机号" :align="$protovar.align" width="200">
          <template slot-scope="scope">
            <div class="accountInfo">
              <span><i class="el-icon-user"></i>{{ scope.row.loginname }}</span>
              <span><i class="el-icon-eleme"></i>{{ scope.row.email }}</span>
              <span><i class="el-icon-mobile-phone"></i>{{ scope.row.phone || "--" }}</span>
            </div>
          </template>
        </el-table-column>
          <el-table-column label="三方绑定" width="150" :align="$protovar.align">
              <template slot-scope="scope">
                  <div class="thirdTypeBox" v-if="scope.row.thirdtype">
                      <img v-for="(item, index) in scope.row.thirdtype" :key="index" :src="thirdArr[item].img"
                           :class="[thirdArr[item].css]" alt="" srcset="" />
                  </div>
                  <span v-else>暂无</span>
              </template>
          </el-table-column>
          <el-table-column label="群组" width="150" :align="$protovar.align">
          <template slot-scope="scope">
              <span class="tmopera" @click="more(scope.row.id)" v-auth="'reset'">共加入{{scope.row.groupids}}个群</span>
          </template>
      </el-table-column>

        <el-table-column label="地区/IP" width="280" :align="$protovar.align">
          <template slot-scope="scope">
            <span class="color_666" v-show="scope.row.region">{{
              scope.row.region
            }}</span><br />
            <a class="a_ip" v-if="scope.row.ip" :href="`https://www.baidu.com/s?wd=${scope.row.ip}&from=t-io`"
              target="_blank">{{ scope.row.ip }}
            </a>
            <span v-else>未知</span><br />
              <button class="primarybtn search" @click="setIp(scope.row.ip,scope.row.banid)">
                  {{
                  scope.row.isBan=='1'?'解封':'封禁'
                  }}
              </button>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="210" :align="$protovar.align">
          <template slot-scope="scope">
            <span class="color_666">{{ scope.row.createdays }} </span><br />
            <span class="color_999">{{ scope.row.createtime }} </span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录" width="210" prop="lastlogintime" :align="$protovar.align">
          <template slot-scope="scope">
            <span class="color_666">{{ scope.row.lastlogindays }} </span><br />
            <span class="color_999">{{ scope.row.lastlogintime }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" :align="$protovar.align">
          <template slot-scope="scope">
            <span :class="[
              scope.row.status == 1 ? 'tmdisabledfalse' : 'tmdisabledtrue',
            ]">{{ scope.row.status == 1 ? "正常" : scope.row.status == 5?'被封禁':'已注销' }}</span>
              <br />
              <span v-show="scope.row.status==5">{{scope.row.banlevel==null?'永久':scope.row.banlevel+"天"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="邀请码" width="150" :align="$protovar().align">
          <template slot-scope="scope">
            邀请码：{{ scope.row.invitecode }}<br />
            被邀请码：{{ scope.row.beinvitecode }}<br />
              邀请人：{{scope.row.uinick}}<br/>
              被邀请人：{{scope.row.u2nicks}}
          </template>
        </el-table-column>
        <el-table-column style="text-align: center" label="操作" align="center" width="300">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center">
<!--              <span :class="[-->
<!--                'tmopera',-->
<!--                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',-->
<!--              ]" v-auth="'disable'" @click="operStatus(scope.row)">{{ scope.row.status == 1 ? "禁用" : "启用" }}</span>-->
                <span :class="[
                'tmopera',
                scope.row.status == 1 ? 'stateDisabled' : 'statesuccess',
              ]" v-auth="'disable'" @click="closure(scope.row.id, 1,scope.row.status)">{{ scope.row.status == 1 ? "禁用" : "启用" }}</span>


<!--                <button class="primarybtn search" @click="closure(scope.row.id, 1,scope.row.status)">-->
<!--                    {{ scope.row.status == 1 ? '禁用' : '启用' }}-->
<!--                </button>-->

                <span class="tmopera" v-auth="'reset'" @click="setVip(scope.row.id,scope.row.vid,scope.row.vipid)">
                    {{ scope.row.vipid==1?'初级会员':scope.row.vipid==2?'中级会员':
                    scope.row.vipid==3?'高级会员':scope.row.vipid==4?'超级会员':'不是会员'}}</span>
              <span class="tmopera" @click="resetPwd(scope.row)" v-auth="'reset'">重置密码</span>
            </div>
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
    <!-- 重置密码-->
    <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
      <div class="title">确认重置当前用户登录密码为 a+用户登录账户 吗？</div>
      <div class="tmdialog-footer pb60">
        <button class="primarybtn search" @click="hideDialog('dialog3', 'visible')">
          取消
        </button>
        <button class="primarybtn" @click="sureResetPwd">重置</button>
      </div>
    </el-dialog>
    <!-- 提示成功 -->
    <el-dialog :visible.sync="dialog3.visible2" :width="$protovar.dwidth" class="tmdialog" :modal="false">
      <div class="title">
        <p>
          已成功重置为默认密码：{{ sysparams ? sysparams["resetpwd"] : "" }}
        </p>
        <p>请尽快通知用户进行修改！</p>
      </div>
      <div class="tmdialog-footer pb60">
        <button class="primarybtn" @click="hideDialog('dialog3', 'visible2')">
          确定
        </button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="getmessage1">
      <div class="filter">
        <div class="filter-btn">
          <button class="primarybtn search" @click="txtdata1(data.list2)">
            导出txt
          </button>
        </div>
        <div class="filter-btn">
          <button class="primarybtn search" @click="xlsdata1(data.list2)">
            导出xls
          </button>
        </div>
      </div>
    </el-dialog>
      <!-- 封停/解封弹窗 -->
      <el-dialog :visible.sync="visible.userChatShow" class="groupChat-dialog" width="553px">
          <div class="groupChatBox">
              <p>{{ userStatus == 1 ? '封停' : '解封' }}原由</p>
              <textarea v-model="inblack.reason"
                        :placeholder="userStatus==1?'请输入封停原由':'请输入解封原由'"></textarea>
              <p class="operator">操作人：{{ curruser && curruser.loginname }}</p>
          </div>
          <div class="groupChatBox" style="height: 60px" v-show="userStatus==1">
              封禁时间：
              <el-select v-model="inblack.day">
                  <el-option label="3天" value="3"></el-option>
                  <el-option label="7天" value="7"></el-option>
                  <el-option label="30天" value="30"></el-option>
                  <el-option label="永久" value="null"></el-option>
              </el-select>
          </div>
          <div class="tmdialog-footer">
              <button class="primarybtn search" @click="visible.userChatShow=false">取消</button>
              <button class="primarybtn" @click="closure1()">
                  {{ userStatus == 1 ? '确认封停' : '确认解封' }}
              </button>
          </div>
      </el-dialog>
<!--      vip会员选择-->
      <el-dialog :visible.sync="dialog3.visible3" :width="$protovar.dwidth" class="tmdialog" :modal="false">
          <div class="title">选择VIP</div>
          <div class="tmdialog-footer pb60">
              <button class="primarybtn" @click="sureReset(0)" v-show="vipid!=null&&vipid!=''">非会员</button>
              <button class="primarybtn" @click="sureReset(1)" v-show="vipid!=1">初级会员</button>
              <button class="primarybtn" @click="sureReset(2)" v-show="vipid!=2">中级会员</button>
              <button class="primarybtn" @click="sureReset(3)" v-show="vipid!=3">高级会员</button>
              <button class="primarybtn" @click="sureReset(4)" v-show="vipid!=4">超级会员</button>
          </div>
      </el-dialog>
<!--      群组详情-->
      <el-dialog :visible.sync="dialog4.visible" :width="$protovar.dwidth" class="tmdialog" :modal="false">
          <el-table :data="dialog4.data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
              <el-table-column label="群组昵称" :align="$protovar.align" @click="seeInfoGrounp(scope.row)" >
                  <template slot-scope="scope">
                      <el-image :src="scope.row.avatar" class="imgcol tmopera"></el-image>
                      {{scope.row.name}}
                  </template>
              </el-table-column>
          </el-table>
          <div class="pagecontainer" v-show="dialog4.data.totalRow > 0">
              <el-pagination layout="total,prev, pager, next,sizes,jumper" background :page-size="dialog4.data.pageSize"
                             :page-sizes="dialog4.data.pagesizes" :total="dialog4.data.totalRow" :current-page="dialog4.data.pageNumber"
                             @current-change="handleCurrentChange1" @size-change="handleSizeChange1">
              </el-pagination>
          </div>
      </el-dialog>

  </div>
</template>
<script>

import { mapMutations } from "vuex";
import { imuser, msgTips, successTips } from "@_/axios/path";
import $protovar from "quill";
import {resUrl, btDate} from "@_/utils/common.js";
import {IP, report} from "../../axios/path";

export default {
  data() {
    return {
        uid:'',
        vid:'',
        vipid:'',
        visible: {
            userChatShow:false,
        },
        inblack: {//封停/解封原因
            reason: '',
            day: 'null'
        },
        userid: "", //群id
        userdata: {}, //选中的群消息
        userStatus: 1,//1 封停, 2 解封
        userStatus2: 1,//1 封停, 2 解封
        main:'',
      item: [],
      //弹框
      getmessage1: false,
      getmessage2: false,
      getmessage3: false,
      filters: {
        searchkey: "",
        status: "",
      },
      statusSelect: [
        { id: 1, label: "正常" },
          { id: 5, label: "禁用" },
          { id: 6, label: "已注销" },
      ],
      data: {
        //数据表格
        pageNumber: 1,
        pageSize: 10,
        pageNumber1: 1,
        pageSize1: 10,
        totalRow: 0, //总条数
        totalRow1: 0, //总条数
        loading: false, //表单loading
        list: [], //列表
        list2: [], //列表
        pagesizes: [10, 20, 30, 40],
        pagesizes1: [10, 20, 30, 40],
      },
      currdata: null,
      dialog3: {
        visible: false,
          visible2: false,
          visible3: false,
      },
        dialog4:{
          visible:false,
            id:'',
            data:{
                pageNumber: 1,
                pageSize: 10,
                totalRow: 0, //总条数
                loading: false, //表单loading
                pagesizes: [10, 20, 30, 40],
                list: [], //列表
            },
        },
      loading: false,
      curroute: "",
      thirdArr: [
        { img: "", css: "" },
        { img: require("@_/assets/img/im/icon_qq.png"), css: "qq" },
        { img: require("@_/assets/img/im/icon_wx.png"), css: "wx" },
        { img: require("@_/assets/img/im/icon_weibo.png"), css: "wb" },
        { img: require("@_/assets/img/im/icon_dy.png"), css: "dy" },
        { img: require("@_/assets/img/im/icon_kaiyuan.png"), css: "kaiyuan" },
      ],
    };
  },
  mounted() {
    this.curroute = this.$route.path;
    this.getData();
  },
  watch: {
    $route(to, from) {
      if (to.path == this.curroute) {
        if (this.$protovar.routehasopen != -1 && !to.query.random) {
          return;
        }
        Object.assign(this.$data, this.$options.data());
        this.curroute = this.$route.path;
        this.getData();
      }
    },
  },
  methods: {
      setIp(ip,id){
          IP.setIp({ip:ip,id:id}).then(res=>{
              if(res.ok){
                  this.getData();
              }else {
                  msgTips(res);
              }
          })
      },
      closure(id, status,status2) {
          console.log(id+">?>+"+status2)
          this.inblack.reason='账号涉嫌违规已封停'
          this.userid=id;
          this.userStatus2=status;
          this.userStatus=status2;
          this.visible.userChatShow = true;
      },
      closure1() {
          let closures = {id:this.userid, status:this.userStatus2, reason:this.inblack.reason ,day: this.inblack.day};
          report.closure(closures).then((res) => {
              if (res.ok == true) {
                  this.visible.userChatShow = false;
                  this.getData();
              } else {
                  msgTips(res.msg);
              }
          });
      },
      $protovar() {
          return $protovar
      },
    ...mapMutations(["setUserInfoUid", "setUserInfoShow"]),
    /* 用户数据 */
    getData(item) {
      if (item) {
        this.data.pageNumber = item;
      }
      this.data.loading = true;
      let { pageNumber, pageSize } = this.data;
      let ptdata = { ...this.filters, pageNumber, pageSize };
        imuser.userRegisterMainLive().then(res=> {
            this.main=res;
        }),
      imuser.userList(ptdata).then((res) => {
        if (res.ok) {
          console.log(res);
          let data = res.data;
          if (data) {
            this.data.totalRow = data.totalRow;
            let list = data.list;
            list.map((item) => {
              item.avatar = resUrl(item.avatar);
              item.province = item.province || "";
              item.city = item.city || "";
              item.region = item.country+" "+item.province + " " + item.city;
              item.createdays = btDate(item.createtime);
              item.lastlogindays = btDate(item.lastlogintime);
              if (item.thirdtype) {
                item.thirdtype = item.thirdtype.replace(/11/g, 1);
                item.thirdtype = item.thirdtype.replace(/22/g, 2);
                item.thirdtype = item.thirdtype.replace(/33/g, 3);
                item.thirdtype = item.thirdtype.split(",");
                item.thirdtype = Array.from(new Set(item.thirdtype));
              }
            });
            this.data.list = list || [];
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
      } , /* 切换分页 */
      handleCurrentChange1(val) {
          this.dialog4.data.pageNumber = val;
          this.more();
      },
      /* 调整每页显示条数 */
      handleSizeChange1(val) {
          this.dialog4.data.pageNumber = 1;
          this.dialog4.data.pageSize = val;
          this.more();
      } ,
      /* 查看 */
      seeInfo(item) {
          this.setUserInfoUid(item.id);
          this.setUserInfoShow(true);
      },  /* 查看qun */

    /* 取消弹框 */
    hideDialog(dialog, visible) {
      this[dialog][visible] = false;
    },
      /* 重置密码 */
      resetPwd(item) {
          this.currdata = item;
          this.dialog3.visible = true;
      },  /*设置VIP */
      setVip(uid,vid,vipid) {
          this.uid=uid;
          this.vid=vid;
          this.vipid=vipid;
          this.dialog3.visible3 = true;
      },
    /* 确定重置密码 */
    sureResetPwd() {
      let ptdata = { uid: this.currdata.id };
      imuser.resetPwd(ptdata).then((res) => {
        if (res.ok) {
          this.dialog3.visible= false;
        } else {
          msgTips(res);
        }
      });
    },
      sureReset(vipid){
          let ptdata = { uid: this.uid,vipid:vipid,vid: this.vid };
          // console.log(ptdata);
          imuser.resetVip(ptdata).then((res) => {
              if (res.ok) {
                  this.dialog3.visible3 = false;
                  this.getData();
              } else {
                  msgTips(res);
              }
          });
      },
    /* 启用|禁用 */
    operStatus(item) {
        var  statusvalue;
        if(item.status==6)
            successTips("该账户已注销，请求驳回");
        else{
            if(item.status==5)
                statusvalue=1;
            if(item.status==1)
                statusvalue=5;
            let ptdata = {
                uid: item.id,
                status: statusvalue,
            };
            imuser.userDisable(ptdata).then((res) => {
                if (res.ok) {
                    successTips("修改成功");
                    this.getData();
                } else {
                    msgTips(res);
                }
            });
        }
    },
      more(id){
        if(id==null){
            id=this.dialog4.id;
        }else {
            this.dialog4.id=id;
            this.dialog4.data.pageNumber=0;
            this.dialog4.data.pageSize=10;
        }
          imuser.more({searchkey:id,pageNumber:this.dialog4.data.pageNumber, pageSize:this.dialog4.data.pageSize}).then((res) => {
              console.log(res)
              this.dialog4.data=res.data;
              this.dialog4.data.list.map((item) => {
                  item.avatar = resUrl(item.avatar);
              })
          });
          this.dialog4.visible=true;
      }
  },
};
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/usermanage.less";
</style>

<style lang="less" scoped>@import "~@_/assets/style/less/im/PurseComm.less";</style>