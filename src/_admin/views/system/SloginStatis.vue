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
            <div class="filter" v-show="type=='2'">
                <div class="filter-item">
                    <label class="filter-label">后台用户</label>
                    <el-input type="text" clearable v-model="filters[type].searchkey" placeholder="昵称/ID"></el-input>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getSearch">查询</button>
                </div>
            </div>
            <div>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="1" class="tm-radio-input"/>
                    <span class="tm-radio-label">按登录时间</span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="2" class="tm-radio-input"/>
                    <span class="tm-radio-label">按登录用户</span>
                </label>
            </div>
        </div>
        <TimeStatis :filters="filters['1']" :type="type" ref="timestatis"></TimeStatis>
        <UserStatis :filters="filters['2']" :type="type" ref="ipstatis"></UserStatis>
    </div>
</template>
<script>
import {journal,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import TimeStatis from '@_/components/system/TimeStatis';
import UserStatis from '@_/components/system/UserStatis';
export default {
    data(){
        return {
            filters:{
                '1':{
                    starttime:'',
                    endtime:'',
                },
                '2':{
                    searchkey:''
                },
            },
            type:'1',
            info:{
                visible:false,
                data:{}
            },
            curroute:'',//当前路由
        }
    },
    components:{
        TimeStatis,
        UserStatis,
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                this.refreshScroll();
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
        getSearch(){
            if(this.type==1){
                this.$refs.timestatis.getData(1);
            }
            if(this.type==2){
                this.$refs.ipstatis.getData(1);
            }
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
