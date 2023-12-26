<template>
    <div class="commonright container groupChatMage">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">群主</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称/ID/手机号"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">群聊</label>
                <el-input type="text" clearable v-model="filters.groupkey" placeholder="ID/群名称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" placeholder="全部" clearable>
                    <el-option value="1" label="正常"></el-option>
                    <el-option value="2" label="已停封"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
              <el-table-column label="群聊" :align="$protovar.align" width="180">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image :src="scope.row.avatar" @click="seeInfo(scope.row,'groupInfo')"  class="imgcol tmopera">
                                <div slot="error" class="image-slot">
                                      <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfo(scope.row,'groupInfo')"  class="error-img"/>
                                  </div>
                              </el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick color_666">{{scope.row.name}} </span>
                              <span class="color_999">ID:{{scope.row.id}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="成员" sortable prop="joinnum" :align="$protovar.align" ></el-table-column>
                <el-table-column label="群主" :align="$protovar.align" width="220">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image @click="seeInfo(scope.row,'groupMage')" :src="scope.row.useravatar"  class="imgcol tmopera">
                                  <div slot="error" class="image-slot">
                                      <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfo(scope.row,'groupMage')"  class="error-img"/>
                                  </div>
                              </el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick">{{scope.row.usernick}} </span>
                              <span>UID:{{scope.row.uid}} </span>
                              <span>ID:{{scope.row.usertiono}} </span>
                              <span>手机号:{{scope.row.userphone}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="管理员" :align="$protovar.align" >
                    <template slot-scope="scope">
                        <span class="color_3A7BE9 cursor"  @click="seeforbiddenList(scope.row,'manageList')" >查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="人数上限" prop="maximum" :align="$protovar.align" ></el-table-column>
                <el-table-column label="全员禁言" prop="forbiddenflag" :align="$protovar.align" ></el-table-column>
                <el-table-column label="禁言名单" :align="$protovar.align" >
                    <template slot-scope="scope">
                        <span class="color_3A7BE9 cursor" @click="seeforbiddenList(scope.row,'forbiddenList')">查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="投诉记录" :align="$protovar.align" >
                    <template slot-scope="scope">
                        <span class="color_3A7BE9 cursor" @click="seereportList(scope.row)">查看</span>
                    </template>
                </el-table-column>
                <el-table-column label="停封记录" :align="$protovar.align" >
                    <template  slot-scope="scope">
                        <span class="color_3A7BE9 cursor"  @click="seeforbiddenList(scope.row,'inblackList')">查看</span>
                    </template>
                </el-table-column>
<!--                修改管理员和公共角色设置能否看到的权限-->
                <el-table-column v-if="showChatHistory" label="聊天记录" :align="$protovar.align">
                    <template  slot-scope="scope">
                        <span  @click="showMsgList(scope.row)" class="color_3A7BE9 cursor">查看</span>
                    </template>
                </el-table-column>

                <el-table-column label="登录时间" sortable prop="time" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <span class="color_666">{{scope.row.createtimeday}} </span><br>
                        <span class="color_999">{{scope.row.createtime}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align" width="90">
                    <template slot-scope="scope">
                       <span :class="['statuIcon',scope.row.status==1?'statuGreen':'statuRed']"></span>
                       <span>{{scope.row.status==1?'正常':'已封停'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center" width="120">
                    <template slot-scope="scope">
                    <div style="display:flex;justify-content: center;">
                        <span class="tmopera" @click="inblackclick(scope.row)" v-auth="'reset'">{{scope.row.status==1?'封停':'解封'}}</span>
                    </div>
                    </template>
                </el-table-column>
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
        <!-- 封停/解封弹窗 -->
        <el-dialog :visible.sync="visible.groupChatShow" class="groupChat-dialog"  width="553px">
            <div class="groupChatBox">
                <p>{{groupStatus==1?'封停':'解封'}}原由</p>
                <textarea v-model="inblack.reason" :placeholder="groupStatus==1?'请输入封停原由':'请输入解封原由'"></textarea>
                <p class="operator">操作人：{{curruser&&curruser.loginname}}</p>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.groupChatShow=false" >取消</button>
                <button class="primarybtn" @click="groupInblackoper()" >{{groupStatus==1?'确认封停':'确认解封'}}</button>
            </div>
        </el-dialog>
        <!-- 禁言名单/管理员名单/解停封记录 -->
        <el-dialog :visible.sync="visible.tableListShow" class="forbiddenList-dialog"  width="1065px">
            <div class="forbiddenListBox">
                <p class="forbiddenList-title">{{table.title}}</p>
                <div class="forbiddenList-header">
                    <el-image :src="grouprowdata.avatar" fit="cover" class="el-image" >
                        <div slot="error" class="image-slot">
                            <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                        </div>
                    </el-image>
                    <div class="forbiddenList-header-right">
                      <p>{{grouprowdata.name}}</p>
                      <p class="color_666">ID:{{grouprowdata.id}}</p>
                    </div>
                    <span class="refresh" @click="refreshMsg">
                        <img src="~@_/assets/img/common/refreshin.png" :class="[refresh?'rotate':'']"/>
                        刷新
                    </span>
                </div>
                <div class="table-header">
                  <p v-for="item in table.header" :key="item">{{item}}</p>
                </div>
                <div class="forbiddenList-table">
                  <div class="forbiddenList-li" v-show="table.data.length>0" v-for="item in table.data" :key="item.mid">
                      <div class="user table-col" v-show="popfrom!=='inblackList'">
                          <div>
                              <el-image @click="seeInfo(item,'groupMage')" :src="item.avatar"  class="imgcol tmopera">
                                  <div slot="error" class="image-slot">
                                      <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfo(item,'groupMage')"  class="error-img"/>
                                  </div>
                              </el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick">{{item.nick}} </span>
                              <span>UID:{{item.uid}} </span>
                              <span>ID:{{item.tiono}} </span>
                          </div>
                      </div>
                      <!-- 禁言数据 -->
                      <div class="table-col" v-show="popfrom=='forbiddenList'">
                          <span class="color_666">{{item.cancelforbiddentimeday || '-'}} </span><br>
                          <span class="color_999">{{item.cancelforbiddentime || '-'}} </span>
                      </div>
                      <div class="table-col" v-show="popfrom=='forbiddenList'">
                          <span class="color_999">{{item.forbiddenduration}} </span>
                      </div>
                      <!-- 管理员数据 -->
                      <div class="table-col"  v-show="popfrom=='manageList'">
                          <span class="color_666">{{item.setroletimeday || '-'}} </span><br>
                          <span class="color_999">{{item.setroletime || '-'}} </span>
                      </div>
                      <!-- 封停数据 -->
                      <div class="table-col"  v-show="popfrom=='inblackList'">
                          <span :class="[item.oper==1?'tmdisabledtrue':'tmdisabledfalse']">{{item.oper==1?'解封':'封停'}} </span>
                      </div>
                      <div class="table-col"  v-show="popfrom=='inblackList'">
                        <span class="color_666">{{item.adminnick}} </span>
                      </div>
                       <div class="table-col"  v-show="popfrom=='inblackList'">
                          <span class="color_666">{{item.createtimeday || '-'}} </span><br>
                          <span class="color_999">{{item.createtime || '-'}} </span>
                      </div>
                      <div class="table-col"  v-show="popfrom=='inblackList'">
                          <span class="color_666">{{item.reason||'-'}} </span>
                      </div>
                      
                  </div>
                  <div class="forbiddenList-li" v-show="table.data.length<=0">暂无记录</div>
                </div>
            </div>
        </el-dialog>
        <!-- 群举报列表 -->
        <el-dialog :visible.sync="visible.complaintShow" class="complaintShow-dialog"  width="1080px">
            <div class="complaintShowBox">
                <p class="complaintShow-title">投诉记录</p>
                <div class="complaintShow-header">
                    <div class="header-box">
                      <el-image :src="grouprowdata.avatar" fit="cover" class="el-image" >
                        <div slot="error" class="image-slot">
                            <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                        </div>
                      </el-image>
                      <div class="complaintShow-header-right">
                        <p>{{grouprowdata.name}}</p>
                        <p class="color_666">ID:{{grouprowdata.id}}</p>
                        <p class="color_666">ID:{{grouprowdata.tiono}}</p>
                      </div>
                    </div>
                    <div class="filter">
                        <div class="filter-item">
                             <el-select v-model="report.status" clearable  placeholder="请选择">
                                <el-option
                                  v-for="item in report.options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                        </div>
                        <div class="filter-btn">
                            <button class="primarybtn search" @click="getreportlist(1)" >查询</button>
                            <button class="primarybtn" @click="visible.confirmReportdeal=true" >批量标记</button>
                        </div>
                    </div>
                    <span class="refresh" @click="getreportlist(1),report.status=''">
                        <img src="~@_/assets/img/common/refreshin.png" :class="[refresh?'rotate':'']"/>
                        刷新
                    </span>
                </div>
                <div class="complaintShow-table">
                    <el-table :data="report.list" v-loading="report.loading" :header-cell-style="{background:$protovar.tbhabg}" @selection-change="handleSelectionChange">
                        <el-table-column
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column label="用户" :align="$protovar.align" width="180">
                          <template slot-scope="scope" >
                              <div class="user">
                                  <div>
                                      <el-image @click="seeInfo(scope.row,'groupMage')" :src="scope.row.avatar"  class="imgcol tmopera">
                                        <div slot="error" class="image-slot">
                                            <img src="~@_/assets/img/im/avatar.jpg" @click="seeInfo(scope.row,'groupMage')"  class="error-img"/>
                                        </div>
                                      </el-image>
                                  </div>
                                  <div class="userInfo">
                                      <span class="userInfo-nick color_666">{{scope.row.nick}} </span>
                                      <span class="color_999">UID:{{scope.row.uid}} </span>
                                      <span class="color_999">ID:{{scope.row.tiono}} </span>
                                  </div>
                              </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="投诉理由" :align="$protovar.align" width="300" >
                            <template slot-scope="scope">
                                <div class="reason-box">
                                  <p class="reason" @mouseover='reasonmouse(scope.row)' @mouseout='visible.allReasonShow=false'>{{scope.row.reason}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="投诉时间" prop="time" :align="$protovar.align" width="200">
                            <template slot-scope="scope">
                                <span class="color_666">{{scope.row.createtimeday}} </span><br>
                                <span class="color_999">{{scope.row.createtime}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="终端" :align="$protovar.align"  width="120">
                          <template slot-scope="scope">
                                <div class="devicetype">
                                <p>
                                    <img class="devicetype_Img" :src="scope.row.devicetypeImg" alt="" srcset="">
                                    <span >{{scope.row.devicetype}}</span>
                                </p>
                                  <!-- <span >{{scope.row.appversion||'-'}}</span> -->
                                </div>
                            </template>
                            
                        </el-table-column>
                        <el-table-column label="标记" :align="$protovar.align" width="80">
                            <template slot-scope="scope">
<!--                              <span :class="[scope.row.status==1?'stateMarked':'stateUnmark cursor']"-->
<!--                                    @click="sureReportdeal(scope.row.groupid)">{{scope.row.status==1?'已标记':'标记'}}</span>-->
                                <span :class="[scope.row.status==1?'stateMarked':'stateUnmark cursor']"
                                      @click="sureReportdeal(scope.row.id)">{{scope.row.status==1?'已标记':'标记'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="处理人" prop="adminnick"  width="90" :align="$protovar.align" ></el-table-column>
                          
                    </el-table>
                    <!-- <p class="allReason">{{report.allReason}}</p> -->
                    <!-- 分页 -->
                    <div class="pagecontainer" v-show="report.totalRow>0">
                        <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                            :page-size="report.pageSize" 
                            :page-sizes="report.pagesizes"  
                            :total="report.totalRow"  
                            :current-page="report.pageNumber"
                            @current-change="handleCurrentReport" 
                            @size-change="handleSizeReport">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 举报标记 -->
        <el-dialog :visible.sync="visible.confirmReportdeal" :show-close='false' class="confirmReportdeal-dialog"  width="400px">
            <div class="confirmReportdealBox">
                <p class="confirmReportdeal-title">确定批量标记?</p>
            </div>
            <div class="tmdialog-footer">
                <button class="primarybtn search" @click="visible.confirmReportdeal=false" >取消</button>
                <button class="primarybtn" @click="sureReportdeal()" >确定</button>
            </div>
        </el-dialog>
        <!-- 群聊信息 -->
        <!-- 群聊信息 -->
        <el-dialog :visible.sync="info.visible" :close-on-click-modal="false" class="tmdialog userdialog" width="487px">
            <div class="user-top">
                <div class="info-main">
                    <div class="info-top">
                        <div>
                          <el-image class="user-avatar" :src="info.data.avatar">
                              <div slot="error" class="image-slot">
                                  <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                              </div>
                          </el-image>
                        </div>
                        <div class="top-center">
                            <p class="group-info">
                                <span class="group-name">{{info.data.name}}</span>
                                <span :class="['group-status',info.data.status==1?'':'group-status-error']">{{info.data.status==1?'有效群':'无效群'}}</span>
                            </p>
                            <div class="fidgop">
                                {{info.data.joinnum}}位成员
                            </div>
                        </div>
                        <div class="top-right">
                            <button class="primarybtn" @click="showMsgList(info.data)">查看记录</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-content">
                <p class="info-col">
                    <span>UID：</span>
                    <span class="info-row">{{info.data.id}}</span>
                    <span>ID：</span>
                    <span class="info-row">{{info.data.usertiono}}</span>
                </p>
                <p class="info-col">
                    <span>群简介：</span>
                    <span class="info-row">{{info.data.intro||'无'}}</span>
                </p>
                <p class="info-col">
                    <span>群公告：</span>
                    <span class="info-row">{{info.data.notice||'无'}}</span>
                </p>
                <p class="info-col">
                    <span>群主：</span>
                    <span>
                        <span class="info-row">{{info.data.usernick}}</span>
                        <span class="owner-uid">(UID:{{info.data.uid}})</span>
                        <span class="owner-uid">(ID:{{info.data.usertiono}})</span>
                    </span>
                </p>
                <p class="info-col">
                    <span>管理员：</span>
                    <span class="info-row">无</span>
                </p>
                <p class="info-col">
                    <span>成员邀请：</span>
                    <span class="info-row">{{info.data.applyflag==1?'开启':'已关闭'}}</span>
                </p>
                <p class="info-col">
                    <span>进群审核：</span>
                    <span class="info-row">{{info.data.joinmode==1?'开启':'已关闭'}}</span>
                </p>
                <p class="info-col">
                    <span>全员禁言：</span>
                    <span class="info-row">{{info.data.forbiddenflag==1?'开启':'已关闭'}}</span>
                </p>
                <!-- <p class="info-col">
                    <span>近1月消息数：</span>
                    <span class="info-row">{{info.data.applyflag==1?'开启':'已关闭'}}</span>
                </p> -->
                <p class="info-col">
                    <span>创建时间：</span>
                    <span class="info-row">{{info.data.createtime}}</span>
                </p>
            </div>
        </el-dialog>
        <!-- 群聊消息 -->
        <GroupChatMsg :dialog="dialog" :from="'gpmanage'" ref="chatmsg" :type="type" :show="dialog.visible" @closeMsg="closeMsg"></GroupChatMsg>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {newgroupList,msgTips,successTips, mgrole} from '@_/axios/path';
import {resUrl,btDate} from '@_/utils/common.js';
import GroupChatMsg from '@_/components/im/GroupChatMsg';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                groupkey:'',
                status:'',
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            curroute:'',
            visible:{
              groupChatShow:false,//封停/解封
              tableListShow:false,//禁言名单/管理员/解停封弹窗
              complaintShow:false,//投诉记录
              allReasonShow:true,
              confirmReportdeal:false
            },
            groupStatus:1,//1 封停, 2 解封
            groupid:'',//群id
            inblack:{//封停/解封原因
              reason:''
            },
            grouprowdata:{},//选中的群消息
            table:{
                header:[],
                data:[],
                title:'',
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                totalPage:0,
                loading:true,
            },
            refresh:false,
            popfrom:"",//禁言名单，查看管理员，封停记录
            report:{
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                list:[],
                loading:false,
                status:'',
                allReason:'',
                options:[
                  {
                    value:1,
                    label:"已标记"
                  },{
                    value:2,
                    label:'未标记'
                  }
                ],
            },
            multipleSelection:[],
            info:{// 群聊信息
                visible:false,
                data:{}
            },
            type:'1',
            dialog:{//群消息
                visible:false,
                title:'群名称',
                groupid:'',
            },
            // 是否展示聊天记录列
            showChatHistory:false
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.filters.searchkey=this.$route.query.uid||'';
        this.judgeGroupShowHistory();
        
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                let query=to.query;
                if(query.uid){
                    Object.assign(this.$data, this.$options.data());
                    this.filters.searchkey=query.uid||'';
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
    components:{
        GroupChatMsg
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        // 是否可以查看聊天记录
        judgeGroupShowHistory() {
            mgrole.groupShowHistory(null).then((res) => {
                if (res.data == 1) {
                    this.showChatHistory = true;
                } else {
                    this.showChatHistory = false;
                }
                this.getData();
            })

        },
        /* 群聊数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            newgroupList.managerlist(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                            item.useravatar=resUrl(item.useravatar);
                            item.forbiddenflag= item.forbiddenflag==1?'已开启':'关闭'
                            item.createtimeday = btDate(item.createtime)
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
        seeInfo(item,type){
            if (!showChatHistory) {
                return;
            }
          if(type=='groupMage'){
            this.setUserInfoUid(item.uid);
            this.setUserInfoShow(true);
          }else if(type=='groupInfo'){
            this.info.visible=true;
            console.log(item);
            this.info.data=item;
          }
        },
        /**封停/解封弹窗展示 */
        inblackclick(data){
            this.groupid = data.id
            this.groupStatus = data.status//true封停, false解封
            this.visible.groupChatShow = true
        },
        /**封停事件 */
        groupInblackoper(){
         let status = this.groupStatus==1?2:1
          let data = {
            reason:this.inblack.reason,
            groupid:this.groupid,
            status
          }
          newgroupList.inblack(data).then(res=>{
            if(res.ok){
              msgTips(this.groupStatus===true?'封停成功':'解封成功')
              this.visible.groupChatShow = false
              this.getData()
            }
          })
        },
        /**查看禁言人员/管理员/解停封弹窗 */
        seeforbiddenList(data,popfrom){
          data.avatar = resUrl(data.avatar)
          this.grouprowdata = data
          this.visible.tableListShow = true
          this.groupid = data.id
          this.popfrom = popfrom
          this.table.pageNumber =1
          this.refreshMsg()
        },
        /**获取禁言名单，查看管理员，封停记录列表数剧
         * @param {*} popfrom forbiddenList 禁言名单,manageList 查看管理员,inblackList封停记录
         * @param {*} table.header 表头 
         * @param {*} table.title 表格标题 
         */
        async getTableList(groupid){
          let {pageNumber,pageSize}=this.table;
          let params ={
              groupid,
              pageNumber,
              pageSize
            }
          let res = null
          if(this.popfrom=='forbiddenList'){
            this.table.header = ['用户','禁言时间','禁言时长']
            res = await newgroupList.forbiddenUserList(params)
            this.table.title = `禁言名单（${res.data.totalRow}）人`
          }
          if(this.popfrom=='manageList'){
            this.table.header = ['管理员','设置时间']
            res = await newgroupList.managerUserList(params)
            this.table.title = `管理员（${res.data.totalRow}）人`
          }
          if(this.popfrom=='inblackList'){
            this.table.header = ['操作记录','操作人','操作时间','原由']
            res = await newgroupList.inblackoperlist(params)
            this.table.title = '解封停记录'
          }
            if(res.ok){
              let data=res.data;
                if(data){
                    this.table.totalRow=data.totalRow;
                    this.table.totalPage = data.totalPage
                    let list=data.list;
                    list.map(item=>{
                        item.avatar=resUrl(item.avatar);
                        item.forbiddenduration = this.SecondToDate(item.forbiddenduration)
                        item.cancelforbiddentimeday =  btDate(item.cancelforbiddentime)
                        item.setroletimeday =  btDate(item.setroletime)
                        item.createtimeday = btDate(item.createtime)
                        this.table.data.push(item); 
                    })
                }
            }else{

            }
        },
        /**禁言时间 */
        SecondToDate: function(msd) {
            var time =msd
            if(time==0){
                time = '长期禁言'
                console.log('长期禁言')
                }
            else if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分钟"
            }
            else if (time >= 60 * 60 && time <= 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + "小时"
            }
            return time;
        },
        /**刷新 */
        async refreshMsg(){
            this.refresh=true;
            this.table.pageNumber=1;
            this.table.data = []
            this.getTableList(this.groupid);
            setTimeout(()=>{
                this.refresh=false;
            },500);
            this.$nextTick(()=>{
                $(".forbiddenList-table").unbind("scroll");
                $(".forbiddenList-table").scrollTop($(".forbiddenList-table").height());
                this.setScroll();
            })
        },
        /* 监听聊天滚动 */
        setScroll(){
            let $chatmsglist= $(".forbiddenList-table");
            $chatmsglist.on("scroll",async ()=>{
                if(this.table.loading&&this.table.totalPage>this.table.pageNumber&&$chatmsglist.scrollTop()==0){
                    this.table.loading=false;
                    this.table.pageNumber++;
                    this.getTableList(this.groupid);
                    this.table.loading=true;
                    this.$nextTick(()=>{
                        //重定位滚动位置
                        let topOffsetPx = $(".forbiddenList-table").offset().top-$chatmsglist.height();
                        $chatmsglist.scrollTop(topOffsetPx);
                    })
                }
            })
        },
        /**查看投诉弹窗 */
        seereportList(data){
          this.visible.complaintShow = true
          this.grouprowdata = data
          this.groupid = data.id
          this.getreportlist()
        },
        getreportlist(number){
          let data = {
            pageNumber:this.report.pageNumber,
            groupid:this.groupid,
            status:this.report.status,
            pageSize:this.report.pageSize
          }
          if(number){
            data.pageNumber = number
          }
          this.report.loading = true
            console.log(data);
          newgroupList.reportlist(data).then(res=>{
              console.log(res);
            if(res.ok){
              this.report.totalRow=res.data.totalRow;
              let list=res.data.list;
              list.map(item=>{
                  item.avatar=resUrl(item.avatar);
                  item.createtimeday = btDate(item.createtime)
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
              this.report.list=list||[];
            }
            this.report.loading = false
          })
        },
        /* 切换分页 */
		    handleCurrentReport(val){
            this.report.pageNumber = val;
            this.getreportlist();
        },
        /* 调整每页显示条数 */
        handleSizeReport(val) {
            this.report.pageNumber=1;
            this.report.pageSize=val;
            this.getreportlist();
        },
        reasonmouse(data){
          this.report.allReason = data.reason
          this.visible.allReasonShow=true
        },
        handleSelectionChange(val) {
          this.multipleSelection = val.map( (item, index) => {
                return item.id
            });
        },
        sureReportdeal(id){
          var ids;
          console.log(ids)
          if(id){
            ids = id
          }else{
              console.log(this.multipleSelection)
              ids='0';
              for(var i in this.multipleSelection){
                  console.log(this.multipleSelection[i])
                  ids=ids+','+this.multipleSelection[i];
              }
          }
          let data = {
            ids
          }
          console.log(data)
          newgroupList.reportdeal(data).then(res=>{
            if(res.ok){
              this.getreportlist(1)
              this.visible.confirmReportdeal = false
              successTips('操作成功！')
            }else{
              msgTips('标记失败')
            }
          
          })
        },
        /* 关闭弹框 */
        closeMsg(value){
            this.dialog.visible=value;
        },
        /* 显示聊天列表弹框 */
        async showMsgList(v){
            let gid=v.id;
            let {name,joinnum,status}=v;
            this.dialog.visible=true;
            this.dialog.groupid=gid;
            this.dialog.title=name+'('+joinnum+')';
            this.type=status==1?'1':'3'
        },
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/groupChatManage.less";
@import "~@_/assets/style/less/im/groupmanage.less";
</style>