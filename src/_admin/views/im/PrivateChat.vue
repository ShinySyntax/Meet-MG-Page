<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter" v-for="(v,k) in filters" :key="k" v-show="k==type">
                <div class="filter-item">
                    <label class="filter-label">时间</label>
                    <el-date-picker v-model="v.starttime" type="date" placeholder="开始时间" :picker-options="k==1?pickerOptions:{}" value-format="yyyyMMdd">
                    </el-date-picker>
                    <label class="filter-label fl-date-left">至</label>
                    <el-date-picker v-model="v.endtime" type="date" placeholder="结束时间" :picker-options="k==1?pickerOptions:{}"  value-format="yyyyMMdd">
                    </el-date-picker>
                </div>
                <div class="filter-item">
                    <label class="filter-label">用户</label>
                    <el-input type="text" clearable v-model="v.searchkey" placeholder="昵称/ID"></el-input>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getData(1)">查询</button>
                </div>
            </div>
            <div class="top-right">
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="1" class="tm-radio-input" @change="getData()"/>
                    <span class="tm-radio-label">最近3个月</span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="2" class="tm-radio-input" @change="getData()"/>
                    <span class="tm-radio-label">3个月以前</span>
                </label>
            </div>
        </div>
        <div class="grouplist friendslist">
            <div class="groupitem frienditem" v-for="v in data.list" :key="v.id">
                <div class="item-top">
                    <div class="user-left">
                        <el-image  class="group-avatar private-avatar" :src="v.avatar"  @click="seeInfo(v.uid)">
                            <div slot="error" class="image-slot"  @click="seeInfo(v.uid)">
                                <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                            </div>
                        </el-image>
                        <div class="groupinfo friendinfo">
                            <p class="group-name friend-name">{{v.nick}}</p>
                            <p class="group-id friend-uid">UID:{{v.uid}}</p>
                            <p class="group-id friend-uid">ID:{{v.tiono}}</p>
                            <p class="group-id friend-uid">手机:{{v.phone}}</p>
                        </div>
                    </div>
                    <div :class="['groupsee',v.msglist.length==0?'nogroupsee':'']" @click="showMsgList(v)">
                        <img src="~@_/assets/img/im/monitor.png" v-show="v.msglist.length>0"/>
                        <img src="~@_/assets/img/im/monitorc.png" v-show="v.msglist.length==0"/>
                        查看会话
                    </div>
                    <div class="user-right">
                        <el-image  class="group-avatar private-avatar" :src="v.toavatar"  @click="seeInfo(v.touid)">
                            <div slot="error" class="image-slot"  @click="seeInfo(v.touid)">
                                <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                            </div>
                        </el-image>
                        <div class="groupinfo friendinfo">
                            <p class="group-name friend-name">{{v.tonick}}</p>
                            <p class="group-id friend-uid">UID:{{v.touid}}</p>
                            <p class="group-id friend-uid">ID:{{v.toutiono}}</p>
                            <p class="group-id friend-uid">手机:{{v.touphone}}</p>
                        </div>
                    </div>
                </div>
                <div class="item-bottom" :id="'item-bottom'+v.id">
                    <div class="itemscroll" :id="'itemscroll'+v.id">
                        <div class="msg-col" v-for="item in v.msglist" :key="item.id">
                            <div :class="['msg-right overell',item.uid==v.touid?'msg-right-col':'msg-left-col']">
                                <p class="msg-top">
                                    <span class="msg-time">{{item.t}}</span>
                                </p>
                                <div class="msg-content">
                                    <!--  1、普通文本消息，2、超链接卡片消息，3、文件，4、音频，5、视频 ,6.图片 ,9.名片 ,10.视频通话, 11.音频通话-->
                                    <div v-if="item.ct==1"  v-html="item.html" class="overell">
                                    </div>
                                    <div v-else-if="item.ct==3" class="filebg overell">
                                        {{item.textparse.filename}}
                                    </div>
                                    <div v-else-if="item.ct==4" class="imgcol">
                                        音频消息
                                    </div>
                                    <!-- 视频 -->
                                    <div v-else-if="item.ct==5" class="imgcol">
                                        视频消息
                                    </div>
                                    <!-- 图片 -->
                                    <div v-else-if="item.ct==6"  class="imgcol" >
                                        图片消息
                                    </div>
                                    <!-- 名片 -->
                                    <div v-else-if="item.ct==9" class="cardbg">
                                        {{item.html}}
                                    </div>
                                    <!-- 音视频通话 -->
                                    <div v-else-if="item.ct==10||item.ct==11">
                                        {{item.html}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="group-nodata" v-if="v.msglist.length==0&&v.datatype==2">
                            <img src="~@_/assets/img/im/nodata.png"/>
                            <p>暂无消息</p>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div class="nolist" v-show="data.list.length==0">暂无数据</div>
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
        <!-- 图片查看 -->
	    <div id="view-container" style='display:none' class="view-container">
            <img :src="bigImg"/>
        </div>
        <!-- 聊天列表弹框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog " width="632px" >
            <div class="groupheader">
               <!--  <span class="fdtitle">{{dialog.title}}</span> -->
                <span class="left">
                    <span class="gtitle">{{dialog.title}}</span>
                    <span class="refresh"  @click="refreshMsg">
                        <img src="~@_/assets/img/common/refreshin.png" :class="[refresh?'rotate':'']"/>
                        刷新
                    </span>
                </span>
                <span class="right">
                    <img src="~@_/assets/img/common/recentopen.png"/>
                    <span class="timedesc">{{type=='1'?'最近三个月':'3个月以前'}}</span>
                </span>
            </div>
            <div class="dialoglist" id="dialoglist">
                <div class="scrolllist" id="scrolllist">
                    <div :class="['msg-col',item.uid==dialog.touid?'msg-right-col':'msg-left-col']" v-for="item in dialog.list" :key="item.id">
                        <el-image  class="msg-avatar" :src="item.avatar" @click="seeInfo(item.uid)">
                            <div slot="error" class="image-slot" @click="seeInfo(item.uid)">
                                <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                            </div>
                        </el-image>
                        <img v-show="item.deviceImg" :src="item.deviceImg" alt="" srcset="" :class="['device_icon cursor',item.uid==dialog.touid?'device_icon_right':'device_icon_left']">
                        <p v-show="item.device=='99'" :class="['device_icon deviceSys cursor',item.uid==dialog.touid?'device_icon_right':'device_icon_left']">S</p>
                        <div :class="['appversion',item.uid==dialog.touid?'appversion_right':'appversion_left']" v-show="item.appversion">
                          <span :class="[item.uid==dialog.touid?'triangle-right':'triangle-left']"></span>
                          v{{item.appversion}}
                        </div>
                        <div class="msg-right">
                            <p class="msg-top">
                                <span class="msg-nick">{{item.nick}}</span>
                                <span class="msg-time">{{item.t}}</span>
                            </p>
                            <div :class="['msg-bot',(item.ct==5||item.ct==6||item.ct==9)?'msg-bot-nbg':'']">
                                <!--  1、普通文本消息，2、超链接卡片消息，3、文件，4、音频，5、视频 ,6.图片 ,9.名片 ,10.视频通话, 11.音频通话-->
                                <div v-if="item.ct==1"  v-html="item.html">
                                </div>
                                <div v-else-if="item.ct==3" class="filebg" v-html="item.html"></div>
                                <div v-else-if="item.ct==4" class="audiomsg" @click="playAudio(item)"   :style="{'width':item.textparse.width+'px'}">
                                    <span>{{item.textparse.seconds}}″</span>
                                    <span v-html="item.html"></span>
                                    <img src="~@_/assets/img/im/ownvoice_stop.png" v-show="((item.uid==dialog.touid)&&!item.textparse.play)"/>
                                    <img src="~@_/assets/img/im/voice_stop.png" v-show="(!(item.uid==dialog.touid)&&!item.textparse.play)"/>
                                    <img src="~@_/assets/img/im/ownvoice.gif" v-show="((item.uid==dialog.touid)&&item.textparse.play)"/>
                                    <img src="~@_/assets/img/im/voice.gif" v-show="(!(item.uid==dialog.touid)&&item.textparse.play)"/>
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
                                    <img src="~@_/assets/img/im/video.png" v-if="item.ct==10" :class="['call-icon',item.uid==dialog.touid?'right-icon rotate':'']"/>
                                    <img src="~@_/assets/img/im/autio.png" v-if="item.ct==11&&item.uid!=dialog.touid" class="call-icon"/>
                                    <img src="~@_/assets/img/im/autiort.png" v-if="item.ct==11&&item.uid==dialog.touid" class="call-icon right-icon"/>
                                    {{item.html}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group-nodata" v-if="dialog.list.length==0">
                    <img src="~@_/assets/img/im/nodata.png"/>
                    <p>暂无私聊信息</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {imchat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji} from '@_/utils/common.js';
import Viewer from 'viewerjs';//放大图片插件
import 'viewerjs/dist/viewer.min.css';//放大图片插件css
import {mapMutations} from 'vuex';
export default {
    data(){
        return {
            filters:{
                '1':{
                    starttime:'',
                    endtime:'',
                    searchkey:'',
                },
                '2':{
                    starttime:'',
                    endtime:'',
                    searchkey:'',
                },
            },
            data:{//数据列表
                pageNumber:1,
                pageSize:12,
                totalRow:0,//总条数
                list:[],//列表
                pagesizes:[12,24,36,48]
            },
            pickerOptions: {},
            bigImg:'',//图片消息
            curroute:'',//当前路由
            type:"1",
            dialog:{
                visible:false,
                pageNumber:1,
                pageSize:50,
                list:[],
                title:'',
                fidkey:'',
                load:true,
                totalPage:1,
                touid:'',
                contenttype:[]
            },
            refresh:false//刷新状态
        }
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.setMonthLimit();
                this.getData();
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.setMonthLimit();
        this.getData();
    },
    /* 路由跳转-隐藏页面弹框 */
    beforeRouteLeave(to, from, next){
        if(this.dialog.visible){
            this.dialog.visible=false;
        }
        next();
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let type=this.type;
            let ptdata={...this.filters[type],pageNumber,pageSize,type};
            imchat.fdList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(async item=>{
                            item.avatar=resUrl(item.avatar);
                            item.toavatar=resUrl(item.toavatar);
                            item.msglist=[];
                            item.datatype=1;
                            let msg=await this.getMsgList(1,50,item.fidkey);
                            item.msglist=msg;
                            item.datatype=2;
                            this.$nextTick(()=>{
                                $("#item-bottom"+item.id).scrollTop($("#itemscroll"+item.id).height());
                            })
                        })
                        this.data.list=list;
                        window.scrollTo(0,0);
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 消息列表 */
        async getMsgList(pageNumber,pageSize,fidkey,ctype){
            let ptdata={
                pageNumber,
                pageSize,
                fidkey,
                type:this.type,
                contenttype:ctype||''
            };
            let res=await imchat.p2pList(ptdata);
            if(res.ok){
                let list=res.data.list;
                this.dialog.totalPage=res.data.totalPage;
                list=list.reverse();
                list.map(item=>{
                    item.avatar=resUrl(item.avatar);
                    let contenttype=item.ct;
                    let text=item.c;
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
                            html= `<audio src="${resUrl(textparse.url)}" class="paudio" id="paudio${textparse.id}" mid='${item.id}'></audio>`;
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
                    }
                    let device = item.device
                    switch(device){
                      case 1:
                        item.deviceImg = this.deviceImg[item.device].img
                      case 2:
                        item.deviceImg = this.deviceImg[item.device].img
                      case 3:
                        item.deviceImg = this.deviceImg[item.device].img
                      break;
                    }
                    item.textparse=textparse;
                    item.html=html;
                })
                console.log(list)
                return list;
            }else{
                return []
            }
        },
        /* 刷新消息列表 */
        async refreshMsg(){
            this.refresh=true;
            this.dialog.pageNumber=1;
            let {pageNumber,pageSize,fidkey}=this.dialog;
            this.dialog.list=await this.getMsgList(pageNumber,pageSize,fidkey);
            setTimeout(()=>{
                this.refresh=false;
            },500);
            this.$nextTick(()=>{
                $("#dialoglist").unbind("scroll");
                $("#dialoglist").scrollTop($("#scrolllist").height());
                this.setScroll();
            })
        },
        /* 设置日历可选范围 */
        setMonthLimit(){
            this.pickerOptions={
                disabledDate(time) {
                    return time.getTime() > Date.now()||time.getTime()<new Date().getTime() - 90*24*3600*1000;
                },
            };
        },
        /* 查看图片 */
        viewImg(item){
            let textparse = JSON.parse(item.c);
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
        /* 显示聊天列表弹框 */
        async showMsgList(v){
            let fidkey=v.fidkey;
            let {nick,tonick,touid,msglist}=v;
            if(msglist.length==0){
                return;
            }
            this.dialog=Object.assign({},this.$options.data().dialog);
            this.dialog.visible=true;
            this.dialog.fidkey=fidkey;
            this.dialog.touid=touid;
            this.dialog.title=nick+'与'+tonick+'的会话';
            let {pageNumber,pageSize}=this.dialog;
            this.dialog.list=await this.getMsgList(pageNumber,pageSize,fidkey);
            this.$nextTick(()=>{
                $("#dialoglist").unbind("scroll");
                $("#dialoglist").scrollTop($("#scrolllist").height());
                this.setScroll();
            })
        },
        /* 监听聊天滚动 */
        setScroll(){
            let $dialoglist=$("#dialoglist");
            $dialoglist.on("scroll",async ()=>{
                if(this.dialog.load&&this.dialog.totalPage>this.dialog.pageNumber&& $dialoglist.scrollTop()==0){
                    this.dialog.load=false;
                    let {pageNumber,pageSize,groupid}=this.dialog;
                    this.dialog.pageNumber=pageNumber+1;
                    let list=await this.getMsgList(pageNumber+1,pageSize,groupid);
                    this.dialog.list=list.concat(this.dialog.list);
                    this.dialog.load=true;
                    this.$nextTick(()=>{
                        //重定位滚动位置
                        let topOffsetPx = $("#scrolllist .msg-col").eq(list.length).offset().top- $dialoglist.height();
                         $dialoglist.scrollTop(topOffsetPx);
                    })
                }
            })
        },
        /* 播放音频 */
        playAudio(item){
            let _this=this;
            let audio = document.getElementById("paudio"+item.textparse.id); 
            audio.currentTime=0;
            // audio.volume = 1;
            let allaudio=document.getElementsByClassName("paudio");
            $.each(allaudio,(i,v)=>{
                if(audio!=v){
                    let mid=v.getAttribute('mid');
                    _this.dialog.list.map(val=>{
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
                $("#paudio"+item.textparse.id).unbind('ended');
                $("#paudio"+item.textparse.id).on('ended',function(){
                    item.textparse.play=false;  
                    audio.pause();
                })
            }else{
                item.textparse.play=false;  
                audio.pause();
            }
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
        /* 查看视频 */
        seeVideo(item){
            window.open(resUrl(item.url));
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
@import "~@_/assets/style/less/im/privatechat.less";
</style>

