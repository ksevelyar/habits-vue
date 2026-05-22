import { createRouter, createWebHistory } from 'vue-router'

const DevPalette = () => import('@/views/DevPalette.vue')

const UserLogin = () => import('@/views/UserLogin.vue')
const UserRegistration = () => import('@/views/UserRegistration.vue')
const UserDashboard = () => import('@/views/UserDashboard.vue')

const ChainNew = () => import('@/views/ChainNew.vue')
const ChainEdit = () => import('@/views/ChainEdit.vue')
const ChainList = () => import('@/views/ChainList.vue')

const TaskNew = () => import('@/views/TaskNew.vue')
const TaskEdit = () => import('@/views/TaskEdit.vue')
const TaskList = () => import('@/views/TaskList.vue')

const MetricsList = () => import('@/views/MetricsList.vue')

const routes = [
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/register',
    name: 'UserRegistration',
    component: UserRegistration
  },
  {
    path: '/',
    name: 'UserDashboard',
    component: UserDashboard
  },
  {
    path: '/chains/new',
    name: 'ChainNew',
    component: ChainNew
  },
  {
    path: '/chains/:id/edit',
    name: 'ChainEdit',
    component: ChainEdit
  },
  {
    path: '/chains',
    name: 'ChainList',
    component: ChainList
  },
  {
    path: '/tasks/new',
    name: 'TaskNew',
    component: TaskNew
  },
  {
    path: '/tasks/:id/edit',
    name: 'TaskEdit',
    component: TaskEdit
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList
  },
  {
    path: '/metrics',
    name: 'MetricsList',
    component: MetricsList
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
