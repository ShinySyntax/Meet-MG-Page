<template>
    <el-row class="bodycontent">
        <!-- 头部 -->
        <Header></Header>
        <el-col :span="24" class="main">
            <!-- 左侧菜单列表 -->
            <el-col class="leftNav">
                <div class="left-top-expand">
                    <span @click="openOrclose('open')">全部展开</span>
                    <span @click="openOrclose('close')">全部收起</span>
                </div>
                <el-scrollbar class="scrollbar">
                    <div class="scrollheight">
                        <!-- 菜单列表 -->
                        <el-menu :default-openeds="openeds" router :default-active="activePath"  class="syselmenu"  @select="handleSelect">
                            <NavMenu :navMenus="routeList"></NavMenu>
                        </el-menu>
                    </div>
                </el-scrollbar>
            </el-col>
            <el-col class="content">
                <!-- 内容区 -->
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-col>
        <!-- 用户详情 -->
        <UserInfo></UserInfo>
        <!-- 会话信息 -->
        <UserChatInfo></UserChatInfo>
    </el-row>
</template>
<script>
import {mapState} from 'vuex';
import NavMenu from '@_/components/NavMenu';
import Header from '@_/components/Header';
import UserInfo from '@_/components/im/UserInfo';
import UserChatInfo from '@_/components/im/UserChatInfo';
export default{
    data(){
        return {
            openeds:[],//默认打开的 sub-menu 的 index 的数组
        }
    },
    components:{
        NavMenu,
        Header,
        UserInfo,
        UserChatInfo,
    },
    created(){
        this.setOpeneds();
    },
    mounted(){
        this.handleSelect();
    },
    methods:{
        /* 展开全部|收起全部 */
        openOrclose(type){
            let elsub=$(".el-submenu").length;
            let par, opend;
            for(let i=0;i<elsub;i++){
                par=$(".el-submenu").eq(i);
                if(type=="open"){
                    opend=!par.hasClass("is-opened");
                }else{
                    opend=par.hasClass("is-opened");
                }
                if(opend){
                    par.children(".el-submenu__title").click();
                }
            }
        },
        /* 设置默认展开菜单列表 */
        setOpeneds(){
            this.openeds=[];
            this.OpenedsEach(this.routeList);
        },
        OpenedsEach(data){
            $.each(data,(i,item)=>{
                if(item.virtualmenuflag!=1){
                    if(item.childs){
                        this.OpenedsEach(item.childs);
                        this.openeds.push(item.id+'');
                    }
                }
            })
        },
        /* 菜单激活回调 */
        handleSelect(){
            this.$nextTick(()=>{
                $(".menupar-active").removeClass("menupar-active");
                $(".el-submenu.is-active.is-opened>.el-submenu__title").eq(0).addClass("menupar-active");
            })
        },
    },
    computed:{
        activePath(){
            return this.$route.path.split("/")[1];
        },
        ...mapState({
            routeList:(state)=>state.myadmin.routes,
        }),
    }
}
</script>
<style lang="less">
@import "~@_/assets/style/less/systempub.less";
</style>

