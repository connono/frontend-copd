import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    name: 'Manage',
    meta: { title: '患者管理', icon: 'manage' },
    component: Layout,
    children: [{
      path: 'warning',
      name: 'Warning',
      component: () => import('@/views/warning/index'),
      meta: { title: '预警列表（本院）', icon: 'warning' }
    }, {
      path: 'referralWarning',
      name: 'ReferralWarning',
      component: () => import('@/views/referralWarning/index'),
      meta: { title: '预警列表（转诊）', icon: 'warning' }
    }, {
      path: 'following',
      name: 'Following',
      component: () => import('@/views/following/index'),
      meta: { title: '随访列表（本院）', icon: 'following' }
    }, {
      path: 'referralFollowing',
      name: 'ReferralFollowing',
      component: () => import('@/views/referralFollowing/index'),
      meta: { title: '随访列表（转诊）', icon: 'following' }
    }, {
      path: 'create',
      name: 'Create',
      component: () => import('@/views/create/index'),
      meta: { title: '患者注册', icon: 'create' }
    }, {
      path: 'patientInfo/:patientID',
      name: 'PatientInfo',
      component: () => import('@/views/patientInfo/index'),
      meta: { title: '患者信息', icon: 'info' },
      hidden: true
    }]
  },
  {
    path: '/list',
    name: 'List',
    meta: { title: '患者列表', icon: 'list' },
    component: Layout,
    children: [{
      path: 'benyuan',
      name: 'Benyuan',
      component: () => import('@/views/information/index'),
      meta: { title: '本院', icon: 'benyuan' }
    }, {
      path: 'tayuan',
      name: 'Tayuan',
      component: () => import('@/views/otherInformation/index'),
      meta: { title: '他院', icon: 'tayuan' }
    }, {
      path: 'doctor',
      name: 'Doctor',
      component: () => import('@/views/doctorInformation/index'),
      meta: { title: '医生', icon: 'doctor' }
    }]
  },
  {
    path: '/tansfer',
    name: 'Tansfer',
    meta: { title: '患者转诊', icon: 'tansfer' },
    component: Layout,
    children: [{
      path: 'audit',
      name: 'Audit',
      component: () => import('@/views/correct/index'),
      meta: { title: '转入审核', icon: 'audit' }
    },
    {
      path: 'manage',
      name: 'Manage',
      component: () => import('@/views/manage/index'),
      meta: { title: '转入管理', icon: 'manage' }
    },
    {
      path: 'trace',
      name: 'Trace',
      component: () => import('@/views/manage/index'),
      meta: { title: '转出追踪', icon: 'trace' }
    },
    {
      path: 'auto',
      name: 'Auto',
      component: () => import('@/views/auto/index'),
      meta: { title: '自动审核设置', icon: 'auto' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
