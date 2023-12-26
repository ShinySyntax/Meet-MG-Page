<template>
    <div class="chat-right">
        <div class="chat-msg-head">
            <span class="msg-title">
                {{chatItem.chatmode==2?chatItem.name+'('+chatItem.joinnum+')':chatItem.name}}
            </span>
            <span class="refresh" @click="refreshMsg">
                <img src="~@_/assets/img/common/refreshin.png" :class="[refresh?'rotate':'']"/>
                刷新
            </span>
        </div>
        <div class="scroll-bar">
            <div class="chatmsglist" :id="'chatmsglist'+from">
                <div class="scrolllist" :id="'scrolllist'+from">
                    <div :class="['msg-col',(item.sendbysys==1||item.ct==13||item.ct==12)?'msg-center-col':(item.f==curruid||item.uid==curruid?'msg-right-col':'msg-left-col')]" v-for="item in msgList" :key="item.mid">
                        <div v-if="(item.sendbysys==1||item.ct==12||item.ct==13)">
                            <p>{{item.t}}</p>
                            <p>{{item.html}}</p>
                        </div>
                        <template v-else>
                            <el-image  class="msg-avatar" :src="item.avatar" @click="showUserInfo(item.f||item.uid)">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img" @click="showUserInfo(item.f||item.uid)"/>
                                </div>
                            </el-image>
                            <div class="msg-right">
                                <p class="msg-top">
                                    <span class="msg-nick">{{item.nick}}</span>
                                    <span class="msg-time">{{item.t}}</span>
                                </p>
                                <div :class="['msg-bot',(item.ct==5||item.ct==6||item.ct==9)?'msg-bot-nbg':'']">
                                    <!--  1、普通文本消息，2、超链接卡片消息，3、文件，4、音频，5、视频 ,6.图片 ,9.名片 ,10.视频通话, 11.音频通话, 12.红包, 13.入群申请,88.链接消息-->
           
                                    <div v-if="item.ct==1"  v-html="item.html">
                                    </div>
                                    <div v-else-if="item.ct==3" class="filebg" v-html="item.html"></div>
                                    <div v-else-if="item.ct==4" class="audiomsg" @click="playAudio(item)"   :style="{'width':item.textparse.width+'px'}">
                                        <span>{{item.textparse.seconds}}″</span>
                                        <span v-html="item.html"></span>
                                        <img src="~@_/assets/img/im/ownvoice_stop.png" v-show="((item.f==curruid||item.uid==curruid)&&!item.textparse.play)"/>
                                        <img src="~@_/assets/img/im/voice_stop.png" v-show="(!(item.f==curruid||item.uid==curruid)&&!item.textparse.play)"/>
                                        <img src="~@_/assets/img/im/ownvoice.gif" v-show="((item.f==curruid||item.uid==curruid)&&item.textparse.play)"/>
                                        <img src="~@_/assets/img/im/voice.gif" v-show="(!(item.f==curruid||item.uid==curruid)&&item.textparse.play)"/>
                                    </div>
                                    <!-- 视频 -->
                                    <div v-else-if="item.ct==5" class="videocol" @click="seeVideo(item.textparse)">
                                        <el-image :src="item.html" fit="cover" class="el-image" >
                                            <div slot="error" class="image-slot">
                                                <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                                            </div>
                                        </el-image>
                                    </div>
                                    <!-- 图片 -->
                                    <div v-else-if="item.ct==6"  class="imgcol cursor" >
                                        <el-image :src="item.html" fit="cover" class="el-image" @click="viewImg(item)">
                                        </el-image>
                                    </div>
                                    <!-- 名片 -->
                                    <div v-else-if="item.ct==9" class="cardbg">
                                        <!-- {{item.html}} -->
                                        <div class="cardtop">
                                            <el-image :src="item.textparse.bizavatar" fit="cover" class="el-image" >
                                                <div slot="error" class="image-slot">
                                                    <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                                                </div>
                                            </el-image>
                                            <span class="cardname">{{item.textparse.bizname}}</span>
                                        </div>
                                        <div class="cardbot">
                                            <img src="~@_/assets/img/im/scard.png" v-show="item.textparse.cardtype==1"/>
                                            <img src="~@_/assets/img/im/gcard.png" v-show="item.textparse.cardtype==2"/>
                                            {{item.textparse.cardtype==2?'群名片':'个人名片'}}
                                        </div>
                                    </div>
                                    <!-- 音视频通话 10:视频通话；11:音频通话-->
                                    <div v-else-if="item.ct==10||item.ct==11" class="callcol">
                                        <img src="~@_/assets/img/im/video.png" v-if="item.ct==10" :class="['call-icon',item.uid==curruid?'right-icon rotate':'']"/>
                                        <img src="~@_/assets/img/im/autio.png" v-if="item.ct==11&&item.uid!=curruid" class="call-icon"/>
                                        <img src="~@_/assets/img/im/autiort.png" v-if="item.ct==11&&item.uid==curruid" class="call-icon right-icon"/>
                                        {{item.html}}
                                    </div>
                                    <!-- 链接消息 -->
                                    <div v-else-if="item.ct == 88">
                                        <div class="hyperlinks cursor" @click="openNews(item.temp.url)">
                                            <div class="hyperlinks-title">{{ item.temp.title }}</div>
                                            <div class="hyperlinks-content">
                                                <span class="cardname">{{ item.temp.subtitle }}</span>
                                                <el-image :src="item.temp.img" fit="cover" class="el-image">
                                                    <div slot="error" class="image-slot">
                                                        <img src="~@_/assets/img/im/link_default_img.png" class="error-img" />
                                                    </div>
                                                </el-image>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="group-nodata" v-if="msgList.length==0">
                        <img src="~@_/assets/img/im/nodata.png"/>
                        <p>暂无信息</p>
                    </div>
                </div>
            </div>
        </div>
         <!-- 图片查看 -->
        <div id="view-container2" style='display:none' class="view-container">
            <img :src="bigImg"/>
        </div>
    </div>
</template>
<script>
import {chat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji} from '@_/utils/common.js';
import Viewer from 'viewerjs';//放大图片插件
import 'viewerjs/dist/viewer.min.css';//放大图片插件css
import {mapMutations} from 'vuex';
export default {
    props:['curruid','chatItem','chatlinkid','touid','from','show'],
    data(){
        return {
            msgList:[],
            pageNumber:1,
            pageSize:50,
            totalPage:0,
            bigImg:'',
            loading:true,
            refresh:false
        }
    },
    watch:{
        /* 会话模块监听chatlinkid */
        chatlinkid(nv,ov){
            if(nv!=ov&&nv){
                if(this.from=='chat'){
                    this.refreshMsg();
                }
            }
        },
        /* 好友-聊天列表监听show */
        show(nv,ov){
            if(nv){
                this.refreshMsg();
            }
        },
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 查看视频 */
        seeVideo(item){
            window.open(resUrl(item.url));
        },
        /* 消息列表 */
        async getMsgList(){
            let ptdata={};
            let res=null;
            if(this.from=='chat'){
                ptdata={
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    chatlinkid:this.chatlinkid,
                };
                res=await chat.chatMsgList(ptdata);
            }
            if(this.from=='friend'){
                ptdata={
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    uid:this.curruid,
                    touid:this.chatlinkid
                };
                res=await chat.friendMsgList(ptdata);
            }
            if(this.from=='group'){
                ptdata={
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize,
                    groupid:this.chatlinkid,
                };
                res=await chat.groupMsgList(ptdata);
            }
            if(res.ok){
                let list=res.data.list;
                this.totalPage=res.data.totalPage;
                list=list.reverse();
                list.map(item=>{
                    // let contenttype=this.typeList.find(v=>v.id==item.contenttype);
                    // item.type=contenttype.label;
                    item.avatar=resUrl(item.avatar);
                    let contenttype=item.ct;
                    let text=item.c;
                    if(item.sysmsgkey&&item.sendbysys==1){
                        text= this.msgTemplate(item);
                    }
                    let html='',textparse;
                    switch (contenttype) {
                        case 1:
                            // html=text;
                            html = text.replace(/\n/g, '<br>');
                            //表情编译-begin
                            html=messageEmoji(html);
                            //网址处理
                            let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:)+)/g;
                            html = html.replace(reg, "<a href='$1$2' target='_blank' style='color:#3A7BE9;'>$1$2</a>");
                            break;
                        case 3:
                            textparse = JSON.parse(text);
                            let url=resUrl(textparse.url);
                            html= `<a href="${url}" target="_blank" download="${textparse.filename}" style='color:#3A7BE9;'>${textparse.filename}</a>`;
                            break;
                        case 4:
                            textparse = JSON.parse(text);
                            textparse.play=false;
                            if(textparse.seconds){
                                textparse.width =  textparse.seconds * 5.8;
                            }
                            html= `<audio src="${resUrl(textparse.url)}" class="audio" id="audio${textparse.id}" mid='${item.mid}'></audio>`;
                            break;
                        case 5:
                        case 6:
                            textparse = JSON.parse(text);
                            html=resUrl(textparse.coverurl);
                            break;
                        case 9:
                            textparse = JSON.parse(text);
                            textparse.bizavatar=resUrl(textparse.bizavatar);
                            html='['+textparse.bizname+'/'+textparse.bizid+']';
                            break;
                        case 10:
                        case 11:
                            textparse = JSON.parse(text);
                            html=this.hangUpReason(textparse.hanguptype,textparse.calltype,item.msgtype,textparse.duration);
                            break;
                        case 12:
                            html=item.f==this.curruid?"发出红包，请在手机端查看":"收到红包，请在手机端查看"
                            break;
                        case 13:
                            html="收到一条入群申请";
                            break;
                        case 88:
                            item.temp = JSON.parse(item.c)
                            html="分享一个链接";
                            break;
                    }
                    item.textparse=textparse;
                    item.html=html;
                })
                return list;
            }else{
                return []
            }
        },
        /* 刷新消息列表 */
        async refreshMsg(){
            this.refresh=true;
            this.pageNumber=1;
            this.msgList=await this.getMsgList();
            setTimeout(()=>{
                this.refresh=false;
            },500);
            this.$nextTick(()=>{
                $("#chatmsglist"+this.from).unbind("scroll");
                $("#chatmsglist"+this.from).scrollTop($("#scrolllist"+this.from).height());
                this.setScroll();
            })
        },
        /* 查看图片 */
        viewImg(item){
            let textparse = JSON.parse(item.c);
            this.bigImg=resUrl(textparse.url);
            this.$nextTick(()=>{
                var viewer = new Viewer(document.getElementById("view-container2"), {
                    hidden: function () {
                        viewer.destroy();
                    },
                    button:true,
                    url: 'data-original',
                    toolbar: {
                        zoomIn: 4,
                        zoomOut: 4,
                        prev: function() {
                            viewer.prev(false);//当前是第一个时是不转向查看最后一个
                        },
                        next: function() {
                            viewer.next(false);//当前是最后一个时是不转向查看第一个
                        },
                        loop:false,
                    },
                    title:false,
                    loop:false,
                    navbar:false,
                });
                // viewer.view(0); 
                viewer.show();
            })
        },
        /* 监听聊天滚动 */
        setScroll(){
            let $chatmsglist= $("#chatmsglist"+this.from);
            $chatmsglist.on("scroll",async ()=>{
                if(this.loading&&this.totalPage>this.pageNumber&&$chatmsglist.scrollTop()==0){
                    this.loading=false;
                    this.pageNumber++;
                    let list=await this.getMsgList();
                    this.msgList=list.concat(this.msgList);
                    this.loading=true;
                    this.$nextTick(()=>{
                        //重定位滚动位置
                        let topOffsetPx = $("#scrolllist"+this.from +" .msg-col").eq(list.length).offset().top-$chatmsglist.height();
                        $chatmsglist.scrollTop(topOffsetPx);
                    })
                }
            })
        },
         /* 
        音视频消息类型 
        @param{*} type 挂断类型
        @param{*} call 音视频通话类型 10:视频通话 11:音频通话
        @param{*} sendtype 发送者类别 1:自己发送 2:别人发送
        @param{*} duration 通话时长milliseconds
        */
        hangUpReason(type,call,sendtype,duration){
            //1:自己发送  2：好友发送  
            let data='';
            let callstr=call==10?'视频':'语音';
            switch(type){
                case 1:
                    data='通话时长'+this.formatMilliseconds(duration);
                    break;
                case 2:
                    data=sendtype==1?'对方已拒绝':'已拒绝';
                    break;
                case 3:
                    data=sendtype==1?'对方忙线中':'';
                    break;
                case 4:
                case 5:
                case 6:
                    data='系统自动挂断';
                    break;
                case 7:
                    data='系统重启';
                    break;
                case 8:
                    data='对方不在线';
                    break;
                case 9:
                    data=sendtype==1?'对方未接听':callstr+'通话未接听';
                    break;
                case 10:
                    data=sendtype==1?callstr+'通话已取消':'对方已取消';
                    break;
                case 99:
                    data='还没挂断';
                    break;
            }
            return data;
        },
        /* 会话模板 */
        msgTemplate(item){
            let nick=item.opernick;
            let tonicks=item.tonicks;
            nick=(nick==this.curruser.nick)?'你':'"'+nick+'"';
            tonicks=(tonicks==this.curruser.nick)?'你':'"'+tonicks+'"';
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
        /* 播放音频 */
        playAudio(item){
            let _this=this;
            let audio = document.getElementById("audio"+item.textparse.id); 
            audio.currentTime=0;
            // audio.volume = 1;
            let allaudio=document.getElementsByClassName("audio");
            $.each(allaudio,(i,v)=>{
                if(audio!=v){
                    let mid=v.getAttribute('mid');
                    _this.msgList.map(val=>{
                        if(val.mid==mid&&val.ct==4){
                            val.textparse.play=false;
                        }
                    })
                    v.pause();
                }
            })
            if(audio.paused){ 
                item.textparse.play=true;                
                audio.play(); 
                $("#audio"+item.textparse.id).unbind('ended');
                $("#audio"+item.textparse.id).on('ended',function(){
                    item.textparse.play=false;  
                    audio.pause();
                })
            }else{
                item.textparse.play=false;  
                audio.pause();
            }
        },
        /**
         * 毫秒格式化为时分秒
         * @param {*} s  毫秒
         */
        formatMilliseconds(s) {
            var t='';
            s=s/1000;
            if (s > -1) {
                var min = Math.floor(s / 60) % 60;
                var sec = parseInt(s % 60);

                if (min < 10) {
                    min = "0" + min;
                }
                t += min + ":";
                if (sec < 10) {
                    sec = "0" + sec;
                }
                t += sec;
            }
            return t;
        },
        /* 显示用户信息 */
        showUserInfo(uid){
            this.setUserInfoShow(false);
            this.setUserInfoUid(uid);
            //解决弹框显示层级问题
            setTimeout(()=>{
                this.setUserInfoShow(true);
            },100);
        },
        openNews(url){
            window.open(url,"_blank")
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/groupchat.less";
@import '~@/_admin/assets/style/less/im/userchatinfo.less';
</style>