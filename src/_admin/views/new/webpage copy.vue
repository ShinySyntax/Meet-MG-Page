<template>
  <div class="conmonright container">
    <!-- 筛选 -->
    <div class="filter">
      <div class="filter-btn">
        <button class="primarybtn" @click="setData('add')" v-auth="'add'">
          新增
        </button>
      </div>
    </div>
    <!-- 数据表格 -->
    <div class="contentpad">
      <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
        <el-table-column label="ID" :align="$protovar.align" width="100"><template slot-scope="scope">{{
          scope.row.id
        }}</template></el-table-column>
        <el-table-column label="父级ID" :align="$protovar.align" width="100"><template slot-scope="scope">{{
          scope.row.pid
        }}</template></el-table-column>
        <el-table-column label="名称" :align="$protovar.align" width="200"><template slot-scope="scope">{{
          scope.row.name
        }}</template></el-table-column>
        <el-table-column label="url地址" :align="$protovar.align" width="200"><template slot-scope="scope">{{
          scope.row.url
        }}</template></el-table-column>
        <el-table-column label="icon地址" :align="$protovar.align" width="600"><template slot-scope="scope">{{
          scope.row.icon
        }}</template></el-table-column>
        <el-table-column label="操作" :align="$protovar.align" width="200"><template slot-scope="scope">
            <button class="primarybtn search" @click="setData('edit', scope.row)">
              编辑
            </button>
            <button class="primarybtn search" @click="delServer(scope.row)">
              删除
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 删除 -->
    <el-dialog :visible.sync="dialog2.visible" :width="$protovar.dwidth" class="tmdialog" :close-on-click-modal="false">
      <div class="title">确定删除该配置信息吗？</div>
      <div class="tmdialog-footer pb60">
        <button class="primarybtn search" @click="hideDialog('dialog2', 'visible')">取消</button>
        <button class="primarybtn search" @click="sureDel(dialog.form)">删除</button>
      </div>
    </el-dialog>
    <!-- 新增|编辑框 -->
    <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
      <p class="tmheader">{{ dialog.title }}</p>
      <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form"
        :hide-required-asterisk="true" class="dialogform" id="form">
        <div class="tmcol">
          <el-form-item label="父级ID" prop="pid"><el-input v-model="dialog.form.pid"></el-input></el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item label="名称" prop="name"><el-input v-model="dialog.form.name"></el-input></el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item label="url地址" prop="url"><el-input v-model="dialog.form.url"></el-input></el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item label="icon地址" prop="icon"><el-input v-model="dialog.form.icon"></el-input></el-form-item>
        </div>
      </el-form>
      <div class="tmdialog-footer pb30">
        <button class="primarybtn search" @click="hideDialog('dialog', 'visible')">
          取消
        </button>
        <button class="primarybtn" @click="formSubmit(dialog.form)">
          保存
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { page, msgTips } from "@_/axios/path";
export default {
  data() {
    return {
      // filters:{
      //     searchkey:'',
      //     walletid:'',
      //     type:''
      // },
      data: {
        //数据表格
        loading: false, //表单loading
        list: [], //列表
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        pagesizes: [10, 20, 30, 40],
      },
      // currdata:null,

      // grouprowdata:{},//选中的群消息
      // refresh:false,
      report: {
        pageNumber: 1,
        pageSize: 10,
        totalRow: 0, //总条数
        list: [],
        loading: false,
        status: "",
        type: "",
      },
      dialog: {
        type: "add",
        title: "",
        visible: false,
        form: {
          id: null,
          pid: null,
          name: null,
          url: null,
          icon: null,
        },
        rules: {
          // id: [
          //     {required: true,message: "请输入ID",trigger: "blur"}
          // ],
          pid: [{ required: true, message: "请输入父类ID,只能写数字", trigger: "blur" }],
          name: [{ required: true, message: "请输入名称", trigger: "blur" }],
          url: [{ required: true, message: "请输入url地址", trigger: "blur" }],
          icon: [
            { required: true, message: "请输入icon地址", trigger: "blur" },
          ],
        },
      },
      dialog2: {
        visible: false,
      },
      showpwd: "",
      statusSelect: [
        { id: 1, label: "正常" },
        { id: 2, label: "禁用" },
      ],
      curroute: "",
    };
  },
  conputed: {
    authdisable() {
      return this.authDisable(["update", "del"]);
    },
  },

  watch: {
    showpwd(nv, ol) {
      if (ol == "******") {
        this.showpwd = "";
        this.dialog.form.pwd = "";
      }
      this.dialog.form.showpwd = nv;
    },
    $route(to, from) {
      if (to.path == this.curroute) {
        if (this.$protovar.routehasopen != -1 && !to.query.random) {
          return;
        }
        Object.assign(this.$data, this.$options.data());
        this.curroute = this.$route.path;
        this.getData();
      }
    },
  },
  mounted() {
    this.curroute = this.$route.path;
    this.getData();
  },
  methods: {
    update(item) {
      page.set(item).then((res) => {
        if (res.ok) {
          this.getData();
        }
      })
    },
    getData(item) {
      this.data.loading = true;
      let ptdata = { ...this.filters };
      page.openlist(ptdata).then((res) => {
        if (res.ok) {
          let data = res.data;
          if (data) {
            this.data.totalRow = data.totalRow;

            this.data.list = data.list;
          }
        } else {
          msgTips(res);
        }
        this.data.loading = false;
      });
    },
    /* 提交表单 */
    formSubmit(postdata) {
      page.addpage(postdata).then((res) => {
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
      this.getData();
    },
    /* 取消弹框 */
    hideDialog(dialog, visible) {
      this[dialog][visible] = false;
    },
    /* 删除 */
    delServer(item) {
      this.dialog.form = item;
      this.dialog2.visible = true;
    },
    /* 确定删除 */
    sureDel(data) {
      page.delDate(data).then((res) => {
        if (res.ok) {
          this.dialog2.visible = false;
          this.getData();
        } else {
          msgTips(res);
        }
      });
    },

    /* 新增|编辑 */
    setData(type, item) {
      this.dialog.visible = true;
      if (type == "add") {
        this.dialog.title = "添加";
      }
      if (type == "edit") {
        console.log(item);
        this.dialog.form = item;
        this.dialog.title = "修改";
      }
    },
  },
};
</script>