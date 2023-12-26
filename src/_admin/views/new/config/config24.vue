.<template>
    <div class="commonright container">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">第24页</label>

                    <label class="filter-label">配置项</label>
                    <el-input type="text" clearable v-model="filters.searchkey" placeholder="输入名称/参数名"></el-input>
                </div>
                <!-- <div class="filter-item">
                    <label class="filter-label">配置项</label>
                    <el-input type="text" clearable v-model="filters.searchkey1" placeholder="输入名称/参数名"></el-input>
                </div> -->
                <div class="filter-item">
                    <label class="filter-label">类型</label>
                    <el-select v-model="filters.type" clearable placeholder="全部">
                        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getData()" >查询</button>
                    <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <el-table  :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="序号" width="80" type="index" :align="$protovar.align" :index="indexMethod" ></el-table-column>
                    <el-table-column label="配置项名称" prop="title"></el-table-column>
                    <el-table-column label="参数名" prop="name"></el-table-column>
                    <el-table-column label="参数值" prop="value"></el-table-column>
                    <el-table-column label="单位"  prop="unit" width="150">
                    </el-table-column>
                    <el-table-column label="类型" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.type==1?'系统':'业务'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.updatetime.substring(0,16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  width="150" v-if="authdisable">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="setData('edit',scope.row)">编辑</span>
                        </template>
                    </el-table-column>
                </el-table>
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
import {mgconfs,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                searchkey1:'24',
                type:''
            },
            data:{//数据表格
                loading:false,//表单loading
                list:[],//列表
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
                        res=await mgconfs.mgConfUpdate2(postdata);
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