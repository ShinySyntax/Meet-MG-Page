<template>
    <div class="conmonright container">
<div class="contentpad" >
    <div v-for="item in data.list3" style="float: left;width: 25%;height: 55px;font-size:25px">
        {{item["remark"]}}共{{item["coin"]/100}}元
    </div>
</div>
        <!-- 数据表格 -->
        <div class="contentpad" style="width: 50%;float: left">
            <el-table :data="data.list2" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="标签" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{ scope.row.remark }}</template>
                </el-table-column>
                <el-table-column label="数额" :align="$protovar.align">
                    <template slot-scope="scope">

                        <span v-if="isNaN(scope.row.cnys)">0</span>
                        <span v-else>{{ scope.row.cnys/100 }}</span>
                    </template>
                </el-table-column>

            </el-table>
            <el-table :data="data.list" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="标签" :align="$protovar.align">
                    <template slot-scope="scope">

                        {{scope.row.remark!='充值'&&scope.row.remark!='提现'&&scope.row.remark!='提现失败退回'&&scope.row.remark!='购买会员'?'':
                        scope.row.paytype== 1 ? '微信' : scope.row.paytype ==2 ? '支付宝' : scope.row.paytype == 3 ? '银行卡' : scope.row.paytype == 4?'转账':
                            scope.row.paytype == 5?'后台':scope.row.paytype == 6?'苹果':'旧或异常'}}
                        {{scope.row.remark }}
                    </template>
                </el-table-column>
                <el-table-column label="数额" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.cnys)">0</span>
                        <span v-else>{{ scope.row.cnys/100 }}</span></template>
                </el-table-column>
                <el-table-column label="手续费" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.othercnys)||scope.row.remark=='提现失败退回'">0</span>
                        <span v-else>{{ scope.row.othercnys/100 }}</span></template>
                </el-table-column>
            </el-table>
            <el-table :data="data.list5" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="当月统计标签" :align="$protovar.align">
                    <template slot-scope="scope">

                        {{scope.row.remark!='充值'&&scope.row.remark!='提现'&&scope.row.remark!='提现失败退回'&&scope.row.remark!='购买会员'?'':
                        scope.row.paytype== 1 ? '微信' : scope.row.paytype ==2 ? '支付宝' : scope.row.paytype == 3 ? '银行卡' : scope.row.paytype == 4?'转账':
                            scope.row.paytype == 5?'后台':scope.row.paytype == 6?'苹果':scope.row.paytype == 7?'旧':''}}
                        {{scope.row.remark }}
                    </template>
                </el-table-column>
                <el-table-column label="数额" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.cnys)">0</span>
                        <span v-else>{{ scope.row.cnys/100 }}</span></template>
                </el-table-column>
                <el-table-column label="手续费" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.othercnys)||scope.row.remark=='提现失败退回'">0</span>
                        <span v-else>{{ scope.row.othercnys/100 }}</span></template>
                </el-table-column>
            </el-table>

        </div>
        <!-- 数据表格 -->
        <div class="contentpad" style="width: 50%;float: left">
            <!-- 筛选 -->
            <div class="filter">
                <div class="block">
                    <el-date-picker
                            v-model="timevalue"
                            type="date"
                            @change="getData1"
                    >
                    </el-date-picker>
                </div>
            </div>
            <el-table :data="data.list1" v-loading="false" :header-cell-style="{ background: $protovar.tbhabg }">
                <el-table-column label="标签" :align="$protovar.align">
                    <template slot-scope="scope">
                        {{scope.row.remark!='充值'&&scope.row.remark!='提现'&&scope.row.remark!='提现失败退回'&&scope.row.remark!='购买会员'?'':
                        scope.row.paytype== 2 ? '支付宝' : scope.row.paytype ==1 ? '微信' : scope.row.paytype == 3 ? '银行卡' : scope.row.paytype == 4?'转账':
                            scope.row.paytype == 5?'后台':scope.row.paytype == 6?'苹果':'旧或异常'}}
                        {{scope.row.remark }}
<!--                        {{scope.row.paytype}}-->
                    </template>
                </el-table-column>
                <el-table-column label="数额" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.cnys)">0</span>
                        <span v-else>{{ scope.row.cnys/100 }}</span></template>
                </el-table-column>
                <el-table-column label="手续费" :align="$protovar.align">
                    <template slot-scope="scope">
                        <span v-if="isNaN(scope.row.othercnys)||scope.row.remark=='提现失败退回'">0</span>
                        <span v-else>{{ scope.row.othercnys/100 }}</span></template>
                </el-table-column>
            </el-table>

        </div>

    </div>
</template>
<script>
import {notice, msgTips} from "@_/axios/path";
import {account} from "../../axios/path";

export default {
    data() {
        return {
            timevalue: '',
            data: {
                list: [],
                list1: [],
                list2: [],
                list3: [],
                list4: [],
                list5: [],//月
            },
        };
    },
    watch: {
        $route() {
            this.getData();
        },
    },
    mounted() {
        this.getData();
        // 获取所有
        this.getData1();
        // 获取特定时间
        this.getData2();
        this.getData3();
    //     获取特殊项
        this.getData4();
        this.getData5();//月
    },
    methods: {
        getData() {
            account.list().then((res) => {
                if (res.ok) {
                    this.data.list = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        getData3() {
            account.list3().then((res) => {
                // console.log(res);
                if (res.ok) {
                    this.data.list3 = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        getData4() {
            account.list4().then((res) => {
                // console.log(res);
                if (res.ok) {
                    this.data.list4 = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        getData2() {
            account.list2().then((res) => {
                if (res.ok) {
                    this.data.list2 = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        getData1() {
            if(this.timevalue==''){
                this.timevalue=new Date();
            }
            var starttime = this.timevalue.getFullYear() + "-" + String(Number(this.timevalue.getMonth()) + 1) + "-" + this.timevalue.getDate();
            var endtime = this.timevalue.getFullYear() + "-" + String(Number(this.timevalue.getMonth()) + 1) + "-" + String(this.timevalue.getDate()+1);
            let data={starttime:starttime,endtime:endtime}
            account.list(data).then((res) => {
                // console.log(res)
                if (res.ok) {
                    this.data.list1 = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        getData5() {
            var now=new Date();
            var starttime = now.getFullYear() + "-" + String(Number(now.getMonth()) + 1) + "-01" ;
            var endtime = now.getFullYear() + "-" + String(Number(now.getMonth()) + 1) + "-" + String(now.getDate()+1);
            let data={starttime:starttime,endtime:endtime}
            console.log(data)
            account.list(data).then((res) => {
                console.log(res)
                if (res.ok) {
                    this.data.list5 = res.data;
                } else {
                    msgTips(res);
                }
                this.data.loading = false;
            });
        },
        /* 提交表单 */
        formSubmit(postdata) {
            if (this.dialog.title === "添加") {
                postdata.id = null;
            }
            // console.log(postdata);
            notice.addpage(postdata).then((res) => {
                if (res.ok) {
                    let data = res.data;
                    if (data) {
                        this.data.totalRow = data.totalRow;
                        this.data.list = data.list;
                    }
                } else {
                    msgTips(res);
                }
            });
            this.dialog.visible = false;
            postdata.msg = null;
            this.getData();
            // this.getData();

        },
    },
};
</script>