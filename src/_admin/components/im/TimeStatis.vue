<template>
    <div class="maincontent" v-show="type==1">
       <div class="left-line"></div>
        <div class="type-item" v-for="v in data.list" :key="v.id">
            <div class="item-header">
                <span :class="['circle',v.listshow?'redcircle':'']" @click="upDown(v)"></span>
                <span class="info" @click="upDown(v)">
                    {{v.time}}
                    <img :class="['up',v.listshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                    当日<span class="num">{{v.usercount}}</span>人登录
                    <span class="totalcount">(共<span>{{v.totalcount}}</span>次记录)</span>
                </span>
            </div>
            <div class="userlist" v-show="v.listshow">
                <div class="clearfloat">
                    <div :class="['user-col',dialog.visible&&dialog.uid==item.uid&&dialog.dayperiod==item.dayperiod?'active':'']" v-for="item in v.userlist" :key="item.id">
                        <div class="left-avatar" @click="seeInfo(item)">
                            <el-image class="login-avatar" :src="item.avatar">
                                <div slot="error" class="image-slot">
                                    <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                </div>
                            </el-image>
                        </div>
                        <div class="col-center overell">
                            <p class="user-nick overell"  @click="seeInfo(item)">{{item.nick}}</p>
                            <p class="user-totalcount" @click="showTimeList(item)">{{item.totalcount}}次登录</p>
                        </div>
                        <div class="righticon" @click="showTimeList(item)">
                            <img src="~@_/assets/img/common/updown.png" class="updownicon downicon" v-show="!(dialog.visible&&dialog.uid==item.uid)"/>
                            <img src="~@_/assets/img/common/whiteup.png" class="updownicon upicon" v-show="dialog.visible&&dialog.uid==item.uid"/>
                        </div>
                    </div>
                    <div class="seemore" v-show="v.totalPage>v.pageNumber" @click="loadMoreUser(v)">查看更多</div>
                </div>
               <!--  <p v-show="v.totalPage>v.pageNumber" class="seemore" @click="loadMoreUser(v)">查看更多</p> -->
            </div>
        </div>
        <!-- 登录列表弹框 -->
        <TimeLogin :dialog="dialog" :loginList="loginList" :type="'day'"></TimeLogin>
    </div>
</template>
<script>
import {journal,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import TimeLogin from '@_/components/im/TimeLogin';
export default {
    props:['filters','type'],
    data(){
        return {
            data:{//数据列表
                pageNumber:1,
                pageSize:50,
                totalPage:0,//总条数
                list:[],//列表
                load:true
            },
            loginList:[],//时间维度-用户-登录列表
            dialog:{
                visible:false,
                list:[],
                uid:'',
                dayperiod:''
            },
        }
    },
    watch: {
        type(nv,ov){
            if(nv==1){
                this.data=Object.assign({},this.$options.data().data);
                this.getData();
            }
        }
    },
    mounted(){
        this.getData();
    },
    components:{
        TimeLogin
    },
    methods:{
        /* 收起|展开 */
        upDown(item){
            item.listshow=!item.listshow;
            if(item.listshow&&item.userlist.length==0){
                this.userStatlist(item);
            }
        },
        /* 时间维度列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            journal.timeList(ptdata).then(res=>{
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
                            //用户列表
                            item.userlist=[];//列表
                            item.listshow=false;//显示状态
                            item.pageNumber=1;
                            item.pageSize=35;
                            item.totalPage=1;
                            //时间维度-天-用户列表
                            if(i==0&&pageNumber==1){
                                this.userStatlist(item);
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
            this.userStatlist(item);
        },
        /* 时间维度-天-用户列表 */
        userStatlist(item){
            item.listshow=true;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageNumber==1?item.pageSize-1:item.pageSize,
                period:item.dayperiod
            };
            journal.timeUserList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(item.pageNumber==1){
                        item.userlist=[];
                    }
                    if(data){
                        item.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((v,i)=>{
                            v.avatar=resUrl(v.avatar);
                        })
                        item.userlist=item.userlist.concat(list);
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 显示时间列表弹框 */
        showTimeList(v){
            this.dialog.visible=true;
            this.dialog.uid=v.uid;
            this.dialog.dayperiod=v.dayperiod;
            this.setTimeList(v);
        },
        /* 填充时间列表 */
        setTimeList(v){
            let timeList=[];
            for(let i=0;i<25;i++){
                let obj={};
                obj.count=v['hour'+i]||0;
                obj.heightStyle='';//当前时间登录次数高度
                if(i!=0){
                    obj.time=i<10?'0'+i+':00':i+':00';
                }else{
                    obj.time='0';
                }
                timeList.push(obj);
            }
            //筛选最大值，设置柱状图高度
            var maxvlaue=Math.max.apply(Math, timeList.map(function(o) {return o.count}));
            var percHeight=parseFloat(240/maxvlaue).toFixed(2);
            timeList.map(tmitem=>{
                tmitem.heightStyle=tmitem.count*percHeight+'px';
            })
            this.dialog.list=timeList;
            this.getLoginList(v);
        },
        /*  时间维度-用户-日志列表*/
        getLoginList(v){
            let ptdata={
                uid:v.uid,
                period:v.dayperiod
            };
            journal.timeLoginList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    data.map(item=>{
                        let type='';
                        switch(item.devicetype){
                            case 1:
                                type="PC";
                            break;
                            case 2:
                                type="安卓";
                            break;
                            case 3:
                                type="IOS";
                            break;
                            case 4:
                                type="H5";
                            break;
                            case 5:
                                type="APP";
                            break;
                        }
                        item.devicetype=type;
                    })
                    this.loginList=data;
                }
            })
        },
        /* 监听滚动 */
        listenScroll(){
            let _this=this;
            $(window).unbind("scroll");
            $(window).scroll(function() {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                //总页数大于当前页码&&可加载&&滚动底部
                if(_this.data.totalPage>_this.data.pageNumber&&_this.data.load&&scrollTop+windowHeight==scrollHeight){
                    _this.data.pageNumber++;
                    _this.data.load=false;
                    _this.getData();
                }
            })
        },
        /* 查看用户详情 */
        seeInfo(item){
            this.$emit("seeInfo",item);
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/registerstatics.less";
@import "~@_/assets/style/less/im/loginstatics.less";
</style>