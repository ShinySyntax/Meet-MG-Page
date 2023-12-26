<template>
    <div :class="['usercontent',stylename?stylename:'']">
        <div class="user-top">
            <div class="info-main">
                <div class="info-top">
                    <el-image class="user-avatar" :src="info.avatar">
                        <div slot="error" class="image-slot">
                            <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                        </div>
                    </el-image>
                    <div class="top-center">
                        <p class="user-nick">{{info.nick}}</p>
                        <div class="fidgop">
                            <span class="user-login" @click="toLoginList">
                                <img src="~@_/assets/img/im/login.png"/>
                                <span>{{logincount}}次登录</span>
                            </span>
                            <span class="user-friends">
                                <img src="~@_/assets/img/im/fnum.png"/>
                                <span>{{info.fcount}}位好友</span>
                            </span>
                            <span class="user-group">
                                <img src="~@_/assets/img/im/gsnum.png"/>
                                <span>{{info.agcount||0}}个群聊</span>
                            </span>
                        </div>
                    </div>
                    <div class="top-right">
                        <button class="primarybtn" @click="seeUserChatInfo()" v-auth="'watch'">监控视角</button>
                    </div>
                </div>
                <div class="info-bot">
                    <img src="~@_/assets/img/im/sign.png"/>
                    <span class="info-sign">
                        {{info.sign||'暂无个性签名'}}
                    </span>
                </div>
            </div>
        </div>
        <div class="info-content">
            <div class="left-col">
                <p>UID：<span class="info-row">{{info.id}}</span></p>
                <p>ID：<span class="info-row">{{info.tiono}}</span></p>
                <p>手机号：<span class="info-row">{{info.phone}}</span></p>
                <p>账号：<span class="info-row">{{info.loginname}}</span></p>
                <p>性别：<span class="info-row">{{info.sex==1?'男':(info.sex==2?'女':'保密')}}</span></p>
                <p>手机：<span class="info-row">{{info.phone||'--'}}</span></p>
                <p>邮箱：<span class="info-row">{{info.email}}</span></p>
            </div>
            <div class="right-col">
                <p>IP：<span class="info-row">{{info.ip}}</span>
                    <span class="regcount" @click="toRegPath('ip')"><img src="~@_/assets/img/im/ahref.png"/>该IP共注册{{ipcount}}人</span>
                </p>
                <p>注册地：<span class="info-row">{{info.province}} {{info.city}}</span>
                    <span class="regcount" @click="toRegPath('area')"><img src="~@_/assets/img/im/ahref.png"/>该地区共注册{{areacount}}人</span>
                </p>
                <p>注册时间：<span class="info-row">{{info.createtime}}</span>
                 <span class="regcount" @click="toRegPath('time')"><img src="~@_/assets/img/im/ahref.png"/>当日注册{{ctcount}}人</span>
                </p>
                <p>最近登录：<span class="info-row">{{info.lastlogintime}}</span></p>
                <p>状态：<span class="info-row">{{info.status==1?'正常':'无效'}}</span></p>
            </div>
        </div>
    </div>
</template>
<script>
import {stat,imuser,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import {mapState,mapMutations} from 'vuex';
export default {
    props:['uid','detailshow','from','stylename'],
    data(){
        return {
            info:{},
            logincount:0,
            ipcount:0,
            areacount:0,
            ctcount:0,
        }
    },
    watch:{
        detailshow(nv,ol){
            if(nv&&nv!='apply'){
                this.initData();
            }
        },
    },
    mounted(){
        if(this.from){
            this.initData();
        }
    },
    computed:{
        ...mapState({
            chatshow:(state)=>state.myadmin.chatshow,//显示状态
        })
    },
    methods:{
        ...mapMutations(['setChatShow','setTmChat','setUserInfoShow']),
        /* 初始化 */
        async initData(){
            await this.getUserDetail();
            this.getUserLoginCount();
            this.getIpRegCount();
            this.getAreaRegCount();
            this.getTimeRegcount();
        },
        /* 用户详情 */
        async getUserDetail(){
            let res=await  imuser.userDetail({uid:this.uid});
            if(res.ok){
                let data=res.data;
                if(data){
                    data.avatar=resUrl(data.avatar);
                    this.info=res.data;
                }
            }else{
                msgTips(res);
            }
        },
        /* 用户总登录次数 */
        getUserLoginCount(){
            let ptdata={uid:this.uid};
            stat.userlogincount(ptdata).then(res=>{
                if(res.ok){
                    this.logincount=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* ip注册人数 */
        getIpRegCount(){
            let ptdata={ip:this.info.ip};
            stat.ipregcount(ptdata).then(res=>{
                if(res.ok){
                    this.ipcount=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 区域注册人数 */
        getAreaRegCount(){
            let ptdata={province:this.info.province,city:this.info.city};
            stat.arearegcount(ptdata).then(res=>{
                if(res.ok){
                    this.areacount=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 时间注册人数 */
        getTimeRegcount(){
            let dayperiod=this.info.createtime.substring(0,10);
            dayperiod=dayperiod.replace(/-/g,'');
            let ptdata={period:dayperiod};
            stat.timeregcount(ptdata).then(res=>{
                if(res.ok){
                    this.ctcount=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 跳转用户登录日志页面 */
        toLoginList(){
            this.handleClose();
            this.$router.push({path:'/loginlist',query:{'uid':this.info.id}})
        },
        /* 跳转注册页面 */
        toRegPath(type){
            let query;
            let {ip,province,city,createtime}=this.info;
            let dayperiod=createtime.substring(0,10);
            dayperiod=dayperiod.replace(/-/g,'');
            switch(type){
                case 'ip':
                    if(this.ipcount>0){
                        query={'searchip':ip,'type':2};
                    }
                    console.log(ip);
                    break;
                case 'area':
                    if(this.areacount>0){
                        query={'province':province,'city':city,'type':2,'jtype':2};
                    }
                    break;
                case 'time':
                    if(this.ctcount>0){
                        query={'start':dayperiod,'end':dayperiod,'type':1};
                    }
                    break;

            }
            this.handleClose();
            this.$router.push({path:'/registerstatis',query:query})
        },
        /* 关闭弹框 */
        handleClose(){
            this.setUserInfoShow(false);
            this.setChatShow(false);
        },
        /* 监控 */
        seeUserChatInfo(){
            if(this.chatshow){
                this.setChatShow(false);
                setTimeout(()=>{
                    this.setChatShow(true);
                },100);
            }else{
                this.setChatShow(true);
            }
            this.setTmChat(this.info);
        }
    }
}
</script>
<style lang="less" scoped>
.usercontent{
    .user-top{
        padding: 20px 0 17px 0;
        margin:0 27px;
        border-bottom:1px solid #F3F3F3;
        .info-main{
            .info-top{
                .flexbox;
                .user-avatar{
                    width:50px;
                    height:50px;
                    margin-right:10px;
                    .error-img{
                        width: 100%;
                    }
                }
                .top-center{
                    flex:1;
                    .user-nick{
                        line-height: 22px;
                        font-size:16px;
                        margin-bottom:8px;
                    }
                    .fidgop{
                        .flexbox;
                        .user-login{
                            &:hover{
                                color:@buttonColor;
                                cursor: pointer;
                            }
                        }
                        .user-login,.user-friends,.user-group{
                            margin-right:20px;
                            color:#666;
                            line-height: 1;
                            img{
                                margin-right: 3px;
                                vertical-align: top;
                            }
                        }
                    }
                }
                .top-right{
                    flex-shrink: 0;
                    padding-right: 37px;
                }
            }
            .info-bot{
                display:flex;
                color:#999;
                line-height: 17px;
                margin-top:16px;
                img{
                    margin-right:6px;
                    width:12px;
                    height:12px;
                    margin-top:3px;
                }
                .info-sign{
                    line-height: 20px;
                }
            }
        }
    }
    .info-content{
        color:#666;
        display: flex;
        padding:8px 27px 40px;
        line-height: 30px;
        .left-col{
            flex:1;
        }
        .info-row{
            color:#333;
        }
        .regcount{
            margin-left:12px;
            cursor: pointer;
            .tmopera;
            img{
                vertical-align: middle;
                margin-right: 2px;
            }
        }
    }
}
.friendsdetail{
    padding:0 13px;
    .user-top{
        border-bottom-color: #E6E6E6;
    }
    .right-col{
        padding-right:60px;
    }
}
</style>