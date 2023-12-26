<template>
    <div :class="['flexbox','tagbody',tags.length==0?'tagbg':'']" id="tagbody">
        <span class="arrow arrow-left" @click="scrollLeft" v-show="show"></span>
        <div id="tagmain" class="tagmain">
            <div id="scrolltag" class="scrolltag">
                <span v-for="item in tags" :key="item.path" :class="['tag',item.path==$route.path?'active':'']">
                    <span @click="toOther(item.path)" @contextmenu.prevent="showDrop($event,item.path)" class="span-col">
                        <i class="tm-icon-refresh"  @click.stop="Refresh"></i>
                        {{item.name}}
                        <!-- <i class="tagclose" :paths="item.path" @click.stop="closeTag(item.path)">
                        </i> -->
                        <i class="tm-icon-close" :paths="item.path" @click.stop="closeTag(item.path)"></i>
                    </span>
                </span>
            </div>
        </div>
        <span class="arrow arrow-left arrow-right" @click="scrollRight" v-show="show"></span>
        <span class="el-dropdown-link" @click.prevent="showDrop($event,$route.path,'click')" v-show="tags.length>0">
            <i class="el-icon-caret-bottom"></i>
        </span>
        <transition name="el-zoom-in-top">
            <ul class="el-dropdown-menu el-popper tagquickin tmtagdrop" x-placement="bottom" v-show="drop.show" :style="{'position':'fixed','left':drop.left,'top':drop.top}">
                <li class="el-dropdown-menu__item closecur"  @click="closeCommand({path:drop.path,type:'cur'})">关闭当前</li>
                <li class="el-dropdown-menu__item closeleft" @click="closeCommand({path:drop.path,type:'left'})">关闭左侧</li>
                <li class="el-dropdown-menu__item closeright" @click="closeCommand({path:drop.path,type:'right'})">关闭右侧</li>
                <li class="el-dropdown-menu__item closeoth" @click="closeCommand({path:drop.path,type:'other'})">关闭其他</li>
                <li class="el-dropdown-menu__item closeall" @click="closeCommand({path:drop.path,type:'all'})">关闭全部</li>
                <div class="dropdown-line"></div>
                <li class="el-dropdown-menu__item collectcur"  @click="closeCommand({path:drop.path,type:'collect'})">{{colstatus?'取消收藏':'收藏菜单'}}</li>
                <div class="dropdown-line"></div>
                <li class="el-dropdown-menu__item refreshcur" @click="closeCommand({path:drop.path,type:'refresh'})">刷新</li>
                <div x-arrow="" class="popper__arrow" :style="{'left':drop.aleft}"></div>
            </ul>
        </transition>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {mgheader,successTips,msgTips} from '@_/axios/path';
export default {
    data(){
        return{
            tagWidth:0,//标签总宽度
            show:false,//向左|右按钮显示状态
            $scrolltag:null,
            $tagmain:null,
            scroll:300,//一次滚动宽度
            colstatus:false,//菜单收藏状态
            collect:null,//当前菜单收藏数据
            drop:{
                show:false,
                top:'87px',
                left:0,
                aleft:0,
                path:''
            },
            timeout:null
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.$scrolltag=$("#scrolltag");
            this.$tagmain=$("#tagmain");
        })
    },
    watch:{
        /* 监听标签 */
        tags(){
            this.$nextTick(()=>{
                let tbwidth=$("#tagbody").width(),
                    $elTag=$(".tag"),
                    width=0;
                let dnwidth=114;//下拉和左右滑动图标占位宽度
                //所有tag标签宽度
                for(let i=0;i<$elTag.length;i++){
                    width+=$elTag.eq(i).outerWidth();
                }
                if(width+dnwidth>tbwidth){
                    this.show=true;
                }else{
                    this.show=false;
                    this.$scrolltag.animate({marginLeft:0});
                }
                this.$nextTick(()=>{
                    let tmwidth=this.$tagmain.width();
                    this.tagWidth=width;
                    //让当前标签显示在可见区域
                    let $active=$("#scrolltag .active");
                    if($active.length==0){
                        return;
                    }
                    let currwidth=$active.outerWidth();//当前tag的宽度
                    let currofl=$active.offset().left;//当前tag的距离浏览器左侧的距离;
                    let currleft=currofl+currwidth;
                    let tmleft=this.$tagmain.offset().left;
                    let seewidth=tmleft + tmwidth;
                    let scrollml=parseInt(this.$scrolltag.css("margin-left"));
                    /* 激活标签在可见范围右侧 */
                    if(currleft>seewidth){
                        this.$scrolltag.animate({marginLeft:seewidth-currleft+scrollml});
                    }
                        /* 激活标签在可见范围左侧 */
                    if(currofl<tmleft){
                        this.$scrolltag.animate({marginLeft:tmleft-currleft+scrollml+currwidth});
                    } 
                })
            })
        }
    },
    methods:{
        ...mapMutations(['addTags']),
        /* 标签向左滚动 */
        scrollLeft(){
            let left=parseInt(this.$scrolltag.css("margin-left"));
            if(left==0){
                return;
            }
            this.$scrolltag.animate({marginLeft:left+this.scroll>0?0:this.scroll+left});
        },
        /* 标签向右滚动 */
        scrollRight(){
            let tagmain=$("#tagmain").width();
            let max=tagmain-this.tagWidth;
            let left=parseInt(this.$scrolltag.css("margin-left"));
            if(left<=max){
                return;
            }
            this.$scrolltag.animate({marginLeft:left-this.scroll<max?max:left-this.scroll});
        },
        /* 标签右键 */
        showDrop(e,path,type){
            clearTimeout(this.timeout);
            let offset=$(e.currentTarget).offset();
            let owidth=$(e.currentTarget).width();
            let oleft=offset.left;
            if(type=='click'){
                //组织默认事件
                e.stopPropagation();
                this.drop.show=!this.drop.show;
            }else{
                this.drop.show=true;
            }
            //设置下拉框显示位置
            let dropwidth=122;//下拉框宽度
            let browserwidth=$(window).width();
            if(oleft+dropwidth/2>=browserwidth){
                this.drop.left=browserwidth-dropwidth+'px';
                this.drop.aleft='96px';
            }else{
                this.drop.left=oleft-Math.abs(owidth-dropwidth)/2+'px';
                this.drop.aleft='50px';
            }

            this.$router.push({"path":path});
            this.drop.path=path;
            
            this.getCollectStatus(path);
            this.timeout=setTimeout(()=>{
                //点击空白处隐藏
                document.addEventListener('click', this.unbindListen, false);
            },300)
        },
        /* 解绑监听 */
        unbindListen (e) {
            this.drop.show=false;
            document.removeEventListener('click', this.unbindListen, false)
        },
        /* 下拉框出现/隐藏时触发 */
        changeActive(show){
            if(show){
                this.getCollectStatus(this.$route.path);
            }
        },
        /* 判断收藏状态 */
        getCollectStatus(path){
             mgheader.favoriteList({pageSize:''}).then(res=>{
                if(res.ok){
                    let data=res.data;
                    let obj=data.find(v=>'/'+v.routekey==path);
                    if(obj){
                        this.colstatus=true;
                        this.collect=obj;
                    }else{
                        this.colstatus=false;
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        closeCommand(obj){
            let curindex=this.tags.findIndex(item=>item.path==this.$route.path);
            switch(obj.type){
                case 'cur':
                    this.tags.splice(curindex,1);
                    let topath='index';
                    if(this.tags.length>0){
                        topath=this.tags[this.tags.length-1].path;
                    }
                    this.$router.push({"path":topath});
                    this.$scrolltag.css("margin-left",0);
                   break; 
                case 'other':
                    this.tags.splice(curindex+1,this.tags.length-curindex);
                    this.tags.splice(0,curindex);
                    this.$scrolltag.css("margin-left",0);
                    break;
                case 'all':
                    this.addTags([]);
                    this.$router.push({"path":"/index"});
                    this.$scrolltag.css("margin-left",0);
                    break;
                case 'left':
                    this.tags.splice(0,curindex);
                    this.$scrolltag.css("margin-left",0);
                    break;
                case 'right':
                    this.tags.splice(curindex+1,this.tags.length-curindex);
                    this.$scrolltag.css("margin-left",0);
                    break;
                case 'refresh':
                    this.Refresh();
                    break;
                case 'collect':
                    this.updateCollect();
                    break;
            }
        },
        /* 跳转其他页面 */
        toOther(path){
            this.$router.push({"path":path});
        },
        /* 关闭当前页面 */
        closeTag(path){
            let findex=this.tags.findIndex(item=>item.path==path);
            if(findex!=-1){
                this.tags.splice(findex,1);
            }
            let topath='index';
            if(this.tags.length>0){
                topath=this.tags[this.tags.length-1].path;
            }
            this.$router.push({"path":topath});
            this.$scrolltag.css("margin-left",0);
        },
        /* 刷新 */
        Refresh(){
            let path=this.$route.path;
            this.$router.push({path,query:{'random':new Date().getTime()}});
        },
        /* 收藏 */
        updateCollect(){
            if(this.colstatus){
                /* 取消收藏 */
                let ptdata={
                    'id':this.collect.id
                };
                mgheader.delFavorite(ptdata).then(res=>{
                    if(res.ok){
                        successTips('取消成功');
                    }else{
                        msgTips(res);
                    }
                })
            }else{
                /* 添加收藏 */
                let currRoute=this.tags.find(item=>item.path==this.$route.path);
                let ptdata={
                    'routkey':currRoute.path.split("/")[1],
                    'aid':currRoute.id
                }
                mgheader.addFavorite(ptdata).then(res=>{
                    if(res.ok){
                        successTips('收藏成功');
                    }else{
                        msgTips(res);
                    }
                })
            }
           
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/taglist.less";
</style>