<template>
    <div class="commonright container">
        <div class="topcontainer">
            <div class="filter"  v-show="type=='1'">
                <div class="filter-item">
                    <label class="filter-label">时间</label>
                    <el-date-picker v-model="filters[type].start" type="date" placeholder="开始时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                    <label class="filter-label fl-date-left">至</label>
                    <el-date-picker v-model="filters[type].end" type="date" placeholder="结束时间"  value-format="yyyyMMdd">
                    </el-date-picker>
                </div>

                <div class="filter-btn">
                    <button class="primarybtn search" @click="getSearch()">查询</button>
                    共注册{{main.data[0]['count(*)']}}用户
                </div>
            </div>
            <div class="filter"  v-show="type=='2'">
                <div class="filter-item">
                    <label class="filter-label">IP</label>
                    <el-input type="text" clearable v-model="filters[type].searchip" placeholder="ip地址"></el-input>
                </div>
                <div class="filter-item">
                    <label class="filter-label">地区</label>
                    <el-select v-model="filters[type].province" clearable @change="changeProvince" placeholder="全部">
                        <el-option v-for="item in provinceList" :key="item" :value="item" :label="item" ></el-option>
                    </el-select>
                    <el-select v-model="filters[type].city" clearable style="margin-left:15px;" placeholder="全部">
                        <el-option v-for="item in cityList" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                </div>
                <div class="filter-item">
                    <label class="tm-radio">
                        <input type="radio" v-model="jtype" value="1" class="tm-radio-input"/>
                        <span class="tm-radio-label">查IP</span>
                    </label>
                    <label class="tm-radio">
                        <input type="radio" v-model="jtype" value="2" class="tm-radio-input"/>
                        <span class="tm-radio-label">查地区</span>
                    </label>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getSearch()">查询</button>
                    共注册{{main.data[0]['count(*)']}}用户
                </div>
            </div>
            <div class="top-right">
                <label class="tm-switch">
                    <span class="tm-switch-label">信息加灰</span>
                    <el-switch v-model="infoauth"></el-switch>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="1" class="tm-radio-input" @change="getSearch"/>
                    <span class="tm-radio-label">按注册时间</span>
                </label>
                <label class="tm-radio">
                    <input type="radio" v-model="type" value="2" class="tm-radio-input"  @change="getSearch"/>
                    <span class="tm-radio-label">按注册IP</span>
                </label>
            </div>
        </div>
        <!-- 按时间 -->
        <RgTimeStat :filters="filters['1']" :type="type" :infoauth="infoauth" @seeInfo="seeInfo" ref="timestatis"></RgTimeStat>
        <!-- 按IP -->
        <RgIpStat :filters="filters['2']" :type="type" :jtype="jtype" :infoauth="infoauth" @seeInfo="seeInfo" ref="ipstatis"></RgIpStat>
        
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {imuser,stat,msgTips,successTips} from '@_/axios/path';
import {resUrl,messageEmoji} from '@_/utils/common.js';
import RgIpStat from '@_/components/im/RgIpStat';
import RgTimeStat from '@_/components/im/RgTimeStat';

export default {
    data(){
        return {
            main:'',
            filters:{
                '1':{
                    start:'',
                    end:'',
                },
                '2':{
                    province:'',
                    city:'',
                    searchip:''
                },
            },
            areaList:[],
            provinceList:[],//省列表
            cityList:[],//城市列表
            type:'1',
            jtype:"1",
            curroute:'',//当前路由
            infoauth:false,//信息加灰状态
        }
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                this.refreshScroll();
                let query=to.query;
                if(query.type){
                    Object.assign(this.$data, this.$options.data());
                    this.setQuery(query);
                    this.areadict();
                    this.getSearch();
                    this.curroute=this.$route.path;
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.areadict();
                this.getSearch();
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.areadict();
        let query=this.$route.query;
        if(query.type){
            this.setQuery(query);
        }
        this.getSearch();
    },
    components:{
        RgIpStat,
        RgTimeStat
    },
    methods:{
         ...mapMutations(['setUserInfoUid','setUserInfoShow']),
        /* 路由传参 */
        setQuery(query){
            let keyarr=Object.keys(query);
            let type=query.type;
            this.type=type;
            this.jtype=query.jtype||'1';
            keyarr.map(item=>{
                if(item!='type'){
                    this.filters[type][item]=query[item];
                }
            })
        },
        /* 查询 */
        getSearch(){
            this.$nextTick(()=>{
                if(this.type==1){
                    this.$refs.timestatis.initData();
                }
                if(this.type==2){
                    this.$refs.ipstatis.initData();
                }
            });
            imuser.userRegisterMain().then(res=> {
                this.main=res;
            })
        },
        /* 查看用户详情 */
        seeInfo(item){
            this.setUserInfoUid(item.id);
            this.setUserInfoShow(true);
        },
        /* 区域字典列表 */
        areadict(){
            stat.areadict().then(res=>{
                if(res.ok){
                    let data=res.data;
                    // this.filters['2'].province=[];
                    let province=[];
                    data.map(item=>{
                        province.push(item.province);
                    })
                    this.areaList=data;
                    this.provinceList=province;
                }
            })
        },
        /* 省改变 */
        changeProvince(province){
            this.filters[2].city='';
            let obj=this.areaList.find(item=>item.province==province);
            if(obj&&obj.citys){
                this.cityList=obj.citys.split(',');
            }else{
                this.cityList=[];
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

