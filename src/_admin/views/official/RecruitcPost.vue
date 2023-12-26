<template>
    <div class="commonright container">
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">企业</label>
                <el-select v-model="filters.cmpid" clearable>
                    <el-option v-for="item in cmpList" :key="item.id" :value="item.id" :label="item.cmpname"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">职位</label>
                <el-input type="text" clearable v-model="filters.postname"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" clearable placeholder="全部">
                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData">查询</button>
                <button class="primarybtn" v-auth="'add'" @click="setData('add')">新增</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="职位ID" prop="id" :align="$protovar.align"></el-table-column>
                <el-table-column label="企业" prop="cmpname" :align="$protovar.align"></el-table-column>
                <el-table-column label="岗位类型" prop="ptype" :align="$protovar.align"></el-table-column>
                <el-table-column label="职位名称" :align="$protovar.align" prop="postname">
                </el-table-column>
                <el-table-column label="工作地点" prop="postcity" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="薪资" prop="salaryview" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="职位要求" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="overell">{{scope.row.jobrequire}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工作职责" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="overell">{{scope.row.workduty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.publishtime.substring(0,11)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="职位状态" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.status==1?'已发布':'已下架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="企业状态" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.cmpstatus==1?'有效':'无效'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收到简历" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="scope.row.submitnum>0" class="tmopera" @click="toRctRsm(scope.row)">{{scope.row.submitnum}}份</span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  :align="$protovar.align" width="200" v-if="authdisable">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="setDisable(scope.row,1,'发布')" v-auth="'pubs'">发布</span>
                        <span class="tmopera" @click="setData('edit',scope.row)" v-auth="'update'">修改</span>
                        <span class="tmopera" @click="setDisable(scope.row,scope.row.status==1?2:1)" v-auth="'disable'">{{scope.row.status==1?'下架':'上架'}}</span>
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
        <!-- 新增|编辑 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="企业" prop="cmpid">
                       <el-select v-model="dialog.form.cmpid">
                            <el-option v-for="item in cmpList" :key="item.id" :value="item.id" :label="item.cmpname"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="岗位类型" prop="posttype">
                       <!--  <el-input v-model="dialog.form.posttype"></el-input> -->
                        <el-select v-model="dialog.form.posttype">
                            <el-option v-for="item in typeList" :key="item.id" :value="item.code" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="职位名称" prop="postname">
                       <el-input v-model="dialog.form.postname" name="postname"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="工作地点" prop="postcity">
                       <el-input v-model="dialog.form.postcity" name="postcity"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="薪资" prop="salaryview">
                       <el-input v-model="dialog.form.salaryview" name="salaryview"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="职位要求" prop="jobrequire">
                        <el-input v-model="dialog.form.jobrequire" name="jobrequire" type="textarea"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="工作职责" prop="workduty">
                        <el-input v-model="dialog.form.workduty" name="workduty" type="textarea"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="dialog.form.status">
                            <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <input type="hidden" v-model="dialog.form.id" name="id" v-if="dialog.type=='edit'"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('dialog','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit" :disabled="loading">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {recruit,mgdictChild,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{//筛选表单
                cmpid:'',
                postname:'',
                status:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            dialog:{
                type:'add',
                visible:false,
                title:'',
                form:{},
                rules:{
                    postname: [
                        {required: true,message: "请输入岗位名称",trigger: "blur"}
                    ],
                    postcity: [
                        {required: true,message: "请输入工作地点",trigger: "blur"}
                    ],
                    salaryview:[
                        {required: true,message: "请输入薪资",trigger: "blur"}
                    ],
                    jobrequire:[
                        {required: true,message: "请输入职位要求",trigger: "blur"}
                    ],
                    workduty:[
                        {required: true,message: "请输入工作职责",trigger: "blur"}
                    ],
                    cmpid:[
                        { required: true, message: '请选择企业', trigger: 'change' }
                    ],
                    posttype:[
                        { required: true, message: '请选择岗位类型', trigger: 'change' }
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                }
            },
            cmpList:[],//企业列表
            typeList:[],//岗位类型
            statusSelect:[{id:1,label:'发布'},{id:2,label:'下架'}],
            loading:false,
            curroute: ''
        }
    },
	async created(){
        this.curroute=this.$route.path;
        await this.dictList();
        this.filters.cmpid=parseInt(this.$route.query.cmpid)||'';
        this.filters.postname=this.$route.query.postname||'';
        if(this.filters.cmpid){
            this.filters.status=1;
        }
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['pubs','update','disable']);
        }
    },
    watch:{
        async '$route'(to,from){
            if(to.path==this.curroute){
                let query=to.query;
                let cmpid=query.cmpid;
                let postname=query.postname;
                if(cmpid){
                    this.filters.cmpid=parseInt(cmpid);
                    if(postname){
                        this.filters.postname=postname;
                    }
                    this.filters.status=1;
                    this.getData();
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                await this.dictList();
                this.getData();
            }
        }
    },
    methods:{
        /* 查询列表 */
        getData(){
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            recruit.recruitQueryList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        //处理岗位类型
                        list.map(v=>{
                            this.typeList.map(item=>{
                                if(v.posttype==item.code){
                                    v.ptype=item.name;
                                }
                            })
                        })
                        this.data.list=list||[];
                    }
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
        /* 序号 */
        indexMethod(index) {
            return this.data.pageSize * (this.data.pageNumber-1) + (index+1);
        },
        /* 企业字典列表 /岗位类型列表 */
        async dictList(){
            await recruit.cmpDictList().then(res=>{
                if(res.ok){
                    this.cmpList=res.data;
                }
            })
            let res=await mgdictChild({pcode:'posttype'});
            if(res.ok){
                this.typeList=res.data;
            }
        },
        /* 新增|编辑 */
        setData(type,item){
            this.dialog.visible=true;
            this.dialog.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.dialog.title='新增招聘';
                this.dialog.form=this.$options.data().dialog.form;
            }
            if(type=="edit"){
                this.dialog.title='修改招聘';
                let data={...item};
                this.dialog.form=data;
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
                    let {posttype,cmpid,status}=this.dialog.form;
                    postdata=$("#form").serialize()+`&posttype=${posttype}&cmpid=${cmpid}&status=${status}`;
                    /* 新增 */
                    if(type=="add"){
                        res=await recruit.recruitAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await recruit.recruitUpdate(postdata);
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
        /* 启用|禁用 */
        setDisable(item,status,type){
            let ptdata={
                rid:item.id,
                status:status
            };
            type=type||'修改';
            recruit.recruitDisable(ptdata).then(res=>{
                if(res.ok){
                    successTips(type+"成功");
                    this.getData();
                }else{
                    msgTips(res);
                }
            })
        },
        /* 已发布职位 */
        toRctPost(){
            this.$router.push({"path":'/recruitcpost',"query":{"id":1}})
        },
        /* 已投递简历 */
        toRctRsm(item){
            this.$router.push({"path":'/recruitcresume',"query":{"cmpid":item.cmpid,"postname":item.postname}})
        },
    }
}
</script>

