<template>
    <!--    这是一个富文本的组件-->
    <div class="editor_wrap">
        <!-- <el-upload
            class="avatar-uploader"
            action=""
            name="img"
            :show-file-list="false"
            :http-request="uploadQuillImage"
            :on-success="uploadQuillSuccess"
            :on-error="uploadQuillError"
            :before-upload="beforeQuillrUpload">
        </el-upload> -->
        <el-row v-loading="quillUpdateImg">
            <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
            </quill-editor>
        </el-row>
    </div>
</template>

<script>
    // import upload from '../../utils/api/index' // 这里我封装的一个上传图片的，返回一个url地址，将它插入光标位置
    import Quill from 'quill' //引入编辑器
    import {quillEditor} from "vue-quill-editor";
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    // 自定义字体大小
    let Size = Quill.import('attributors/style/size')
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px']
    Quill.register(Size, true)

    //quill编辑器的字体
    var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
    var Font = Quill.import('formats/font');
    Font.whitelist = fonts; //将字体加入到白名单
    Quill.register(Font, true);
    //quill图片可拖拽改变大小
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageResize', ImageResize)

    // 富文本工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': Size.whitelist}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': fonts}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ];
    export default {
        name: "quillEditorCom",
        data() {
            return {
                                content: this.quillContent, // 我们不能直接使用props传过来的值，先赋值到这里
                // 富文本配置项
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                editorOption: {
                    placeholder: '',
                    theme: 'snow',  // or 'bubble'
                    modules: {
                        imageResize: { //调整大小组件。
                            displayStyles: {
                                backgroundColor: 'black',
                                border: 'none',
                                color: 'white'
                            },
                            modules: ['Resize', 'DisplaySize', 'Toolbar']
                        },
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector('.avatar-uploader input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
            }
        },
        props: ['quillContent'],
        components: {quillEditor},
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },
        methods: {
            uploadQuillImage: function (e) {
                           // 这是上传图片的函数，可以改成自己的，成功返回一个地址插入光标处
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
                this.quillUpdateImg = true //】这是我封装的一个判断是否上传为图片，图片大小的公共函数，自己可自定义
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
                console.log(this.$refs.myQuillEditor.quill.getSelection().index,'获取示例')
            }, // 获得焦点事件
            onEditorChange() {
                this.$emit('changeQuill', this.content)//将值绑定到changeQuill上传递过去,引入组件的时候监听这个值，可以拿到改变的值，
            }, // 内容改变事件
        }
    }
</script>

<style scoped lang="less">
    .ql-toolbar {
        white-space: normal;
    }

    .editor_wrap /deep/ .avatar-uploader {
        display: none;
    }

    .editor_wrap /deep/ .editor {
        line-height: normal !important;
        height: 270px;
        margin-bottom: 60px;
    }

    .editor_wrap /deep/ .editor .ql-bubble .ql-editor a {
        color: #136ec2;
    }

    .editor_wrap /deep/ .editor img {
        max-width: 720px;
        margin: 10px;
    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
        content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: '保存';
        padding-right: 0px;
    }
</style>
