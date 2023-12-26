<template>
<div>
    <!-- 聊天列表弹框 -->
    <el-dialog :visible.sync="show" :close-on-click-modal="false" class="tmdialog" width="632px" :before-close="handleClose">
        <p class="groupheader">
            <span class="left">
                <span class="gtitle">{{dialog.title}}</span>
                <span class="refresh" @click="refreshClick">
                    <img src="~@_/assets/img/common/refreshin.png" :class="[refresh?'rotate':'']"/>
                    刷新
                </span>
            </span>
            <span class="right" v-if="from=='groupchat'">
                <img src="~@_/assets/img/common/recentopen.png"/>
                <span class="timedesc">{{type=='1'?'最近三个月':(type=='2'?'3个月以前':'无效群记录')}}</span>
            </span>
            <span class="right" v-if="from=='gpmanage'">
               <label class="tm-radio">
                    <input type="radio" v-model="msgtype" value="1" class="tm-radio-input" @change="changeMsgType"/>
                    <span class="tm-radio-label">最近三个月</span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="msgtype" value="3" class="tm-radio-input" @change="changeMsgType"/>
                    <span class="tm-radio-label">3个月以前</span>
                </label>
            </span>
        </p>
        <div class="dialoglist" id="dialoglist">
            <div class="scrolllist" id="scrolllist">
               <div :class="['msg-col',item.uid==seeuid?'msg-right-col':'msg-left-col']" v-for="item in msgList" :key="item.id">
                <el-image  class="msg-avatar" :src="item.avatar" @click="seeInfo(item.uid)">
                    <div slot="error" class="image-slot" @click="seeInfo(item.uid)">
                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                    </div>
                </el-image>
                <img v-show="item.deviceImg" :src="item.deviceImg" alt="" srcset="" :class="['device_icon cursor',item.uid==seeuid?'device_icon_right':'device_icon_left']">
                <p v-show="item.device=='99'" :class="['device_icon deviceSys cursor',item.uid==seeuid?'device_icon_right':'device_icon_left']">S</p>
                <div :class="['appversion',item.uid==seeuid?'appversion_right':'appversion_left']" v-show="item.appversion">
                  <span :class="[item.uid==seeuid?'triangle-right':'triangle-left']"></span>
                  v{{item.appversion}}
                </div>
                <div class="msg-right">
                    <p class="msg-top">
                        <span class="msg-nick">{{item.nick}}</span>
                        <span class="msg-time">{{item.createtime}}</span>
                    </p>

                    <div :class="['msg-bot',(item.contenttype==5||item.contenttype==6||item.contenttype==9)?'msg-bot-nbg':'']">
                        <!--  1、普通文本消息，2、超链接卡片消息，3、文件，4、音频，5、视频 ,6.图片 ,9.名片 ,10.视频通话, 11.音频通话-->
                        <div v-if="item.contenttype==1"  v-html="item.html">
                        </div>
                        <div v-else-if="item.contenttype==3" class="filebg" v-html="item.html"></div>
                        <div v-else-if="item.contenttype==4" class="audiomsg" @click="playAudio(item)"   :style="{'width':item.textparse.width+'px'}">
                            <span>{{item.textparse.seconds}}″</span>
                            <span v-html="item.html"></span>
                            <img src="~@_/assets/img/im/ownvoice_stop.png" v-show="((item.uid==seeuid)&&!item.textparse.play)"/>
                            <img src="~@_/assets/img/im/voice_stop.png" v-show="(!(item.uid==seeuid)&&!item.textparse.play)"/>
                            <img src="~@_/assets/img/im/ownvoice.gif" v-show="((item.uid==seeuid)&&item.textparse.play)"/>
                            <img src="~@_/assets/img/im/voice.gif" v-show="(!(item.uid==seeuid)&&item.textparse.play)"/>
                        </div>
                        <!-- 视频 -->
                        <div v-else-if="item.contenttype==5" class="videocol" @click="seeVideo(item.textparse)">
                            <el-image :src="item.html" fit="cover" class="el-image" >
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                                </div>
                            </el-image>
                        </div>
                        <!-- 图片 -->
                        <div v-else-if="item.contenttype==6"  class="imgcol cursor" >
                            <el-image :src="item.html" fit="cover" class="el-image" @click="viewImg(item)">
                            </el-image>
                        </div>
                        <!-- 名片 -->
                        <div v-else-if="item.contenttype==9" class="cardbg">
                            <div class="cardtop">
                                <el-image :src="item.textparse.bizavatar" fit="cover" class="el-image" >
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                                    </div>
                                </el-image>
                                <span class="cardname">{{item.textparse.bizname}}</span>++++++++
                            </div>
                            <div class="cardbot">
                                <img src="~@_/assets/img/im/scard.png" v-show="item.textparse.cardtype==1"/>
                                <img src="~@_/assets/img/im/gcard.png" v-show="item.textparse.cardtype==2"/>
                                {{item.textparse.cardtype==2?'群名片':'个人名片'}}
                            </div>
                        </div>
                        <!-- 红包 -->
<!--                        <div v-else-if="item.contenttype==12" class="cardbg">-->
                            <div v-else-if="item.contenttype==12" class="cardbg">
                            <div class="redcardtop" >
<!--                                <el-image :src="item.textparse.bizavatar" fit="cover" class="el-image" >-->
<!--                                    <div slot="error" class="image-slot">-->
<!--                                        <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>-->
<!--                                    </div>-->
<!--                                </el-image>-->
                                {{item.textparse.text}}<br />
                                {{item.textparse.mode==1?"普通红包":item.textparse.mode==2?"手气红包":item.textparse.mode==3?"专属红包":""}}
<!--                                ?{"cny":"1","mode":2,"rid":12056,"showAmount":"0","status":"1","text":"恭喜发财，吉祥如意"}?-->
<!--                                {{item.textparse.cny/100}}-->
                            </div>

<!--                            <div class="cardtop">-->
<!--                                <el-image :src="item.textparse.bizavatar" fit="cover" class="el-image" >-->
<!--                                    <div slot="error" class="image-slot">-->
<!--                                        <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>-->
<!--                                    </div>-->
<!--                                </el-image>-->
<!--                                <span class="cardname">{{item.textparse.bizname}}</span>-->
<!--                            </div>-->
<!--                            <div class="cardbot">-->
<!--                                <img src="~@_/assets/img/im/scard.png" v-show="item.textparse.cardtype==1"/>-->
<!--                                <img src="~@_/assets/img/im/gcard.png" v-show="item.textparse.cardtype==2"/>-->
<!--                                {{item.textparse.cardtype==2?'群名片':'个人名片'}}-->
<!--                            </div>-->
                        </div>
                        <div v-else-if="item.contenttype==13">
                            <span>群聊邀请已发送，请等待管理员确认</span>
                        </div>
                        
                    </div>
                </div>
                <div class="seerole" @click="seeRole(item.uid,item.nick)">
                    按TA的视角查看
                </div>
            </div>
            <div class="group-nodata" v-if="msgList.length==0">
                <img src="~@_/assets/img/im/nodata.png"/>
                <p>暂无群聊信息</p>
            </div>
            </div>
        </div>
        <div class="outseerole" v-show="seeuid">
            <span>“{{seenick}}”的视角</span>
            <button class="primarybtn out-right" @click="seeRole('')">
                <img src="~@_/assets/img/im/out.png"/>退出他人视角</button>
        </div>
    </el-dialog>
    <!-- 图片查看 -->
    <div id="view-container" style='display:none' class="view-container">
        <img :src="bigImg"/>
    </div>
    </div>
</template>
<script>
import {imchat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji} from '@_/utils/common.js';
import Viewer from 'viewerjs';//放大图片插件
import 'viewerjs/dist/viewer.min.css';//放大图片插件css
import {mapMutations} from 'vuex';
export default {
    props:['dialog','type','from','show'],
    data(){
        return{
            bigImg:'',//图片消息
            msgtype:'1',
            refresh:false,
            msgList:[],
            load:true,
            pageNumber:1,
            pageSize:20,
            totalPage:0,
            seeuid:'',//查看视角uid
            seenick:''//查看视角昵称
        }
    },
    watch:{
        show(nv){
            if(nv){
                this.msgtype=this.type;
                this.refreshMsg();
            }
        }
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 查看视频 */
        seeVideo(item){
            window.open(resUrl(item.url));
        },
        /* 消息列表 */
        async getMsgList(pageNumber,pageSize,groupid,type){
            let ptdata={
                pageNumber:pageNumber||this.pageNumber,
                pageSize:pageSize||this.pageSize,
                groupid:groupid||this.dialog.groupid,
                type:type||this.msgtype
            };
            let res=await imchat.groupMsgModeList(ptdata);
            if(res.ok){
                let list=res.data.list;
                this.totalPage=res.data.totalPage;
                list=list.reverse();
                list.map(item=>{
                    item.avatar=resUrl(item.avatar);
                    let contenttype=item.contenttype;
                    let text=item.text;
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
                            html= `<audio src="${resUrl(textparse.url)}" class="gaudio" id="gaudio${textparse.id}" mid='${item.id}'></audio>`;
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
                        case 12:
                            textparse = JSON.parse(text);
                            break;
                    }
                    let device = item.device
                    switch(device){
                        case 1:
                            item.deviceImg = this.deviceImg[item.device].img
                        case 2:
                            item.deviceImg = this.deviceImg[item.device].img
                        case 3:
                            item.deviceImg = this.deviceImg[item.device].img
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
        refreshClick(){
            this.refresh=true;
            this.refreshMsg();
            setTimeout(()=>{
                this.refresh=false;
            },1000);
        },
        /* 刷新消息列表 */
        async refreshMsg(){
            this.pageNumber=1;
            this.msgList=await this.getMsgList();
            this.$nextTick(()=>{
                $("#dialoglist").unbind("scroll");
                $("#dialoglist").scrollTop($("#scrolllist").height());
                this.setScroll();
            })
        },
        /* 查看图片 */
        viewImg(item){
            let textparse = JSON.parse(item.text);
            this.bigImg=resUrl(textparse.url);
            this.$nextTick(()=>{
                var viewer = new Viewer(document.getElementById("view-container"), {
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
                    navbar:false,
                });
                viewer.view(0); 
                viewer.show();
            })
        },
        /* 切换视角 */
        seeRole(uid,nick){
            this.seeuid=uid;
            this.seenick=nick||'';
        },
        /* 监听聊天滚动 */
        setScroll(){
            $("#dialoglist").on("scroll",async ()=>{
                if(this.load&&this.totalPage>this.pageNumber&&$("#dialoglist").scrollTop()==0){
                    this.load=false;
                    this.pageNumber++;
                    let list=await this.getMsgList();
                    this.msgList=list.concat(this.msgList);
                    this.load=true;
                    this.$nextTick(()=>{
                        //重定位滚动位置
                        let topOffsetPx = $("#scrolllist .msg-col").eq(list.length).offset().top-$("#dialoglist").height();
                        $("#dialoglist").scrollTop(topOffsetPx);
                    })
                }
            })
        },
        /* 播放音频 */
        playAudio(item){
            let _this=this;
            let tid=item.textparse.id;
            let audio = document.getElementById("gaudio"+tid); 
            audio.currentTime=0;
            // audio.volume = 1;
            let allaudio=document.getElementsByClassName("gaudio");
            $.each(allaudio,(i,v)=>{
                if(audio!=v){
                    let mid=v.getAttribute('mid');
                    _this.msgList.map(val=>{
                        if(val.id==mid&&val.ct==4){
                            val.textparse.play=false;
                        }
                    })
                    v.pause();
                }
            })
            if(audio.paused){ 
                item.textparse.play=true;                
                audio.play(); 
                $("#gaudio"+item.textparse.id).unbind('ended');
                $("#gaudio"+item.textparse.id).on('ended',function(){
                    item.textparse.play=false;  
                    audio.pause();
                })
            }else{
                item.textparse.play=false;  
                audio.pause();
            }
        },
        /* 更改消息 */
        changeMsgType(){
            this.seeuid="";
            this.refreshMsg();
            // this.$emit('changeMsgType',this.msgtype);
        },
        /* 关闭弹框 */
        handleClose(){
            this.$emit('closeMsg',false);
        },
        /* 查看用户详情 */
        seeInfo(uid){
            this.setUserInfoUid(uid);
            this.setUserInfoShow(true);
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/groupchat.less";
</style>