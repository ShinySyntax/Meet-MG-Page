<template>
     <div class="tm-right-content">
        <div class="chat-left">
            <div class="user-title">
                <span class="user-nick">“{{tmchat.nick}}”</span>的视角
            </div>
            <div class="chat-list friends-list" id="friends-list">
                <div class="chat-scroll-body" id="friends-scroll-body">
                    <div :class="['chat-friends-row',(friendOn=='apply')?'active':'']"  @click="friendRowClick()">
                        <img class="user-avatar" src="~@_/assets/img/im/apply.png"/>
                        <p class="friendname">好友请求</p>
                    </div>
                    <p class="firend-total">
                        <span class="line"></span>
                        <span>{{totalRow}}位联系人</span>
                        <span class="line"></span>
                    </p>
                    <div v-for="v in friendsList" :key="v.index">
                        <p class="letter">{{v.index}}<p> 
                        <li :class="['chat-friends-row',(friendOn==item.uid)?'active':'']" v-for="item in v.data" :key="item.uid"  @click="friendRowClick(item)">
                            <el-image class="user-avatar" :src="item.avatar">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                            </el-image>
                            <p class="friendname">{{item.remarkname||item.nick}}</p>
                        </li>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-right" v-show="!msgshow">
            <div class="chat-msg-head">
                <span class="msg-title">
                   {{fdtitle}}
                </span>
            </div>
            <div class="scroll-bar">
                <div class="chatmsglist" id="applys-list">
                    <div class="chat-scroll-body" id="applys-scroll-body" v-show="friendOn=='apply'">
                        <ul>
                            <li class="chat-apply-col" v-for="v in apply.list" :key="v.uid" @click="showUserInfo(v.uid)">
                                 <el-image class="apply-avatar" :src="v.avatar">
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                                <div class="chat-apply-right">
                                    <div>
                                        <p class="chat-apply-name" v-text="v.nick"></p>
                                        <p class="chat-apply-hello" v-text="v.greet"></p>
                                    </div>
                                    <span v-if="v.status==1" class="chat-apply-passed">已添加</span>
                                    <span v-else class="chat-apply-nopass">待添加</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                     <!-- 用户详情 -->
                    <div v-show="friendOn!='apply'">
                        <UserDetails :uid="friendOn" :detailshow="friendOn" :stylename="'friendsdetail'"></UserDetails>
                        <button class="primarybtn msglistbtn" @click="seeMsgList">查看聊天记录</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 会话消息 -->
        <ChatMsg :curruid="tmchat.uid" :chatItem="chatItem" :chatlinkid="friendOn" :from="'friend'" :show="msgshow" ref="chatmsg" v-show="msgshow"></ChatMsg>
    </div>
</template>
<script>
import {chat,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import ChatMsg from '@_/components/im/ChatMsg';
import UserDetails from '@_/components/im/UserDetails';
import {mapMutations} from 'vuex';
export default {
    props:['tmchat','type'],
    data(){
        return {
            friendsList:[],//好友列表
            pageNumber:1,
            pageSize:50,
            totalPage:0,
            totalRow:0,
            loading:false,
            chatItem:{},
            fdtitle:'好友请求',
            friendOn:'apply',
            indexArr:[],//字母数组
            msgshow:false,
            apply:{
                list:[],
                pageNumber:1,
                pageSize:50,
                totalPage:0,
            }
        }
    },
    watch:{
        type(nv){
            if(nv=='friend'){
                Object.assign(this.$data, this.$options.data())
                this.getFriends();
                this.getFriendApply();
            }
        }
    },
    components:{
        ChatMsg,
        UserDetails
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 获取好友列表 */
        getFriends(){
            let ptdata={
                uid:this.tmchat.uid,
                pageNumber:this.pageNumber,
                pageSize:this.pageSize
            };
            chat.friendList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.totalPage=data.totalPage;//总页数
                        this.totalRow=data.totalRow;//总条数
                        let list=data.list;
                        let contdata=[];//根据字母分类的数组
                        //如果为第一页-清空数据
                        if(this.pageNumber==1){
                            this.friendsList=[];
                            this.indexArr=[];//字母数组
                            this.friendListScroll();
                        }else{
                            contdata=[...this.friendsList];
                        }
                        let setObj=this.setChatIndex(list,contdata,'indexArr');
                        this.friendsList=setObj.contdata;
                    }
                    this.loading=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 好友申请列表 */
        getFriendApply(){
            let ptdata={
                uid:this.tmchat.uid,
                pageNumber:this.apply.pageNumber,
                pageSize:this.apply.pageSize
            };
            chat.applyList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.apply.totalPage=data.totalPage;//总页数
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                        })
                        if(this.apply.pageNumber==1){
                            this.apply.list=[];
                            this.applyListScroll();
                        }
                        this.apply.list= this.apply.list.concat(list);
                    }
                    this.loading=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 好友点击 */
        friendRowClick(item){
            if(!item){
                this.friendOn='apply';
                this.fdtitle='好友请求';
                return;
            }
            if(this.msgshow){
                this.msgshow=false;
            }
            this.friendOn=item.uid;
            this.chatItem=item;
            this.fdtitle=item.nick;
        },
        /* 监听-好友列表-滚动 */
        friendListScroll(){
            let _this=this;
            $("#friends-list").unbind('scroll');
            $("#friends-list").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#friends-scroll-body").height();
                var contentHeight = $(this).height();
                if(_this.totalPage>_this.pageNumber&&_this.loading&&scrollTop+contentHeight>scrollHeight-50){
                    _this.pageNumber++;
                    _this.loading=false;
                    _this.getFriends();
                }
            })
        },
        /* 监听-申请列表-滚动 */
        applyListScroll(){
            let _this=this;
            $("#applys-list").unbind('scroll');
            $("#applys-list").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#applys-scroll-body").height();
                var contentHeight = $(this).height();
                if(_this.apply.totalPage>_this.apply.pageNumber&&_this.loading&&scrollTop+contentHeight>scrollHeight-50){
                    _this.apply.pageNumber++;
                    _this.loading=false;
                    _this.getFriendApply();
                }
            })
        },
        /* 
        *列表通讯录数据展示字母分类 
        * list-需处理的数组
        * contdata-处理后返回的数组
        * indexArr-字母分类数组名称
        */
        setChatIndex(list,contdata,indexArr){
            list.map(item=>{
                let chatindex=item.chatindex;
                item.avatar=resUrl(item.avatar);//头像
                if(this[indexArr].find(item=>item==chatindex)){
                    contdata[contdata.length-1]['data'].push(item);
                }else{
                    let obj={index:'',data:[]};
                    this[indexArr].push(chatindex);
                    obj.index=chatindex;
                    obj.data.push(item);
                    contdata.push(obj);
                }
            })
            return {contdata,list};
        },
        /* 查看聊天记录 */
        seeMsgList(){
            this.chatItem={...this.chatItem,name:this.chatItem.nick}
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