<template>
     <div class="tm-right-content">
        <div class="chat-left">
            <div class="user-title">
                <span class="user-nick">“{{tmchat.nick}}”</span>的视角
            </div>
            <div class="chat-list friends-list" id="groups-list">
                <div class="chat-scroll-body" id="groups-scroll-body">
                    <p class="firend-total">
                        <span class="line"></span>
                        <span>{{totalRow}}个群聊</span>
                        <span class="line"></span>
                    </p>
                    <ul>
                        <li :class="['chat-friends-row chat-groups-row',(groupId==item.groupid)?'active':'']" v-for="item in groupsList" :key="item.groupid" @click="groupRowClick(item)">
                            <div class="chat-groups-col">
                                <el-image class="user-avatar" :src="item.avatar">
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                                <div class="name-number">
                                    <p class="friendname">{{item.name}}</p>
                                    <div class="joinnum">
                                        <img src="~@_/assets/img/im/owner.png" v-show="tmchat.uid==item.uid"/>
                                        <span>{{item.joinnum}}人</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="chat-right chat-groups-right" v-show="!msgshow">
            <div class="chat-msg-head" >
                <span class="msg-title">
                   {{groupInfo.name}}
                </span>
                <span class="groupjoin-num" v-show="groupId">
                    ({{groupInfo.joinnum}})
                </span>
            </div>
            <div class="groups-content"  v-show="groupId">
                <div class="scroll-bar">
                    <div class="chatmsglist memberlist" id="member-list">
                        <ul id="member-scroll-body" class="clearfloat">
                            <li class="member-col" v-for="v in member.list" :key="v.uid" @click="showUserInfo(v.uid)">
                                <el-image class="user-avatar" :src="v.avatar" >
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                                <p class="user-nick">{{v.nick}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="info-content">
                    <p class="info-col">
                        <span>ID：</span>
                        <span class="info-row">{{groupInfo.id}}</span>
                    </p>
                    <p class="info-col">
                        <span>群简介：</span>
                        <span class="info-row">{{groupInfo.intro||'无'}}</span>
                    </p>
                    <p class="info-col">
                        <span>群公告：</span>
                        <span class="info-row">{{groupInfo.notice||'无'}}</span>
                    </p>
                    <p class="info-col">
                        <span>群主：</span>
                        <span class="group-owner"  @click="showUserInfo(groupInfo.uid)">
                            <span class="info-row">{{groupInfo.nick}}</span>
                            <span class="owner-uid">(UID:{{groupInfo.uid}})</span>
                        </span>
                    </p>
                    <p class="info-col">
                        <span>管理员：</span>
                        <span class="info-row">无</span>
                    </p>
                    <p class="info-col">
                        <span>成员邀请：</span>
                        <span class="info-row">{{groupInfo.applyflag==1?'开启':'已关闭'}}</span>
                    </p>
                    <p class="info-col">
                        <span>创建时间：</span>
                        <span class="info-row">{{groupInfo.createtime}}</span>
                    </p>
                    <button class="primarybtn msglistbtn" @click="seeMsgList">查看聊天记录</button>
                </div>
            </div>
            <div class="group-nodata" v-if="!groupId">
                <img src="~@_/assets/img/im/nodata.png"/>
                <p>暂无群聊</p>
            </div>

        </div>
        <!-- 会话消息 -->
        <ChatMsg :curruid="tmchat.uid" :chatItem="chatItem" :chatlinkid="groupId" :from="'group'" :show="msgshow" ref="chatmsg" v-show="msgshow"></ChatMsg>
    </div>
</template>
<script>
import {chat,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import ChatMsg from '@_/components/im/ChatMsg';
import {mapMutations} from 'vuex';
export default {
    props:['tmchat','type'],
    data(){
        return {
            groupsList:[],//群聊列表
            pageNumber:1,
            pageSize:50,
            totalPage:0,
            totalRow:0,
            loading:false,
            chatItem:{},
            groupId:'',
            groupInfo:{},
            msgshow:false,//消息列表显示状态
            member:{
                list:[],
                pageNumber:1,
                pageSize:54,
                totalPage:0,
            },
        }
    },
    watch:{
        type(nv){
            if(nv=='group'){
                Object.assign(this.$data, this.$options.data())
                this.getGroups();
            }
        }
    },
    components:{
        ChatMsg,
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 获取群聊列表 */
        getGroups(){
            let ptdata={
                uid:this.tmchat.uid,
                pageNumber:this.pageNumber,
                pageSize:this.pageSize
            };
            chat.groupList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.totalPage=data.totalPage;//总页数
                        this.totalRow=data.totalRow;//总条数
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                        })
                        //如果为第一页-清空数据
                        if(this.pageNumber==1){
                            this.groupsList=[];
                            this.groupListScroll();
                            if(!this.groupId){
                                this.groupId=list[0].groupid;
                            }
                        }
                        this.groupsList=this.groupsList.concat(list);
                        this.getGroupInfo();
                        this.getMemberList();
                    }
                    this.loading=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 群成员列表 */
        getMemberList(){
            let ptdata={
                groupid:this.groupId,
                pageNumber:this.member.pageNumber,
                pageSize:this.member.pageSize
            };
            chat.groupUserList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.member.totalPage=data.totalPage;//总页数
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                        })
                        if(this.member.pageNumber==1){
                            this.member.list=[];
                            this.memberListScroll();
                        }
                        this.member.list= this.member.list.concat(list);
                    }
                    this.loading=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 监听-成员列表-滚动 */
        memberListScroll(){
            let _this=this;
            $("#member-list").unbind('scroll');
            $("#member-list").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#member-scroll-body").height();
                var contentHeight = $(this).height();
                if(_this.member.totalPage>_this.member.pageNumber&&_this.loading&&scrollTop+contentHeight>scrollHeight-20){
                    _this.member.pageNumber++;
                    _this.loading=false;
                    _this.getMemberList();
                }
            })
        },
        /* 群信息 */
        getGroupInfo(){
            chat.groupInfo({groupid:this.groupId}).then(res=>{
                if(res.ok){
                    this.groupInfo=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 群聊点击 */
        groupRowClick(item){
            if(this.msgshow){
                this.msgshow=false;
            }
            this.groupId=item.groupid;
            this.chatItem=item;
            this.gptitle=item.name;
            this.getGroupInfo();
            this.getMemberList();
        },
        /* 监听-群聊列表-滚动 */
        groupListScroll(){
            let _this=this;
            $("#groups-list").unbind('scroll');
            $("#groups-list").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#groups-scroll-body").height();
                var contentHeight = $(this).height();
                if(_this.totalPage>_this.pageNumber&&_this.loading&&scrollTop+contentHeight>scrollHeight-50){
                    _this.pageNumber++;
                    _this.loading=false;
                    _this.getGroups();
                }
            })
        },
        /* 查看聊天记录 */
        seeMsgList(){
            this.chatItem={...this.groupInfo,chatmode:2}
            this.msgshow=true;
        },
        /* 显示用户信息 */
        showUserInfo(uid){
            this.setUserInfoShow(false);
            this.setUserInfoUid(uid);
            //解决弹框显示层级问题
            setTimeout(()=>{
                this.setUserInfoShow(true);
            },100);
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/_admin/assets/style/less/im/userchatinfo.less';
</style>