<template>
    <div>
        <div class="block">
            <el-date-picker
                    v-model="value"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getData"
            >
            </el-date-picker>
            {{ value }}
        </div>
        <div type="daterange" id="mychart" :style="myChartStyle"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import {account} from "@_/axios/path";

export default {
    data() {
        return {
            myChart: {},
            xData: [], //横坐标
            myChartStyle: {float: "left", width: "100%", height: "600px"},//图表样式

            redsend: [],
            redreceive: [],
            redreturn: [],
            recharge: [],
            backrechange: [],
            withdrawals: [],
            backwithdrawals: [],
            value: '',
        };

    },
    mounted() {
        this.initEcharts();
    },
    watch: {
        $route() {
            this.getData();
        },
    },
    methods: {
        getData() {
            var starttime = this.value[0].getFullYear() + "-" + String(Number(this.value[0].getMonth()) + 1) + "-" + this.value[0].getDate();
            var endtime = this.value[1].getFullYear() + "-" + String(Number(this.value[1].getMonth()) + 1) + "-" + this.value[1].getDate();
            let ptdata = {starttime, endtime};
            // 埋萝卜

            account.getList(ptdata).then((res) => {
                    this.xData = [];
                    this.redsend = [];
                    this.redreceive = [];
                    //console.log(res);
                    // 挖坑
                    var i = 0;
                    var time = ''
                    while (this.value[0] <= this.value[1]) {
                        //console.log(this.xData);
                        var y = this.value[0].getFullYear(),
                            m = this.value[0].getMonth() + 1,
                            d = this.value[0].getDate();
                        time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);

                        this.xData.push(time);
                        try {
                            if (res.data[i].time) {
                                //console.log(time + "时间有时间");
                                if (res.data[i].time === time) {
                                    console.log(time + "时间有数据");
                                    try {
                                        this.redsend.push(res.data[i].redsend);
                                    } catch (e) {
                                        this.redsend.push(0);
                                    }

                                    try {
                                        this.redreceive.push(res.data[i].redreceive);
                                    } catch (e) {
                                        this.redreceive.push(0);
                                    }

                                    try {
                                        this.redreturn.push(res.data[i].redreturn);
                                    } catch (e) {
                                        this.redreturn.push(0);
                                    }
                                    try {
                                        this.recharge.push(res.data[i].recharge);
                                    } catch (e) {
                                        this.recharge.push(0);
                                    }
                                    try {
                                        this.backrechange.push(res.data[i].backrechange);
                                    } catch (e) {
                                        this.backrechange.push(0);
                                    }
                                    try {
                                        this.withdrawals.push(res.data[i].withdrawals);
                                    } catch (e) {
                                        this.withdrawals.push(0);
                                    }
                                    try {
                                        this.backwithdrawals.push(res.data[i].backwithdrawals);
                                    } catch (e) {
                                        this.backwithdrawals.push(0);
                                    }

                                }
                            }
                        } catch (e) {
                            this.redsend.push(0);
                            this.redreceive.push(0);
                            this.redreturn.push(0);
                            this.recharge.push(0);
                            this.backrechange.push(0);
                            this.withdrawals.push(0);
                            this.backwithdrawals.push(0);


                            //console.log("无时间");
                        }
                        i++;
                        this.value[0].setDate(this.value[0].getDate() + 1);
                    }

                    this.initEcharts();

                }
            );

        },
        initEcharts() {
            console.log("init");
            this.myChart = echarts.init(document.getElementById("mychart"));
            console.log(this.xData);
            let option = {
                xAxis: {
                    data: this.xData
                },
                legend: { // 图例
                    data: ["发红包", "抢红包","红包退回","充值","后台充值","提现","后台提现"],
                    bottom: "0%"
                },
                yAxis: {},
                series: [
                    {
                        name: "发红包",
                        data: this.redsend,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "抢红包",
                        data: this.redreceive,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "红包退回",
                        data: this.redreturn,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "充值",
                        data: this.recharge,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "后台充值",
                        data: this.backrechange,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "提现",
                        data: this.withdrawals,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    },
                    {
                        name: "后台提现",
                        data: this.backwithdrawals,
                        type: "bar",
                        label: {
                            show: true,
                            position: "top",
                            textStyle: {
                                fontSize: 16
                            }
                        }
                    }
                ]
            };
            console.log(option);
            this.myChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
        }
    }
};
</script>