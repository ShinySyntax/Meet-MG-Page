<template>
    <el-dialog :visible.sync="show" :close-on-click-modal="false" class="tmdialog setdialog" :width="$protovar.dtbwidth" :before-close="closeInfo">
        <div class="tmheader">
            报销单
        </div>
        <div class="dialogpad">
            <div class="content-head">
                <span>
                    <label>报销单号</label>
                    {{info.code}}
                </span>
                <span>
                    <label>合计人民币</label> 
                    <b>{{info.amount}}</b>
                </span>
            </div>
            <el-table :data="list"  :header-cell-style="{background:$protovar.tbhabg}">
                <el-table-column label="日期" prop="uploadtime" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="费用类别" prop="costtype" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="报销内容" prop="name" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="单据张数" :align="$protovar.align">
                    <template>
                        1
                    </template>
                </el-table-column>
                <el-table-column label="金额" prop="amount" :align="$protovar.align">
                </el-table-column>
                <el-table-column label="备注" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span>{{scope.row.remark?scope.row.remark:'--'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="reimman">
                <label class="reiman-label">报销人</label>
                <span>{{info.nick}}</span>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import {reimb,msgTips,successTips} from '@_/axios/path';
import {resUrl} from '@_/utils/common.js';
export default {
    props:['code','show'],
    data(){
        return{
            info:{},
            list:[]
        }
    },
    watch:{
        show(nv,ol){
            if(nv){
                this.getReimBurseInfo();
            }
        }
    },
    methods:{
        /* 报销单基础信息 */
        getReimBurseInfo(){
            reimb.reimBurseInfo({code:this.code}).then(res=>{
                if(res.ok){
                    this.info=res.data;
                    this.getInvoiceList();
                }else{
                    msgTips(res);
                }
            });
        },
        /* 发票列表-报销单内 */
        getInvoiceList(){
            let ptdata={pageNumber:1,pageSize:99,code:this.info.code};
            reimb.invoiceReimBurseList(ptdata).then(res=>{
                if(res.ok){
                    let list=res.data.list;
                    list.map(item=>{
                        item.rmshow=false;
                        item.uremark=item.remark;
                        item.amount=item.amount.toFixed(2);
                    })
                    this.list=list;
                }else{
                    msgTips(res);
                }
            })
        },
        closeInfo(){
            this.$emit("closeInfo");
        }
    }

}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/reimmanage.less";
</style>