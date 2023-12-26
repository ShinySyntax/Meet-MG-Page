<template>
  <div class="conmonright container">
    <!-- 筛选 -->
    <div class="filter">
      <div class="filter-btn">
        <button class="primarybtn" @click="setData('add')" v-auth="'add'">
          新增文本公告
        </button>

        <button class="primarybtn" style="width:150px;" @click="fasongImgNotice()">
          发送图片公告
        </button>
      </div>
    </div>
    <!-- 数据表格 -->
    <div class="contentpad">
      <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{ background: $protovar.tbhabg }">
        <el-table-column label="ID" :align="$protovar.align" width="100"><template slot-scope="scope">{{
          scope.row.id
        }}</template></el-table-column>
        <el-table-column label="内容" :align="$protovar.align" width="500"><template slot-scope="scope">{{
          scope.row.msg
        }}</template></el-table-column>
        <el-table-column label="时间" :align="$protovar.align" width="200"><template slot-scope="scope">{{
          scope.row.createtime
        }}</template></el-table-column>
        <el-table-column label="操作" :align="$protovar.align" width="400"><template slot-scope="scope">
            <button class="primarybtn search" @click="setData('edit', scope.row)">
              编辑
            </button>
            <button class="primarybtn search" @click="referServer(scope.row)">
              发布
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
    <!-- 发布 -->
    <el-dialog :visible.sync="dialog3.visible" :width="$protovar.dwidth" class="tmdialog" :close-on-click-modal="false">
      <div class="title">确定发布该配置信息吗？</div>
      <div class="tmdialog-footer pb60">
        <button class="primarybtn search" @click="hideDialog('dialog3', 'visible')">取消</button>
        <button class="primarybtn search" @click="sureReper(dialog.form)">发布</button>
      </div>
    </el-dialog>
    <!-- 新增|编辑框 -->
    <el-dialog :visible.sync="dialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
      <p class="tmheader">{{ dialog.title }}</p>
      <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form"
        :hide-required-asterisk="true" class="dialogform" id="form">
        <div class="tmcol">
          <el-form-item label="内容" prop="pid"><textarea style="height:400px;width:250px" v-model="dialog.form.msg"></textarea></el-form-item>

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

    <!-- 发布图片公告 -->
    <el-dialog :visible.sync="imgdialog.visible" :close-on-click-modal="false" class="tmdialog" :width="$protovar.sgtwidth">
      <p class="tmheader">发布图片公告</p>
      <el-form :model="dialog.form" :rules="dialog.rules" :label-width="$protovar.fmlabwidth" ref="form"
        :hide-required-asterisk="true" class="dialogform" id="form">
        <div class="tmcol">
          <el-form-item label="上传图片" prop="icon">
              <el-upload class="upload-demo" action="/tioadmin/notice/sendMsgImg.admin_x" list-type="picture"
                          :limit="1"
                          :on-success="pictureSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">请上传jpg/png文件</div>
              </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { notice, msgTips } from "@_/axios/path";
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
          msg: null,
        },
      },
      dialog2: {
        visible: false,
      },
      dialog3: {
        visible: false,
      },
      imgdialog: {
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
    fasongImgNotice() {
      this.imgdialog.visible = true;
    },
    pictureSuccess() {
      this.imgdialog.visible = false;
    },
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
      notice.openlist(ptdata).then((res) => {
          console.log(res)
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
        console.log(this.data)
      });
    },
    /* 提交表单 */
    formSubmit(postdata) {
      if(this.dialog.title == "添加"){
        postdata.id=null;
      }
      console.log(postdata);
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
      postdata.msg=null;
      this.getData();
      // this.getData();

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
    // 发布
    referServer(item) {
      this.dialog.form = item;
      this.dialog3.visible = true;
     

    },
    /* 确定删除 */
    sureDel(data) {
      notice.delDate(data).then((res) => {
        if (res.ok) {
          this.dialog2.visible = false;
          this.getData();
        } else {
          msgTips(res);
        }
      });
    },
    /* 确定发布 */
    sureReper(data) {
      notice.reperDate(data).then((res) => {
        if (res.ok) {
          this.dialog3.visible = false;
          this.getData();
        } else {
          msgTips(res);
        }
      });
      this.hideDialog('dialog3', 'visible')
    },

    /* 新增|编辑 */
    setData(type, item) {
      this.dialog.visible = true;
      if (type == "add") {
        this.dialog.title = "添加";
        this.dialog.form.msg='';
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