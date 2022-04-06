import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

import User from '@/views/User.vue'
const Report = () => import('@/views/Report.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:handle',
    name: 'User',
    component: User
  },
  {
    path: '/report',
    name: 'Report',
    component: Report 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
