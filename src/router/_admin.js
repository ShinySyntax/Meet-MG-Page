import Login from '@_/views/Login.vue';
import Index from '@_/views/Index.vue';
import Home from '@_/views/Home.vue';
import NotFound from '@_/views/NotFound.vue';//404
import SystemPub from '@/SystemPub.vue';//头部和侧边栏

/* 在此处引入组件-构建路由是为了满足菜单管理访问验证路径需求 */
import UserManage from '@_/views/system/UserManage';//系统用户管理
import MenuManage from '@_/views/system/MenuManage';//系统菜单管理
import ParamConfig from '@_/views/system/ParamConfig';//系统参数配置
import RoleManage from '@_/views/system/RoleManage';//系统角色管理
import Dictionary from '@_/views/system/Dictionary';//系统数据字典
import SqlQuery from '@_/views/system/SqlQuery';//系统sql查询
import SloginList from '@_/views/system/SloginList';//后台登录日志
import MenuSyns from '@_/views/system/MenuSyns';//菜单同步
import Cache from '@_/views/system/Cache';//缓存处理

import OrderManage from '@_/views/official/OrderManage';//招聘订单管理
import RecruitCompany from '@_/views/official/RecruitCompany';//招聘企业管理
import RecruitcPost from '@_/views/official/RecruitcPost';//招聘职位管理
import RecruitcResume from '@_/views/official/RecruitcResume';//招聘简历管理
import InvoiceUpload from '@_/views/official/InvoiceUpload';//发票上传
import InvoiceManage from '@_/views/official/InvoiceManage';//发票上传
import ReimManage from '@_/views/official/ReimManage';//报销单管理
import CaseManage from '@_/views/official/CaseManage';//案例管理

import Email from '@_/views/im/Email';//发邮件
import EmailConfig from '@_/views/im/EmailConfig';//邮件服务器配置
import PrivateChat from '@_/views/im/PrivateChat';//私聊历史
import GroupChat from '@_/views/im/GroupChat';//私聊历史
import UserList from '@_/views/im/UserList';//用户列表
import GroupManage from '@_/views/im/GroupManage';//群组管理
import AppManage from '@_/views/im/AppManage';//App管理
import RegisterStatis from '@_/views/im/RegisterStatis';//用户注册统计
import LoginList from '@_/views/im/LoginList';//用户登录日志列表
import GroupChatManage from '@_/views/im/GroupChatManage';//群聊管理
import InvalidGroup from '@_/views/im/InvalidGroup';//无效群组
import PurseUserAccount from '@_/views/im/PurseUserAccount';//群聊管理
import PurseWithdrawalList from '@_/views/im/PurseWithdrawalList';//提现列表
import PurseRedList from '@_/views/im/PurseRedList';//群聊管理
import PurseRechargeRecord from '@_/views/im/PurseRechargeRecord';//群聊管理
import WithHold from '@_/views/withhold/WithHold';//提现管理
import Statistic from '@_/views/statistic/Static';//充值提现每月统计


import UserChatInfo from '@_/components/im/UserChatInfo';
const adminRoute=[
    {
        path: '/login',
        name: '登录',
        component: Login
    },
    {
        path:'/',
        component:SystemPub,
        children:[{
            path:'index',
            component:Index,
            name:"首页"
        }],
    },
    {
        path:'/_admin/views/Home',
        component:Home
    },
    {
        path:'/_admin/views/system/UserManage',
        component:UserManage
    },
    {
        path:'/_admin/views/system/MenuManage',
        component:MenuManage
    },
    {
        path:'/_admin/views/system/ParamConfig',
        component:ParamConfig
    },
    {
        path:'/_admin/views/system/RoleManage',
        component:RoleManage
    },
    {
        path:'/_admin/views/system/Dictionary',
        component:Dictionary
    },
    {
        path:'/_admin/views/system/SqlQuery',
        component:SqlQuery
    },
    {
        path:'/_admin/views/system/MenuSyns',
        component:MenuSyns
    },
    {
        path:"/_admin/views/system/Cache",
        component:Cache
    },
    {
        path:'/_admin/views/official/OrderManage',
        component:OrderManage
    },
    {
        path:'/_admin/views/official/RecruitCompany',
        component:RecruitCompany
    },
    {
        path:'/_admin/views/official/RecruitcPost',
        component:RecruitcPost
    },
    {
        path:'/_admin/views/official/RecruitcResume',
        component:RecruitcResume
    },
    {
        path:'/_admin/views/official/InvoiceManage',
        component:InvoiceManage
    },
    {
        path:'/_admin/views/official/ReimManage',
        component:ReimManage
    },
    {
        path:'/_admin/views/official/InvoiceUpload',
        component:InvoiceUpload
    },
    {
        path:'/_admin/views/im/Email',
        component:Email
    },
    {
        path:'/_admin/views/im/EmailConfig',
        component:EmailConfig
    },
    {
        path:'/_admin/views/im/PrivateChat',
        component:PrivateChat
    },
    {
        path:'/_admin/views/im/GroupChat',
        component:GroupChat
    },
    {
        path:'/_admin/views/im/UserList',
        component:UserList
    },
    {
        path:'/_admin/views/im/GroupManage',
        component:GroupManage
    },
    {
        path:'/_admin/views/im/AppManage',
        component:AppManage
    },
    {
        path:'/_admin/views/im/RegisterStatis',
        component:RegisterStatis
    },
    {
        path:'/_admin/views/im/LoginList',
        component:LoginList
    },
    {
        path:'/_admin/views/system/SloginList',
        component:SloginList
    },
    {
      path:'/_admin/views/im/GroupChatManage',
      component:GroupChatManage
    },
    {
      path:'/_admin/views/im/PurseUserAccount',
      component:PurseUserAccount
    },
    {
      path:'/_admin/views/im/PurseWithdrawalList',
      component:PurseWithdrawalList
    },
    {
      path:'/_admin/views/im/PurseRedList',
      component:PurseRedList
    },
    {
      path:'/_admin/views/im/PurseRechargeRecord',
      component:PurseRechargeRecord
    },
    {
        path:'/_admin/views/statistic/Static',
        component: Statistic
    },
    {
      path:'/_admin/views/official/CaseManage',
      component:CaseManage
    },
    {
      path:'/_admin/views/im/InvalidGroup',
      component:InvalidGroup
    },
    {
        path:'/_admin/views/withhold/WithHold',
        component: WithHold
    },
    {
        path: '/notfound',
        name:'404',
        component:NotFound,
    },
    {
        path: '*',
        redirect: '/index',
    }
];
export default adminRoute