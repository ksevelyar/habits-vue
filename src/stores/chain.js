import { defineStore } from 'pinia'
import { reactive } from 'vue'
import chainClient from '@/api/chain-client'

export const useChainStore = defineStore('chain', () => {
  const chain = reactive({
    id: null,
    name: null,
    active: true,
    type: null,
    description: null
  })

  async function create(chainData) {
    try {
      Object.assign(chain, await chainClient.create(chainData))

      return chain
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    chain,
    create
  }
})
