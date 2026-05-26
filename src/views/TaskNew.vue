<template lang="pug">
form.task-new(@submit.prevent='create')
  .task-new__active
    | Active
    input(type="checkbox" v-model="task.active")
    label(for="checkbox")

  input.task-new__name(
    v-model.trim="task.name"
    placeholder="name"
    required
  )

  input.task-new__cron(
    v-model.trim="task.cron"
    placeholder="cron"
    required
  )

  button.task-new__submit(type="submit") Add
</template>

<script setup>
import { reactive } from 'vue'
import { useTaskStore } from '@/stores/task'
import router from '@/router'

const taskStore = useTaskStore()

const task = reactive({
  active: false,
  name: null,
  cron: null
})

const create = async () => {
  try {
    const createdTask = await taskStore.create(task)
    router.push({ path: `/tasks/${createdTask.id}/edit` })
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.task-new
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  gap: 10px
  flex-grow: 1

.task-new__name
  width: 200px

.task-new__type
  width: 200px

.task-new__description
  width: 200px

.task-new__submit
  width: 200px

.task-new__active
  width: 200px
</style>
