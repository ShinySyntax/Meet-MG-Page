<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="用户名/ID"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">IP</label>
                <el-input type="text" clearable v-model="filters.ip" placeholder="IP地址"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">时间</label>
                <el-date-picker v-model="filters.starttime" type="date" placeholder="开始时间"  value-format="yyyyMMdd">
                </el-date-picker>
                <label class="filter-label fl-date-left">至</label>
                <el-date-picker v-model="filters.endtime" type="date" placeholder="结束时间" value-format="yyyyMMdd">
                </el-date-picker>
                </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
              <el-table-column label="用户" :align="$protovar.align" width="240">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image @click="seeInfo(scope.row)" :src="scope.row.avatar"  class="imgcol tmopera"></el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick color_666">{{scope.row.nick}} </span>
                              <span class="color_999">UID:{{scope.row.uid}} </span>
                              <span class="color_999">ID:{{scope.row.tiono}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="账号/邮箱/手机号" :align="$protovar.align" width="240">
                    <template slot-scope="scope" >
                        <div class="accountInfo">
                            <span><i class="el-icon-user"></i>{{scope.row.loginname}}</span>
                            <span><i class="el-icon-eleme"></i>{{scope.row.email||"--"}}</span>
                            <span><i class="el-icon-mobile-phone"></i>{{scope.row.phone||"--"}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="地区/IP" width="240" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="color_666" v-show="scope.row.region">{{scope.row.region}}</span><br>
                        <a class="a_ip" v-if="scope.row.ip" :href="`https://www.baidu.com/s?wd=${scope.row.ip}&from=t-io`"  target="_blank">{{scope.row.ip}} </a>
                        <span v-else>未知</span>
                        <br />
                        <button :class="scope.row.isBan=='1'?'primarybtn search1':'primarybtn search2'" @click="setIp(scope.row.ip,scope.row.banid)">
                            {{scope.row.isBan=='1'?'解封':'封禁'}}
                        </button>
                    </template>
                </el-table-column>
                <el-table-column label="登录时间" prop="time" :align="$protovar.align" width="200">
                  <template slot-scope="scope">
                     <p class="flex_column_center">
                      <span class="color_666">{{scope.row.btDate_time}}</span>
                      <span class="color_999">{{scope.row.time}}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="终端/版本" :align="$protovar.align"  width="120">
                  <!-- pc -->
                   <template slot-scope="scope">
                        <div class="devicetype">
                         <p>
                            <img class="devicetype_Img" :src="scope.row.devicetypeImg" alt="" srcset="">
                            <span >{{scope.row.devicetype}}</span>
                         </p>
                          <span >{{scope.row.appversion||'-'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="设备信息" prop="deviceinfo" :align="$protovar.align" ></el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow>0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                :page-size="data.pageSize" 
                :page-sizes="data.pagesizes"  
                :total="data.totalRow"  
                :current-page="data.pageNumber"
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {journal,msgTips,successTips} from '@_/axios/path';
import {resUrl,btDate} from '@_/utils/common.js';
import {IP} from "../../axios/path";
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                ip:'',
                starttime:'',
                endtime:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.filters.searchkey=this.$route.query.uid;
        this.getData();
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                let query=to.query;
                if(query.uid){
                    Object.assign(this.$data, this.$options.data());
                    this.filters.searchkey=query.uid;
                    this.curroute=this.$route.path;
                    this.getData();
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getData();
            }
        }
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        setIp(ip,id){
            IP.setIp({ip:ip,id:id}).then(res=>{
                if(res.ok){
                    this.getData();
                }else {
                    msgTips(res);
                }
            })
        },
        /* 用户数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            journal.loginList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        let reg=/AppleWebKit\/.*(KHTML, like Gecko)/ig;
                        list.map(item=>{
                            // {{scope.row.devicetype==1?'PC':(scope.row.devicetype==4?'H5':'WEB')}}
                            // item.deviceinfo=item.deviceinfo.replace(reg,'');
                            item.btDate_time = btDate(item.time)
                            item.avatar=resUrl(item.avatar);
                            item.province = item.province ||''
                            item.city = item.city ||''
                            item.region = item.province+' '+item.city
                            item.deviceinfo=item.deviceinfo.replace(reg,'')
                            let type='';
                            let img = ''
                            switch(item.devicetype){
                                case 1:
                                    type="PC";
                                    img=require("@_/assets/img/im/pc.png")
                                break;
                                case 2:
                                    type="安卓";
                                    img=require("@_/assets/img/im/android.png")
                                break;
                                case 3:
                                    type="IOS";
                                    img=require("@_/assets/img/im/ios.png")
                                break;
                                case 4:
                                    type="H5";
                                break;
                                case 5:
                                    type="APP";
                                break;
                            }
                             item.devicetype=type; 
                             item.devicetypeImg=img; 
                        })
                        this.data.list=list||[];
                        window.scrollTo(0,0);
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
        },
         /* 切换分页 */
		    handleCurrentChange(val){
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getData();
        },
        /* 查看 */
        seeInfo(item){
            this.setUserInfoUid(item.uid);
            this.setUserInfoShow(true);
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
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/loginList.less";
</style>