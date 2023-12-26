
<template>
    <div class="maincontent"  v-show="type==1">
        <div class="left-line"></div>
        <div :class="['type-item',infoauth?'infoash':'']" v-for="v in data.list" :key="v.id">
            <div class="item-header">
                <span :class="['circle',v.listshow?'redcircle':'']" @click="upDown(v)"></span>
                <span class="info" @click="upDown(v)">
                    {{v.time}}
                    <img :class="['up',v.listshow?'down':'']" src="~@_/assets/img/common/updown.png"/>
                    当日新增<span class="num">{{v.regcount}}</span>人
                </span>
            </div>

            <div class="userlist" v-show="v.listshow">
                <div class="clearfloat">
                <div class="user-col" v-for="item in v.userlist" :key="item.id" @click="seeInfo(item)">
                    <div class="top">
                        <span class="top-left">
                            <el-image class="user-avatar" :src="item.avatar">
                            <div slot="error" class="image-slot">
                                <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                            </div>
                            </el-image>
                            <img src="~@_/assets/img/im/boy.png" class="sex-icon" v-show="item.sex==1"/>
                            <img src="~@_/assets/img/im/girl.png" class="sex-icon" v-show="item.sex==2"/>
                        </span>
                        <div class="top-right">
                            <p class="user-nick">{{item.nick}}</p>
                            <p class="user-loginname">{{item.loginname}}</p>
                        </div>
                    </div>
                    <div class="bot">
                        <span class="bot-uid">UID：{{item.id}}</span>
                        <span class="bot-uid">ID：{{item.tiono}}</span>
                        <span class="city" v-show="item.province||item.city">
                            <img src="~@_/assets/img/im/pos.png" class="pos"/>
                            {{item.province}} {{item.city}}
                        </span>
                    </div>
                </div>
                </div>
                <p v-show="v.totalPage>v.pageNumber" class="seemore" @click="loadMoreUser(v)">查看更多</p>
            </div>
        </div>
        <div class="loading" v-show="!data.load&&data.totalPage>data.pageNumber">加载中...</div>
    </div>
</template>
<script>
import {imuser,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    props:['filters','type','infoauth'],
    data(){
        return {
            main:'',
            data:{//数据列表
                pageNumber:1,
                pageSize:50,
                totalPage:0,//总条数
                list:[],//列表
                load:true
            },
        }
    },
    mounted() {
        this.getData();
    },
    watch: {
        type(nv,ov){
            if(nv==1){
                this.data=Object.assign({},this.$options.data().data);
                this.getData();
            }
        }
    },
    methods:{
        initData(){
            this.data=Object.assign({},this.$options.data().data);
            this.getData();
        },
        /* 注册统计列表 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            let {pageNumber,pageSize}=this.data;
            let type=this.type;
            let ptdata={...this.filters,pageNumber,pageSize,type};

            imuser.userRegisterStat(ptdata).then(res=>{
                console.log(res);
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
                            item.userlist=[];
                            item.listshow=false;
                            item.pageNumber=1;
                            item.pageSize=35;
                            item.totalPage=1;
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
        /* 统计下的用户列表 */
        userStatlist(item){
            item.listshow=true;
            let type=this.type;
            let ptdata={
                pageNumber:item.pageNumber,
                pageSize:item.pageSize,
                searchkey:item.statbizstr,
                type:1
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
        /* 收起|展开 */
        upDown(item){
            item.listshow=!item.listshow;
            if(item.listshow&&item.userlist.length==0){
                this.userStatlist(item);
            }
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
