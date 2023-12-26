<template>
    <div class="maincontent usermaincontent" v-show="type==2">
        <div class="left-line"></div>
        <!-- 用户列表 -->
        <div class="type-item" v-for="(v,i) in data.list" :key="v.id">
            <div class="item-header">
                <span :class="['circle',v.dayshow?'redcircle':'']" @click="upDown(v)"></span>
                <span class="info" @click="upDown(v)">
                    <span class="nickrole">
                        {{v.nick}}
                        <span class="user-role">{{v.rolename}}</span>
                    </span>
                    <img :class="['up',v.dayshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                    <span class="totalcount">共<span>{{v.totalcount}}</span>次记录</span>
                </span>
            </div>
            <div class="daylist clearfloat" v-show="v.dayshow">
                <div class="dayleft" @click="scrollLeft(i)">
                    <img src="~@_/assets/img/common/scroll.png"/>
                </div>
                <!-- 用户-天列表 -->
                <div class="daywrapper">
                    <div class="clearfloat scroll-content" :style="{'width':v.daylist.length>0?v.daylist.length*126+'px':'3000px'}">
                        <div :class="['day-col',v.loginid==item.id?'active':'']" v-for="item in v.daylist" :key="item.id" @click="seeUserLoginList(v,item)"> 
                            <p class="daytime">{{item.time}}</p>
                            <p class="logintime">{{item.totalcount}}次登录</p>
                        </div>
                    </div>
                </div>
                <div class="dayright" @click="scrollRight(i,v)">
                    <img src="~@_/assets/img/common/scroll.png"/>
                </div>
            </div>
            <!-- 时间列表 -->
            <div class="timecontent usertimecontent" v-show="v.timeshow&&v.dayshow">
                <div class="ytitle">次数</div>
                <div class="timelist">
                    <span class="time-col" v-for="item in v.timelist" :key="item.time">
                        <span class="count">
                            <span :style="{'height':item.heightStyle}" class="columnar"  @mouseover="timeLoginList($event,item,v)" @mouseleave="hideLoginList"></span>
                            <span v-if="item.count>0" class="curcount">{{item.count}}次</span>
                        </span>
                        <span class="time">{{item.time}}</span>
                    </span>
                    <span class="xtitle">时间</span>
                </div>
            </div>
        </div>
        <!-- 日志列表 -->
        <transition name="el-fade-in-linear">
            <div class="timeloginlist" id="userloginlist" v-show="timelogin.show" :style="{'top':timelogin.top,'left':timelogin.left}" @mouseenter="mouseEnterList" @mouseleave="hideLoginList">
                <ul>
                    <li class="login-col" v-for="v in timelogin.list" :key="v.id">
                        <span class="timeperiod">{{v.timeperiod}}</span>
                        <span class="ip">{{v.ip}}</span>
                        <span class="city">{{v.province||v.city?(v.province+v.city):'--'}}</span>
                        <span class="devicetype">{{v.devicetype}}</span>
                        <span>{{v.deviceinfo||'--'}}</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
import {logsts,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
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
            scroll:300,
            timelogin:{//日志列表
                show:false,
                top:0,
                left:0,
                list:[]
            },
            firstshow:false,
            loginList:[],//用户-登录列表
        }
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
        /* 用户统计列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize,order:this.order};
            logsts.userList(ptdata).then(res=>{
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
                                this.firstshow=true;
                                this.userDayList(item);
                            }
                            //时间列表
                            item.timeshow=false;
                            item.timelist=[];
                            item.xlist=[];
                            //日志列表
                            item.loginlist=[];
                            item.loginid='';
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
        /* 收起|展开 */
        upDown(item){
            item.dayshow=!item.dayshow;
            if(item.dayshow&&item.pageNumber==1){
                this.userDayList(item);
            }
        },
        /* 用户日期统计 */
        userDayList(user){
            user.dayshow=true;
            let ptdata={
                pageNumber:user.pageNumber,
                pageSize:user.pageSize,
                mguid:user.mguid
            };
            logsts.userDayList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(user.pageNumber==1){
                        user.daylist=[];
                    }
                    if(data){
                        user.totalPage=data.totalPage;
                        let list=data.list;
                        list.map((item,i)=>{
                            item.time=item.dayperiod?item.dayperiod.substring(0,4)+'-'+item.dayperiod.substring(4,6)+'-'+item.dayperiod.substring(6,8):'--';
                            //第一页数据默认展开第一条日志统计
                            if(this.firstshow){
                                this.firstshow=false;
                                user.timeshow=true;
                                user.loginid=item.id;
                                this.setTimeList(user,item);
                            }
                        })
                        user.daylist=user.daylist.concat(list);

                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 向左滚动 */
        scrollLeft(i){
            let $scrolldom=$(".scroll-content").eq(i);
            let left=parseInt($scrolldom.css("margin-left"));
            if(left==0){
                return;
            }
            if(left+300<0){
                left=left+300;
            }else{
                left=0;
            }
            $scrolldom.css({'margin-left':left+'px'});
        },
        /* 向右滚动 */
        scrollRight(i,item){
            let $scrolldom=$(".scroll-content").eq(i);
            let left=parseInt($scrolldom.css("margin-left"));
            let width=$scrolldom.width();
            let cwidth=$(".daywrapper").width();

            if(left==cwidth-width||cwidth>width){
                return;
            }
            if(left-300-cwidth<-width){
                left=cwidth-width;
                if(item.pageNumber<item.totalPage){
                    item.pageNumber++;
                    this.userDayList(item);
                }
            }else{
                left=left-300;
            }
            $scrolldom.css({'margin-left':left+'px'});
        },
        /* 
        * 显示|隐藏时间列表
        * @param {*} user 用户
        * @param {*} day  天
        */
        seeUserLoginList(user,day){
            if(user.loginid==day.id){
                user.timeshow=!user.timeshow;
                user.loginid='';
            }else{
                user.loginid=day.id;
                user.timeshow=true;
            }
            if(user.timeshow){
                this.setTimeList(user,day);
            }
        },
        /* 
        * 填充时间列表
        * @param {*} v 用户
        * @param {*} item 天
        */
        setTimeList(v,item){
            let timeList=[];
            for(let i=0;i<25;i++){
                let obj={};
                obj.count=item['hour'+i]||0;
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
            v.timelist=timeList;
            this.getLoginList(v,item);
        },
        /* 
        * 日志列表
        * @param {*} v 用户
        * @param {*} item 天
        */
        getLoginList(v,item){
            let ptdata={
                mguid:item.mguid,
                period:item.dayperiod
            };
            logsts.loginInfoList(ptdata).then(res=>{
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
                    v.loginlist=data;
                }
            })
        },
        /* 当前时间的日志列表 
        * @param {*} user 用户
        * @param {*} day  天
        */
        timeLoginList(e,user,day){
            clearTimeout(this.timer);
            let $current=$(e.currentTarget);
            let offset=$current.offset(),
                curheight=$current.height(),//当前元素高度
                oleft=offset.left,//偏移量-左侧
                otop=offset.top+curheight/3,
                curtime=parseInt(user.time),//当前元素的时间
                browserwidth=$(window).width(),//浏览器宽度
                scrolltop=$(document).scrollTop();//滚动距离
            let loginTimeList=[];
            day.loginlist.map(item=>{
                if(item.hourperiod==curtime){
                    loginTimeList.push(item);
                }
            })
            this.timelogin.show=true;
            this.timelogin.list=loginTimeList;
            this.$nextTick(()=>{
                //定位列表显示位置
                let lheight=$("#userloginlist").innerHeight();
                let lwidth=$("#userloginlist").innerWidth();
                if(lwidth/2+oleft>browserwidth){
                    if(oleft<lwidth/2){
                        this.timelogin.left=0+'px';
                    }else{
                        this.timelogin.left=oleft-lwidth/2+'px';
                    }
                }else{
                    this.timelogin.left=oleft-lwidth/2+'px';
                }
                this.timelogin.top=otop-lheight-scrolltop+'px';
            })
        },
        /* 隐藏登录列表 */
        hideLoginList(){
            this.timer=setTimeout(()=>{
                this.timelogin.show=false;
            },300)
        },
        /* 鼠标进入登录信息 */
        mouseEnterList(){
            clearTimeout(this.timer);
            this.timelogin.show=true;
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
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/registerstatics.less";
@import "~@_/assets/style/less/im/loginstatics.less";
@import "~@_/assets/style/less/system/sloginstatis.less";
</style>