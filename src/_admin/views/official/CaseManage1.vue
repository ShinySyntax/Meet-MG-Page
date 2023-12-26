<template>
    <div class="commonright container">
        <!-- 筛选 -->
        <div class="filter">
            <div class="filter-item">
                <label class="filter-label">产品名称</label>
                <el-input type="text" clearable v-model="filters.name" placeholder="产品名称"></el-input>
            </div>
            <div class="filter-item">
                <label class="filter-label">类型</label>
                <el-select v-model="filters.type" placeholder="全部" clearable>
                    <el-option v-for="item in developsCode" :key="item.code" :value="item.code" :label="item.name"></el-option>
                </el-select>
            </div>
            <div class="filter-item">
                <label class="filter-label">状态</label>
                <el-select v-model="filters.status" placeholder="全部" clearable>
                    <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="filter-btn">
                <button class="primarybtn search" @click="getData(1)" >查询</button>
            </div>
        </div>
        <!-- 数据表格 -->
        <div class="contentpad">
            <el-table :data="data.list" v-loading="data.loading" :header-cell-style="{background:$protovar.tbhabg}">
              <el-table-column label="ID" prop="id" :align="$protovar.align" width="120" ></el-table-column>
              <el-table-column label="排序" prop="cindex"  :align="$protovar.align" width="60" >
                 <template slot-scope="scope">
                        <span class="cursor cindex"  @click="edit(scope.row)">{{scope.row.cindex}}</span>
                    </template>
              </el-table-column>
              <el-table-column label="用户" :align="$protovar.align" width="160">
                  <template slot-scope="scope" >
                      <div class="user">
                          <div>
                              <el-image  :src="scope.row.avatar"  class="imgcol tmopera"></el-image>
                          </div>
                          <div class="userInfo">
                              <span class="userInfo-nick font14_666">{{scope.row.nick}} </span>
                              <span class="font12_999">ID:{{scope.row.uid}} </span>
                          </div>
                      </div>
                  </template>
                </el-table-column>
                <el-table-column label="产品/企业" width="300" :align="$protovar.align">
                    <template slot-scope="scope">
                       <div class="nameInfo">
                          <el-image @click="seeInfo(scope.row)" :src="scope.row.casecover" fit="cover" class="el-image logoimg cursor" >
                            <div slot="error" class="image-slot">
                                <img @click="seeInfo(scope.row)" src="~@_/assets/img/common/coverBg.png"  class="error-img cursor"/>
                            </div>
                          </el-image>
                          <p v-if="scope.row.status==1">
                              <a :class=" ['font14_666',scope.row.status==1?'cursor color_3A7BE9':'']" :href="scope.row.status==1?'https://www.tiocloud.com/2/case/caseInfo.html?id='+scope.row.id:''" target="_blank" v-show="scope.row.name">{{scope.row.name}}</a>
                              <a :class=" ['font12_999',scope.row.status==1?'cursor color_3A7BE9':'']" :href="scope.row.status==1?'https://www.tiocloud.com/2/case/caseInfo.html?id='+scope.row.id:''" target="_blank" v-show="scope.row.cmpname">{{scope.row.cmpname}}</a>
                          </p>
                           <p v-else>
                              <span :class=" ['font14_666',scope.row.status==1?'cursor color_3A7BE9':'']"  v-show="scope.row.name">{{scope.row.name}}</span>
                              <span :class=" ['font12_999',scope.row.status==1?'cursor color_3A7BE9':'']"  v-show="scope.row.cmpname">{{scope.row.cmpname}}</span>
                          </p>
                       </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型/URL" prop="typeviews" :align="$protovar.align" width="200">
                    <template slot-scope="scope">
                       <div class="types_url">
                            <span >{{scope.row.typeviews ||'-'}}</span>
                            <a v-if="scope.row.caseurl" :href="scope.row.caseurl ||'#'" target="_blank">{{scope.row.caseurl }}</a>
                            <span v-else>{{'-'}}</span>
                       </div>
                    </template>
                </el-table-column>
                <el-table-column style="text-align:center" label="产品介绍"  align="center" width="80">
                    <template slot-scope="scope">
                    <div style="display:flex;justify-content: center;">
                        <span class="tmopera" @click="seeInfo(scope.row)" v-auth="'reset'">查看</span>
                    </div>
                    </template>
                </el-table-column>
                 <el-table-column label="产品时间" prop="pubdate" :align="$protovar.align" width="80"></el-table-column>
                <el-table-column label="点赞" prop="praises" align="center" width="50"></el-table-column>
                <el-table-column label="阅读" prop="hits" align="center" width="70"></el-table-column>
                <el-table-column label="评论" prop="commments" align="center" width="70"></el-table-column>
                <el-table-column label="状态" :align="$protovar.align" width="70">
                    <template slot-scope="scope">
                       <span :class="['statuIcon',scope.row.status==1?'statuGreen':'statuRed']"></span>
                       <span>{{scope.row.status==1?'正常':'已禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上传时间" prop="updatetime"  width="140">
                    <template slot-scope="scope">
                     <p class="flex_column_center">
                      <span class="font14_666">{{scope.row.btDate_updatetime}}</span>
                      <span class="font12_999">{{scope.row.updatetime}}</span>
                    </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center" width="80">
                    <template slot-scope="scope">
                    <div style="display:flex;justify-content: center;">
                        <span class="tmopera" @click="edit(scope.row)" v-auth="'reset'">审核</span>
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
        <!-- 查看 -->
        <el-dialog :visible.sync="caseShow" class="caseDialog" width="855px">
          <div class="caseBody">
            <div class="case-header">
                   <el-image @click="seeInfo(scope.row)" :src="caseItemInfo.casecover" fit="cover" class="el-image logoimg" >
                        <div slot="error" class="image-slot">
                            <img src="~@_/assets/img/common/coverBg.png"  class="error-img"/>
                        </div>
                    </el-image>
              <div class="case-header-right">
                <p>{{caseItemInfo.name}}</p>
                <p>{{caseItemInfo.cmpname}}</p>
              </div>
              <span class="updateBtn cursor" @click="editorShowClick">修改</span>
            </div>
            <hr>
            <div class="case-content">
              <p v-html="caseItemInfo.content"></p>
            </div>
          </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog :visible.sync="caseEditShow" :close-on-click-modal="false" class="caseUpDialog" width="855px" height="786px">
            <div class="caseBody">
                <div class="case-header">
                  案例审核编辑
                </div>
                <div class="case-content">
                    <el-form :model="caseItemInfo" :rules="rules" ref="form" :hide-required-asterisk="true" class="dialogform" id="form">
                        <div class="tmcol">
                            <el-form-item label="用户" >
                                    <div class="user">
                                        <el-image :src="avatar" fit="cover" class="imgcol tmopera" >
                                            <div slot="error" class="image-slot">
                                                <img src="~@_/assets/img/common/avatar.jpg"  class="error-img"/>
                                            </div>
                                        </el-image>
                                        <div class="userInfo">
                                            <span class="userInfo-nick">{{caseItemInfo.nick}} </span>
                                            <span>ID:{{caseItemInfo.uid}} </span>
                                        </div>
                                    </div>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="产品名称" prop="name">
                                <el-input v-model="caseItemInfo.name" name="name"></el-input>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="公司名称">
                                <el-input v-model="caseItemInfo.cmpname" name="server"></el-input>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="URL" width="120">
                                <el-input v-model="caseItemInfo.caseurl" name="caseurl"></el-input>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="所属类型" prop="types">
                                <el-checkbox v-for="(item,index) in developsCode" v-model="item.checked" :key="index" 
                                @change="checked=>isChekedTypes(checked,index)">{{item.name}}</el-checkbox>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="封面图" prop="cmplogo">
                                <div class="casecover">
                                    <el-image  :src="caseItemInfo.casecover" fit="cover" class="el-image logoimg" >
                                        <div slot="error" class="image-slot">
                                            <img src="~@_/assets/img/common/coverBg.png"  class="error-img"/>
                                        </div>
                                    </el-image>
                                    <div class="casecovermask"></div>
                                    <div class="casecoverfile">
                                      <span class=" fileimg cursor">
                                        <input type="file" 
                                        class="cursor" @change="uploadImg" accept="image/*" /></span>
                                    <el-input v-model="caseItemInfo.casecover" class="cursor" style="display:none;"  name="cmplogo"></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                        </div> 
                        <div class="tmcol">
                            <el-form-item label="摘要" prop="summary">
                                <div class="form-summary">
                                    <el-input v-model="caseItemInfo.summary" name="server" type="textarea" 
                                  maxlength=60
                                  @input="summaryInput"></el-input>
                                    <span class="count">{{summaryCount}}/60</span>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="产品开始时间" prop="pubdate">
                                <el-date-picker v-model="caseItemInfo.pubdate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd" >
                                </el-date-picker>
                    
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="状态" prop="status">
                                <el-select v-model="caseItemInfo.status">
                                    <el-option v-for="item in statusSelect" :key="item.id" :value="item.id" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="tmcol">
                            <el-form-item label="排序号"  prop="cindex">
                                <el-input v-model="caseItemInfo.cindex" name="cindex" class="input-cindex"></el-input>
                            </el-form-item>
                        </div>
                        
                    </el-form>
                    <div class="tmdialog-footer pb30">
                        <button class="primarybtn search" @click="caseEditShow=false">取消</button>
                        <button class="primarybtn" @click="editSubmit('edit')">保存</button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog :visible.sync="editorShow" :show-close='false' class="editDialog" width="855px" height="786px">
            <div class="caseBody">
                <!-- <editor id="editor_id" height="650px" width="855px" :content.sync="editorText" :uploadJson="uploadJson"
              :allowImageUpload='true' :formatUploadUrl='true' :filePostName="filePostName" :afterChange="afterChange()" :loadStyleMode="false" :fillDescAfterUploadImage="true" @on-content-change="onContentChange">
                </editor> -->
                <el-upload
                      class="avatar-uploader"
                      action=""
                      name="img"
                      :show-file-list="false"
                      :http-request="uploadQuillImage"
                      :on-success="uploadQuillSuccess"
                      :on-error="uploadQuillError"
                      :before-upload="beforeQuillrUpload">
                </el-upload>
                <quill-editor ref="myTextEditor" v-model="editorText" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" 
                 @change="onEditorChange($event)"
                 ></quill-editor>
                <div class="tmdialog-footer pb30">
                    <button class="primarybtn search" @click="editorShow=false">取消</button>
                    <button class="primarybtn" @click="editSubmit('editor')">保存</button>
                </div>
            </div>
          </el-dialog>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {caseList,msgTips,successTips,mgdictChild,caseCoverFile} from '@_/axios/path';
import {resUrl,dataURLtoBlob,btDate} from '@_/utils/common.js';
import editor from '@_/components/kindeditor.vue'
import 'highlight.js/styles/dracula.css'



import Quill from 'quill'
import hljs from 'highlight.js'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
// import imageRresize from 'quill-image-resize-module'
// Quill.register('modules/imageResize', imageResize);



  //quill图片可拖拽改变大小
// import imageResize from 'quill-image-resize-module'
// Quill.register('modules/imageResize', imageResize)
export default {
    data(){
        return {
            filters:{
                name:'',
                type:'',
                status:''
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
            caseShow:false,
            caseItemInfo:{},//查看数据信息
            caseEditShow:false,
            statusSelect:[
              {
                id:1,
                label:"通过"
              },
              {
                id:2,
                label:"未通过"
              }
            ],
            developsCode:[],
            summaryCount:0,
            rules:{
                    name: [
                        {required: true,message: "请输入产品名称",trigger: "blur"}
                    ],
                    types: [
                        {required: true,message: "请选择所属类型",trigger: "blur"}
                    ],
                    casecover:[
                        {required: true,message: "请上传封面图",trigger: "blur"}
                    ],
                    summary:[
                        { required: true, message: '请输入摘要', trigger: 'blur' }
                    ],
                    pubdate:[
                        { required: true, message: '请选择产品开始时间', trigger: 'change' }
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                    cindex:[
                        { required: true, message: '排序号', trigger: 'blur' }
                    ],
            },
            editorText: '直接初始化值', // 双向同步的变量
            editorTextCopy: '', // content-change 事件回掉改变的对象
            editorShow:false,
            avatar:"",
            uploadJson:"",
            filePostName:'uploadFile',
            statusList:[{id:1,label:'审核通过'},{id:2,label:'未通过'}],
            content:null,
            editorOption:{
                // placeholder设置提示词
                placeholder: '请输入正文......',
                readyOnly: false, //是否只读
                theme: 'snow', //主题 snow/bubble
                syntax: true, //语法检测
                // modules设置工具栏
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        ['formula'],
                        ['clean'],
                        ['link', 'image', 'video'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }], 
                        [{ 'font': [] }],
                        [{ 'align': [] }]
                    ],
                    handlers: {
                        'image': function (value) {
                            if (value) {
                                // 触发input框选择图片文件
                                document.querySelector('.avatar-uploader input').click()
                            } else {
                                this.quill.format('image', false);
                            }
                        }
                    },
                    syntax: {
                      highlight: text => hljs.highlightAuto(text).value
                    },
                }
            }
        }
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor;
      }
    },
    create(){
    },
    mounted(){
      let suffix=process.env.VUE_APP_sufFix;//请求接口地址后缀；例：.php
      this.uploadJson = process.env.VUE_APP_apiCtx+"/tiocase/caseCover"+suffix
      this.curroute=this.$route.path;
      this.getData();
      this.getMgdictChild()
    },
    components:{
      editor,
      quillEditor
    },
    methods:{
        /* 案例数据 */
        getData(item){
            if(item){
                this.data.pageNumber=item;
            }
            this.data.loading=true;
            let {pageNumber,pageSize}=this.data;
            let ptdata={...this.filters,pageNumber,pageSize};
            caseList.tiocaseList(ptdata).then(res=>{
                if(res.ok){
                    let data=res.data;
                    if(data){
                        this.data.totalRow=data.totalRow;
                        let list=data.list;
                        list.map(item=>{
                            item.avatar=resUrl(item.avatar);
                            item.casecover= resUrl(item.casecover);
                            item.pubdate = item.pubdate.substring(0,7)
                            item.praises = item.praises||0
                            item.hits = item.hits||0
                            item.commments = item.commments||0
                            item.btDate_updatetime = btDate(item.updatetime)
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
        },
        /* 查看 */
        seeInfo(item){
            this.getTiocaseInfo(item)
            this.caseShow = true
        },
        /**案例详情 */
        async getTiocaseInfo(item){
          let cid = item.id
          await  caseList.tiocaseInfo({cid}).then(res=>{
                if(res.ok){
                    res.data.casecover = resUrl(res.data.casecover);
                    res.data.avatar = resUrl(item.avatar);
                    this.caseItemInfo = res.data
                }else{
                    msgTips(res);
                }
            })
        },
        /**案例审核编辑弹窗显示 */
        edit(item){
          this.avatar = resUrl(item.avatar)
          this.caseEditShow = true
          this.summaryCount = item.summary.length
          this.getTiocaseInfo(item)
          this.getDevelopCode(item)
        },
        /* 研发项目字典、费用类型字典 */
        async getMgdictChild(){
            let res=await mgdictChild({pcode:'case_product_type'})
            if(res.ok){
                this.developsCode=res.data;
            }else{
                msgTips(res);
            }
        },
        /**回显类型 */
        getDevelopCode(item){
            this.developsCode.map(ite=>{
                ite.checked = false
            })
            var types = item.types.split(",")
                types.map(items=>{
                    this.developsCode.map(ite=>{
                        if(items==ite.code){
                            ite.checked = true
                        }
                    })
                })
        },
        /**摘要字数 */
        summaryInput(e){
          this.summaryCount = e.length
        },
        /**勾选类型 */
        isChekedTypes(e,index){
          this.developsCode[index].checked = e
          this.$set(this.developsCode, index, this.developsCode[index])
        },
        /* 上传处理数据 */
        uploadImg(event){
            let _this=this,
                file = event.currentTarget.files[0],
                reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onload = function (e) { 
                let blob=dataURLtoBlob(this.result);
                let fd=new FormData();
                fd.append("uploadFile",blob,file.name);
               caseCoverFile(fd).then(res=>{
                    if(res.ok){
                        _this.caseItemInfo.casecover=resUrl(res.data.url);
                    }else{
                        msgTips(res);
                    }
                })
                event.target.value="";
            }
        },
        /**获取富文本编辑器内容 */
        onContentChange (val) {
            this.editorTextCopy = val;
        },
        afterChange () {},
        /**显示富文本编辑器 */
        editorShowClick(){
            this.editorShow = true
            this.editorText = this.caseItemInfo.content
        },
        /**提交 */
        editSubmit(type){
          var typeviewsArr = [],typesArr=[],typeviews="",types=""
          this.developsCode.map(item=>{
            if(item.checked===true){
              typeviewsArr.push(item.name)
              typesArr.push(item.code)
            }
          })
          typeviews = typeviewsArr.toString() 
          types = typesArr.toString() 
           let { summary, casecover, cindex, cmpname,name,pubdate,status,caseurl,content,coverself,id,contentid } = this.caseItemInfo
           let data = {
             summary,
             casecover,
             cindex,
             cmpname,
             name,
             pubdate,
             status,
             typeviews,
             types,
             caseurl,
             coverself,
             id,
             content,
             contentid
           }
           if(type==="editor"){
             let { typeviews, types} = this.caseItemInfo
             data.content = this.editorTextCopy
             data.typeviews = typeviews
             data.types = types
           }
          caseList.tiocaseUpdate(data).then(res=>{
            if(res.ok){
              this.caseEditShow = false
              this.editorShow = false
              this.caseItemInfo.content = this.editorTextCopy
              this.getData();
            }else{
              msgTips(res.msg)
            }
          })
        },
        /**quill */
        uploadQuillImage: function (e) {//这是上传图片的函数，可以改成自己的，成功返回一个地址插入光标处
            let that = this;
            // 获取富文本组件实例
            let quill = this.$refs.myQuillEditor.quill
            let func_s = function (data) {
                that.$message({
                    message: '上传成功',
                    type: 'success'
                });
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片  data.url为服务器返回的图片地址
                quill.insertEmbed(length, 'image', data.url)
                // 调整光标到最后
                quill.setSelection(length + 1)
            };
            let func_f = function (err) {
                that.$message.error('上传失败');
            };
            // loading动画消失
            this.quillUpdateImg = false
            upload.upload(e, func_s, func_f);
        },
        beforeQuillrUpload: function (file) {
            // 显示loading动画
            this.quillUpdateImg = true//这是我封装的一个判断是否上传为图片，图片大小的公共函数，自己可自定义
            Utils.base.beforeAvatarUpload(file);
        },
        // 成功失败回调
        uploadQuillSuccess() {
        },
        uploadQuillError() {
            // loading动画消失
            this.quillUpdateImg = false
            this.$message.error('图片插入失败')
        },
        onEditorReady(editor) { // 准备编辑器
        },
        onEditorBlur(e) {
        }, // 失去焦点事件
        onEditorFocus() {
            // console.log(this.$refs.myQuillEditor.quill.getSelection().index,'获取示例')
        }, // 获得焦点事件
        onEditorChange(e) {
          console.log(e)
            // this.$emit('changeQuill', this.content)//将值绑定到changeQuill上传递过去,引入组件的时候监听这个值，可以拿到改变的值，
        }, // 内容改变事件
    },
}
</script>
<style lang="less" scoped>
@import "~@_/assets/style/less/official/caseManage.less";
</style>