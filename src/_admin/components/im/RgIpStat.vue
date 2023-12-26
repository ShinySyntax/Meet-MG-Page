
<template>
    <div class="maincontent rgIpStat" v-show="type==2">
        <div class="topsort">
            <span :class="order=='regcount'?'active':''"  @click="changeTopSort('regcount')">按IP注册数<img src="~@_/assets/img/im/bluesort.png" v-show="order=='regcount'" class="sorticon"/></span>
            <span :class="order=='updatetime'?'active':''" @click="changeTopSort('updatetime')">按IP注册时间<img src="~@_/assets/img/im/bluesort.png" v-show="order=='updatetime'" class="sorticon"/></span>
        </div>
        <div class="left-line"></div>
        <div :class="['type-item',infoauth?'infoash':'']" v-for="v in data.list" :key="v.id">
            <div class="item-header">
                <span @click="upDownDay(v)" class="flexbox">
                    <span :class="['circle',v.dayshow?'redcircle':'']"></span>
                    <span class="info" >
                        <span class="ipwidth">{{v.statbizstr}}</span>
                        <img :class="['up',v.dayshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                        <span :class="[v.statbizstr=='00000000'?'noip':'']">{{v.statbizstr=='00000000'?'无IP注册':'当前IP注册'}}</span>
                        <span class="num">{{v.regcount}}</span>人
                    </span>
                </span>
                
                <span class="header-sort" v-show="v.dayshow">
                    <span :class="v.order=='regcount'?'active':''" @click="changeDaySort(v,'regcount')">人数<img src="~@_/assets/img/im/wtsort.png" v-show="v.order=='regcount'" class="sorticon"/></span>
                    <span :class="v.order=='statbizstr'?'active':''" @click="changeDaySort(v,'statbizstr')">时间<img src="~@_/assets/img/im/wtsort.png" v-show="v.order=='statbizstr'" class="sorticon"/></span>
                </span>
            </div>
            <!-- 日列表 -->
            <div class="daylist" v-show="v.dayshow">
                <div class="day-col" v-for="item in v.daylist" :key="item.id">
                    <p class="day-head">
                        <span  @click="upDownUser(item)">
                            <span class="daytime">{{item.time}}</span>
                            <img :class="['up',item.usershow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                            当日<span class="daynum">{{item.regcount}}人</span>注册
                        </span>
                    </p>
                    <!-- 用户列表 -->
                    <div class="userlist" v-show="item.usershow">
                        <div class="clearfloat">
                            <div class="user-col" v-for="v in item.userlist" :key="v.id" @click="seeInfo(v)">
                                <div class="top">
                                    <span class="top-left">
                                        <el-image class="user-avatar" :src="v.avatar">
                                        <div slot="error" class="image-slot">
                                            <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                        </div>
                                        </el-image>
                                        <img src="~@_/assets/img/im/boy.png" class="sex-icon" v-show="v.sex==1"/>
                                        <img src="~@_/assets/img/im/girl.png" class="sex-icon" v-show="v.sex==2"/>
                                    </span>
                                    <div class="top-right">
                                        <p class="user-nick">{{v.nick}}</p>
                                        <p class="user-loginname">{{v.loginname}}</p>
                                    </div>
                                </div>
                                <div class="bot">
                                    <span class="bot-uid">UID：{{v.id}}</span>
                                    <span class="city">
                                        <img src="~@_/assets/img/im/pos.png" class="pos"/>
                                        {{v.province}} {{v.city}}
                                    </span>
                                </div>
                            </div>
                             <div class="user-seemore" v-show="item.totalPage>item.pageNumber" @click="loadMoreUser(item)">查看更多</div>
                        </div>
                    </div>
                </div>
             <p v-show="v.totalPage>v.pageNumber" class="seemore" @click="loadMoreDay(v)">查看更多</p>
            </div>
        </div>
        <div class="loading" v-show="!data.load&&data.totalPage>data.pageNumber">加载中...</div>
    </div>
</template>
<script>
import {imuser,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    props:['filters','type','jtype','infoauth'],
    data(){
        return {
            data:{//数据列表
                pageNumber:1,
                pageSize:50,
                totalPage:0,//总条数
                list:[],//列表
                load:true
            },
            order:'regcount',
        }
    },
    watch: {
        type(nv,ov){
            if(nv==2){
                this.data=Object.assign({},this.$options.data().data);
                this.getData();
            }
        },
        filters:{
            handler(nv,ol){
            },
            deep:true
        }
    },
    methods:{
        /* 初始化数据获取列表 */
        initData(){
            this.data=Object.assign({},this.$options.data().data);
            this.getData();
        },
        /* IP数|时间排序 */
        changeTopSort(order){
            this.order=order;
            this.getData(1);
        },
        /* 注册统计列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            // let type=this.type;
            let type=2;
            let {province,city,searchip}=this.filters;
            let ptdata={pageNumber,pageSize,type};
            if(this.jtype==1){
                ptdata.searchip=searchip;
            }else{
                ptdata.province=province;
                ptdata.city=city;
            }
            imuser.userRegisterStat(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(pageNumber==1){
                        this.data.list=[];
                    }
                    if(data){
                        this.data.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((item,i)=>{
                            if(type==1){
                                item.time=item.statbizstr?item.statbizstr.substring(0,4)+'-'+item.statbizstr.substring(4,6)+'-'+item.statbizstr.substring(6,8):'--';
                            }
                            item.daylist=[];
                            item.dayshow=false;
                            item.pageNumber=1;
                            item.pageSize=35;
                            item.totalPage=1;
                            item.order="regcount";//排序
                            if(i==0&&pageNumber==1){
                                item.firstshow=true;
                                // this.userStatlist(item);
                                this.getIpDaylist(item);
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
        /* 视图统计-IP-周期 */
        getIpDaylist(item){
            item.dayshow=true;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageSize,
                order:item.order,
                ipid:item.statbizid
            };
            imuser.userIpTimeRegisterStat(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(item.pageNumber==1){
                        item.daylist=[];
                    }
                    if(data){
                        item.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((v,i)=>{
                            v.time=v.statbizstr?v.statbizstr.substring(0,4)+'-'+v.statbizstr.substring(4,6)+'-'+v.statbizstr.substring(6,8):'--';
                            //用户列表
                            v.userlist=[];
                            v.pageNumber=1;
                            v.pageSize=35;
                            v.totalPage=1;
                            v.usershow=false;
                            if(item.firstshow&&i==0){
                                this.userStatlist(v);
                            }
                        })
                        item.daylist=item.daylist.concat(list);
                    }
                }else{
                    msgTips(res);
                }
            })
        },
         /* 查看更多-天列表 */
        loadMoreDay(item){
            item.pageNumber++;
            this.getIpDaylist(item);
        },
        /* 天收起|展开 */
        upDownDay(item){
            item.dayshow=!item.dayshow;
            if(item.dayshow&&item.daylist.length==0){
                this.getIpDaylist(item);
            }
        },
        /* IP维度-天-排序 */
        changeDaySort(v,order){
            v.order=order;
            v.pageNumber=1;
            this.getIpDaylist(v);
        },
        /* 用户展开|收起 */
        upDownUser(item){
            item.usershow=!item.usershow;
            if(item.usershow&&item.userlist.length==0){
                this.userStatlist(item);
            }
        },
        /* 统计下的用户列表 */
        userStatlist(item){
            item.usershow=true;
            let type=this.type;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageNumber==1?item.pageSize-1:item.pageSize,
                ipid:item.statbizid,
                searchkey:item.statbizstr
            };
            imuser.statList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(item.pageNumber==1){
                        item.userlist=[];
                    }
                    if(data){
                        item.totalPage=data.totalPage;
                        let list=data.list;
                        list.map(v=>{
                            v.avatar=resUrl(v.avatar);
                        })
                        item.userlist=item.userlist.concat(list);
                    }
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
        /* 查看用户详情 */
        seeInfo(item){
            this.$emit("seeInfo",item);
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
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/registerstatics.less";
</style>
