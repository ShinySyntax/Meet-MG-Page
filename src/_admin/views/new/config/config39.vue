.<template>
    <div class="commonright container">
            <div class="filter">
                <div class="filter-item">
                    <label class="filter-label">第39页</label>

                   
                </div>
                
                <div class="filter-btn">
                    <button class="primarybtn search" @click="getData()" >查询</button>
                    <button class="primarybtn" @click="setData('add')" v-auth="'add'">新增</button>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <el-table  :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="序号" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="规则" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.type}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="抢红包用户id" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.userId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="群组id" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.groupId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="修改金额" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.modifyMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否可用" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.isUsed=='0'?'可用':'已使用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否有效" width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.deleted=='0'?'有效':'无效'}}</span>
                        </template>
                    </el-table-column>

                    
                    <el-table-column label="操作"  width="150" v-if="authdisable">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="setData('edit',scope.row)">编辑</span>
                            <span class="tmopera" @click="deleteClick(scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <!-- 新增|编辑框 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{dialog.title}}</p>
            <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="form">
                <div class="tmcol">
                    <el-form-item label="规则" prop="type">
                        <el-select v-model="dialog.form.type">
                            <el-option v-for="item in ruleList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                        
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="抢红包用户id" prop="userId">
                        <el-input v-model="dialog.form.userId" name="userId" :disabled="dialog.type=='edit'?true:false"></el-input>
                        <input type="hidden" v-if="dialog.type=='edit'" name="userId" v-model="dialog.form.userId"/>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="群组id" prop="groupId">
                        <el-input type="textarea" v-model="dialog.form.groupId" name="groupId" ></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="修改金额" prop="modifyMoney">
                        <el-input v-model="dialog.form.modifyMoney" name="modifyMoney"></el-input>
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
import {redModifyRules} from '@_/axios/path';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                searchkey1:'39',
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
                    type: [
                        {required: true,message: "请输入规则id",trigger: "blur"}
                    ],
                    userId: [
                        {required: true,message: "请输入抢红包用户id",trigger: "blur"}
                    ],
                    groupId:[
                        {required: true,message: "请输入群组id",trigger: "blur"}
                    ],
                    modifyMoney:[ {required: true,message: "请输入修改的金额",trigger: "blur"}]
                }
            },
            typeList:[{id:1,label:"系统"},{id:2,label:"业务"}],
            ruleList:[{id:1, label:"规则1"}],
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
            //let ptdata={searchkey:this.filters.searchkey,searchkey1:this.filters.searchkey1,type:this.filters.type};
            let ptdata = {};
            redModifyRules.getList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.list=data;
                    } else {
                        this.data.list = [];
                    }
                }else{
                    msgTips(res);
                }
                this.data.loading=false;
            })
        },
        // 删除
        deleteClick(item) {
            this.data.loading=true;
            let ptdata = {id:item.id}
            redModifyRules.delete(ptdata).then(res=>{
                if(res.ok){
                    this.getData();
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
                    let res,postdata;
                    //postdata=$("#form").serialize()+`&type=${this.dialog.form.type}`;
                    /* 新增 */
                    //if(type=="add"){
                    //    res=await mgconfs.mgConfAdd(postdata);
                    //}
                    /* 修改 */
                    //if(type=="edit"){
                    //    res=await mgconfs.mgConfUpdate(postdata);
                    //}
                    postdata = {type:this.dialog.form.type,userId:this.dialog.form.userId,groupId:this.dialog.form.groupId,modifyMoney:this.dialog.form.modifyMoney};
                    res=await redModifyRules.add(postdata);

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