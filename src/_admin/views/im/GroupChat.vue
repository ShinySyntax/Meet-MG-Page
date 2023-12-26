<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter" v-for="(v,k) in filters" :key="k" v-show="k==type">
                <div class="filter-item">
                    <label class="filter-label">时间</label>
                    <el-date-picker v-model="v.starttime" type="date" placeholder="开始时间" :picker-options="k==1?pickerOptions:(k==2?pickerOptions2:{})" value-format="yyyyMMdd">
                    </el-date-picker>
                    <label class="filter-label fl-date-left">至</label>
                    <el-date-picker v-model="v.endtime" type="date" placeholder="结束时间" :picker-options="k==1?pickerOptions:(k==2?pickerOptions2:{})"  value-format="yyyyMMdd">
                    </el-date-picker>
                </div>
                <div class="filter-item">
                    <label class="filter-label">群聊</label>
                    <el-input type="text" clearable v-model="v.groupkey" placeholder="群聊名称/群ID"></el-input>
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
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="3" class="tm-radio-input" @change="getData()"/>
                    <span class="tm-radio-label">无效群记录</span>
                </label>
            </div>
        </div>
        <div class="grouplist">
            <div class="groupitem" v-for="v in data.list" :key="v.id">
                <div class="item-top">
                    <el-image  class="group-avatar" :src="v.avatar">
                        <div slot="error" class="image-slot" >
                            <img src="~@_/assets/img/im/avatar.jpg"  class="error-img"/>
                        </div>
                    </el-image>
                    <div class="groupinfo">
                        <p class="info-top">
                            <span class="group-name overell">{{v.name}}</span>
                            <span class="group-id">ID:{{v.id}}</span>
                        </p>
                        <p class="info-bottom">
                            <span class="info-col">
                                <img src="~@_/assets/img/im/gowner.png"/>
                                <span class="usernick">{{v.usernick}}</span>
                            </span>
                            <span class="info-col">
                                <img src="~@_/assets/img/im/friends.png"/>
                                {{v.joinnum}}
                            </span>
                        </p>
                    </div>
                    <div :class="['groupsee',v.msglist.length==0?'nogroupsee':'']" @click="showMsgList(v)">
                        <img src="~@_/assets/img/im/monitor.png" v-show="v.msglist.length>0"/>
                        <img src="~@_/assets/img/im/monitorc.png" v-show="v.msglist.length==0"/>
                        查看会话
                    </div>
                </div>
                <div class="item-bottom" :id="'item-bottom'+v.id">
                    <div class="itemscroll" :id="'itemscroll'+v.id">
                        <div class="msg-col" v-for="item in v.msglist" :key="item.id">
                            <el-image  class="msg-avatar" :src="item.avatar"  @click="seeInfo(item.uid)">
                                <div slot="error" class="image-slot"  @click="seeInfo(item.uid)">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                            </el-image>
                            <div class="msg-right overell">
                                <p class="msg-top">
                                    <span class="msg-nick">{{item.nick}}</span>
                                    <span class="msg-time">{{item.createtime}}</span>
                                </p>
                                <div class="msg-content">
                                    <!--  1、普通文本消息，2、超链接卡片消息，3、文件，4、音频，5、视频 ,6.图片 ,9.名片 ,10.视频通话, 11.音频通话-->
                                    <div v-if="item.contenttype==1"  v-html="item.html" class="overell">
                                    </div>
                                    <div v-else-if="item.contenttype==3" class="filebg overell">
                                        {{item.textparse.filename}}
                                    </div>
                                    <!-- 音频 -->
                                    <div v-else-if="item.contenttype==4" class="imgcol">
                                        语音消息
                                    </div>
                                    <!-- 视频 -->
                                    <div v-else-if="item.contenttype==5" class="imgcol">
                                        视频消息
                                    </div>
                                    <!-- 图片 -->
                                    <div v-else-if="item.contenttype==6"  class="imgcol" >
                                        图片消息
                                    </div>
                                    <!-- 名片 -->
                                    <div v-else-if="item.contenttype==9" class="cardbg">
                                        {{item.html}}
                                    </div>
                                    <!-- 音视频通话 -->
                                    <div v-else-if="item.contenttype==10||item.contenttype==11">
                                        {{item.html}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="group-nodata" v-if="v.msglist.length==0&&v.datatype==2">
                            <img src="~@_/assets/img/im/nodata.png"/>
                            <p>暂无群聊信息</p>
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
        <GroupChatMsg :dialog="dialog" :from="'groupchat'" ref="chatmsg" :type="type" :show="dialog.visible" @closeMsg="closeMsg"></GroupChatMsg>
    </div>
</template>
<script>
import {imchat,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import GroupChatMsg from '@_/components/im/GroupChatMsg';
import {mapMutations} from 'vuex';
export default {
    data(){
        return {
            filters:{
                '1':{
                    starttime:'',
                    endtime:'',
                    groupkey:'',
                },
                '2':{
                    starttime:'',
                    endtime:'',
                    groupkey:'',
                },
                '3':{
                    starttime:'',
                    endtime:'',
                    groupkey:'',
                }
            },
            data:{//数据列表
                pageNumber:1,
                pageSize:12,
                totalRow:0,//总条数
                list:[],//列表
                pagesizes:[12,24,36,48]
            },
            pickerOptions: {},
            pickerOptions2:{},
            curroute:'',//当前路由
            type:"1",
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
    components:{
        GroupChatMsg
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
            imchat.modeGroupList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(async item=>{
                            item.avatar=resUrl(item.avatar);
                            item.msglist=[];
                            item.datatype=1;
                            let msg=await this.$refs.chatmsg.getMsgList(1,50,item.id,this.type);
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
        /* 设置日历可选范围 */
        setMonthLimit(){
            this.pickerOptions={
                disabledDate(time) {
                    return time.getTime() > Date.now()||time.getTime()<new Date().getTime() - 90*24*3600*1000;
                },
            };
            this.pickerOptions2={
                disabledDate(time) {
                    return time.getTime()>new Date().getTime() - 90*24*3600*1000;
                },
            };
        },
        /* 显示聊天列表弹框 */
        async showMsgList(v){
            let gid=v.id;
            let {name,joinnum,msglist}=v;
            if(msglist.length==0){
                return;
            }
            this.dialog.visible=true;
            this.dialog.groupid=gid;
            this.dialog.title=name+'('+joinnum+')';
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
        /* 查看用户详情 */
        seeInfo(uid){
            this.setUserInfoUid(uid);
            this.setUserInfoShow(true);
        },
        /* 关闭弹框 */
        closeMsg(value){
            this.dialog.visible=value;
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/groupchat.less";
</style>

