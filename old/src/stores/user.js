import { defineStore } from 'pinia'
import userClient from '@/api/user-client'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    error: null
  }),
  actions: {
    async fetchUser() {
      this.user = null

      try {
        this.user = await userClient.get()
      } catch (error) {
        this.error = error
      }
    }
  }
})
