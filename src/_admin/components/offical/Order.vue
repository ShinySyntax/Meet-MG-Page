<template>
    <div>
        <!-- 订单详情 -->
        <el-dialog :visible.sync="order.show&&order.type=='info'" :close-on-click-modal="false" class="tmdialog" :width="$protovar.dtfwidth" :before-close="handleClose">
            <p class="tmheader">订单详情</p>
             <el-form :label-width="$protovar.fmlabwidth" :hide-required-asterisk="true" class="dialogform">
                <div class="tmcol tmcol-half">
                    <el-form-item label="订单编号：">
                        <span class="textlh">{{order.form.orderno}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="联系人：">
                         <span class="textlh">{{order.form.bizname}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="电话：">
                         <span class="textlh">{{order.form.phone}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="邮箱：">
                         <span class="textlh">{{order.form.email}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="单位：">
                         <span class="textlh">{{order.form.cmpname}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="地址：">
                         <span class="textlh">{{order.form.addressdetail}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="订购产品：">
                         <span class="textlh">{{order.form.productname}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="产品类型：">
                         <span class="textlh">{{order.form.producttype==1?'源码':(order.form.producttype==2?'sdk':'--')}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="合同价：">
                         <span class="textlh">{{order.form.contractprice}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="返点：">
                         <span class="textlh">{{order.form.rebate}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="销售提成：">
                         <span class="textlh">{{order.form.commission}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="税前收入：">
                        <span class="textlh">{{order.form.entryprice}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="是否开票：">
                        <span class="textlh">{{order.form.invoiceflag==1?'是':(order.form.invoiceflag==2?'否':'')}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="发票抬头：">
                        <span class="textlh">{{order.form.invoicecmpname}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="税号：">
                        <span class="textlh">{{order.form.invoicecmpno}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="下单时间：">
                        <span class="textlh">{{order.form.ordertime}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="成交时间：">
                        <span class="textlh">{{order.form.entrytime}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="迭代版本：">
                        <span class="textlh">{{order.form.invoicecmpno}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="状态：">
                        <span class="textlh">{{order.form.status==1?'待付款':(order.form.status==2?'已完成':'--')}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="快递公司：">
                        <span class="textlh">{{order.form.deliverycmp}}</span>
                    </el-form-item>
                </div>
                <div class="tmcol tmcol-half">
                    <el-form-item label="快递单号：">
                        <span class="textlh">{{order.form.deliveryno}}</span>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <!-- 迭代记录 -->
        <el-dialog :visible.sync="order.show&&order.type=='iteration'" :close-on-click-modal="false" class="tmdialog setdialog" :width="$protovar.dtbwidth" :before-close="handleClose">
            <div class="tmheader">
                <span>迭代记录<span class="pagename">({{order.form.cmpname}})</span></span>
                <div class="opergrant fr">
                    <button class="primarybtn" @click="addEdit('add')" v-auth="'oadd'">
                        <i class="el-icon-plus"></i>
                        添加
                    </button>
                </div>
            </div>
            <div class="dialogpad">
                <el-table :data="iterat.list"  :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="日期" prop="aftersaletime" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.aftersaletime&&scope.row.aftersaletime.substring(0,11)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务端" prop="servicedesc" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="overell">
                                {{scope.row.servicedesc}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="IOS端" prop="iosdesc" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="overell">
                                {{scope.row.iosdesc}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="安卓端" prop="androiddesc" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="overell">
                                {{scope.row.androiddesc}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="PC端" prop="pcdesc" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="overell">
                                {{scope.row.pcdesc}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="H5端" prop="h5desc" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span class="overell">
                                {{scope.row.h5desc}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  :align="$protovar.align" width="200" v-if="authdisable">
                        <template slot-scope="scope">
                            <span class="tmopera" @click="addEdit('edit',scope.row)"  v-auth="'oupdate'">修改</span>
                         <span class="tmopera waring" @click="delClick(scope.row.id,'interat')" v-auth="'odel'">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 新增|编辑版本 -->
        <el-dialog :visible.sync="iterat.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
            <p class="tmheader">{{iterat.title}}</p>
            <el-form :model="iterat.form"  :label-width="$protovar.fmlabwidth" ref="form" :hide-required-asterisk="true" class="dialogform sdialogform" id="iteratform">
                <div class="tmcol">
                    <el-form-item label="后端" prop="servicedesc">
                        <el-input v-model="iterat.form.servicedesc" name="servicedesc" type="textarea"></el-input>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="IOS" prop="iosdesc">
                        <el-input v-model="iterat.form.iosdesc" name="iosdesc" type="textarea"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="安卓" prop="androiddesc">
                        <el-input v-model="iterat.form.androiddesc" name="androiddesc" type="textarea"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="PC" prop="pcdesc">
                        <el-input v-model="iterat.form.pcdesc" name="pcdesc" type="textarea"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="H5" prop="h5desc">
                        <el-input v-model="iterat.form.h5desc" name="h5desc" type="textarea"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="售后时间" prop="aftersaletime">
                        <el-date-picker v-model="iterat.form.aftersaletime" type="date" name="aftersaletime"></el-date-picker>
                    </el-form-item>
                </div> 
                <input type="hidden" name="id" :value="iterat.form.id" v-if="iterat.type=='edit'"/>
                <input type="hidden" name="oid" :value="order.form.id"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="hideDialog('iterat','visible')">取消</button>
                <button class="primarybtn" @click="formSubmit">保存</button>
            </div>
        </el-dialog>
        <!-- 代码参数配置 -->
        <el-dialog :visible.sync="order.show&&order.type=='config'" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth" :before-close="handleClose">
            <p class="tmheader">{{iterat.title}}</p>
            <el-form :model="configform"  :label-width="$protovar.fmlabwidth" ref="configform" :hide-required-asterisk="true" class="dialogform sdialogform" id="configform">
                <div class="tmcol">
                    <el-form-item label="产品">
                        <span class="textlh">{{order.form.productname}}</span>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="类型" prop="servicedesc">
                        <span class="textlh">{{order.form.producttype==1?'源码':(order.form.producttype==2?'sdk':'--')}}</span>
                    </el-form-item>
                </div>  
                <div class="tmcol">
                    <el-form-item label="app握手key" prop="appkey">
                        <el-input v-model="configform.appkey" name="appkey"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="证书key" prop="certificatekey">
                        <el-input v-model="configform.certificatekey" name="certificatekey"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="授权信息" prop="grantinfo">
                        <el-input v-model="configform.grantinfo" name="grantinfo"></el-input>
                    </el-form-item>
                </div> 
                <div class="tmcol">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="configform.status">
                            <el-option v-for="item in statuselect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <input type="hidden" name="oid" :value="configform.oid"/>
                <input type="hidden" name="id" :value="configform.id"/>
            </el-form>
            <div class="tmdialog-footer pb30">
                <button class="primarybtn search" @click="handleClose">生成代码</button>
                <button class="primarybtn" @click="setConfig">保存</button>
            </div>
        </el-dialog>
        <!-- 关联用户 -->
        <el-dialog :visible.sync="order.show&&order.type=='user'" :close-on-click-modal="false" class="tmdialog setdialog" :width="$protovar.dtbwidth" :before-close="handleClose">
            <div class="tmheader" style="padding-left:10px;">
                <span>关联用户</span>
            </div>
            <div class="dialogpad">
                <el-table :data="userList"  :header-cell-style="{background:$protovar.tbhabg}">
                    <el-table-column label="账号" prop="loginname" width="250" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="昵称" prop="nick" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="地区" prop="city" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="授权类型" prop="type" :align="$protovar.align">
                    </el-table-column>
                    <el-table-column label="状态" prop="status" :align="$protovar.align">
                        <template slot-scope="scope">
                            <span>{{scope.row.status==1?'正常':'禁用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  :align="$protovar.align"  v-if="authdisable2">
                        <template slot-scope="scope">
                            <span class="tmopera waring" v-auth="'odel'" @click="delClick(scope.row.uid,'user')">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 删除确认弹框 -->
        <el-dialog :visible.sync="del.visible" :width="$protovar.dwidth"  class="tmdialog" :close-on-click-modal="false"> 
            <div class="title">{{del.title}}</div>
            <div class="tmdialog-footer pb60">
                <button class="primarybtn search" @click="hideDialog('del','visible')">取消</button>
                <button class="primarybtn" @click="sureDel">删除</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {order,msgTips,successTips} from '@_/axios/path';
export default {
    data(){
        return {
            iterat:{//迭代
                list:[],
                type:'add',
                title:'',
                visible:false,
                form:{
                },
            },
            configform:{},
            statuselect:[{id:1,label:'初始化'},{id:2,label:'准备完成'}],
            userList:[],//关联用户
            del:{
                visible:false,
                title:'确定删除该迭代版本',
                id:'',
                type:'interat'
            }
        }
    },
    props:['order','show','oid'],
    computed:{
        authdisable(){
            return this.authDisable(['oupdate'])
        },
        authdisable2(){
            return this.authDisable(['odel'])
        }
    },
    watch:{
        show(nv,ol){
            if(this.show){
                switch(this.order.type){
                    case 'iteration':
                        this.saleAfterList();
                        break;
                    case 'config':
                        this.getOrderParam();
                        break;
                    case 'user':
                        this.getOrderUserList();
                        break;
                }
            }
        }
    },
    methods:{
        /* 关闭弹框 */
        handleClose(){
            Object.assign(this.$data, this.$options.data())
            this.$emit("closeOrder");
        },
        /* 订单售后列表 */
        saleAfterList(){
            order.orderAfterSalesList({oid:this.oid}).then(res=>{
                if(res.ok){
                    this.iterat.list=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
         /* 新增|编辑版本 */
        addEdit(type,item){
            this.iterat.visible=true;
            this.iterat.type=type;
            this.$nextTick(()=>{
                this.$refs.form.clearValidate();
            })
            if(type=="add"){
                this.iterat.title='添加记录';
                this.iterat.form=this.$options.data().iterat.form;
            }
            if(type=="edit"){
                 this.iterat.title='维护记录';
                let data={...item};
                this.iterat.form=data;
            }
        },
        /* 保存版本 */
        formSubmit(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let res;
                    let postdata=$("#iteratform").serialize();
                    /* 修改 */
                    if(this.iterat.type=="add"){
                        res=await order.salesAdd(postdata);
                    }
                    if(this.iterat.type=="edit"){
                        res=await order.salesUpdate(postdata);
                    }
                    if(res.ok){
                        this.iterat.visible=false;
                        successTips("保存成功");
                        this.saleAfterList();
                    }else{
                        msgTips(res); 
                    }
                } else {
                    return false;
                }
            });
        },
        /* 获取配置 */
        getOrderParam(){
            order.orderParam({oid:this.oid}).then(res=>{
                if(res.ok){
                    this.configform=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
        /* 更新配置 */
        setConfig(){
            let postdata=$("#configform").serialize();
            order.paramUpdate(postdata).then(res=>{
                if(res.ok){
                    this.iterat.visible=false;
                    successTips("保存成功");
                    this.handleClose();
                }else{
                    msgTips(res); 
                }
            });
        },
        /* 关联用户 */
        getOrderUserList(){
            order.orderUserList({oid:this.oid}).then(res=>{
                if(res.ok){
                    this.userList=res.data;
                }else{
                    msgTips(res);
                }
            })
        },
         /* 取消弹框 */
        hideDialog(dialog,visible){
            this[dialog][visible]=false;
        },
        /* 删除售后 */
        delClick(id,type){
            this.del.id=id;
            this.del.type=type;
            this.del.title="确定删除该用户?";
            if(type=="interat"){
                this.del.title="确定删除该迭代版本?";
            }
            this.del.visible=true;
        },
        /* 确认删除 */
        async sureDel(){
            let res;
            let type=this.del.type,
                id=this.del.id;
            if(type=="interat"){
               res=await order.delSales({id:id});
            }
            if(type=="user"){
                res=await order.delOrderUser({uid:id,oid:this.oid})
            }
            if(res.ok){
                successTips("删除成功");
                if(type=="interat"){
                    this.saleAfterList();
                }
                if(type=="user"){
                    this.getOrderUserList();
                }
                
            }else{
                msgTips(res);
            }
            this.del.visible=false;
        },
    }

}
</script>
<style lang="less" scoped>
.setdialog{
    /deep/.el-dialog{
        padding-bottom:30px;
    }
    .tmheader{
        line-height: 30px;
        padding: 15px 0 14px 10px;
        .pagename{
            color:@textBlue;
            margin-left:20px;
        }
    }
    /deep/.el-dialog__headerbtn{
        right:10px;
    }
    .opergrant{
        margin-right:70px;
        .primarybtn{
            width: 92px;
        }
    }
}
.el-form{
    /deep/.el-date-editor--date{
         width:268px;
    }
    /deep/.el-textarea__inner{
        height:80px;
        width:268px;
        padding: 5px 8px;
        color:#333;
        border-color: #DFDFDF;
    }
}
</style>