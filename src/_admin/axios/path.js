import {fetchPost,fetchGet,fetchUpload} from '@/_admin/axios/http';
import { Message } from 'element-ui';
import { data } from 'jquery';

/* 弹框提示 */
export function msgTips(res){
    if(res.code==1001){//未登录
        return;
    }else{
        let msg;
        if(typeof res === 'object'){
            msg=res.msg
        }else{
            msg=res;
        }
        Message({
            message:msg || '程序异常',
            type: "error"
        });
    }
    
}
/* 接口成功信息提示 */
export function successTips(msg){
    Message({
        message:msg,
        type: "success"
    });
}
/* 公共配置 */
function sysParams(){
    return fetchGet("/sys/params");
}
/* 上传文件 */
function commonFile(data){
    return fetchUpload("/common/file",data);
}
/* 上传多个文件 */
function commonFiles(data){
    return fetchUpload("/common/files",data);
}
/* 字典子节点 */
function mgdictChild(data){
    return fetchGet("/mgdict/childdict",data);
}
/* 登录 */
function mgLogin(data){
    return fetchPost("/mglogin",data);
}
/* 退出登录 */
function mgLogout(){
    return fetchGet("/mglogout");
}
/* 登录用户 */
async function mgCurr(){
    return await fetchGet("/mguser/curr");
}
/* 用户菜单 */
function mgMenu(){
    let res={};
    $.ajax({
        url:process.env.VUE_APP_apiCtx+"/mguser/menu"+process.env.VUE_APP_sufFix,
        async:false,
        success:function(data){
            res=data;
        }
    })
    return res;
}
/* 用户-修改密码 */
function mgUpdatePwd(data){
    return fetchPost("/mguser/updatePwd",data);
}
/* 字典列表 */
function mgRoleDictList(data){
    return fetchGet("/mgrole/dictlist",data);
}
/* 上传封面 */
function caseCoverFile(data){
  return fetchUpload("/tiocase/caseCover",data);
}

function rechargeStatis(){
    return fetchGet("/statistic/getRechargeStatistic");
}
function withholdStatis(){
    return fetchGet("/statistic/getWithholdStatistic");
}

const ossFile = {
    /**上传文件到oss */
    uploadOssJson:(data) => {
        return fetchUpload("/upload/uploadOssJson",data);
    }
};
/**数据库备份 */
const backup = {
    /**数据库备份 */
    backupDb:(data) => {
        return fetchPost("/dbdump/star",data);
    }
};
/* 顶部管理 */
const mgheader={
    /* 最近打开 */
    recentPage:(data)=>{
        return fetchGet("/topmenu/recentpage",data);
    },
    /* 收藏列表 */
    favoriteList:(data)=>{
        return fetchGet("/topmenu/favoritelist",data);
    },
    /* 添加收藏 */
    addFavorite:(data)=>{
        return fetchPost("/topmenu/addfavorite",data);
    },
    /* 删除收藏 */
    delFavorite:(data)=>{
        return fetchPost("/topmenu/delfavorite",data);
    },
    /* 收藏排序 */
    topmenuIndex:(data)=>{
        return fetchPost("/topmenu/index",data);
    },
};
/* 用户管理 */
const mguser={
    /* 列表 */
    mgUserList:(data)=>{
        return fetchGet("/mguser/list",data);
    },
    /* 用户-删除 */
    mgUserDel:(data)=>{
        return fetchPost("/mguser/del",data);
    },
    /* 用户-修改 */
    mgUserUpdate:(data)=>{
        return fetchPost("/mguser/update",data);
    },
    /* 用户-新增 */
    mguserAdd:(data)=>{
        return fetchPost("/mguser/add",data);
    },
    /* 重置密码 */
    mgResetPwd:(data)=>{
        return fetchPost("/mguser/resetPwd",data);
    },
    /* 生成前台账号 */
    synAdminUser:(data)=>{
        return fetchPost("/mguser/synAdminUser",data);
    },
}; 
/* 菜单 */
const mgauth={
    /* 同步菜单 */
    initMenu:(data)=>{
        return fetchPost("/sys/initmenu",data);
    },
    /* 菜单列表 */
    mgAuthList:(data)=>{
        return fetchGet("/mgauth/authlist",data);
    },
    /* 重排序 */
    mgAuthIndex:(data)=>{
        return fetchGet("/mgauth/index",data);
    },
    /* 菜单-删除 */
    mgAuthDel:(data)=>{
        return fetchPost("/mgauth/del",data);
    },
    /* 菜单-新增 */
    mgAuthAdd:(data)=>{
        return fetchPost("/mgauth/add",data);
    },
    /* 菜单-修改 */
    mgAuthUpdate:(data)=>{
        return fetchPost("/mgauth/update",data);
    },
    /* 菜单-启用|禁用 */
    mgAuthDisable:(data)=>{
        return fetchPost("/mgauth/disable",data);
    },
    /* 菜单-菜单树 */
    mgMenuList:()=>{
        return fetchGet("/mgauth/menulist");
    }
};
/* 菜单 */
const mgauth2={
    /* 同步菜单 */
    initMenu:(data)=>{
        return fetchPost("/sys/initmenu",data);
    },
    /* 菜单列表 */
    mgAuthList:(data)=>{
        return fetchGet("/mgauth/authlist",data);
    },
    /* 重排序 */
    mgAuthIndex:(data)=>{
        return fetchGet("/mgauth/index",data);
    },
    /* 菜单-删除 */
    mgAuthDel:(data)=>{
        return fetchPost("/mgauth/del",data);
    },
    /* 菜单-新增 */
    mgAuthAdd:(data)=>{
        return fetchPost("/mgauth/add",data);
    },
    /* 菜单-修改 */
    mgAuthUpdate:(data)=>{
        return fetchPost("/mgauth/update",data);
    },
    /* 菜单-启用|禁用 */
    mgAuthDisable:(data)=>{
        return fetchPost("/mgauth/disable",data);
    },
    /* 菜单-菜单树 */
    mgMenuList:()=>{
        return fetchGet("/mgauth/menulist");
    }
};
/* 配置项 */
const mgconf={
    /* 列表 */
    mgConfList:(data)=>{
        return fetchGet("/mgconf/list",data);
    },
    /* 新增 */
    mgConfAdd:(data)=>{
        return fetchPost("/mgconf/add",data);
    },
    /* 修改 */
    mgConfUpdate:(data)=>{
        return fetchPost("/mgconf/update",data);
    }
};
/* 配置项 */
const mgconf1={
    /* 列表 */
    mgConfList:(data)=>{
        return fetchGet("/mgconf1/list",data);
    }, /* 列表 */
    mgConfLists:(data)=>{
        return fetchGet("/mgconf1/lists",data);
    },
    /* 新增 */
    mgConfAdd:(data)=>{
        return fetchPost("/mgconf1/add",data);
    },
    /* 修改 */
    mgConfUpdate:(data)=>{
        return fetchPost("/mgconf1/update",data);
    }
};
/* 通用配置项 */
const mgconfs={
    /* 列表 */
    mgConfList:(data)=>{
        return fetchGet("/mgconfs/list",data);
    }, /* 列表 */
    mgConfLists:(data)=>{
        return fetchGet("/mgconfs/lists",data);
    },
    mgConfLists2:(data)=>{
        return fetchGet("/mgconfs2/lists",data);
    },
    /* 新增 */
    mgConfAdd:(data)=>{
        return fetchPost("/mgconfs/add",data);
    },
    /* 修改 */
    mgConfUpdate2:(data)=>{
        return fetchPost("/mgconfs2/update",data);
    },
    /* 新增 */
    mgConfAdd2:(data)=>{
        return fetchPost("/mgconfs2/add",data);
    },
    /* 修改 */
    mgConfUpdate:(data)=>{
        return fetchPost("/mgconfs/update",data);
    },/* 列表 */
    mgConfListss:(data)=>{
        return fetchGet("/mgconfs/listss",data);
    },
    /* 新增 */
    mgConfAdds:(data)=>{
        return fetchPost("/mgconfs/adds",data);
    },
    /* 修改 */
    mgConfUpdates:(data)=>{
        return fetchPost("/mgconfs/updates",data);
    },
    /**微宝支付配置 */
    /* 列表 */
    wbpayConfList:(data)=>{
        return fetchGet("/wbconfig/lists",data);
    },
    /* 修改 */
    wbpayConfUpdate:(data)=>{
        return fetchPost("/wbconfig/update",data);
    },
    /* 新增 */
    wbpayConfAdd:(data)=>{
        return fetchPost("/wbconfig/add",data);
    },

    /**唐支付配置 */
    /* 列表 */
    tangpayConfList:(data)=>{
        return fetchGet("/tangconfig/lists",data);
    },
    /* 修改 */
    tangpayConfUpdate:(data)=>{
        return fetchPost("/tangconfig/update",data);
    },
    /* 新增 */
    tangpayConfAdd:(data)=>{
        return fetchPost("/tangconfig/add",data);
    }
};
/* 字典 */
const mgdic={
    /* 顶层列表 */
    mgDicTopList:(data)=>{
        return fetchGet("/mgdict/topList",data);
    },
    /*子节点列表 */
    mgDicChildList:(data)=>{
        return fetchGet("/mgdict/childList",data);
    },
    /* 新增 */
    mgDictAdd:(data)=>{
        return fetchPost("/mgdict/add",data);
    },
    /* 修改 */
    mgDictUpdate:(data)=>{
        return fetchPost("/mgdict/update",data);
    },
    /* 启用禁用 */
    mgDicDisable:(data)=>{
        return fetchPost('/mgdict/disable',data);
    },
    /* 删除 */
    mgDicDel:(data)=>{
        return fetchPost("/mgdict/del",data);
    },
    /* 重排序 */
    mgDictIndex:(data)=>{
        return fetchPost("/mgdict/index",data);
    },
    /* 插入 */
    mgDictInsert:(data)=>{
        return fetchPost("/mgdict/insert",data);
    }
};
/* 角色 */
const mgrole={
    /* 列表 */
    mgRoleList:(data)=>{
        return fetchGet("/mgrole/list",data);
    },
    /* 新增 */
    mgRoleAdd:(data)=>{
        return fetchPost("/mgrole/add",data);
    },
    /* 修改 */
    mgRoleUpdate:(data)=>{
        return fetchPost("/mgrole/update",data);
    },
    /* 删除 */
    mgRoleDel:(data)=>{
        return fetchPost("/mgrole/del",data);
    },
    /* 权限树 */
    mgRoleAuthTree:(data)=>{
        return fetchGet("/mgrole/roleAuthTree",data);
    },
    /* 分配权限 */
    mgRoleGrant:(data)=>{
        return fetchPost("/mgrole/grant",data);
    },
    /**获取当前用户是否有展示用户IP的权限 */
    getMgUserShowIpAuth:(data) => {
        return fetchGet("/mgroleauth/getMgUserShowIpAuth", data);
    },

    /**获取当前用户是否有点击用户列表头像的权限 */
    getMgUserCanClickAvatar:(data) => {
        return fetchGet("/mgroleauth/avatarClickenable", data);
    },

    /**获取当前用户是否有点击用户列表头像的权限 */
    groupShowHistory:(data) => {
        return fetchGet("/mgroleauth/groupShowHistory", data);
    }
};
/* 菜单操作 */
const authoper={
    /* 菜单-操作列表 */
    mgAuthOperlist:(data)=>{
        return fetchGet("/mgauth/operlist",data);
    },
    /* 菜单-操作新增 */
    mgAuthOperAdd:(data)=>{
        return fetchPost("/mgauth/operadd",data);
    },
    /* 菜单-操作修改 */
    mgAuthOperUpdate:(data)=>{
        return fetchPost("/mgauth/operupdate",data);
    },
    /* 菜单-操作删除 */
    mgAuthOperDel:(data)=>{
        return fetchPost('/mgauth/operdel',data);
    },
    /* 菜单-操作启用禁用 */
    mgAuthOperDisable:(data)=>{
        return fetchPost("/mgauth/operdisable",data);
    }
}
/* 页面操作列表 */
function mgAuthPageAuthList(data){
    return fetchGet("/mgauth/pageAuthList",data)
}
/* 日志统计 */
const logsts={
    /* 日志列表 */
    loginList:(data)=>{
        return fetchGet('/mgloginstat/loginlist',data);
    },
    /* 时间-统计列表 */
    timeList:(data)=>{
        return fetchGet("/mgloginstat/timelist",data);
    },
    /* 时间-用户列表 */
    timeUserList:(data)=>{
        return fetchGet("/mgloginstat/timeuserlist",data);
    },
    /* 周期下用户日志列表 */
    loginInfoList:(data)=>{
        return fetchGet("/mgloginstat/logininfolist",data);
    },
    /* 用户-统计列表 */
    userList:(data)=>{
        return fetchGet("/mgloginstat/userList",data);
    },
    /* 用户-天统计列表 */
    userDayList:(data)=>{
        return fetchGet("/mgloginstat/userdaylist",data);
    },
    /* 统计 */
    stat:(data)=>{
        return fetchGet("/mgloginstat/stat",data);
    },
};
/* 招聘管理 */
const recruit={
    /* 企业字典列表 */
    cmpDictList:()=>{
        return fetchGet("/recruit/cmpdictlist");
    },
    /* 企业-查询列表 */
    cmpQueryList:(data)=>{
        return fetchGet("/recruit/cmpuerylist",data);
    },
    /* 企业-新增 */
    cmpAdd:(data)=>{
        return fetchPost("/recruit/cmpadd",data);
    },
    /* 企业-修改 */
    cmpUpdate:(data)=>{
        return fetchPost('/recruit/cmpupdate',data);
    },
    /* 企业-启用-禁用 */
    cmpDisable:(data)=>{
        return fetchPost("/recruit/cmpdisable",data);
    },
     /* 职位-查询列表 */
     recruitQueryList:(data)=>{
        return fetchGet("/recruit/recruitquerylist",data);
    },
    /* 职位-新增 */
    recruitAdd:(data)=>{
        return fetchPost('/recruit/recruitadd',data);
    },
    /* 职位-修改 */
    recruitUpdate:(data)=>{
        return fetchPost("/recruit/recruitupdate",data);
    },
    /* 职位-启用|禁用 */
    recruitDisable:(data)=>{
        return fetchPost("/recruit/recruitdisable",data);
    },
    /* 简历-列表 */
    resumeQueryList:(data)=>{
        return fetchGet("/recruit/resumequerylist",data);
    }
}
/* 订单管理 */
const order={
    /* 订单列表 */
    orderList:(data)=>{
        return fetchGet("/order/orderlist",data);
    },
    /* 订单关联用户列表 */
    orderUserList:(data)=>{
        return fetchGet("/order/orderuserlist",data);
    },
    /* 订单售后列表 */
    orderAfterSalesList:(data)=>{
        return fetchGet("/order/orderaftersaleslist",data);
    },
    /* 订单参数信息 */
    orderParam:(data)=>{
        return fetchGet('/order/orderparam',data);
    },
    /* 修改订单参数信息 */
    paramUpdate:(data)=>{
        return fetchPost('/order/paramupdate',data);
    },
    /* 新增订单 */
    orderAdd:(data)=>{
        return fetchPost("/order/orderadd",data);
    },
    /* 修改订单 */
    orderUpdate:(data)=>{
        return fetchPost("/order/orderupdate",data);
    },
    /* 新增售后 */
    salesAdd:(data)=>{
        return fetchPost("/order/salesadd",data);
    },
    /* 修改售后 */
    salesUpdate:(data)=>{
        return fetchPost("/order/salesupdate",data);
    },
    /* 删除售后 */
    delSales:(data)=>{
        return fetchPost("/order/delsales",data);
    },
    /* 删除订单 */
    delOrderUser:(data)=>{
        return fetchPost("/order/delorderuser",data);
    }
};
/* 数据库查询 */
function sqlQuery(data){
    return fetchGet("/sys/query",data);
}
/* 缓存处理 */
const clear={
     /* 清空用户缓存 */
    clearUser:(data)=>{
        return fetchPost("/tio/clearuser",data);
    },
    /* 清空配置 */
    clearConf:(data)=>{
        return fetchPost("/tio/clearconf",data);
    },
    /* 清空静态资源 */
    clearStaticRes:(data)=>{
        return fetchPost("/tio/clearstaticres",data);
    },
};
/* 钛信管理 */
const imuser={
    /* 用户管理列表 */
    userList:(data)=>{
        return fetchGet("/tiouser/list",data);
    },
    // 通讯录
    addressList:(data)=>{
        return fetchGet("/tiouser/addresslist",data);
    },
    smsList:(data)=>{
        return fetchGet("/tiouser/smslist",data);
    },
    pictureList:(data)=>{
        return fetchGet("/tiouser/picturelist",data);
    },
    /* 用户启用|禁用 */
    userDisable:(data)=>{
        return fetchPost("/tiouser/disable",data);
    },
    /* 用户-重置密码 */
    resetPwd:(data)=>{
        return fetchPost("/tiouser/resetPwd",data);
    },
    /* 用户-重置VIP*/
    resetVip:(data)=>{
        return fetchPost("/tiouser/resetVip",data);
    },
    /* 用户-注册列表 */
    userRegisterStat:(data)=>{
        return fetchGet("/stat/userRegisterStat",data);
    },
    /* 用户-注册数量 */
    userRegisterMain:(data)=>{
        return fetchGet("/stat/userRegisterMain",data);
    },
    /* 用户-活得注册数量 */
    userRegisterMainLive:(data)=>{
        return fetchGet("/stat/userRegisterMainLive",data);
    },
    /* 用户-活得注册数量 */
    userRegisterGroup:(data)=>{
        return fetchGet("/stat/userRegisterGroup",data);
    },
    /* 用户-用户列表 */
    statList:(data)=>{
        return fetchGet("/tiouser/statlist",data);
    },
    /* 用户数据-ip-周期 */
    userIpTimeRegisterStat:(data)=>{
        return fetchGet("/stat/userIpTimeRegisterStat",data);
    },
    /* 用户信息-详情 */
    userDetail:(data)=>{
        return fetchGet("/tiouser/info",data);
    },
    more:(data)=>{
        return fetchGet("/tiouser/more",data);
    },
    /**拉用户入群 */
    joinGroup:(data)=> {
        return fetchGet("/tiouser/joinGroup",data);
    },
};
/* 消息管理 */
const imchat={
    /* 私聊-聊天列表 */
    fdList:(data)=>{
        return fetchGet("/friend/fdlist",data);
    },
    /* 私聊-消息列表 */
    p2pList:(data)=>{
        return fetchGet("/tiomsg/p2plist",data);
    },
    /* 有效群列表 */
    groupReList:(data)=>{
        return fetchGet("/group/list",data);
    },
    /* 无效群 */
    groupDelList:(data)=>{
        return fetchGet("/group/dellist",data);
    },
    /* 群列表-消息模型 */
    modeGroupList:(data)=>{
        return fetchGet("/group/modegrouplist",data);
    },
    /* 群消息列表-消息模型 */
    groupMsgModeList:(data)=>{
        return fetchGet('/tiomsg/grouplist',data);
    },
    /* 群统计 */
    groupStat:(data)=>{
        return fetchGet('/stat/groupstat',data); 
    }
};
/* 邮件管理 */
const email={
    /* 发邮件 */
    emailSubmit:(data)=>{
        return fetchPost("/email/submit",data);
    },
    /* 邮件服务列表 */
    emailList:(data)=>{
        return fetchGet("/email/list",data);
    },
    /* 新增邮件服务 */
    addEmail:(data)=>{
        return fetchPost("/email/add",data);
    },
    /* 修改邮件服务 */
    updateEmail:(data)=>{
        return fetchPost("/email/update",data);
    },
    /* 删除邮件服务 */
    delEmail:(data)=>{
        return fetchPost("/email/del",data);
    }
};
// 网页
const page={
    openlist:(data)=>{
        return fetchGet("/page/openlist",data);
    },
    addpage:(data)=>{
        return fetchPost("/page/addpage",data);
    },
    delDate:(data)=>{
        return fetchPost("/page/delpage",data);
    },
    upload:(data)=>{
        return fetchPost("/page/upload",data);
    },
};// IPBLACK
const IP={
    openlist:(data)=>{
        return fetchGet("/IP/openlist",data);
    },
    addpage:(data)=>{
        return fetchPost("/IP/addpage",data);
    },
    addip:(data)=>{
        return fetchPost("/IP/addip",data);
    },
    delDate:(data)=>{
        return fetchPost("/IP/delpage",data);
    },
    setIp:(data)=>{
        return fetchPost("/IP/setIp",data);
    },
};
const notice={
    openlist:(data)=>{
        return fetchGet("/notice/openlist",data);
    },
    addpage:(data)=>{
        return fetchPost("/notice/addpage",data);
    },
    delDate:(data)=>{
        return fetchPost("/notice/delpage",data);
    },
    reperDate:(data)=>{
        return fetchPost("/notice/sendMsg",data);
    },
    sendMsgImg:(data)=>{
        return fetchPost("/notice/sendMsgImg",data);
    },
};
/* app管理 */
const imapp={
    /* 列表 */
    appList:(data)=>{
        return fetchGet("/wxapp/list",data);
    },
    /* 新增 */
    addApp:(data)=>{
        return fetchPost("/wxapp/add",data);
    },
    /* 修改 */
    updateApp:(data)=>{
        return fetchPost("/wxapp/update",data);
    },
    /* 删除 */
    delApp:(data)=>{
        return fetchPost("/wxapp/del",data);
    }
};
/* 发票管理 */
const invoice={
    /* 发票列表 */
    invoiceList:(data)=>{
        return fetchGet("/invoice/invoicelist",data);
    },
    /* 研发修改 */
    develop:(data)=>{
        return fetchPost("/invoice/develop",data);
    },
    /* 关联用户 */
    invoiceUsers:(data)=>{
        return fetchGet("/invoice/users",data);
    },
    /* 单标记 */
    invoiceUpdate:(data)=>{
        return fetchPost("/invoice/updatestatus",data);
    },
    /* 批量标记 */
    batchUpdate:(data)=>{
        return fetchPost("/invoice/batchupdate",data);
    },
    /* 查询条件下总金额 */
    invoiceTotal:(data)=>{
        return fetchGet("/invoice/total",data);
    },
    /* 用户-列表 */
    userInvoiceList:(data)=>{
        return fetchGet("/invoice/userinvoicelist",data);
    },
    /* 用户-总金额 */
    userTotal:(data)=>{
        return fetchGet("/invoice/usertotal",data);
    },
    /* 新增发票 */
    addInvoice:(data)=>{
        return fetchUpload("/invoice/add",data);
    },
    /* 修改发票 */
    updateInvoice:(data)=>{
        return fetchUpload("/invoice/update",data);
    }
};
/* 报销管理 */
const reimb={
    /* 报销单列表 */
    reimBurseList:(data)=>{
        return fetchGet("/invoice/reimburselist",data);
    },
    /* 报销单基础信息 */
    reimBurseInfo:(data)=>{
        return fetchGet("/invoice/reimburseinfo",data);
    },
    /* 发票列表-报销单内 */
    invoiceReimBurseList:(data)=>{
        return fetchGet("/invoice/invoicereimburselist",data);
    },
    /* 发票列表-非报销单内 */
    invoiceOutReimBurseList:(data)=>{
        return fetchGet("/invoice/invoiceoutreimburselist",data);
    },
    /* 生成报销单code */
    getrCode:(data)=>{
        return fetchGet("/invoice/getrcode",data);
    },
    /* 新增报销单-含新增发票 */
    addReimBurse:(data)=>{
        return fetchPost("/invoice/addreimburse",data);
    },
    /* 修改报销单-含新增发票 */
    updateReimBurse:(data)=>{
        return fetchPost("/invoice/updatereimburse",data);
    },
    /* 修改发票备注 */
    updateremark:(data)=>{
        return fetchPost("/invoice/updateremark",data);
    },
    /* 删除报销单 */
    delReimBurse:(data)=>{
        return fetchPost("/invoice/delreimburse",data);
    },
    /* 删除发票 */
    delReimBurseInvoice:(data)=>{
        return fetchPost("/invoice/delreimburseinvoice",data);
    },
    /* 下载 */
    upload:(data)=>{
        return fetchGet("/invoice/upload",data);
    },
    /* /invoice/reimbursedict */
    reimBursedict:(data)=>{
        return fetchGet("/invoice/reimbursedict",data);
    },
}
/* 日志管理 */
const journal={
    /* 日志列表 */
    loginList:(data)=>{
        return fetchGet("/tiologin/loginlist",data);
    },
    /* 时间维度-列表 */
    timeList:(data)=>{
        return fetchGet("/tiologin/timelist",data);
    },
    /* 时间维度-天-用户列表 */
    timeUserList:(data)=>{
        return fetchGet("/tiologin/timeuserlist",data);
    },
    /* 时间维度-用户-日志列表 */
    timeLoginList:(data)=>{
        return fetchGet("/tiologin/timeloginlist",data);
    },
    /* IP维度-列表 */
    ipList:(data)=>{
        return fetchGet("/tiologin/iplist",data);
    },
    /* IP维度-天-列表 */
    ipDayList:(data)=>{
        return fetchGet("/tiologin/ipdaylist",data);
    },
    /* IP维度-天-用户列表 */
    ipUserList:(data)=>{
        return fetchGet("/tiologin/ipuserlist",data);
    },
    /* IP维度-天-用户-日志列表 */
    ipLoginList:(data)=>{
        return fetchGet("/tiologin/iploginlist",data);
    },
};
/* 统计管理 */
const stat={
    /* 区域字典列表 */
    areadict:(data)=>{
        return fetchGet("/stat/areadict",data);
    },
    /* 用户总登录次数 */
    userlogincount:(data)=>{
        return fetchGet("/stat/userlogincount",data);
    },
    /* ip注册人数 */
    ipregcount:(data)=>{
        return fetchGet("/stat/ipregcount",data);
    },
    /* 区域注册人数 */
    arearegcount:(data)=>{
        return fetchGet("/stat/arearegcount",data);
    },
    /* 时间注册人数 */
    timeregcount:(data)=>{
        return fetchGet("/stat/timeregcount",data);
    },
};
/* 会话管理 */
const chat={
    /* 会话列表 */
    chatList:(data)=>{
        return fetchGet('/wxchat/chatlist',data);
    },
    /* 会话消息列表 */
    chatMsgList:(data)=>{
        return fetchGet('/wxchat/chatmsglist',data);
    },
    /* 好友列表 */
    friendList:(data)=>{
        return fetchGet("/wxchat/friendlist",data);
    },
    /* 好友消息列表 */
    friendMsgList:(data)=>{
        return fetchGet("/wxchat/friendmsglist",data);
    },
    /* 好友申请记录 */
    applyList:(data)=>{
        return fetchGet("/wxchat/applylist",data);
    },
    /* 群列表 */
    groupList:(data)=>{
        return fetchGet("/wxchat/grouplist",data);
    },
    /* 群信息 */
    groupInfo:(data)=>{
        return fetchGet("/wxchat/groupinfo",data);
    },
    /* 群用户列表 */
    groupUserList:(data)=>{
        return fetchGet("/wxchat/groupuserlist",data);
    },
    /* 群消息列表 */
    groupMsgList:(data)=>{
        return fetchGet("/wxchat/groupmsglist",data);
    }
};
/* 案例管理 */
const caseList={
    /* 案例列表 */
    tiocaseList:(data)=>{
      return fetchPost("/tiocase/list",data);
    },
    /* 案例信息 */
    tiocaseInfo:(data)=>{
      return fetchPost("/tiocase/info",data);
    },
    /* 案例-修改数据 */
    tiocaseUpdate:(data)=>{
      return fetchPost("/tiocase/update",data);
    }
}
/* 群聊管理 */
const newgroupList={
  /* 案例列表 */
  managerlist:(data)=>{
    return fetchGet("/group/managerlist",data);
  },
  /**封停操作 */
  inblack:(data)=>{
    return fetchPost("/group/inblack",data);
  },
  /* 封停列表 */
  inblackoperlist:(data)=>{
    return fetchGet("/group/inblackoperlist",data);
  },
  /* 禁言用户列表 */
  forbiddenUserList:(data)=>{
    return fetchGet("/group/forbiddenUserList",data);
  },
  /* 管理员用户列表 */
  managerUserList:(data)=>{
    return fetchGet("/group/managerUserList",data);
  },
  /* 群举报列表列表 */
  reportlist:(data)=>{
    return fetchGet("/group/reportlist",data);
  },
  /* 举报标记 */
  reportdeal:(data)=>{
    return fetchPost("/group/reportdeal",data);
  }
}
/* 钱包红包 */
const redPrurse={
    /* 开户列表 */
    openlist:(data)=>{
        return fetchGet("/red/openlist",data);
    },
    /* 红包列表 */
    redlist:(data)=>{
        return fetchGet("/red/redlist",data);
    },
    /* 提现列表 */
    withholdlist:(data)=>{
        return fetchGet("/red/withholdlist",data);
    },
    /* 充值列表 */
    rechargelist:(data)=>{
        return fetchGet("/red/rechargelist",data);
    },
    /* 钱包明细 */
    coinlist:(data)=>{
        return fetchGet("/red/coinlist",data);
    },
    /* 转账记录 */
    transferRecordlist:(data)=>{
        return fetchGet("/transferRecord/list",data);
    },
    updata:(data)=>{
        return fetchGet("/red/updata",data);
    },
    setzero:(data)=>{
        return fetchGet("/red/setzero",data);
    }
}
// 举报
const report={
    openlist:(data)=>{
        return fetchGet("/report/openlist",data);
    },
    openlistmore:(data)=>{
        return fetchGet("/report/openlistmore",data);
    },
    closure:(data)=>{
        return fetchGet("/report/closure",data);
    },
    closures:(data)=>{
        return fetchGet("/report/closures",data);
    },
    delmid:(data)=>{
        return fetchGet("/report/delmid",data);
    },
    deletemain:(data)=>{
        return fetchGet("/report/deletemain",data);
    },
}
// app
const app={
    openlist:(data)=>{
        return fetchGet("/app/openlist",data);
    },
    set:(data)=>{
        return fetchGet("/app/set",data);
    },
}
// chit
const chit={
    list:(data)=>{
        return fetchGet("/chit/list",data);
    },
    set:(data)=>{
        return fetchGet("/chit/set",data);
    },
    list1:(data)=>{
        return fetchGet("/chit/list1",data);
    },
    set1:(data)=>{
        return fetchGet("/chit/set1",data);
    },
}
const moments={
    openlist:(data)=>{
        return fetchGet("/moments/openlist",data);
    },
    set:(data)=>{
        return fetchGet("/moments/set",data);
    },
    shenhetongguo:(data) => {
        return fetchGet("/moments/shenhetongguo",data);
    }
}

const withhold={
    getList:(data)=>{
        return fetchGet("/withholdjob/list",data)
    },
    setChecked:(data)=>{
        return fetchGet("/withholdjob/setChecked",data)
    },
    refuseChecked:(data)=>{
        return fetchGet("/withholdjob/refuseChecked",data)
    }
}
const account={
    list:(data)=>{
        return fetchPost("/account/getData",data)
    },
    list2:(data)=>{
        return fetchPost("/account/getData2",data)
    },
    list3:(data)=>{
        return fetchPost("/account/getData3",data)
    },
    list4:(data)=>{
        return fetchPost("/account/getData4",data)
    },
    signlist:(data)=>{
        return fetchPost("/account/signlist",data)
    }
}
const vipconfig={
    getList:(data)=>{
        return fetchGet("/vip/vipconfig",data)
    },
    
    mgConfAdd:(data)=>{
        return fetchPost("/vip/add",data);
    },
    getAvatarList:(data)=>{
        return fetchGet("/vip/vipAvatarConfig",data)
    },
    AvatarAdd:(data)=>{
        return fetchPost("/vip/avataradd",data);
    },

}
const vipuser={
    getList:(data)=>{
        return fetchGet("/vip/vipuser",data);
    },
    getVipCount:(data) => {
        return fetchGet("/vip/vipCount", data);
    }
}
const circle={
    getList:(data)=>{
        return fetchGet("/circle/getList",data);
    },
    setStatus:(data)=>{
        return fetchGet("/circle/setStatus",data);
    },
    openCircle:(data)=>{
        return fetchGet("/circle/openCircle",data);
    },
    del:(data)=>{
        return fetchGet("/circle/del",data);
    },
    del2:(data)=>{
        return fetchGet("/circle/del2",data);
    },

}
const circlevice={
    getList:(data)=>{
        return fetchGet("/circle/circleviceList",data);
    },
    del:(data)=>{
        return fetchGet("/circle/del",data);
    },
}
const UID={
    list:(data)=>{
        return fetchGet("/UID/list",data);
    },
    reset:(data)=>{
        return fetchGet("/UID/reset",data);
    },
    add:(data)=>{
        return fetchGet("/UID/add",data);
    },
    delete:(data)=>{
        return fetchGet("/UID/delete",data);
    },
    setStatus:(data)=>{
        return fetchGet("/circle/setStatus",data);
    },
    openlist:(data)=>{
        return fetchGet("/UID/openlist",data);
    },
    choose:(data)=>{
        return fetchGet("/UID/choose",data);
    },
    addopen:(data)=>{
        return fetchGet("/UID/addopen",data);
    },
}
const litemall={
    list:(data)=>{
        return fetchPost("/litemall/list",data);
    },
    add:(data)=>{
        return fetchPost("/litemall/add",data);
    },
    html:(data)=>{
        return fetchPost("/litemall/html",data);
    },
    save:(data)=>{
        return fetchPost("/litemall/save",data);
    },
    save2:(data)=>{
        return fetchPost("/litemall/save2",data);
    },
    save3:(data)=>{
        return fetchPost("/litemall/save3",data);
    },
    newAdd:(data)=>{
        return fetchPost("/litemall/newAdd",data);
    }
}
const html={
    html:(data)=>{
        return fetchPost("/html/html",data);
    },
    save:(data)=>{
        return fetchPost("/html/save",data);
    },
    save2:(data)=>{
        return fetchPost("/html/save2",data);
    },
    save3:(data)=>{
        return fetchPost("/html/save3",data);
    },
    newAdd:(data)=>{
        return fetchPost("/html/newAdd",data);
    }
}

/**
 * 协议
 */
const deal={
    // 用户协议
    userdeal:(data)=>{
        return fetchPost("/userdeal/getcontent",data);
    },
    replaceText:(data)=>{
        return fetchPost("/userdeal/replaceText",data);
    },
    generateHtml:(data)=>{
        return fetchPost("/userdeal/generateHtml",data);
    },
}

/**
 * 红包规则
 */
const redModifyRules={
    getList:(data)=>{
        return fetchGet("/redModifyrules/list",data);
    },
    add:(data)=>{
        return fetchGet("/redModifyrules/add",data);
    },
    delete:(data)=>{
        return fetchGet("/redModifyrules/delete",data);
    },
}
export {
    html,
    litemall,
    circlevice,
    UID,
    circle,
    vipuser,
    sysParams,
    commonFile,
    commonFiles,
    caseCoverFile,
    mgdictChild,
    mgLogin,
    mgLogout, 
    mgCurr,
    mgMenu,
    mgUpdatePwd, 
    mgRoleDictList,
    rechargeStatis,
    withholdStatis,
    vipconfig,
    account,
    mgheader,
    backup,
    mguser,
    mgauth,
    mgauth2,
    mgconf,
    mgdic,
    mgrole,
    authoper,
    mgAuthPageAuthList,
    logsts,
    recruit,
    order,
    sqlQuery,
    clear,
    imuser,
    imchat,
    email,
    imapp,
    invoice,
    reimb,
    journal,
    stat,
    chat,
    caseList,
    newgroupList,
    redPrurse,
    report,
    page,
    app,
    moments,
    mgconf1,
    mgconfs,
    chit,
    withhold,
    notice,
    IP,
    redModifyRules,
    deal
}