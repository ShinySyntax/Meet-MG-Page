<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称/账号/ID"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable>
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="ID" prop="id" :align="$protovar.align"></el-table-column>
                <el-table-column label="账号" prop="loginname" :align="$protovar.align"></el-table-column>
                <el-table-column label="昵称" prop="nick" :align="$protovar.align"></el-table-column>
                <el-table-column label="头像" :align="$protovar.align">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatar"  class="imgcol"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱" prop="email" :align="$protovar.align"></el-table-column>
                <el-table-column label="手机号" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.phone||"--"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="IP" :align="$protovar.align">
                    <template slot-scope="scope">
                        <a class="a_ip" v-if="scope.row.ip" :href="`https://www.baidu.com/s?wd=${scope.row.ip}&from=t-io`"  target="_blank">{{scope.row.ip}} </a>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" prop="createtime" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="最近登录" prop="lastlogintime" :align="$protovar.align"></el-table-column>
                <el-table-column label="状态" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span :class="[scope.row.status==1?'tmdisabledfalse':'tmdisabledtrue']">{{scope.row.status==1?'正常':'已禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="seeInfo(scope.row)">查看</span>
                        <span :class="['tmopera',scope.row.status==1?'stateDisabled':'statesuccess']" v-auth="'disable'" @click="operStatus(scope.row)">{{scope.row.status==1?'禁用':'启用'}}</span>
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
        <!-- 重置密码-->
        <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth"  class="tmdialog" :modal="false">
            <div class="title">确认重置当前用户登录密码吗？</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('dialog3','visible')">取消</button>
                <button class="primarybtn" @click="sureResetPwd">重置</button>
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
        <!-- 用户详情 -->
        <el-dialog :visible.sync="dialog2.visible" :close-on-click-modal="false" class="tmdialog " :width="$protovar.dtfwidth" >
            <el-form :label-width="$protovar.fmlabwidth" :hide-required-asterisk="true" class="dialogform">
                <p class="tmheader">账号信息</p>
                <div class="tmcol tmcol-half">
                    <el-form-item label="账号：">
                        <span class="textlh">{{dialog2.data.loginname}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="邮箱：">
                         <span class="textlh">{{dialog2.data.email||'--'}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="注册时间：">
                         <span class="textlh">{{dialog2.data.createtime}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="手机号：">
                         <span class="textlh">{{dialog2.data.phone||'--'}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="IP：">
                         <span class="textlh">{{dialog2.data.ip||'--'}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="状态：">
                         <span class="textlh">{{dialog2.data.status==1?'正常':'禁用'}}</span>
                    </el-form-item>
                </div>
                <p class="tmheader">用户资料</p>
                <div class="tmcol tmcol-half">
                    <el-form-item label="昵称：">
                        <span class="textlh">{{dialog2.data.nick||'--'}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="性别：">
                         <span class="textlh">{{dialog2.data.sex==1?'男':(dialog2.data.sex==2?'女':'保密')}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="头像：">
                        <span class="textlh">
                             <el-image :src="dialog2.data.avatar"  class="see-imgcol"></el-image>
                        </span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="地区：">
                        <span class="textlh">{{dialog2.data.province+dialog2.data.city}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="签名：">
                        <span class="textlh">{{dialog2.data.sign||'--'}}</span>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {imuser,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
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
            dialog2:{
                visible:false,
                data:{}
            },
            dialog3:{
                visible:false,
                visible2:false
            },
            loading:false,
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    watch: {
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
    methods:{
        /* 用户数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            imuser.userList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                        })
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
        /* 查看 */
        seeInfo(item){
            this.dialog2.data=item;
            this.dialog2.visible=true;
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 重置密码 */
        resetPwd(item){
            this.currdata=item;
            this.dialog3.visible=true;
        },
        /* 确定重置密码 */
        sureResetPwd(){
            let ptdata={uid:this.currdata.id};
            imuser.resetPwd(ptdata).then(res=>{
                if(res.ok){
                    this.dialog3.visible=false;
                    this.dialog3.visible2=true;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 启用|禁用 */
        operStatus(item){
            let ptdata={
                uid:item.id,
                status:item.status==1?2:1
            };
            imuser.userDisable(ptdata).then(res=>{
                if(res.ok){
                    successTips("修改成功");
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/usermanage.less";
</style>