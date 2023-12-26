<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column label="参数说明">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付宝参数值">
        <template slot-scope="scope">
          <span>
            <el-input
              @blur.native.capture="update(scope.row,1)"
              v-model="scope.row.key1"
              placeholder="请输入内容"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="微信参数值">
        <template slot-scope="scope">
          <span>
            <el-input
              @blur.native.capture="update(scope.row,2)"
              v-model="scope.row.key2"
              placeholder="请输入内容"
            ></el-input>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="参数名">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  



</template>

<script>
import { chit } from "@_/axios/path";

export default {
  data() {
    return {
      table: [
        {
          type: null,
          key: null,
          name: null,
        },
      ],
      tableData: [
      {
          host: "新生支付商户号",
          key: "",
          key1: "",
          key2: "",
          type: "merchantid",
        },
        {
          host: "新生支付私钥位置",
          key: "",
          key1: "",
          key2: "",
          type: "pen",
        },
        {
          host: "外部服务器地址",
          key: "",
          key1: "",
          key2: "",
          type: "service",
        },
        {
          host: "APP ID",
          key: "",
          key1: "",
          key2: "",
          type: "appid",
        },
        {
          host: "app 私钥",
          key: "",
          key1: "",
          key2: "",
          type: "app_private_key",
        },
        {
          host: "支付公钥",
          key: "",
          key1: "",
          key2: "",
          type: "alipay_public_key",
        },
        {
          host: "应用程序证书路径",
          key: "",
          key1: "",
          key2: "",
          type: "app_cert_path",
        },
        {
          host: "根证书路径",
          key: "",
          key1: "",
          key2: "",
          type: "root_cert_path",
        },
        {
          host: "证书公共路径",
          key: "",
          key1: "",
          key2: "",
          type: "alipay_cert_public_path",
        },
      ],
      value: 1,
      filters: {
        searchkey: "",
        walletid: "",
        type: "",
      },
      data: {
        //数据表格
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        loading: false, //表单loading
        list: [], //列表
        pagesizes: [10, 20, 30, 40],
      },
      curroute: "",
      visible: {
        complaintShow: false, //投诉记录
      },
      groupid: "", //群id
      grouprowdata: {}, //选中的群消息
      refresh: false,
      report: {
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        list: [],
        loading: false,
        status: "",
        type: "",
      },
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      chit.list1().then((response) => { 
        console.log(response);
        try {
          this.tableData[0].key1 = response.data.list[0].merchantid;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[1].key1 = response.data.list[0].pen;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[2].key1 = response.data.list[0].service;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[3].key1 = response.data.list[0].appid;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[4].key1 = response.data.list[0].app_private_key;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[5].key1 = response.data.list[0].alipay_public_key;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[6].key1 = response.data.list[0].app_cert_path;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[7].key1 = response.data.list[0].root_cert_path;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[8].key1 = response.data.list[0].alipay_cert_public_path;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[0].key2 = response.data.list[1].merchantid;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[1].key2 = response.data.list[1].pen;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[2].key2 = response.data.list[1].service;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[3].key2 = response.data.list[1].appid;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[4].key2 = response.data.list[1].app_private_key;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[5].key2 = response.data.list[1].alipay_public_key;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[6].key2 = response.data.list[1].app_cert_path;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[7].key2 = response.data.list[1].root_cert_path;
        } catch (err) {
          console.log("null ");
        }
        try {
          this.tableData[8].key2 = response.data.list[1].alipay_cert_public_path;
        } catch (err) {
          console.log("null ");
        }
        this.loading = false;
      });
    },
    update(name,n) {
      if(n==1){
        name.key=name.key1;
        name.key3=1;
      }
      if(n==2){
        name.key=name.key2;
        name.key3=2;
      }
      chit.set1(name).then((response) => {
        this.getList();
      });
    },
  },
};
</script>

<style scoped="scoped"></style>
