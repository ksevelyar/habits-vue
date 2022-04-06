import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/views/UserLogin.vue'

const UserReport = () => import('@/views/UserReport.vue')
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
    name: 'Report',
    component: UserReport 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
