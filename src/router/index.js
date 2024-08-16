import { createRouter, createWebHistory } from 'vue-router'

const DevPalette = () => import('@/views/DevPalette.vue')

const UserLogin = () => import('@/views/UserLogin.vue')
const UserRegistration = () => import('@/views/UserRegistration.vue')
const UserDashboard = () => import('@/views/UserDashboard.vue')

const NewHabit = () => import('@/views/NewHabit.vue')
const HabitsList = () => import('@/views/HabitsList.vue')

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
    path: '/',
    name: 'UserDashboard',
    component: UserDashboard
  },

  {
    path: '/habits/new',
    name: 'NewHabit',
    component: NewHabit
  },
  {
    path: '/habits',
    name: 'HabitsList',
    component: HabitsList
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
