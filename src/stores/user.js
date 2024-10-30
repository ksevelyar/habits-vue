import { defineStore } from 'pinia'
import { reactive } from 'vue'
import userClient from '@/api/user-client'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: null,
    email: null
  })

  async function get() {
    try {
      Object.assign(user, await userClient.get())
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function register(userData) {
    try {
      Object.assign(user, await userClient.register(userData))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function login(userData) {
    try {
      Object.assign(user, await userClient.login(userData))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    user,
    get,
    register,
    login
  }
})
