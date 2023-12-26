<template>
    <div class="commonright container">
        <div class="filter flexbox">
            <el-input type="textarea" :rows="6" v-model="filters.sql" placeholder="请输入查询语句" class="sql">
            </el-input>
            <div class="filter-right">
                <div class="filter-item">
                    <label class="filter-label">数据库</label>
                    <el-select v-model="filters.db">
                        <el-option v-for="item in dbList" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                </div>
                <div class="checkleft"><el-checkbox  v-model="filters.groupby">groupby</el-checkbox></div>
                <div class="filter-item">
                    <button class="primarybtn" @click="getSqlQuery(1)">查询</button>
                </div>
            </div>
        </div>
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}" border>
                <el-table-column :label="v" :prop="v" align="center" v-for="(v,index) in data.keys" :key="index" show-overflow-tooltip>
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
    </div>
</template>
<script>
import {sqlQuery,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return{
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                keys:[],//表头
                pagesizes:[10,20,30,40]
            },
            filters:{
                sql:'',
                db:'tio_site_main',
                groupby:false
            },
            dbList:['tio_site_main','tio_site_conf','tio_site_stat','tio_mg'],
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
    },
    watch:{
        '$route'(to,from){
            if(to.path==this.curroute){
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
            }
        }
    },
    methods:{
        /* 获取数据库搜索 */
        getSqlQuery(item){
            let {db,sql}=this.filters;
            if(sql==''){
                msgTips("请输入查询语句");
                return;
            }
            if(item){
                this.data.pageNumber=1;
            }
            let {pageNumber,pageSize}=this.data;
            let ptdata={
                pageNumber:pageNumber,
                pageSize:pageSize,
                groupby:this.filters.groupby?1:2,
                db:db,
                // sql:'select * from tio_order'
                sql:sql
            };
            sqlQuery(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    let page=data.page;
                    this.data.totalRow=page.totalRow;
                    let list=page.list;
                    this.data.list=list||[];
                    this.data.keys=data.columns;
                }else{
                    msgTips(res);
                }
            })
        },
         /* 切换分页 */
		handleCurrentChange(val){
            this.data.pageNumber = val;
            this.getSqlQuery();
        },
        /* 调整每页显示条数 */
        handleSizeChange(val) {
            this.data.pageNumber=1;
            this.data.pageSize=val;
            this.getSqlQuery();
        },
    }
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/system/sqlquery.less";
</style>