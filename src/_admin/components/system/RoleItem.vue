<template>
    <div class="roleItem">
        <template v-for="v in roleAuth">
            <!-- 页面 -->
            <div v-if="v.type==2" :key="v.id" :class="[v.pid==-1?'authcontent':'nexauth']">
                <div class="authheader">
                    <div class="flexbox">
                       <input type="checkbox" v-model="applyThis.checkArr" :value="v.id" @change="handleCheckChange(v.id,v.pid)" v-auth="'grant'"/>
                        <!-- <img src="~@_/assets/img/system/page.png" class="icon" v-if="v.pid!=-1"/> -->
                        <span class="menuname">{{v.name}}</span>
                        <span v-if="v.childs" class="count-num">
                            (<span>{{setOperItem(v)}}</span>/
                            <span>{{v.childs.length}}</span>)
                        </span>
                    </div>
                    <i class="updownicon caret-bottom" v-if="v.childs" @click="upDown">
                    </i>
                </div>
                <!-- 页面操作 -->
                <div class="operlist">
                    <div v-for="item in v.childs" :key="item.id" class="flexbox">
                        <input type="checkbox" v-model="applyThis.checkArr" :value="item.id" v-auth="'grant'"/>
                        <!-- <img src="~@_/assets/img/system/oper.png" class="icon"/> -->
                        {{item.name}}
                    </div>
                </div>
            </div>
            <!-- 菜单 -->
            <div :key="v.id" v-if="v.type==1" :class="[v.pid==-1?'authcontent':'nexauth']">
                <div class="authheader">
                    <div :class="['flexbox',v.bf?'bf':'']" :id="'ch'+v.id" >
                        <input type="checkbox" v-model="applyThis.checkArr" @change="handleCheckChange(v.id,v.pid,v.childids)" :value="v.id" v-auth="'grant'"/>
                       <!--  <img src="~@_/assets/img/system/menu.png" class="icon" v-if="v.pid!=-1"/> -->
                        <span class="menuname">{{v.name}}</span>
                        <span v-if="v.childs" class="count-num">
                            (<span>{{setNum(v)}}</span>
                            /{{v.childs.length}})
                        </span>
                    </div>
                    <i class="updownicon caret-bottom" v-if="v.childs" @click="upDown">
                    </i>
                </div>
                <RoleItem :roleAuth="v.childs" :applyThis="applyThis"></RoleItem>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'RoleItem',
    props:['roleAuth','applyThis'],
    data(){
        return {
            checkarr:[]
        }
    },
    methods:{
        /* 展开|收起 */
        upDown(e){
            let $dom=$(e.currentTarget).parent().next();
            if($dom.css("display")=="block"){
                $dom.hide();
                $(e.currentTarget).addClass("caret-right").removeClass("caret-bottom");
            }else{
                $dom.show();
                $(e.currentTarget).addClass("caret-bottom").removeClass("caret-right");
            }
        },
         /* 
        * 复选框change事件
        * @param{*} id 
        * @param{*} pid 
        * @param{*} childids 
        */
        handleCheckChange(id,pid,childids){
            this.applyThis.linkage=false;
            let num=0;
            let checkArr=this.applyThis.checkArr;
            // let childids=[];//所有子级
             if(childids){
                childids=childids.split(",");
                childids.splice(0,1);
                if(checkArr.includes(id)){//选中
                    childids.map((item,i)=>{
                        checkArr.map((v,j)=>{
                            if(v==item){
                                childids.splice(i,1);
                            }
                        })
                    })
                    this.applyThis.checkArr=(checkArr.concat(childids)).map(Number);
                }else{//取消选中
                    childids.map((item,i)=>{
                        checkArr.map((v,j)=>{
                            if(v==item){
                                checkArr.splice(j,1);
                            }
                        })
                    })
                    this.applyThis.checkArr=checkArr.map(Number) ;
                }
            }
        },
        /* 设置选中数值 */
        setNum(row){
            let num=0;
            let checkArr=this.applyThis.checkArr;//已选中id数组
            let  inchildids=row.inchildids;//一级子级
            //已选中数组中-一级子级选中个数
            if(inchildids){
                inchildids=inchildids.split(",");
                inchildids.splice(0,1);
                inchildids.map((item,i)=>{
                    checkArr.map((v,j)=>{
                        if(v==item){
                            num++;
                        }
                    })
                })
                if(!this.applyThis.linkage){
                    //如果一级子级选中个数大于0&&已选中数组中没有当前id
                    if(num>0&&!checkArr.includes(row.id)){
                        this.applyThis.checkArr.push(row.id);
                    }
                }
                
            }

            let childids=row.childids;//所有子集
            let num2=0;
            //当前下边的所有子集在已选中数组中占有个数
            if(childids){
                childids=childids.split(",");
                childids.splice(0,1);
                childids.map((item,i)=>{
                    checkArr.map((v,j)=>{
                        if(v==item){
                            num2++;
                        }
                    })
                })
                //如果一级子级选中个数等于0&&已选中数组大于0，在已选中数组中去除当前id
                if(num==0&&checkArr.length>0){
                   let findex=checkArr.findIndex(item=>item==row.id);
                   if(findex!=-1){
                       this.applyThis.checkArr.splice(findex,1);
                   }
                }
                //如果已选中所有子集等于所有子集个数&&num==inchildids.length
                if(num2==childids.length){
                    row.bf=false;
                }else{
                    row.bf=true;
                }
            }
            return num;
        },
        /* 页面下操作选中数值 */
        setOperItem(data){
            let num=0;
            let checkArr=this.applyThis.checkArr;//已选中id数组
            let childs=data.childs;
            childs.map((item,i)=>{
                checkArr.map((v,j)=>{
                    if(v==item.id){
                        num++;
                    }
                })
            })
            return num;
        },
       
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/rolemanage.less";
</style>