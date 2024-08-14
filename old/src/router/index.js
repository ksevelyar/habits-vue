import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/views/UserLogin.vue'

const ReportForm = () => import('@/views/ReportForm.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const ReportsList = () => import('@/views/ReportsList.vue')
const DevPalette = () => import('@/views/DevPalette.vue')

const routes = [
  {
    path: '/',
    name: 'ReportsList',
    component: ReportsList
  },
  {
    path: '/auth',
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
  },
  {
    path: '/dev/palette',
    name: 'DevPalette',
    component: DevPalette
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
