.<template>
    <div class="commonright container">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">第38页</label>

                    <label class="filter-label">数据库备份到oss</label>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <button style="width:150px;height:30px;background:rgba(127, 150, 190, 0.49)" @click="startmg()" >开始备份mg</button>
                <label class="filter-label">备份地址：{{this.data.uploadMgResult}}</label>
            </div>
            <div class="contentpad">
                <button style="width:150px;height:30px;background:rgba(127, 150, 190, 0.49)" @click="startconf()" >开始备份config</button>
                <label class="filter-label">备份地址：{{this.data.uploadConfResult}}</label>
            </div>
            <div class="contentpad">
                <button style="width:150px;height:30px;background:rgba(127, 150, 190, 0.49)" @click="startmain()" >开始备份main</button>
                <label class="filter-label">备份地址：{{this.data.uploadMainResult}}</label>
            </div>
            <div class="contentpad">
                <button style="width:150px;height:30px;background:rgba(127, 150, 190, 0.49)" @click="startstate()">开始备份state</button>
                <label class="filter-label">备份地址：{{this.data.uploadStateResult}}</label>
            </div>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="配置项名称" prop="title">
                        <el-input  type="textarea" v-model="dialog.form.title" name="title" ></el-input>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="参数名" prop="name">
                        <el-input v-model="dialog.form.name" name="name" :disabled="dialog.type=='edit'?true:false"></el-input>
                        <input type="hidden" v-if="dialog.type=='edit'" name="name" v-model="dialog.form.name"/>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="参数值" prop="value">
                        <el-input type="textarea" v-model="dialog.form.value" name="value" ></el-input>
                        <!-- <textarea v-model="dialog.form.value" name="value" id="" cols="30" rows="10"></textarea> -->

                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="dialog.form.unit" name="unit"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="dialog.form.type">
                            <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="页码" prop="page">
                        <el-input v-model="dialog.form.page" name="page"></el-input>
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
import {backup,msgTips,successTips} from '@_/axios/path';

export default {
    data(){
        return {
            filters:{
                searchkey:'',
                searchkey1:'38',
                type:''
            },
            data:{//数据表格
                loading:false,//表单loading
                list:[],//列表
                uploadMgResult:"",
                uploadConfResult:"",
                uploadMainResult:"",
                uploadStateResult:"",
            },
            dialog:{
                type:'add',
                title:'',
                visible:false,
                form:{
                },
                page:'',
                rules:{
                    title: [
                        {required: true,message: "请输入配置项名称",trigger: "blur"}
                    ],
                    name: [
                        {required: true,message: "请输入参数名",trigger: "blur"}
                    ],
                    value:[
                        {required: true,message: "请输入参数值",trigger: "blur"}
                    ],
                    // unit:[ {required: true,message: "请输入参数单位",trigger: "blur"}],
                    type:[
                        { required: true, message: '请选择参数类型', trigger: 'change' }
                    ],
                    page:[
                        { required: true, message: '请选择页码', trigger: 'blur' }
                    ],
                }
            },
            typeList:[{id:1,label:"系统"},{id:2,label:"业务"}],
            loading:false,
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getData();
    },
    computed:{
        authdisable(){
            return this.authDisable(['update']);
        }
    },
    watch:{
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
        startmg() {
            this.data.loading=true;
            let ptdata={type:1};
            backup.backupDb(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.uploadMgResult = data.data
                    }
                    successTips("备份成功")
                }else{
                    msgTips("备份失败");
                }
                this.data.loading=false;
            })
        },
        startconf() {
            this.data.loading=true;
            let ptdata={type:2};
            backup.backupDb(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.uploadConfResult = data.data
                    }
                    successTips("备份成功")
                }else{
                    msgTips("备份失败");
                }
                this.data.loading=false;
            })
        },
        startmain() {
            this.data.loading=true;
            let ptdata={type:3};
            backup.backupDb(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.uploadMainResult = data.data
                    }
                    successTips("备份成功")
                }else{
                    msgTips("备份失败");
                }
                this.data.loading=false;
            })
        },
        startstate() {
            this.data.loading=true;
            let ptdata={type:4};
            backup.backupDb(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.uploadStateResult = data.data
                    }
                    successTips("备份成功")
                }else{
                    msgTips("备份失败");
                }
                this.data.loading=false;
            })
        },
        /* 序号 */
        indexMethod(index) {
            return (index+1);
        },
        /* 用户数据 */
        getData(){
            this.data.loading=true;
            let ptdata={searchkey:this.filters.searchkey,searchkey1:this.filters.searchkey1,type:this.filters.type};
            mgconfs.mgConfLists(ptdata).then(res=>{
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
        /* 提交表单 */
        formSubmit(){
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading=true;
                    let type=this.dialog.type;
                    let res,postdata;
                    postdata=$("#form").serialize()+`&type=${this.dialog.form.type}`;
                    /* 新增 */
                    if(type=="add"){
                        res=await mgconfs.mgConfAdd(postdata);
                    }
                    /* 修改 */
                    if(type=="edit"){
                        res=await mgconfs.mgConfUpdate(postdata);
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
                this.dialog.title="新增配置项";
            }
            if(type=="edit"){
                let data={...item};
                this.dialog.form=data;
                this.dialog.title="编辑配置项";
            }
        },
    },
}
</script>