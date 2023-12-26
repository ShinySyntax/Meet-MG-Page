<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称/ID"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">IP</label>
                <el-input type="text" clearable v-model="filters.ip" placeholder="IP地址"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">角色</label>
                <el-select v-model="filters.rid" clearable placeholder="全部">
                    <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">时间</label>
                <el-date-picker v-model="filters.starttime" type="date" placeholder="开始时间"  value-format="yyyyMMdd">
                </el-date-picker>
                <label class="filter-label fl-date-left">至</label>
                <el-date-picker v-model="filters.endtime" type="date" placeholder="结束时间" value-format="yyyyMMdd">
                </el-date-picker>
                </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table height="620" :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="ID" prop="mguid" :align="$protovar.align" width="100"></el-table-column>
                <el-table-column label="用户名" prop="loginname" :align="$protovar.align" ></el-table-column>
                <el-table-column label="昵称" prop="nick" :align="$protovar.align" width="100"></el-table-column>
                <el-table-column label="所属角色" prop="rolename" show-overflow-tooltip :align="$protovar.align"></el-table-column>
                <el-table-column label="地区/IP" width="240" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-show="scope.row.region">{{scope.row.region}}</span><br>
                        <a class="a_ip" v-if="scope.row.ip" :href="`https://www.baidu.com/s?wd=${scope.row.ip}&from=t-io`"  target="_blank">{{scope.row.ip}} </a>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column label="设备信息" prop="deviceinfo" :align="$protovar.align"></el-table-column>
                <el-table-column label="登录时间" prop="createtime" :align="$protovar.align"></el-table-column>
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
import {logsts,mgRoleDictList,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                ip:'',
                starttime:'',
                endtime:'',
                rid:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            roleList:[],
            curroute:''
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.getRolelist();
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
                this. getRolelist();
                this.getData();
            }
        }
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
            logsts.loginList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        let reg=/AppleWebKit\/.*(KHTML, like Gecko)/ig;
                        list.map(item=>{
                            // {{scope.row.devicetype==1?'PC':(scope.row.devicetype==4?'H5':'WEB')}}
                            // item.deviceinfo=item.deviceinfo.replace(reg,'');
                            item.province = item.province ||''
                            item.city = item.city ||''
                            item.region = item.province+' '+item.city
                            item.deviceinfo=item.deviceinfo.replace(reg,'')
                            let type='';
                            switch(item.devicetype){
                                case 1:
                                    type="PC";
                                break;
                                case 2:
                                    type="安卓";
                                break;
                                case 3:
                                    type="IOS";
                                break;
                                case 4:
                                    type="H5";
                                break;
                                case 5:
                                    type="APP";
                                break;
                            }
                             item.devicetype=type; 
                        })
                        this.data.list=list||[];
                        window.scrollTo(0,0);
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
        }
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/im/usermanage.less";
</style>