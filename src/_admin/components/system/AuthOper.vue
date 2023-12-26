<template>
    <div>
        <!-- 操作权限 -->
        <el-dialog :visible.sync="show" :close-on-click-modal="false" class="tmdialog setdialog" :width="$protovar.dtbwidth" :before-close="handleClose">
            <div class="tmheader">
                <span>操作权限</span>
                <div class="opergrant fr">
                    <span>当前页面：</span>
                    <span class="pagename">{{data.name}}</span>
                    <button class="primarybtn" @click="addEditAuth('add')" v-auth="'oadd'">
                        <i class="el-icon-plus"></i>
                        添加权限
                    </button>
                </div>
            </div>
            <div class="dialogpad">
                <el-table :data="list" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="操作名称" prop="name" :align="$protovar.align"></el-table-column>
                    <el-table-column label="请求路径" prop="authurl" :align="$protovar.align" width="250"></el-table-column>
                    <el-table-column label="指令词" prop="routekey" :align="$protovar.align"></el-table-column>
                    <el-table-column label="角色权限分配" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span>{{scope.row.status==1?'开启':'关闭'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  :align="$protovar.align" v-if="authdisable" width="160">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="addEditAuth('edit',scope.row)"  v-auth="'oupdate'">修改</span>
                            <span class="tmopera" @click="operStatus(scope.row)" v-auth="'odisable'">{{scope.row.status==1?'禁用':'启用'}}</span>
                            <span class="tmopera waring" @click="delAuth(scope.row)" v-auth="'odel'">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog"> 
            <div class="title">确定删除当前操作吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" :disabled="loading">删除</button>
            </div>
        </el-dialog>
        <!-- 新增|编辑框 -->
            <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
                <p class="tmheader">{{dialog.title}}</p>
                <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="authform">
                    <div class="tmcol">
                        <el-form-item label="当前页面" >
                        <span class="textlh" style="line-height:30px;"> {{data.name}}</span>
                        </el-form-item>
                    </div> 
                    <div class="tmcol">
                        <el-form-item label="操作名称" prop="name">
                            <el-input v-model="dialog.form.name" name="name"></el-input>
                        </el-form-item>
                    </div>  
                    <div class="tmcol">
                        <el-form-item label="请求路径" prop="authurl">
                            <el-input v-model="dialog.form.authurl" name="authurl"></el-input>
                        </el-form-item>
                    </div>  
                    <div class="tmcol">
                        <el-form-item label="指令词" prop="routekey">
                            <el-input v-model="dialog.form.routekey" name="routekey"></el-input>
                        </el-form-item>
                    </div> 
                    <div class="tmcol">
                        <el-form-item label="角色权限分配" prop="status">
                            <el-select v-model="dialog.form.status">
                                <el-option v-for="item in statuselect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </div> 
                    <input type="hidden" name="pid" :value="data.id" v-if="dialog.type=='add'"/>
                    <input type="hidden" name="id" :value="dialog.form.id" v-if="dialog.type=='edit'"/>
                </el-form>
                <div class="tmdialog-footer pb30">
                    <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                    <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
                </div>
            </el-dialog>
    </div>
</template>
<script>
import {authoper,msgTips,successTips} from '@_/axios/path';
export default {
    props:['data','show'],
    data(){
        return {
            list:[],
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                },
                rules:{
                    authurl: [
                        {required: true,message: "请输入请求路径",trigger: "blur"}
                    ],
                    name: [
                        {required: true,message: "请输入操作名称",trigger: "blur"}
                    ],
                    routekey:[
                        {required: true,message: "请输入指令词",trigger: "blur"}
                    ],
                    status:[
                        { required: true, message: '请选择角色分配权限', trigger: 'change' }
                    ],
                }
            },
            statuselect:[{id:1,label:'开启'},{id:2,label:'关闭'}],
            dialog2:{
                visible:false,
                data:{}
            },
            loading:false
        }
    },
    computed:{
        authdisable(){
            return this.authDisable(['oupdate','odisable','odel'])
        }
    },
    watch:{
        show(nv,ol){
            if(this.show){
                this.getOperList();
            }
        }
    },
    methods:{
        /* 权限列表 */
        getOperList(){
            let ptdata={aid:this.data.id};
            authoper.mgAuthOperlist(ptdata).then(res=>{
                if(res.ok){
                    this.list=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
         /* 新增|编辑 权限 */
        addEditAuth(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
                 this.dialog.title="添加权限";
            }
            if(type=="edit"){
                this.dialog.form={...item};
                this.dialog.title="修改权限";
            }
        },
        /* 保存权限 */
        formSubmit(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let res;
                    let status=this.dialog.form.status;
                    let postdata=$("#authform").serialize()+`&status=${status}`;
                    /* 修改 */
                    if(this.dialog.type=="add"){
                        res=await authoper.mgAuthOperAdd(postdata);
                    }
                    if(this.dialog.type=="edit"){
                        res=await authoper.mgAuthOperUpdate(postdata);
                    }
                    if(res.ok){
                        this.dialog.visible=false;
                        successTips("保存成功");
                        this.dialog.form=this.$options.data().dialog.form;
                        this.getOperList();
                    }else{
                        msgTips(res); 
                    }
                    this.loading=false;
                } else {
                    return false;
                }
            });
        },
        /* 启用|禁用 */
        operStatus(item){
            let ptdata={
                aid:item.id,
                status:item.status==1?2:1
            };
            authoper.mgAuthOperDisable(ptdata).then(res=>{
                if(res.ok){
                    successTips("修改成功");
                    this.getOperList();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 删除 */
        delAuth(item){
            this.dialog2.visible=true;
            this.dialog2.data=item;
        },
        /* 确认删除 */
        sureDel(){
            this.loading=true;
            let ptdata={aid:this.dialog2.data.id};
            authoper.mgAuthOperDel(ptdata).then(res=>{
                if(res.ok){
                    this.dialog2.visible=false;
                    this.getOperList();
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 关闭弹框 */
        handleClose(){
            this.$emit("closeAuthOper");
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
    }
}
</script>
<style lang="less" scoped>
.setdialog{
    /deep/.el-dialog{
        padding-bottom:30px;
    }
    .tmheader{
        line-height: 30px;
        padding: 15px 0 14px 26px;
    }
    .opergrant{
        margin-right:70px;
        .pagename{
            color:@textBlue;
            margin-right:46px;
        }
        .primarybtn{
            width: 92px;
        }
    }
}
</style>