<template>
    <div class="menusitem" dragset="57">
        <template v-for="(item) in menusItem" >
            <!-- 页面 -->
            <div class="menu-col" :aid="item.id" :key="item.id"  v-if="item.type==2" :dragset="paddingStyle">
                <div class="men-col-name" :style="{'paddingLeft':paddingStyle+'px'}">
                    <i class="my-handler"  @mouseover="showTips" @mouseleave="hideTips" v-auth="'index'"></i>
                   <!--  <img src="~@_/assets/img/system/pgdf.png" class="itemicon"/> -->
                   <i class="pageicon itemicon"></i>
                    <span class="pagename" @click="toPreview(item)">{{item.name}}</span>
                </div>
                <div class="men-col-url">{{item.authurl||'/'}}</div>
                <div class="men-col-route">{{item.routekey}}</div>
                <div class="men-col-type">页面</div>
                <div class="men-col-status">
                    <span :class="[item.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{item.status==1?'有效':'无效'}} </span>
                </div>
                <div class="men-col-see" v-auth="'osee'">
                    <span  @click="seeOper(item)" class="tmopera">查看 </span>
                </div>
                <div class="men-col-oper"  v-auth="{'list':['update','disable','del']}">
                    <span class="tmopera" @click="editItem(item)" v-auth="'update'">修改</span>
                    <span :class="['tmopera',item.status==1?'stateDisabled':'statesuccess']" @click="setAuthOpen(item)" v-auth="'disable'">{{item.status==1?'禁用':'启用'}}</span>
                    <span class="tmopera waring" @click="delItem(item)" v-auth="'del'">删除</span>
                </div>
            </div>
            <!-- 菜单 -->
            <div :key="item.id" v-if="item.type==1" :aid="item.id" :dragset="paddingStyle" class="menurow" :type="item.type">
                <div class="menu-col">
                    <div class="men-col-name" :style="{'paddingLeft':paddingStyle+'px'}">
                        <i class="my-handler"  @mouseover="showTips" @mouseleave="hideTips"  v-auth="'index'"></i>
                        <i class="menuicon itemicon"></i>
                        {{item.name}}
                        <i v-if="item.childs" class="caret-bottom updown" @click="upDown" >
                            <img src="~@_/assets/img/common/updown.png"/>
                        </i>
                    </div>
                    <div class="men-col-url">{{item.authurl||'/'}}</div>
                    <div class="men-col-route">{{item.routekey}}</div>
                    <div class="men-col-type">菜单</div>
                    <div class="men-col-status">
                        <span :class="[item.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{item.status==1?'有效':'无效'}} </span>
                    </div>
                    <div class="men-col-see" v-auth="'osee'">/</div>
                    <div class="men-col-oper" v-auth="{'list':['update','disable','del']}">
                        <span class="tmopera" @click="editItem(item)" v-auth="'update'">修改</span>
                        <span :class="['tmopera',item.status==1?'stateDisabled':'statesuccess']" @click="setAuthOpen(item)" v-auth="'disable'">{{item.status==1?'禁用':'启用'}}</span>
                        <span class="tmopera waring" @click="delItem(item)" v-auth="'del'">删除</span>
                        <span class="tmopera" @click="addChileMenu(item)" v-auth="'add'">+子菜单</span>
                    </div>
                </div>
                <div class="menusitem" v-if="!item.childs" :singled="paddingStyle"></div>
                <MenuItem :menusItem="item.childs" v-if="item.childs" :applyThis="applyThis"></MenuItem>
            </div>    
        </template>
    </div>
</template>
<script>
export default {
    name: 'MenuItem',
    props:['menusItem','applyThis'],
    computed:{
        paddingStyle() {
            let padding = 57;
            let parent = this.$parent;
            while (parent && !parent.$refs['menuparent']) {
                padding += 20;
                parent = parent.$parent;
            }
            return padding;
        }
    },
    methods:{
        /* 展开|收起 */
        upDown(e){
            let $this=$(e.currentTarget);
            if($this.hasClass("caret-right")){
                $this.parent().parent().next().show();
                $this.addClass("caret-bottom").removeClass("caret-right");
            }else{
                $this.parent().parent().next().hide();
                $this.addClass("caret-right").removeClass("caret-bottom");
            }
        },
        /* 预览页面 */
        toPreview(item){
            window.open(location.origin+"/#/"+item.authurl);
        },
        /* 子菜单 */
        addChileMenu(item){
            this.applyThis.setData("addchild",item);
        },
        /* 查看 */
        seeOper(item){
            this.applyThis.seeOper(item);
        },
        /* 删除 */
        delItem(item){
            this.applyThis.delItem(item);
        },
        /* 修改 */
        editItem(item){
            this.applyThis.setData('edit',item);
        },
        /* 启用|禁用 */
        setAuthOpen(item){
            this.applyThis.setAuthOpen(item);
        },
        /* 显示拖拽提示 */
        showTips(e){
            this.applyThis.showTips(e);
        },
        /* 隐藏拖拽提示 */
        hideTips(){
            this.applyThis.hideTips();
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/menumanage.less";
</style>
