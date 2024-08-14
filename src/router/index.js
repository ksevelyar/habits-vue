import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/views/UserLogin.vue'

const DevPalette = () => import('@/views/DevPalette.vue')
const UserRegistration = () => import('@/views/UserRegistration.vue')

const routes = [
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/registration',
    name: 'UserRegistration',
    component: UserRegistration
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
