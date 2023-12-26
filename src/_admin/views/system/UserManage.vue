<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">后台用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="登录名/昵称/姓名"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">角色</label>
                <el-select v-model="filters.rid" clearable placeholder="全部">
                    <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
                <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
                <button class="primarybtn synAdminUser" @click="addAccount" v-auth="'synAdminUser'" >生成前台账号</button>
            </div>
             
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table height="620" :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="用户ID" prop="id"></el-table-column>
                <el-table-column label="用户名" prop="loginname"></el-table-column>
                <el-table-column label="昵称" prop="nick" show-overflow-tooltip></el-table-column>
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.realname||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="电话">
                    <template slot-scope="scope">
                        <span>{{scope.row.phone||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.deptname||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="职位" prop="position">
                    <template slot-scope="scope">
                        <span>{{scope.row.position||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属角色" prop="rolename" show-overflow-tooltip ></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <span :class="[scope.row.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{scope.row.status==1?'正常':'已禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setData('edit',scope.row)" v-auth="'update'">修改</span>
                        <span class="tmopera waring" @click="delUser(scope.row)" v-auth="'del'">删除</span>
                        <span class="tmopera" @click="resetPwd(scope.row)" v-auth="'reset'">重置密码</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagecontainer" v-show="data.totalRow>0">
            <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                :page-size="data.pageSize" 
                :page-sizes="data.pagesizes"  
                :total="data.totalRow"  
                :current-page="data.pageNumber"
                @current-change="handleCurrentChange" 
                @size-change="handleSizeChange">
            </el-pagination>
        </div>
        <!-- 删除用户 -->
        <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">确定删除当前用户吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog2','visible')">取消</button>
                <button class="primarybtn" @click="sureDelUser" :disabled="loading">删除</button>
            </div>
        </el-dialog>
        <!-- 重置密码-->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth"  class="tmdialog" :modal="false">
            <div class="title">确认重置当前用户登录密码吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog3','visible')">取消</button>
                <button class="primarybtn" @click="sureResetPwd" :disabled="loading">重置</button>
            </div>
        </el-dialog>
        <!-- 提示成功 -->
        <el-dialog :visible.sync="dialog3.visible2" :width="$protovar.dwidth" class="tmdialog" :modal="false">
            <div class="title">
                <p>已成功重置为默认密码：{{sysparams?sysparams['resetpwd']:''}}</p>
                <p>请尽快通知用户进行修改！</p>
            </div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn" @click="hideDialog('dialog3','visible2')" >确定</button>
            </div>
        </el-dialog>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.dtfwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform" id="form">
                <div class="tmcol tmcol-half">
                    <el-form-item label="登录名" prop="loginname">
                        <el-input v-model="dialog.form.loginname" name="loginname" :disabled="dialog.type=='edit'?true:false"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="姓名" prop="realname">
                        <el-input v-model="dialog.form.realname" name="realname"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half" v-if="dialog.type=='edit'">
                    <el-form-item label="密码" prop="showpwd">
                        <el-input v-model="showpwd"></el-input>
                    </el-form-item>
                    <input type="hidden" name="id" v-model="dialog.form.id"/>
                </div>
                <div class="tmcol tmcol-half" v-if="dialog.type=='add'">
                    <el-form-item label="密码" prop="pwd">
                        <el-input v-model="dialog.form.pwd"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="dialog.form.phone" name="phone"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="昵称" prop="nick">
                        <el-input v-model="dialog.form.nick" name="nick"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="部门">
                        <el-input v-model="dialog.form.deptname" name="deptname"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="职位">
                        <el-input v-model="dialog.form.position" name="position"></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="角色" prop="checklist">
                        <div class="tm-checkgroup">
                            <label  v-for="child in roleList" :key="child.id" class="check-col"><input type="checkbox" v-model="dialog.form.checklist" :value="child.id"/>{{child.name}}</label>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import CryptoJS from 'crypto-js';//加密
import {mguser,mgRoleDictList,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                rid:'',
                status:''
            },
            statusSelect:[{id:1,label:'正常'},{id:2,label:'禁用'}],
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            currdata:null,
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                    checklist:[]
                },
                rules:{
                    loginname: [
                        {required: true,message: "请输入登录名",trigger: "blur"}
                    ],
                    nick: [
                        {required: true,message: "请输入昵称",trigger: "blur"}
                    ],
                    showpwd:[
                        {required: true,message: "请输入密码",trigger: "blur"}
                    ],
                    pwd:[ {required: true,message: "请输入密码",trigger: "blur"}],
                    status:[
                        { required: true, message: '请选择账号状态', trigger: 'change' }
                    ],
                    checklist: [
                        { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
                    ],
                }
            },
            dialog2:{
                visible:false
            },
            dialog3:{
                visible:false,
                visible2:false
            },
            loading:false,
            roleList:[],
            showpwd:'',
            curroute:''
        }
    },
    computed:{
        authdisable(){
            return this.authDisable(['update','del','reset']);
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
                let rid=to.query.rid;
                if(rid){
                    this.filters.rid=parseInt(rid);
                    this.getData();
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getRolelist();
                this.getData();
            }
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.filters.rid=parseInt(this.$route.query.rid)||'';
        this.getRolelist();
        this.getData();
    },
    methods:{
        /* 角色列表 */
        getRolelist(){
            mgRoleDictList().then(res=>{
                if(res.ok){
                    this.roleList=res.data;
                }else{
                    msgTips(res);
                }
            });
        },
        /* 用户数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            mguser.mgUserList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        this.data.list=list||[];
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
        },
         /* 切换分页 */
		handleCurrentChange(val){
            this.data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getData();
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 删除用户 */
        delUser(item){
            this.currdata=item;
            this.dialog2.visible=true;
        },
        /* 重置密码 */
        resetPwd(item){
            this.currdata=item;
            this.dialog3.visible=true;
        },
        /* 确定删除用户 */
        sureDelUser(){
            this.loading=true;
            let ptdata={mguid:this.currdata.id};
            mguser.mgUserDel(ptdata).then(res=>{
                if(res.ok){
                    this.dialog2.visible=false;
                    this.getData();
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 确定重置密码 */
        sureResetPwd(){
            this.loading=true;
            let ptdata={mguid:this.currdata.id};
            mguser.mgResetPwd(ptdata).then(res=>{
                if(res.ok){
                    this.dialog3.visible=false;
                    this.dialog3.visible2=true;
                }else{
                    msgTips(res);
                }
                this.loading=false;
            })
        },
        /* 提交表单 */
        formSubmit(){ 
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let type=this.dialog.type;
                    let {loginname,checklist,pwd,status}=this.dialog.form;
                    let rids=checklist.join(",");
                    let	key1='$',key2='{',key3='}';
                    let palinstr='';
                    let res,postdata;
                    /* 新增 */
                    if(type=="add"){
                        palinstr= `${key1}${key2}${loginname}${key3}${pwd}`;
                        pwd=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
                        postdata=$("#form").serialize()+`&pwd=${pwd}&status=${status}&rids=${rids}`;
                        res=await mguser.mguserAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        if(!pwd){
                            let palinstr= `${key1}${key2}${loginname}${key3}${this.showpwd}`;
                            pwd=CryptoJS.MD5(CryptoJS.enc.Latin1.parse(palinstr)).toString();
                        }
                        postdata=$("#form").serialize()+`&pwd=${pwd}&status=${status}&rids=${rids}`;
                        res=await mguser.mgUserUpdate(postdata);
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
        /* 新增|编辑 */
        setData(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.form=this.$options.data().dialog.form;
                this.dialog.title="添加管理员";
            }
            if(type=="edit"){
                let data={...item};
                data.checklist=data.rids?data.rids.split(","):[];
                data.showpwd="******";
                this.showpwd="******";
                this.dialog.form=data;
                this.dialog.title="修改管理员";
            }
        },
        /**同步前台账号 */
        addAccount(){
          mguser.synAdminUser().then(res=>{
            if(res.ok){
              successTips('成功')
            }else{
              msgTips(res.msg); 
            }
          })
        }
    },
}
</script>