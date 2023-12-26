<template>
  <div class="commonright container">
    <div class="filter">
      <!-- <div class="filter-item">
                    <label class="filter-label">配置项</label>
                    <el-input type="text" clearable v-model="filters.searchkey" placeholder="输入名称/参数名"></el-input>
                </div>
                <div class="filter-item">
                    <label class="filter-label">类型</label>
                    <el-select v-model="filters.type" clearable placeholder="全部">
                        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                    </el-select>
                </div> -->
      <div class="filter-btn">
        <!-- <button class="primarybtn search" @click="getData()" >查询</button> -->
        <button
          class="primarybtn"
          @click="setData('add')"
          v-auth="'add'"
        >新增</button>
      </div>
    </div>
    <!-- 数据表格 -->
    <div class="contentpad">
      <el-table
        :data="data.list"
        v-loading="data.loading"
        :header-cell-style="{ background: $protovar.tbhabg }"
      >
        <el-table-column
          label="会员名称"
          width="80"
          prop="vipname"
        ></el-table-column>
        <el-table-column
          label="会员等级"
          prop="viprank"
        ></el-table-column>
        <el-table-column
          label="会员时长·单位月·具体时间"
          prop="duration"
        ></el-table-column>
        <el-table-column
          label="会员时长·文本显示·仅支持文本显示·具体时间依靠前者"
          prop="durationtext"
        ></el-table-column>
        <el-table-column
          label="苹果内购价格"
          prop="price"
          width="150"
        ></el-table-column>
        <el-table-column
          label="微信价格"
          prop="buyprice"
          width="150"
        ></el-table-column>
        <el-table-column
          label="朋友人数上限"
          prop="friendlims"
          width="150"
        ></el-table-column>
        <el-table-column
          label="群人数上限"
          prop="grouplims"
          width="150"
        ></el-table-column>

        <el-table-column
          label="创建时间"
          prop="createtime"
          width="150"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="updatetime"
          width="150"
        ></el-table-column>

        <el-table-column
          label="操作"
          width="150"
          v-if="authdisable"
        >
          <template slot-scope="scope">
            <span
              class="tmopera"
              @click="setData('edit', scope.row)"
            >编辑</span>
            <span
              class="tmopera"
              @click="setData('delete', scope.row)"
            >移除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增|编辑框 -->
    <el-dialog
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      class="tmdialog"
      :width="$protovar.sgtwidth"
    >
      <p class="tmheader">{{ dialog.title }}</p>
      <el-form
        :model="dialog.form"
        :label-width="$protovar.fmlabwidth"
        ref="form"
        class="dialogform sdialogform"
        id="form"
      >

        <div
          class="tmcol"
          v-show="0"
        >
          <el-form-item
            label="ID"
            prop="id"
          >
            <el-input
              v-model="dialog.form.id"
              name="id"
            ></el-input>
          </el-form-item>
        </div>

        <div class="tmcol">
          <el-form-item
            label="会员名称"
            prop="vipname"
          >
            <el-input
              v-model="dialog.form.vipname"
              name="vipname"
            ></el-input>
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="会员等级"
            prop="viprank"
          >
            <el-input
              v-model="dialog.form.viprank"
              name="viprank"
            ></el-input>
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="会员时长·月份"
            prop="duration"
          >
            <el-input
              v-model="dialog.form.duration"
              name="duration"
            ></el-input>
              个月
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="会员时长·文本显示·"
            prop="durationtext"
          >
            <el-input
              v-model="dialog.form.durationtext"
              name="durationtext"
            ></el-input>
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="苹果内购价格"
            prop="price"
          >
            <el-input
              v-model="dialog.form.price"
              name="price"
            ></el-input>
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="微信价格"
            prop="buyprice"
          >
            <el-input
              v-model="dialog.form.buyprice"
              name="buyprice"
            ></el-input>
          </el-form-item>
        </div>

        <div class="tmcol">
          <el-form-item
            label="朋友人数上限"
            prop="friendlims"
          >
            <el-input
              v-model="dialog.form.friendlims"
              name="friendlims"
            ></el-input>
          </el-form-item>
        </div>
        <div class="tmcol">
          <el-form-item
            label="群人数上限"
            prop="grouplims"
          >
            <el-input
              v-model="dialog.form.grouplims"
              name="grouplims"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="tmdialog-footer pb30">
        <button
          class="primarybtn search"
          @click="hideDialog('dialog', 'visible')"
        >取消</button>
        <button
          class="primarybtn"
          @click="formSubmit"
          :disabled="loading"
        >保存</button>
      </div>
    </el-dialog>
    <!-- 移除 -->
    <el-dialog
      :visible.sync="dialog.visible1"
      :close-on-click-modal="false"
      class="tmdialog"
      :width="$protovar.sgtwidth"
    >
      <p class="tmheader">{{ dialog.title }}</p>
      <el-form
        :model="dialog.form"
        :label-width="$protovar.fmlabwidth"
        ref="form"
        class="dialogform sdialogform"
        id="form"
      >

        <div
          class="tmcol"
          v-show="0"
        >
          <el-form-item
            label="ID"
            prop="id"
          >
            <el-input
              v-model="dialog.form.id"
              name="id"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="tmdialog-footer pb30">
        <button
          class="primarybtn search"
          @click="hideDialog('dialog', 'visible1')"
        >取消</button>
        <button
          class="primarybtn"
          @click="formSubmit"
          :disabled="loading"
        >移除</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { vipconfig, msgTips, successTips } from '@_/axios/path';
export default {
  data () {
    return {
      filters: {
        searchkey: '',
        type: ''
      },
      data: {//数据表格
        loading: false,//表单loading
        list: [],//列表
      },
      dialog: {
        type: 'add',
        title: '',
        visible: false,
        visible1: false,
        form: {
        },
        page: '',
        // rules:{
        //     title: [
        //         {required: true,message: "请输入配置项名称",trigger: "blur"}
        //     ],
        //     name: [
        //         {required: true,message: "请输入参数名",trigger: "blur"}
        //     ],
        //     value:[
        //         {required: true,message: "请输入参数值",trigger: "blur"}
        //     ],
        //     // unit:[ {required: true,message: "请输入参数单位",trigger: "blur"}],
        //     type:[
        //         { required: true, message: '请选择参数类型', trigger: 'change' }
        //     ],
        //     page:[
        //         { required: true, message: '请选择页码', trigger: 'blur' }
        //     ],
        // }
      },
      typeList: [{ id: 1, label: "系统" }, { id: 2, label: "业务" }],
      loading: false,
      curroute: ''
    }
  },
  mounted () {
    this.curroute = this.$route.path;
    this.getData();
  },
  computed: {
    authdisable () {
      return this.authDisable(['update']);
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path == this.curroute) {
        if (this.$protovar.routehasopen != -1 && !to.query.random) {
          return;
        }
        Object.assign(this.$data, this.$options.data());
        this.curroute = this.$route.path;
        this.getData();
      }
    }
  },
  methods: {
    /* 序号 */
    indexMethod (index) {
      return (index + 1);
    },
    /* 用户数据 */
    getData () {
      this.data.loading = true;
      let ptdata = { searchkey: this.filters.searchkey, type: this.filters.type };
      vipconfig.getList(ptdata).then(res => {
        if (res.ok) {
          let data = res.data;
          if (data) {
            this.data.list = data;
          }
        } else {
          msgTips(res);
        }
        this.data.loading = false;
      })
    },
    /* 取消弹框 */
    hideDialog (dialog, visible) {
      this[dialog][visible] = false;
    },
    /* 提交表单 */
    formSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          let type = this.dialog.type;
          let res, postdata;
          console.log(this.dialog);
          postdata = $("#form").serialize() + `&type=${this.dialog.type}`;
          console.log(postdata);
          res = await vipconfig.mgConfAdd(postdata);

          if (res.ok) {
            this.dialog.visible = false;
            this.dialog.visible1 = false;
            successTips("保存成功");
            this.dialog.form = this.$options.data().dialog.form;
            this.getData();
          } else {
            msgTips(res);
          }
          this.loading = false;
        } else {
          return false;
        }
      });
    },
    /* 新增|编辑 */
    setData (type, item) {
      if (type == "add") {

        this.dialog.visible = true;
        this.dialog.type = type;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
        this.dialog.form = this.$options.data().dialog.form;
        this.dialog.title = "新增配置项";
      }
      if (type == "edit") {

        this.dialog.visible = true;
        this.dialog.type = type;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
        let data = { ...item };
        this.dialog.form = data;
        this.dialog.title = "编辑配置项";
      }
      if (type == "delete") {
        this.dialog.visible1 = true;
        this.dialog.type = type;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
        let data = { ...item };
        this.dialog.form = data;
        this.dialog.title = "移除";
      }
    },
  },
}
</script>