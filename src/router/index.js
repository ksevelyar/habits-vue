import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'ReportsList',
    component: () => import(/* webpackChunkName: "reports" */ '../views/ReportsList.vue')
  },
  {
    path: '/report/:date',
    name: 'Report',
    component: () => import(/* webpackChunkName: "report" */ '../views/Report.vue')
  },
  {
    path: '/report/add',
    name: 'AddReport',
    component: () => import(/* webpackChunkName: "add-report" */ '../views/AddReport.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
