<template lang="pug">
form.task-new(@submit.prevent='update')
  label.task-new__active
    | Active
    input(type="checkbox" v-model="task.active")

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

  button.task-new__submit(type="submit") Save
</template>

<script setup>
import { reactive } from 'vue'
import taskClient from '@/requests/task-client'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const task = reactive({
  id: null,
  active: null,
  name: null,
  cron: null,
})

const update = async () => {
  try {
    await taskClient.update(task)
    await router.push({ path: '/tasks/' })
  } catch (error) {
    console.error(error)
  }
}

const get = async () => {
  try {
    const savedtask = await taskClient.get(route.params.id)

    Object.assign(task, savedtask)
  } catch (error) {
    console.error(error)
  }
}

get()
</script>

<style>
.task-new {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.task-new__name {
  width: 200px;
}

.task-new__cron {
  width: 200px;
}

.task-new__submit {
  width: 200px;
}

.task-new__active {
  width: 200px;
}
</style>
