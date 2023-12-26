<template>
    <div>
        <!-- 登录列表弹框 -->
        <el-dialog :visible.sync="dialog.visible" width="1155px"  class="tmdialog" :before-close="closeDialog"> 
            <div class="timecontent">
                <div class="ytitle">次数</div>
                <div class="timelist">
                    <span class="time-col" v-for="v in dialog.list" :key="v.time">
                        <span class="count">
                            <span :style="{'height':v.heightStyle}" class="columnar"  @mouseover="timeLoginList($event,v)" @mouseleave="hideLoginList"></span>
                            <span v-if="v.count>0" class="curcount">{{v.count}}次</span>
                        </span>
                        <span class="time">{{v.time}}</span>
                    </span>
                    <span class="xtitle">时间</span>
                </div>
            </div>
        </el-dialog>
        <transition name="el-fade-in-linear">
            <div class="timeloginlist" :id="'timeloginlist'+type" v-show="timelogin.show" :style="{'top':timelogin.top,'left':timelogin.left}" @mouseenter="mouseEnterList" @mouseleave="hideLoginList">
                <ul>
                    <li class="login-col" v-for="v in timelogin.list" :key="v.id">
                        <span class="timeperiod">{{v.timeperiod}}</span>
                        <span class="ip">{{v.ip}}</span>
                        <span class="city">{{v.province?(v.province+v.city):'--'}}</span>
                        <span class="devicetype">{{v.devicetype}}</span>
                        <span>{{v.deviceinfo||'--'}}</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props:['dialog','loginList','type'],
    data(){
        return {
            timer:'',
            timelogin:{//日志列表
                show:false,
                top:0,
                left:0,
                list:[]
            },
        }
    },
    methods:{
        /* 关闭弹框 */
        closeDialog(){
            this.dialog.visible=false;
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
        /* 当前时间的日志列表 */
        timeLoginList(e,user){
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
            this.loginList.map(item=>{
                if(item.hourperiod==curtime){
                    loginTimeList.push(item);
                }
            })
            this.timelogin.show=true;
            this.timelogin.list=loginTimeList;
            this.$nextTick(()=>{
                //定位列表显示位置
                let lheight=$("#timeloginlist"+this.type).innerHeight();
                let lwidth=$("#timeloginlist"+this.type).innerWidth();
                if(lwidth+oleft>browserwidth){
                    if(oleft<lwidth/2){
                        this.timelogin.left=0+'px';
                    }else if(oleft+lwidth/2>browserwidth){
                        this.timelogin.left=browserwidth-lwidth+'px';
                    }else{
                        this.timelogin.left=oleft-lwidth/2+'px';
                    }
                }else{
                    this.timelogin.left=oleft-lwidth/2+'px';
                }
                this.timelogin.top=otop-lheight-scrolltop+'px';
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/loginstatics.less";
</style>