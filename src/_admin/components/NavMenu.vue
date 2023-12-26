<template>
    <div class="navMenu">
        <template v-for="(item) in navMenus" >
            <el-menu-item :index="item.path+''" v-if="item.virtualmenuflag!=1&&item.type==2" :key="item.id"> 
                <div class="addpad">
                    <span :class="[item.type==1?'menuicon':'pageicon']"></span>
                    {{item.name}}
                </div>
            </el-menu-item>
            <el-submenu :index="item.id+''" v-if="item.virtualmenuflag!=1&&item.type==1" :key="item.id">
                <template slot="title">
                    <div class="addpad">
                        <span :class="[item.type==1?'menuicon':'pageicon']"></span>
                        {{item.name}}
                        <i class="el-icon-arrow-right arrow"></i>
                    </div>
                </template>
                <NavMenu :navMenus="item.childs" v-if="item.childs"></NavMenu>
            </el-submenu> 
            <!-- 一级页面 -->
            <el-menu-item v-if="item.virtualmenuflag==1" :index="item.childs[0].path" :key="item.childs[0].id">
                <div class="addpad">
                    <span :class="[item.type==1?'menuicon':'pageicon']"></span>
                    {{item.childs[0].name}}
                </div>
            </el-menu-item>                           
        </template>
    </div>
</template>
<script>
export default {
    name: 'NavMenu',
    props:['navMenus'],
   /*  computed:{
        paddingStyle() {
            let padding = 12;
            let parent = this.$parent;
            return {marginLeft: padding + 'px'};
        }
    } */
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/navmenu.less";
</style>
