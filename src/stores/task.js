import { defineStore } from 'pinia'
import { reactive } from 'vue'
import taskClient from '@/api/task-client'

export const useTaskStore = defineStore('task', () => {
  const task = reactive({
    id: null,
    name: null,
    active: true,
    cron: null,
  })

  async function create(taskData) {
    try {
      Object.assign(task, await taskClient.create(taskData))

      return task
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    task,
    create
  }
})
