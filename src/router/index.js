import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'ReportsList',
    component: () => import(/* webpackChunkName: "home" */ '../views/ReportsList.vue')
  },
  {
    path: '/report/:date',
    name: 'Report',
    component: () => import(/* webpackChunkName: "about" */ '../views/Report.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
