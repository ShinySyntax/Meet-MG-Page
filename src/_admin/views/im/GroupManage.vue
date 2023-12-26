<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter" v-for="(v,k) in filters" :key="k" v-show="k==type">
                <div class="filter-item">
                    <label class="filter-label">时间</label>
                    <el-date-picker v-model="filters[k].starttime" type="date" placeholder="开始时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                    <label class="filter-label fl-date-left">至</label>
                    <el-date-picker v-model="filters[k].endtime" type="date" placeholder="结束时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                </div>
               <!--  <div class="filter-item">
                    <label class="filter-label">群主</label>
                    <el-input type="text" clearable v-model="filters[k].searchkey" placeholder="昵称/账号/ID"></el-input>
                </div>
                <div class="filter-item">
                    <label class="filter-label">群聊</label>
                    <el-input type="text" clearable v-model="filters[k].groupkey" placeholder="群聊名称/群ID"></el-input>
                </div> -->
                <div class="filter-btn">
                    <button class="primarybtn search" @click="changeType()">查询</button>
                </div>
            </div>
            <div class="top-right">
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="1" class="tm-radio-input" @change="changeType"/>
                    <span class="tm-radio-label">
                    共{{main.data[0]['a']}}个有效群
                    </span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="3" class="tm-radio-input" @change="changeType"/>
                    <span class="tm-radio-label">
                    共{{main.data[0]['c']}}个无效群

                    </span>
                </label>
            </div>
        </div>
        <div class="maincontent">
            <div class="left-line"></div>
            <div class="type-item" v-for="v in data.list" :key="v.id">
                <div class="item-header">
                    <span :class="['circle',v.listshow?'redcircle':'']" @click="upDown(v)"></span>
                    <span class="info" @click="upDown(v)">
                        {{v.time}}
                        <img :class="['up',v.listshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                        当日新增<span class="num">{{v.addcount}}个</span>群组
                    </span>
                </div>
                <div class="userlist" v-show="v.listshow">
                    <div class="clearfloat">
                    <div class="user-col" v-for="item in v.grouplist" :key="item.id" @click="seeInfo(item)">
                        <div class="top">
                            <span class="top-left">
                                <el-image class="user-avatar" :src="item.avatar">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                                </el-image>
                            </span>
                            <div class="top-right">
                                <p class="user-nick">{{item.name}}</p>
                                <p class="user-loginname">{{item.gusercount}}人</p>
                            </div>
                        </div>
                        <div class="bot">
                            <span>ID：{{item.id}}</span>
                            <span class="city">
                                群主：{{item.usernick}}
                            </span>
                        </div>
                    </div>
                    </div>
                    <p v-show="v.totalPage>v.pageNumber" class="seemore" @click="loadMoreUser(v)">查看更多</p>
                </div>
            </div>
            <div class="loading" v-show="!data.load&&data.totalPage>data.pageNumber">加载中...</div>
        </div>
        <!-- 群聊信息 -->
        <el-dialog :visible.sync="info.visible" :close-on-click-modal="false" class="tmdialog userdialog" width="487px">
            <div class="user-top">
                <div class="info-main">
                    <div class="info-top">
                        <el-image class="user-avatar" :src="info.data.avatar">
                            <div slot="error" class="image-slot">
                                <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                            </div>
                        </el-image>
                        <div class="top-center">
                            <p class="group-info">
                                <span class="group-name">{{info.data.name}}</span>
                                <span :class="['group-status',type==1?'':'group-status-error']">{{type==1?'有效群':'无效群'}}</span>
                            </p>
                            <div class="fidgop">
                                {{info.data.gusercount}}位成员
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
                    <span>ID：</span>
                    <span class="info-row">{{info.data.id}}</span>
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
                    </span>
                </p>
                <p class="info-col">
                    <span>管理员：</span>
                    <span class="info-row">{{ info.data.mcount }}</span>
                </p>
                <p class="info-col">
                    <span>成员邀请：</span>
                    <span class="info-row">{{info.data.applyflag==1?'开启':'已关闭'}}</span>
                </p>
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
import {imchat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji} from '@_/utils/common.js';
import GroupChatMsg from '@_/components/im/GroupChatMsg';
import {imuser} from "../../axios/path";
export default {
    data(){
        return {
            main:'',
            filters:{
                '1':{
                    starttime:'',
                    endtime:'',
                    searchkey:'',
                    groupkey:''
                },
                '3':{
                    starttime:'',
                    endtime:'',
                    searchkey:'',
                    groupkey:''
                },
            },
            data:{//数据列表
                pageNumber:1,
                pageSize:50,
                totalPage:0,//总条数
                list:[],//列表
                load:true
            },
            info:{
                visible:false,
                data:{}
            },
            type:'1',
            curroute:'',//当前路由
            dialog:{
                visible:false,
                title:'群名称',
                groupid:'',
            }
        }
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                this.listenScroll();//重新绑定滚动
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getData();
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    /* 路由跳转-隐藏页面弹框 */
    beforeRouteLeave(to, from, next){
        if(this.info.visible){
            this.info.visible=false;
            this.dialog.visible=false;
        }
        next();
    },
    components:{
        GroupChatMsg
    },
    methods:{
        /* 查询 */
        changeType(){
            this.data=Object.assign({},this.$options.data().data);
            this.getData();
        },
        /* 群统计列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let type=this.type;
            let {starttime,endtime}=this.filters[type];
            let ptdata={starttime,endtime,pageNumber,pageSize,type};
            imuser.userRegisterGroup().then(res=> {
                this.main=res;
            }),
            imchat.groupStat(ptdata).then(res=>{
                console.log(res);
                if(res.ok){
                    let data=res.data;
                    if(pageNumber==1){
                        this.data.list=[];
                    }
                    if(data){
                        this.data.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((item,i)=>{
                            item.time=item.dayperiod?item.dayperiod.substring(0,4)+'-'+item.dayperiod.substring(4,6)+'-'+item.dayperiod.substring(6,8):'--';
                            item.grouplist=[];
                            item.listshow=false;
                            item.pageNumber=1;
                            item.pageSize=35;
                            item.totalPage=1;
                            if(i==0&&pageNumber==1){
                                this.groupList(item);
                            }
                        })
                        this.data.list=this.data.list.concat(list);
                        if(pageNumber==1){
                            this.listenScroll();
                        }
                    }
                    this.data.load=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 查看更多用户 */
        loadMoreUser(item){
            item.pageNumber++;
            this.groupList(item);
        },
        /* 收起|展开 */
        upDown(item){
            console.log(item);
            item.listshow=!item.listshow;
            if(item.listshow&&item.pageNumber==1){
                this.groupList(item);
            }
        },
        /* 统计下的用户列表 */
        async groupList(item){
            item.listshow=true;
            let type=this.type;
            let {searchkey,groupkey}=this.filters[type];
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageSize,
                searchkey:searchkey,
                groupkey:groupkey,
                starttime:item.time+' 00:00:00',
                endtime:item.time+' 23:59:59'
            };
            let res;
            if(type==1){
                res=await imchat.groupReList(ptdata);
            }
            if(type==3){
                res=await imchat.groupDelList(ptdata);
            }
            if(res.ok){
                let data=res.data;
                if(item.pageNumber==1){
                    item.grouplist=[];
                }
                if(data){
                    item.totalPage=data.totalPage;
                    let list=data.list;
                    list.map(v=>{
                        v.avatar=resUrl(v.avatar);
                    })
                    item.grouplist=item.grouplist.concat(list);
                }
            }else{
                msgTips(res);
            }
        },
        /* 查看 */
        seeInfo(item){
            console.log(item);
            this.info.visible=true;
            this.info.data=item;
        },
        /* 监听滚动 */
        listenScroll(){
            let _this=this;
            $(window).unbind("scroll");
            $(window).scroll(function() {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
            
                if(_this.data.totalPage>_this.data.pageNumber&&_this.data.load&&scrollTop+windowHeight==scrollHeight){
                    _this.data.pageNumber++;
                    _this.data.load=false;
                    _this.getData();
                }

            })
        },
        /* 显示聊天列表弹框 */
        async showMsgList(v){
            let gid=v.id;
            let {name,gusercount}=v;
            this.dialog.visible=true;
            this.dialog.groupid=gid;
            this.dialog.title=name+'('+gusercount+')';
        },
        /* 关闭弹框 */
        closeMsg(value){
            this.dialog.visible=value;
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/registerstatics.less";
@import "~@_/assets/style/less/im/groupmanage.less";
</style>

