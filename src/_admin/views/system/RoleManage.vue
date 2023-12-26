<template>
    <div class="commonright container">
       <div class="leftcontent">
            <div class="searchtop">
                <label class="label">状态</label>
                <el-select v-model="filters.status" clearable placeholder="全部">
                    <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
                <button class="primarybtn search" @click="getData()" >查询</button>
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
            </div>
            <ul class="list">
                <li :class="['list-col',rid==v.id?'active':'']" v-for="v in list" :key="v.id" @click="getRoleAuthTree(v)">
                    <span :class="['list-name flexbox',v.status==2?'list-status':'']">
                        <span>{{v.name}}</span>
                        <img src="~@_/assets/img/system/disable.png" v-if="v.status==2" class="col-status"/>
                        <span class="roleid">(ID：{{v.id}})</span>
                    </span>
<!--                    <span class="usercount" @click="toUser(v)">{{v.usercount}}人</span>-->
                    <span class="list-oper" v-auth="{'list':['update','del']}">
                        <span class="tmopera" @click.stop="setData('edit',v)" v-auth="'update'"   v-show="rid==v.id">修改</span>
                        <span class="tmopera waring" @click.stop="delOper(v)" v-auth="'del'"    v-show="rid==v.id">删除</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="rightcontent">
            <div class="tmheader">
                <span>当前角色：</span>
                <span class="rolename">{{rname}}</span>
                <div class="rolegrant">
                    <span @click="allUpDown('down')" class="updown">全部展开</span>
                    <span @click="allUpDown('up')"  class="updown">全部收起</span>
                    <button class="primarybtn" @click="saveAuthUpdate" v-auth="'grant'">保存</button>
                </div>
            </div>
            <div class="authbody">
                <div class="listbody">
                    <div v-for="(v,index) in roleAuth" :key="index" class="authrow">
                        <RoleItem :roleAuth="v" :applyThis="applyThis"></RoleItem>
                    </div>
                </div>
            </div>
            
        </div>
         <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="角色名" prop="name">
                        <el-input v-model="dialog.form.name" name="name"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="描述" prop="remark">
                        <el-input v-model="dialog.form.remark" name="remark" type="textarea"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <input type="hidden" name="id" :value="dialog.form.id" v-if="dialog.type=='edit'"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :close-on-click-modal="false" :width="$protovar.dwidth"  class="tmdialog"> 
            <div class="title">确定删除当前角色吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" :disabled="loading">删除</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mgrole,msgTips,successTips} from '@_/axios/path';
import RoleItem from '@_/components/system/RoleItem.vue';
export default {
    data(){
        return {
            filters:{
                status:''
            },
            list:[],//列表
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                },
                rules:{
                    name: [
                        {required: true,message: "请输入角色名",trigger: "blur"}
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            },
            dialog2:{
                visible:false,
                data:null
            },
            statusList:[{id:1,label:"正常"},{id:2,label:"禁用"}],
            roleAuth:[],
            checkArr:[],
            applyThis:null,
            allAuthOperId:[],
            authData:[],
            rid:'',//角色id
            rname:'',
            loading:false,
            curroute:'',
            linkage:false,//是否处理子项选中-父级联动选中
        }
    },
    components:{
        RoleItem
    },
    mounted(){
        this.curroute=this.$route.path;
        this.applyThis=this;
        this.getData();
    },
    watch:{
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.applyThis=this;
                this.getData();
            }
        }
    },
    methods:{
        /* 用户数据 */
        getData(){
            let ptdata={status:this.filters.status};
            mgrole.mgRoleList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.list=data;
                        if(this.rid==''){
                            this.rid=data[0].id;
                            this.rname=data[0].name;
                        }else{
                            this.rname=(data.find(item=>item.id==this.rid)).name;
                        }
                        this.getRoleAuthTree();
                    }
                }else{
                    msgTips(res);
                }
            })
        },
        /* 跳转用户页面 */
        toUser(item){
            if(item.id==this.rid){
                this.$router.push({path:'/usermanage',query:{rid:item.id}});
            }
        },
        /* 删除 */
        delOper(item){
            this.dialog2.visible=true;
            this.dialog2.data=item;
        },
        /* 确定-删除 */
        sureDel(){
            this.loading=true;
            let ptdata={rid:this.dialog2.data.id};
            mgrole.mgRoleDel(ptdata).then(res=>{
                this.dialog2.visible=false;
                if(res.ok){
                    this.rid="";
                    successTips("删除成功");
                    this.getData();
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 新增|编辑 */
        setData(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="新增配置项";
            }
            if(type=="edit"){
                let data={...item};
                this.dialog.form=data;
                this.dialog.title="编辑配置项";
            }
        },
        /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let type=this.dialog.type;
                    let res,postdata;
                    postdata=$("#form").serialize()+`&status=${this.dialog.form.status}`;
                    /* 新增 */
                    if(type=="add"){
                        res=await mgrole.mgRoleAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await mgrole.mgRoleUpdate(postdata);
                    }
                    if(res.ok){
                        this.dialog.visible=false;
                        successTips("保存成功");
                        this.dialog.form=this.$options.data().dialog.form;
                        this.getData();
                    }else{
                        msgTips(res); 
                    }
                    this.loading=false;
                } else {
                    return false;
                }
            });
        },
        /* 全部收起|全部展开 */
        allUpDown(type){
            if(type=="up"){
                $(".updownicon.caret-bottom").click();
            }
            if(type=="down"){
                 $(".updownicon.caret-right").click();
            }
        },
        /* 权限设置 */
        setAuth(item){
            this.getRoleAuthTree(item);
        },
        getRoleAuthTree(item){
            if(item){
                this.rid=item.id;
                this.rname=item.name;
            }
            mgrole.mgRoleAuthTree({rid:this.rid}).then(res=>{
                if(res.ok){
                    this.roleAuth=[];
                    //屏幕宽度大于1700px,弹框显示3列否则显示2列
                    var width=$(window).width();
                    let data=res.data;
                    this.checkArr=[];
                    this.allAuthOperId=[];
                    this.checkedAuth(data);
                    this.linkage=true;
                    // this.setAllAuthOperId(data);
                    let arr1=[],arr2=[],arr3=[];
                    if(width>=1700){
                        $.each(data,(i,v)=>{
                             if((i+1)%3==1){
                                arr1.push(v);
                            }
                             if((i+1)%3==2){
                                arr2.push(v);
                            }
                            if((i+1)%3==0){
                                arr3.push(v);
                            }
                        })
                        this.roleAuth.push(arr1);
                        this.roleAuth.push(arr2);
                        this.roleAuth.push(arr3);
                    }else{
                        $.each(data,(i,v)=>{
                            if(i % 2 === 0){
                                arr1.push(v);
                            }else{
                                arr2.push(v);
                            } 
                        })
                        this.roleAuth.push(arr1);
                        this.roleAuth.push(arr2);
                    }
                }
            })
        },
        /* 已选中权限id */
        checkedAuth(data){
            data.map((item,i)=>{
                item.bf=false;
                if(item.selid!=-1){
                    this.checkArr.push(item.id);
                }
                if(item.childs){
                    this.checkedAuth(item.childs);
                }
                //操作权限id
                if(item.type==3){
                    this.allAuthOperId.push(item.id);
                }
            })
        },
        /* 保存权限设置 */
        saveAuthUpdate(){
            let arr=[...this.allAuthOperId];
            this.allAuthOperId.map((item,i)=>{
                this.checkArr.map(value=>{
                    if(item==value){
                        arr.splice(i,1);
                    }
                })
            })
           
            let ptdata={
                rid:this.rid,
                aids:this.checkArr.join(","),
                closeoperaids:arr.join(",")
            };
            mgrole.mgRoleGrant(ptdata).then(res=>{
                if(res.ok){
                    successTips("保存成功");
                }else{
                    msgTips(res);
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/rolemanage.less";
</style>