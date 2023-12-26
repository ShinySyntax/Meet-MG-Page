<template>
    <div class="maincontent rgIpStat ipmaincontent" v-show="type==2">
        <div class="topsort">
            <span :class="order=='usercount'?'active':''"  @click="changeTopSort('usercount')">按IP登录数<img src="~@_/assets/img/im/bluesort.png" v-show="order=='usercount'" class="sorticon"/></span>
            <span :class="order=='updatetime'?'active':''" @click="changeTopSort('updatetime')">按IP登录时间<img src="~@_/assets/img/im/bluesort.png" v-show="order=='updatetime'" class="sorticon"/></span>
        </div>
        <div class="left-line"></div>
        <div class="type-item" v-for="v in data.list" :key="v.id">
            <div class="item-header">
                <span :class="['circle',v.dayshow?'redcircle':'']" @click="upDownDay(v)"></span>
                <span class="info" @click="upDownDay(v)">
                    <span class="ipwidth">{{v.ip}}</span>
                    <img :class="['up',v.dayshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                    当前IP登录<span class="num">{{v.usercount}}</span>人
                </span>
                <span class="header-sort" v-show="v.dayshow">
                    <span :class="v.order=='usercount'?'active':''" @click="changeDaySort(v,'usercount')">人数<img src="~@_/assets/img/im/wtsort.png" v-show="v.order=='usercount'" class="sorticon"/></span>
                    <span :class="v.order=='dayperiod'?'active':''" @click="changeDaySort(v,'dayperiod')">时间<img src="~@_/assets/img/im/wtsort.png" v-show="v.order=='dayperiod'" class="sorticon"/></span>
                </span>
            </div>
            <!-- 日列表 -->
            <div class="daylist" v-show="v.dayshow">
                <div class="day-col" v-for="item in v.daylist" :key="item.id">
                    <p class="day-head">
                        <span  @click="upDownUser(item)">
                            <span class="daytime">{{item.time}}</span>
                            <img :class="['up',item.usershow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                            当日<span class="daynum">{{item.usercount}}人</span>登录
                            <span class="daycount">(共<span>{{item.totalcount}}</span>次记录)</span>
                        </span>
                    </p>
                    <!-- 用户列表 -->
                    <div class="userlist clearfloat" v-show="item.usershow">
                        <div :class="['user-col',dialog.visible&&dialog.uid==user.uid&&dialog.dayperiod==item.dayperiod?'active':'']" v-for="user in item.userlist" :key="user.id">
                            <div class="left-avatar" @click="seeInfo(user)">
                                <el-image class="login-avatar" :src="user.avatar">
                                    <div slot="error" class="image-slot">
                                        <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                    </div>
                                </el-image>
                            </div>
                            <div class="col-center overell">
                                <p class="user-nick overell" @click="seeInfo(user)">{{user.nick}}</p>
                                <p class="user-totalcount" @click="showTimeList(user)">{{user.totalcount}}次登录</p>
                            </div>
                            <div class="righticon" @click="showTimeList(user)">
                                <img src="~@_/assets/img/common/updown.png" class="updownicon downicon" v-show="!(dialog.visible&&dialog.uid==user.uid)"/>
                                <img src="~@_/assets/img/common/whiteup.png" class="updownicon upicon" v-show="dialog.visible&&dialog.uid==user.uid"/>
                            </div>
                        </div>
                        <div class="user-seemore" v-show="item.totalPage>item.pageNumber" @click="loadMoreUser(item)">查看更多</div>
                    </div>
                </div>
             <p v-show="v.totalPage>v.pageNumber" class="seemore" @click="loadMoreDay(v)">查看更多</p>
            </div>
        </div>
        <!-- 登录列表弹框 -->
        <TimeLogin :dialog="dialog" :loginList="loginList"  :type="'ip'"></TimeLogin>
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
            order:'usercount',
        }
    },
    components:{
        TimeLogin
    },
    watch: {
        type(nv,ov){
            if(nv==2){
                this.data=Object.assign({},this.$options.data().data);
                this.getData();
            }
        }
    },
    methods:{
        /* IP数|时间排序 */
        changeTopSort(order){
            this.order=order;
            this.getData(1);
        },
        /* IP维度列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize,order:this.order};
            journal.ipList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(pageNumber==1){
                        this.data.list=[];
                    }
                    if(data){
                        this.data.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((item,i)=>{
                            //天列表
                            item.daylist=[];//列表
                            item.dayshow=false;//显示状态
                            item.pageNumber=1;
                            item.pageSize=35;
                            item.totalPage=1;
                            item.order="usercount";//排序
                            if(i==0&&pageNumber==1){
                                item.firstshow=true;
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
        /* ip-天列表 */
        getIpDaylist(item){
            item.dayshow=true;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageSize,
                order:item.order,
                ip:item.ip
            };
            journal.ipDayList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(item.pageNumber==1){
                        item.daylist=[];
                    }
                    if(data){
                        item.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((v,i)=>{
                            v.time=v.dayperiod?v.dayperiod.substring(0,4)+'-'+v.dayperiod.substring(4,6)+'-'+v.dayperiod.substring(6,8):'--';
                            //用户列表
                            v.userlist=[];
                            v.pageNumber=1;
                            v.pageSize=35;
                            v.totalPage=1;
                            v.usershow=false;
                            if(item.firstshow&&i==0){
                                this.firstshow=false;
                                this.getIpUserList(v);
                            }
                        })
                        item.daylist=item.daylist.concat(list);
                       
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 用户收起|展开 */
        upDownUser(item){
            item.usershow=!item.usershow;
            if(item.usershow&&item.userlist.length==0){
                this.getIpUserList(item);
            }
        },
        /* 查看更多-用户列表 */
        loadMoreUser(item){
            item.pageNumber++;
            this.getIpUserList(item);
        },
        /* IP维度-天-用户列表 */
        getIpUserList(item){
            item.usershow=true;
            let type=this.type;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageNumber==1?item.pageSize-1:item.pageSize,
                period:item.dayperiod,
                ip:item.ip
            };
            journal.ipUserList(ptdata).then(res=>{
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
        /* 显示时间 */
        showTimeList(v){
            this.dialog.visible=true;
            this.dialog.uid=v.uid;
            this.dialog.dayperiod=v.dayperiod;
            this.setTimeList(v);
        },
        /* 填充时间列表 */
        setTimeList(v){
            // item.userinfo=v;
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
            var maxvlaue=Math.max.apply(Math, timeList.map(function(o) {return o.count}));
            var percHeight=parseFloat(240/maxvlaue).toFixed(2);
            // this.timeLoginList(v);
            timeList.map(tmitem=>{
                tmitem.heightStyle=tmitem.count*percHeight+'px';
            })
            // item.timeList=timeList;
            this.dialog.list=timeList;
            this.ipLoginList(v);
        },
        /*  Ip维度-用户-日志列表*/
        ipLoginList(v){
            let ptdata={
                uid:v.uid,
                period:v.dayperiod,
                ip:v.ip
            };
            journal.ipLoginList(ptdata).then(res=>{
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