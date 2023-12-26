<template>
    <div class="commonright container groupChatMage">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">流水号</label>
                <el-input type="text" clearable v-model="filters.orderno" placeholder="流水号"></el-input>
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
              <el-table-column label="流水单号"  :align="$protovar.align" width="280">
                <template slot-scope="scope" >

                <span>{{scope.row.merorderid||'流水单号为空'}}</span>
                </template>

              </el-table-column>
              <el-table-column label="用户" :align="$protovar.align" width="220">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image :src="scope.row.avatar" class="imgcol tmopera">
                                <div slot="error" class="image-slot">
                                      <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                  </div>
                              </el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick color_666">{{scope.row.nick}} </span>
                              <span class="color_999">UID:{{scope.row.uid}} </span>
                              <span class="color_999">ID:{{scope.row.tiono}} </span>
                              <span class="color_999">手机号:{{scope.row.phone}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="充值金额" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.amount||0}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="充值方式" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.paytype==1?'微信':scope.row.paytype==2?'支付宝':scope.row.paytype==3?'银行卡':''}}
                            {{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="银行/卡号" :align="$protovar.align" width="210">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div class="userInfo">
                              <span>{{scope.row.bankname}}</span>
                              <span class="userInfo-nick color_666">{{scope.row.cardno}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" :align="$protovar.align" width="200">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div class="flex_center_center">
                              <span :class="['statuIcon',scope.row.status==-1?'statuyellow':scope.row.status==1?'statuGreen':scope.row.status==2?'statublue':scope.row.status==3?'statuRed':'']"></span>
                              <span>{{scope.row.status==-1?'处理中':scope.row.status==1?'成功':scope.row.status==2?'确认':scope.row.status==3?'失败':''}}</span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="提交时间" sortable prop="time" :align="$protovar.align" width="250">
                    <template slot-scope="scope">
                         <span class="color_666">{{scope.row.createtime||'-'}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="到账时间" sortable prop="time" :align="$protovar.align" width="250">
                    <template slot-scope="scope">
                        <span class="color_666">{{scope.row.updatetime||'-'}} </span>
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
import {redPrurse,msgTips,successTips} from '@_/axios/path';
import {resUrl,btDate} from '@_/utils/common.js';
export default {
    data(){
        return {
            filters:{
                searchkey:'',
                orderno:'',
                status:'',
            },
            statusSelect:[
              {id:-1,label:'处理中'},
              {id:1,label:'成功'},
              {id:2,label:'确认'},
              {id:3,label:'失败'}
              ],
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            curroute:'',
            visible:{
              complaintShow:false,//投诉记录
            },
            groupid:'',//群id
            grouprowdata:{},//选中的群消息
            refresh:false
        }
    },
    mounted(){
        this.curroute=this.$route.path;
        this.filters.searchkey=this.$route.query.uid||'';
        this.getData();
    },
    watch: {
        '$route'(to,from){
            if(to.path==this.curroute){
                let query=to.query;
                if(query.uid){
                    Object.assign(this.$data, this.$options.data());
                    this.filters.searchkey=query.uid||'';
                    this.curroute=this.$route.path;
                    this.getData();
                    return;
                }
                if(this.$protovar.routehasopen!=-1&&!query.random){
                    return;
                }
                Object.assign(this.$data, this.$options.data());
                this.curroute=this.$route.path;
                this.getData();
            }
        }
    },

    methods:{
        /* 用户账户 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            redPrurse.rechargelist(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                            item.useravatar=resUrl(item.useravatar);
                            item.forbiddenflag= item.forbiddenflag==1?'已开启':'关闭'
                            item.createtimeday = btDate(item.createtime)
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
@import "~@_/assets/style/less/im/PurseComm.less";
</style>