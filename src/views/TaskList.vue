<template lang="pug">
  .task-list
    router-link(
      v-for="task in tasks"
      :key="task.id"
      :to="{ name: 'TaskEdit', params: {id: task.id }}"
      class="task-list__item"
    ) {{ task.name }}

    router-link(:to="{ name: 'TaskNew' }") Add Task
</template>

<script setup>
import { ref, computed } from 'vue'

import taskClient from '@/api/task-client'

const tasks = ref([])

const getList = async () => {
  tasks.value = await taskClient.list()
}

getList()
</script>

<style lang="sss">
.task-list__item
  font-size: 2em
  margin-bottom: 6px
  display: block
  padding: 0
  cursor: grabbing
</style>
