import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/views/UserLogin.vue'

const ReportForm = () => import('@/views/ReportForm.vue')
const UserProfile = () => import('@/views/UserProfile.vue')

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/:handle',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/report',
    name: 'ReportForm',
    component: ReportForm
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
