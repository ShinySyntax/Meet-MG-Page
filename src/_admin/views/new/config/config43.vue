.<template>
    <div class="commonright container">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">第43页</label>

                </div>
                <!-- <div class="filter-item">
                    <label class="filter-label">配置项</label>
                    <el-input type="text" clearable v-model="filters.searchkey1" placeholder="输入名称/参数名"></el-input>
                </div> -->
                <div class="filter-btn">
                    <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <el-table  :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="序号" width="80" type="index" :align="$protovar.align" :index="indexMethod" ></el-table-column>
                    <el-table-column label="敏感词" prop="word"></el-table-column>
                    
                    <el-table-column label="操作"  width="150" v-if="authdisable">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="del(scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">新增敏感词</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="敏感词" prop="title">
                        <el-input  type="textarea" v-model="dialog.form.title" name="title" ></el-input>
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
import {sensitiveword,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                searchkey1:'43',
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
                        {required: true,message: "请输入敏感词",trigger: "blur"}
                    ]
                    
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
            let ptdata={};
            sensitiveword.getList(ptdata).then(res=>{
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
            this.loading=true;
            /* 新增 */
            let pdata = {word:this.dialog.form.title};
            sensitiveword.add(pdata).then(res=>{
                if(res.ok){
                    this.dialog.visible=false;
                    successTips("保存成功");
                    this.dialog.form=this.$options.data().dialog.form;
                    this.getData();
                }else{
                    msgTips(res); 
                }
            })
            
            this.loading=false;
        },
        /**
         * 删除
         */
        del(item) {
            this.loading=true;
            /* 新增 */
            let pdata = {id:item.id};
            sensitiveword.del(pdata).then(res=>{
                if(res.ok){
                    this.dialog.visible=false;
                    successTips("删除成功");
                    this.dialog.form=this.$options.data().dialog.form;
                    this.getData();
                }else{
                    msgTips(res); 
                }
            })
            
            this.loading=false;
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