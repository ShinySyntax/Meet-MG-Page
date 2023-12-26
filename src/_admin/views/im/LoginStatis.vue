<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter"  v-show="type=='1'">
                <div class="filter-item">
                    <label class="filter-label">时间</label>
                    <el-date-picker v-model="filters[type].starttime" type="date" placeholder="开始时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                    <label class="filter-label fl-date-left">至</label>
                    <el-date-picker v-model="filters[type].endtime" type="date" placeholder="结束时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getSearch">查询</button>
                </div>
            </div>
            <div class="filter"  v-show="type=='2'">
                <div class="filter-item">
                    <label class="filter-label">IP</label>
                    <el-input type="text" clearable v-model="filters[type].searchip" placeholder="ip地址"></el-input>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getSearch">查询</button>
                </div>
            </div>
            <div class="top-right">
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="1" class="tm-radio-input"/>
                    <span class="tm-radio-label">按时间维度</span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="2" class="tm-radio-input"/>
                    <span class="tm-radio-label">按IP维度</span>
                </label>
            </div>
        </div>
        <TimeStatis :filters="filters['1']" :type="type" @seeInfo="seeInfo" ref="timestatis"></TimeStatis>
        <IpStatis :filters="filters['2']" :type="type" @seeInfo="seeInfo" ref="ipstatis"></IpStatis>
        <!-- 用户详情 -->
        <!-- <UserInfo></UserInfo>
        <UserChatInfo></UserChatInfo> -->
    </div>
</template>
<script>
import {journal,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import TimeStatis from '@_/components/im/TimeStatis';
import IpStatis from '@_/components/im/IpStatis';
import {mapMutations} from 'vuex';
export default {
    data(){
        return {
            filters:{
                '1':{
                    starttime:'',
                    endtime:'',
                },
                '2':{
                    searchip:''
                },
            },
            type:'1',
            curroute:'',//当前路由
        }
    },
    components:{
        TimeStatis,
        IpStatis,
    },
    watch: {
        '$route'(to,from){
            this.refreshScroll();
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
    },
    methods:{
        ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 查询 */
        getSearch(){
            if(this.type==1){
                this.$refs.timestatis.getData(1);
            }
            if(this.type==2){
                this.$refs.ipstatis.getData(1);
            }
        },
        /* 查看用户详情 */
        seeInfo(item){
            this.setUserInfoUid(item.uid);
            this.setUserInfoShow(true);
        },
        /* 重新绑定滚动 */
        refreshScroll(){
            if(this.type==1){
                this.$refs.timestatis.listenScroll();
            }
            if(this.type==2){
                this.$refs.ipstatis.listenScroll();
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/registerstatics.less";
</style>
