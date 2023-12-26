<template>
    <div class="commonright container">
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">企业</label>
                <el-select v-model="filters.cmpid" clearable>
                    <el-option v-for="item in cmpList" :key="item.id" :value="item.id" :label="item.cmpname"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData">查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="简历ID" prop="id" :align="$protovar.align"></el-table-column>
                <el-table-column label="企业名称" prop="cmpname" :align="$protovar.align"></el-table-column>
                <el-table-column label="岗位类型" prop="ptype" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="职位名称" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span class="tmopera" @click="toRctPost(scope.row)">{{scope.row.postname}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工作地点" prop="postcity" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="薪资" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.salaryview||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="name" :align="$protovar.align"></el-table-column>
                <el-table-column label="性别" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.sex==1?'男':'女'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="电话" prop="phone" :align="$protovar.align"></el-table-column>
                <el-table-column label="邮箱" prop="email" :align="$protovar.align"></el-table-column>
                <el-table-column label="简历附件" :align="$protovar.align">
                    <template slot-scope="scope">
                        <!-- <a class="tmopera" :href="scope.row.resumeurl" target="_blank">下载</a> -->
                        <span class="tmopera" @click="downRecruit(scope.row)">下载</span>
                    </template>
                </el-table-column>
                <el-table-column label="投递时间" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.createtime.substring(0,11)}}</span>
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
    </div>
</template>
<script>
import {recruit,mgdictChild,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
import {getFile} from '@/_admin/axios/http';
export default {
    data(){
        return {
            filters:{//筛选表单
                cmpid:'',
                postname:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            cmpList:[],
            typeList:[],
            curroute: ''
        }
    },
	async created(){
        this.filters.cmpid=parseInt(this.$route.query.cmpid)||'';
        this.curroute=this.$route.path;
        await this.dictList();
        this.getData();
       
    },
    watch:{
        async '$route'(to,from){
            if(to.path==this.curroute){
                let cmpid=to.query.cmpid;
                let postname=to.query.postname;
                if(cmpid){
                    this.filters.cmpid=parseInt(cmpid);
                        if(postname){
                        this.filters.postname=postname;
                    }
                    this.getData();
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!to.query.random){
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
            recruit.resumeQueryList(ptdata).then(res=>{
                if(res.ok){
                     let data=res.data;
                    this.data.totalRow=data.totalRow;
                    let list=data.list;
                    //处理岗位类型
                    list.map(v=>{
                        this.typeList.map(item=>{
                            if(v.posttype==item.code){
                                v.ptype=item.name;
                            }
                        })
                        v.resumeurl=resUrl(v.resumeurl);
                    })
                    this.data.list=list||[];
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
        /* 企业字典列表 */
        async dictList(){
            recruit.cmpDictList().then(res=>{
                if(res.ok){
                    this.cmpList=res.data;
                }
            })
            let res=await mgdictChild({pcode:'posttype'});
            if(res.ok){
                this.typeList=res.data;
            }
        },
        /* 岗位 */
        toRctPost(item){
            this.$router.push({"path":'/recruitcpost',"query":{"cmpid":item.cmpid,"postname":item.postname}})
        },
        /* 下载 */
        downRecruit(item){
            let url=item.resumeurl;
            getFile(url).then(res=>{
                let a = document.createElement('a');
                let url = window.URL.createObjectURL(res);
                a.href = url;
                //钛特云_web前端工程师_杭州新加坡科技园3幢412_刘艳君_缺省电话_20200818143826
                let {cmpname,postname,postcity,name,phone}=item;
                let fname="";
                fname+=cmpname+'_'+postname+'_'+postcity+'_'+name+'_'+phone+'_'+this.getCurrentDate()
                fname+=item.resumeurl.substring(item.resumeurl.lastIndexOf("."));//文件扩展名
                a.download=fname;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        },
        /* 当前日期 */
        getCurrentDate() {
            let now = new Date();
            let year = now.getFullYear(), //年份
                month = now.getMonth(),//月份
                date = now.getDate(),//日期
                hour = now.getHours(),//小时
                minu = now.getMinutes(),//分钟
                sec = now.getSeconds();//秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;

            let time = year+month+date+hour+minu+sec;
            return time;
        },
    },
    
}
</script>

