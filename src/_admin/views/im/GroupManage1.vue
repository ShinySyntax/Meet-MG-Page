<template>
    <div class="commonright container">
        <div v-show="type=='effect'" class="groupmanage">
            <div class="topcontainer">
                <div class="filter">
                    <div class="filter-item">
                        <label class="filter-label">群主</label>
                        <el-input type="text" clearable v-model="effect.filters.searchkey" placeholder="昵称/账号/ID"></el-input>
                    </div>
                    <div class="filter-item">
                        <label class="filter-label">群聊</label>
                        <el-input type="text" clearable v-model="effect.filters.groupkey" placeholder="群聊名称/群ID"></el-input>
                    </div>
                    <div class="filter-btn">
                        <button class="primarybtn search" @click="getData(1)">查询</button>
                    </div>
                </div>
                <div>
                    <el-radio v-model="type" label="effect" @change="getData">有效群</el-radio>
                    <el-radio v-model="type" label="del" @change="getData">无效群</el-radio>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <el-table :data="effect.data.list" v-loading="effect.data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="ID" prop="id" :align="$protovar.align"></el-table-column>
                    <el-table-column label="群名称" prop="name" :align="$protovar.align" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="overell">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前群主" :align="$protovar.align" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.usernick+'/'+scope.row.loginname}}
                        </template>
                    </el-table-column>
                    <el-table-column label="管理员" prop="mcount" :align="$protovar.align"></el-table-column>
                    <el-table-column label="成员人数" prop="gusercount" :align="$protovar.align"></el-table-column>
                    <el-table-column label="近3个月消息数" prop="msgcount" :align="$protovar.align"></el-table-column>
                    <el-table-column label="群信息" prop="id" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="seeInfo(scope.row)">查看</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="成员邀请状态" :align="$protovar.align">
                        <template slot-scope="scope">
                            {{scope.row.applyflag==1?'已开启':'已关闭'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="createtime" :align="$protovar.align">
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagecontainer" v-show="effect.data.totalRow>0">
                <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                    :page-size="effect.data.pageSize" 
                    :page-sizes="effect.data.pagesizes"  
                    :total="effect.data.totalRow"  
                    @current-change="handleCurrentChange" 
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>
        <div v-show="type=='del'" class="groupmanage">
            <div class="topcontainer">
                <div class="filter">
                    <div class="filter-item">
                        <label class="filter-label">群主</label>
                        <el-input type="text" clearable v-model="del.filters.searchkey" placeholder="昵称/账号/ID"></el-input>
                    </div>
                    <div class="filter-item">
                        <label class="filter-label">群聊</label>
                        <el-input type="text" clearable v-model="del.filters.groupkey" placeholder="群聊名称/群ID"></el-input>
                    </div>
                    <div class="filter-btn">
                        <button class="primarybtn search" @click="getData(1)">查询</button>
                    </div>
                </div>
                <div>
                    <el-radio v-model="type" label="effect" @change="getData">有效群</el-radio>
                    <el-radio v-model="type" label="del" @change="getData">无效群</el-radio>
                </div>
            </div>
            <!-- 数据表格 -->
            <div class="contentpad">
                <el-table :data="del.data.list" v-loading="del.data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="ID" prop="id" :align="$protovar.align"></el-table-column>
                    <el-table-column label="群名称" prop="name" :align="$protovar.align" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="overell">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="群主" :align="$protovar.align" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.usernick+'/'+scope.row.loginname}}
                        </template>
                    </el-table-column>
                    <el-table-column label="管理员" prop="mcount" :align="$protovar.align"></el-table-column>
                    <el-table-column label="成员人数" prop="gusercount" :align="$protovar.align"></el-table-column>
                    <el-table-column label="群信息" prop="id" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="seeInfo(scope.row)">查看</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="createtime" :align="$protovar.align"></el-table-column>
                    <el-table-column label="解散时间" prop="updatetime" :align="$protovar.align"></el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagecontainer" v-show="del.data.totalRow>0">
                <el-pagination layout="total,prev, pager, next,sizes,jumper" background
                    :page-size="del.data.pageSize" 
                    :page-sizes="del.data.pagesizes"  
                    :total="del.data.totalRow"  
                    @current-change="handleCurrentChange" 
                    @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>
        <!-- 用户详情 -->
        <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth" >
            <p class="tmheader">群聊信息</p>
            <el-form :label-width="$protovar.fmlabwidth" :hide-required-asterisk="true" class="dialogform">
                <div class="tmcol">
                    <el-form-item label="群名称：">
                        <span class="textlh">{{dialog.data.name}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="群简介：">
                         <span class="textlh">{{dialog.data.intro||'--'}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol">
                    <el-form-item label="群公告：">
                         <span class="textlh">{{dialog.data.notice||'--'}}</span>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {imchat,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            show:true,
            effect:{
                filters:{
                    searchkey:'',
                    groupkey:''
                },
                data:{//数据表格
                    pageNumber:1,
                    pageSize:10,
                    totalRow:0,//总条数
                    loading:false,//表单loading
                    list:[],//列表
                    pagesizes:[10,20,30,40]
                },
            },
            del:{
                filters:{
                    searchkey:'',
                    groupkey:''
                },
                data:{//数据表格
                    pageNumber:1,
                    pageSize:10,
                    totalRow:0,//总条数
                    loading:false,//表单loading
                    list:[],//列表
                    pagesizes:[10,20,30,40]
                },
            },
            dialog:{
                visible:false,
                data:{}
            },
            curroute:'',
            type:'effect'
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
        /* 群列表 */
        async getData(item,type){
            let key1=type||this.type;
            if(item){
                this[key1].data.pageNumber=item;
            }
            this[key1].data.loading=true;
            let {pageNumber,pageSize}=this[key1].data;
            let ptdata={...this[key1].filters,pageNumber,pageSize};
            let res;
            if(key1=="effect"){
                res=await imchat.groupReList(ptdata);
            }
            if(key1=="del"){
                res=await imchat.groupDelList(ptdata);
            }

            if(res.ok){
                let data=res.data;
                if(data){
                    this[key1].data.totalRow=data.totalRow;
                    let list=data.list;
                    this[key1].data.list=list;
                }
            }else{
                msgTips(res);
            }
            this[key1].data.loading=false;
        },
        /* 切换分页 */
        handleCurrentChange(val){
            this[this.type].data.pageNumber = val;
            this.getData();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this[this.type].data.pageNumber=1;
            this[this.type].data.pageSize=val;
            this.getData();
        },
        /* 查看 */
        seeInfo(item){
            this.dialog.visible=true;
            this.dialog.data=item;
        },
    }
}
</script>
<style lang="less" scoped>
.groupmanage{
    .flexcolumn;
    height:100%;
    .topcontainer{
        .flexbox;
        justify-content: space-between;
        background: #fff;
        margin-bottom:12px;
        border-radius: 4px;
        padding-right:20px;
        .filter{
            margin-bottom:0;
            padding-right:20px;
        }
    }
}
</style>

