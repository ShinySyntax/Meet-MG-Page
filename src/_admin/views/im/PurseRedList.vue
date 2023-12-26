<template>
    <div class="commonright container groupChatMage">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">用户</label>
                <el-input type="text" clearable v-model="filters.searchkey" placeholder="昵称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">订单号</label>
                <el-input type="text" clearable v-model="filters.orderno" placeholder="订单号"></el-input>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
            
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
              <el-table-column label="流水单号" prop="reqid" :align="$protovar.align" width="260">
                  <template slot-scope="scope" >
                  {{scope.row.merorderid}}
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
                              <span class="color_999">UID:{{scope.row.id}} </span>
                              <span class="color_999">ID:{{scope.row.tiono}} </span>
                              <span class="color_999">手机号:{{scope.row.phone}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="接收用户/群聊" :align="$protovar.align" width="220">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image :src="scope.row.receiveavatar" class="imgcol tmopera">
                                <div slot="error" class="image-slot">
                                      <img src="~@_/assets/img/im/avatar.jpg" class="error-img"/>
                                  </div>
                              </el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick color_666">{{scope.row.tousernick||scope.row.groupname}}</span>
                              <span class="color_999">{{scope.row.touid?'ID':'群ID'}}:{{scope.row.tousertiono||scope.row.groupid}} </span>
                              <span class="color_999">{{scope.row.touid}}</span>
                              <span class="color_999">{{scope.row.touid?'手机号':''}}{{scope.row.touphone}}</span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="类型" :align="$protovar.align" width="180">
                    <template slot-scope="scope">
                        <span>{{scope.row.chatmode==1?'单聊红包':scope.row.chatmode==1?'普通紅包':scope.row.chatmode==2?'手气红包':scope.row.chatmode==3?'专属紅包':'不知道是什么红包'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" :align="$protovar.align" width="180">
                    <template slot-scope="scope">
                        <span >￥{{scope.row.cny/100||0}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="数量" prop="num" :align="$protovar.align"  width="180">
                     <template slot-scope="scope" >
                         {{scope.row.acceptnum}}/
                         {{scope.row.num}}
                     </template>
                 </el-table-column>
                <el-table-column label="状态" :align="$protovar.align" width="180">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div class="flex_center_center">
                              <span>{{scope.row.status==1?'发送中':scope.row.status==2?'初始化':scope.row.status==3?'支付中':scope.row.status==4?'支付确认中':scope.row.status==5?'正常结束':scope.row.status==6?'超时结束':scope.row.status==7?'取消结束':scope.row.status==8?'失败'
                               :''}}</span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
<!--                <el-table-column label="数量" prop="num" :align="$protovar.align"  width="180">-->
<!--                    <template slot-scope="scope" >-->
<!--                        {{scope.row.acceptnum}}/-->
<!--                        {{scope.row.num}}-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column label="发送时间" sortable prop="time" :align="$protovar.align"  width="180">
                    <template slot-scope="scope">
                        <div class="userInfo">
                            <span class="color_666">{{scope.row.starttimeday||'-'}} </span>
                            <span class="color_666">{{scope.row.starttime||'-'}} </span>
                        </div>
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
                orderno:''
            },
            data:{//数据表格
                pageNumber:1,
                pageSize:10,
                totalRow:0,//总条数
                loading:false,//表单loading
                list:[],//列表
                pagesizes:[10,20,30,40]
            },
            curroute:'',
   
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
            redPrurse.redlist(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                            item.useravatar=resUrl(item.useravatar);
                            item.receiveavatar=resUrl(item.touseravatar||item.groupavatar);
                            item.starttimeday = btDate(item.starttime)
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