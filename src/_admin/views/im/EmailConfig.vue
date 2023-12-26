<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">账号</label>
                <el-input type="text" clearable v-model="filters.searchkey"></el-input>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="序号" type="index" width="100" :align="$protovar.align"></el-table-column>
                <el-table-column label="账号" prop="email" :align="$protovar.align"></el-table-column>
                <el-table-column label="服务器" prop="server" :align="$protovar.align"></el-table-column>
                <el-table-column label="添加时间" :align="$protovar.align" prop="createtime">
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align">
                    <template slot-scope="scope">
                       <span :class="[scope.row.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{scope.row.status==1?'正常':'已禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="180" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setData('edit',scope.row)" v-auth="'update'">修改</span>
                        <span class="tmopera waring" @click="delServer(scope.row)" v-auth="'del'">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 删除 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">确定删除该配置信息吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDel" >删除</button>
            </div>
        </el-dialog>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="账号" prop="email">
                        <el-input v-model="dialog.form.email" name="email" :disabled="dialog.type=='edit'?true:false"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="服务器" prop="server">
                        <el-input v-model="dialog.form.server" name="server"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="密码" prop="showpwd"  v-if="dialog.type=='edit'">
                        <el-input v-model="showpwd"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd"  v-if="dialog.type=='add'">
                        <el-input v-model="dialog.form.pwd"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <input type="hidden" name="email" :value="dialog.form.email" v-if="dialog.type=='edit'"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {email,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
            },
            data:{//数据表格
                loading:false,//表单loading
                list:[],//列表
            },
            currdata:null,
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                    status:1
                },
                rules:{
                    server: [
                        {required: true,message: "请输入服务器名称",trigger: "blur"}
                    ],
                    pwd: [
                        {required: true,message: "请输入服务器密码",trigger: "blur"}
                    ],
                     showpwd:[
                        {required: true,message: "请输入服务器密码",trigger: "blur"}
                    ],
                    email:[
                        {required: true,message: "请输入账号",trigger: "blur"}
                    ]
                }
            },
            dialog2:{
                visible:false
            },
            showpwd:'',
            statusSelect:[{id:1,label:'正常'},{id:2,label:'禁用'}],
            curroute:''
        }
    },
    computed:{
        authdisable(){
            return this.authDisable(['update','del'])
        }
    },
    watch:{
        showpwd(nv,ol){
            if(ol=='******'){
                this.showpwd='';
                this.dialog.form.pwd='';
            }
            this.dialog.form.showpwd=nv;
        },
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getData();
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    methods:{
        /* 用户数据 */
        getData(item){
            this.data.loading=true;
            let ptdata={...this.filters};
            email.emailList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.list=data;
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 删除 */
        delServer(item){
            this.currdata=item;
            this.dialog2.visible=true;
        },
        /* 确定删除 */
        sureDel(){
            let ptdata={email:this.currdata.email};
            email.delEmail(ptdata).then(res=>{
                if(res.ok){
                    this.dialog2.visible=false;
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let type=this.dialog.type;
                    let {pwd,status}=this.dialog.form;
                    let res,postdata;
                    /* 新增 */
                    if(type=="add"){
                        postdata=$("#form").serialize()+`&pwd=${pwd}&status=${status}`;
                        res=await email.addEmail(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        postdata=$("#form").serialize()+`&status=${status}`;
                        if(!pwd){
                            postdata=postdata+`&pwd=${this.showpwd}`;
                        }
                        res=await email.updateEmail(postdata);
                    }
                    if(res.ok){
                        this.dialog.visible=false;
                        successTips("保存成功");
                        this.getData();
                    }else{
                        msgTips(res); 
                    }
                    
                } else {
                    return false;
                }
            });
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
                this.dialog.title="添加邮件服务器";
            }
            if(type=="edit"){
                let data={...item};
                data.showpwd="******";
                this.showpwd="******";
                this.dialog.form=data;
                this.dialog.title="修改邮件服务器";
            }
        },
    },
}
</script>