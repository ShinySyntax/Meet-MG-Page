<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column label="参数说明">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>

      <el-table-column label="安卓参数值">
        <template slot-scope="scope">
          <span>
            <el-input
            @blur.native.capture="update1(scope.row)"
              v-model="scope.row.key1" 
              placeholder="请输入内容"
            ></el-input>
          </span>
        </template>
      </el-table-column> 
      <el-table-column label="苹果参数值">
        <template slot-scope="scope">
          <span>
            <el-input
            @blur.native.capture="update2(scope.row)"
              v-model="scope.row.key2"
              placeholder="请输入内容"
            ></el-input>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="参数说明">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { app } from "@_/axios/path";

export default {
  data() {
    return {
      table:{
        type:"",
        key:"",
        name:"",
      },
      tableData: [
        {
          host: "版本号",
          key: "",
          key1: "",
          key2: "",
          type: "version",
        },
        {
          host: "更新提示内容",
          key: "",
          key1: "",
          key2: "",
          type: "name",
        },
        {
          host: "更新模式1：正常更新；2：强制更新",
          key: "",
          key1: "",
          key2: "",
          type: "updatemode",
        },
        {
          host: "状态1:发布；2：下架/初始化",
          key: "",
          key1: "",
          key2: "",
          type: "status",
        },
        {
          host: "下载地址",
          key: "",
          key1: "",
          key2: "",
          type: "fileurl",
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
      app.openlist().then((response) => {
            this.tableData[0].key1 = response.data.list[0].version;
            this.tableData[1].key1 = response.data.list[0].name;
            this.tableData[2].key1 = response.data.list[0].updatemode;
            this.tableData[3].key1 = response.data.list[0].status;    
            this.tableData[4].key1 = response.data.list[0].fileurl;    
            this.tableData[0].key2 = response.data.list[1].version;
            this.tableData[1].key2 = response.data.list[1].name;
            this.tableData[2].key2 = response.data.list[1].updatemode;
            this.tableData[3].key2 = response.data.list[1].status;    
            this.tableData[4].key2 = response.data.list[1].fileurl;       
        this.loading = false;
      });
    },
    update1(name){
      this.table.key=name.key1;
      this.table.type='1';
      this.table.name=name.type;
      app.set(this.table).then((response)=>{
        this.getList();
      })
    },
    update2(name){
      
      this.table.key=name.key2;
      this.table.type='2';
      this.table.name=name.type;
      app.set(this.table).then((response)=>{
        this.getList();
      })
    },
  },
};
</script>

<style scoped="scoped">
</style>
