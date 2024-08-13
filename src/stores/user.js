import { defineStore } from 'pinia'
import { reactive } from 'vue'
import userClient from '@/api/user-client'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: null,
    email: null
  })

  async function register(userData) {
    try {
      user.value = await userClient.register(userData)
    } catch(error) {
      user.value = {}
      return Promise.reject(error)
    }
  }

  async function login(userData) {
    try {
      user.value = await userClient.login(userData)
    } catch(error) {
      user.value = {}
      return Promise.reject(error)
    }
  }

  return {
    user,
    register,
    login
  }
})
