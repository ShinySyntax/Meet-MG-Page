import axios from 'axios';
import store from '@/store/index.js';

import JSZip from 'jszip';
import FileSaver from 'file-saver';
/* 自定义axios实例 */
let instance=axios.create({
    "baseURL":process.env.VUE_APP_apiCtx,
    "withCredentials":false,
});
let suffix=process.env.VUE_APP_sufFix;//请求接口地址后缀；例：.php
axios.defaults.withCredentials=true;
let _appcode_start=1000;
let appcode = {
    NOTLOGIN : 1 + _appcode_start,  //没有登录
    NOTPERMISSION : 4 + _appcode_start,//登录了，但是没有权限操作
    REFUSE : 5 + _appcode_start,//拒绝访问
}; 
//添加响应拦截器
instance.interceptors.response.use(function (response) {
    if(response.data.code==appcode.NOTPERMISSION){
        store.commit("setLoginDialog",{show:true,title:'系统权限发生变更，需要重新登录'});
    }
    if(response.data.code==appcode.NOTLOGIN){
        store.commit("setLoginDialog",{show:true,title:'系统登录超时,请重新登录'});
    }
    return response;
})
/* post */
export function fetchPost(url, data) {
    url=url+suffix;
    if(typeof data === 'object'){
        data=$.param(data);
    }
    return new Promise((resolve, reject) => {
        instance.post(url,data).then(response => {
            resolve(response.data);
        }).catch((error) => {
            // reject(error);
            console.error(error);
        })
    })
};

/* get */
export function fetchGet(url,param){
    let geturl=url+suffix;
    return new Promise((resolve, reject) => {
        instance.get(geturl,{ params: param })
        .then(response => {
            resolve(response.data)
        }).catch((error) => {
            // reject(error);
            console.error(error);
        })
    })
}
/* 上传文件 */
export function fetchUpload(url,formData){
    url=url+suffix;
    return new Promise((resolve, reject) => {
        instance.post(url,formData,{
            contentType: false,   
            processData: false,
        }).then(response => {
            resolve(response.data)
        }).catch((error) => {
            // reject(error);
            console.error(error);
        })
    })
}
/* 下载文件 */
export function getFile(url,filename){
    return new Promise((resolve, reject) => {
        instance.get(url,{responseType: 'arraybuffer',
        "responseType": 'blob'}).then(res => {
            resolve(res.data);
        }).catch((error) => {
            console.error(error);
        })
    })
}
/* 打包文件 */
export function handleBatchDownload(data,name){
    // const data = ['各类地址1', '各类地址2'] // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
    const zip = new JSZip();
    const cache = {};
    const promises = [];
    data.forEach(item => {
        const promise = getFile(item.url).then(data => { // 下载文件, 并存成ArrayBuffer对象
            // const arr_name = item.split("/");
            // const file_name = arr_name[arr_name.length - 1] // 获取文件名
            const file_name=item.name;
            zip.file(file_name, data, { binary: true }) // 逐个添加文件
            cache[file_name] = data
        })
        promises.push(promise)
    })
    Promise.all(promises).then(() => {
        zip.generateAsync({type:"blob"}).then(content => { // 生成二进制流
            FileSaver.saveAs(content, name) // 利用file-saver保存文件
            
        })
    })
}