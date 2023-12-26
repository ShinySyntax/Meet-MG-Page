<template>
    <div class="tm-right-content">
        <div class="chat-left">
            <div class="user-title">
                <span class="user-nick">“{{tmchat.nick}}”</span>的视角
            </div>
            <!-- 会话列表 -->
            <div class="chat-list" id="chat-list">
                <div class="chat-scroll-body" id="chat-scroll-body">
                    <div :class="['chat-col',chatlinkid==item.id?'active':'']" v-for="item in chatList" :key="item.id" @click="chatColClick(item)">
                        <span class="triangtop" v-show="item.topflag==1"></span>
                        <el-image class="chat-avatar" :src="item.avatar">
                            <div slot="error" class="image-slot">
                                <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                            </div>
                        </el-image>
                        <!-- <img :src="deviceImg[item.device].img" alt="" srcset="" :class="['device_icon cursor',item.uid==seeuid?'device_icon_right':'device_icon_left']">
                        <div :class="['appversion',item.uid==seeuid?'appversion_right':'appversion_left']" v-show="item.appversion">
                          <span :class="[item.uid==seeuid?'triangle-right':'triangle-left']"></span>
                          v{{item.appversion}}
                        </div> -->
                        <div class="chat-col-right">
                            <p class="chat-info-top">
                                <span class="chat-name">{{item.name}}</span>
                                <span class="chat-notread" v-if="item.notreadcount>0">{{item.notreadcount>99?'...':item.notreadcount}}</span>
                            </p>
                            <p class="chat-info-bottom">
                                <span class="chat-last-msg">
                                    <!-- 是否已读；最后一条消息发送者为自己-toreadflag 1-已读；2-未读 -->
                                    <span v-show="item.sysflag==2&&item.toreadflag&&item.lastmsguid==tmchat.uid&&item.chatmode==1" 
                                    :class="[item.toreadflag==2?'notread':'readed']">
                                    {{item.toreadflag==2?'[未读]':'已读'}}
                                    </span>
                                    <span v-show="item.atreadflag==2" class="notread">[有人@你]</span>
                                    <!-- 如果为群聊，显示 昵称:内容 -->
                                    <span v-html="item.chatmode==2&&item.sysflag==2&&item.msgresume?(item.fromnick+'：'+item.msgresume):item.msgresume" class="chat-last-bot"></span>
                                </span>
                                <span class="chat-last-time">{{item.sendtime}}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 会话消息 -->
        <ChatMsg :curruid="tmchat.uid" :chatItem="chatItem" :chatlinkid="chatlinkid" :from="'chat'" ref="chatmsg"></ChatMsg>
    </div>
</template>
<script>
import {chat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji,formatDateByTime,btDate} from '@_/utils/common.js';
import ChatMsg from '@_/components/im/ChatMsg';
export default {
    props:['tmchat','type'],
    data(){
        return {
            chatList:[],//会话列表
            pageNumber:1,
            pageSize:50,
            totalPage:0,
            allNotRead:0,//未读数
            loading:false,
            chatItem:{},
            chatlinkid:''
        }
    },
    watch:{
        type(nv){
            if(nv=='chat'){
                Object.assign(this.$data, this.$options.data())
                this.getChatList(); 
            }
        }
    },
    components:{
        ChatMsg
    },
    methods:{
        firstGet(){
            Object.assign(this.$data, this.$options.data())
            this.getChatList(); 
        },
        /* 获取会话列表 */
        getChatList(){
            let ptdata={
                uid:this.tmchat.uid,
                pageNumber:this.pageNumber,
                pageSize:this.pageSize
            };
            chat.chatList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.totalPage=data.totalPage;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);//头像
                            //时间
                            item.sendtime=this.chatTime(item.sendtime);
                            if(item.sysflag==1&&item.sysmsgkey){
                                item.c=item.msgresume;
                                item.msgresume=this.msgTemplate(item);
                            }
                            item.msgresume=messageEmoji(item.msgresume);//最后一条消息的内容
                            this.allNotRead+=item.notreadcount;//总未读条数
                        })
                        if(this.pageNumber==1){
                            this.chatList=[];
                            this.chatListScroll();
                        }
                        this.chatList=this.chatList.concat(list);
                        if(!this.chatlinkid){
                            this.chatColClick(list[0]);
                        }
                    }
                    this.loading=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 监听-会话列表-滚动 */
        chatListScroll(){
            let _this=this;
            $("#chat-list").unbind('scroll');
            $("#chat-list").on('scroll',function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $("#chat-scroll-body").height();
                var contentHeight = $(this).height();
                if(_this.totalPage>_this.pageNumber&&_this.loading&&scrollTop+contentHeight>scrollHeight-50){
                    _this.pageNumber++;
                    _this.loading=false;
                    _this.getChatList();
                }
            })
        },
        /* 会话消息列表 */
        chatColClick(item){
            this.chatlinkid=item.id;
            this.chatItem=item;
        },
        /* 会话模板 */
        msgTemplate(item){
            let nick=item.opernick;
            let tonicks=item.tonicks;
            nick=(nick==this.tmchat.nick)?'你':'"'+nick+'"';
            tonicks=(tonicks==this.tmchat.nick)?'你':'"'+tonicks+'"';
            let c=item.c;
            switch(item.sysmsgkey){
                case 'create':
                    c=nick+"邀请"+tonicks+"加入了群聊";
                    break;
                case 'join':
                    c=nick+"邀请"+tonicks+"加入了群聊";
                    break;
                case 'ownerleave':
                    c=nick+"退出了群聊，"+tonicks+"自动成为群主";
                    break;
                case 'leave' :
                    c=nick+"退出了群聊";
                    break;
                case 'operkick' :
                    c=nick+"将"+tonicks+"移除了群聊";
                    break;
                case 'tokick' :
                    c=tonicks+"被"+nick+"移除了群聊";
                    break;
                case 'msgback' :
                    c=nick+"撤回了一条消息";
                    break;
                case 'ownerchange' :
                    c=nick+"将群主转让给了"+tonicks;
                    break;
                case 'applyopen'  :
                    c=nick+"开启了群邀请开关：所有人都可以邀请人员进群";
                    break;
                case 'applyclose' :
                    c=nick+"关闭了群邀请开关：只有群主或者群管理员才能邀请人员进群";
                    break;
                case 'reviewopen' :
                    c=nick+"开启群审核开关：成员进群前,必须群主或者群管理员审核通过";
                    break;
                case 'reviewclose' :
                    c=nick+"关闭了群审核开关：成员进群不需要审核";
                    break;
                case 'updatenotice' :
                    c=nick+"修改了群公告:"+tonicks;
                    break;
                case 'updatename' :
                    c=nick+"修改了群名称:"+tonicks;
                    break;
                case 'delgroup'  :
                    c=nick+"解散了群";
                    break;
            }
            return c;
        },
        /* 会话列表消息-时间处理 */
        chatTime(msgtime) {
            if(!msgtime){
                return '';
            }
            let milliseconds= Date.parse(msgtime.replace(/-/g,"/"))
            let msgYear=new Date(milliseconds).getFullYear();
            let nowYear=new Date().getFullYear();
            var todate=new Date().getTime();
            var toyear=(formatDateByTime(todate,"yyyy-MM-dd")).replace(/-/g,"/");
            var todayStart = new Date(toyear+' 00:00:00').getTime();
            var todayEnd = new Date(toyear+' 23:59:59').getTime();
            var inputTime24 = formatDateByTime(milliseconds,"HH:mm");
            // 昨天的开始
            var yesterdayBegin = todayStart - 3600 * 24 * 1000;
            // 前天的开始
            var preYesterdayBegin = todayStart- 3600 * 24 * 1000;
            var dataString;

            if (milliseconds>todayStart&&milliseconds<todayEnd) {// 今天
                dataString=btDate(msgtime);
            }  else if (milliseconds>yesterdayBegin) {// 昨天
                dataString = "昨天 " + inputTime24;
            } else if (milliseconds>preYesterdayBegin) {// 前天
                dataString = "前天 " + inputTime24;
            }else if (msgYear==nowYear) {// 本年
                dataString = formatDateByTime(milliseconds,"MM/dd");
            } else {// 其他
                dataString = formatDateByTime(milliseconds,"yyyy/MM/dd");
            }
            return dataString;
        }
    }
}
</script>
<style lang="less" scoped>
@import '~@/_admin/assets/style/less/im/userchatinfo.less';
</style>