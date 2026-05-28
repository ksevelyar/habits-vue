<template lang="pug">
form.device-new(@submit.prevent='create')
  input.device-new__name(
    v-model.trim="device.device_name"
    placeholder="name"
    required
  )

  input.device-new__device-id(
    :value="device.device_id"
    placeholder="cron"
    readonly
  )

  input.device-new__token(
    :value="device.token"
    placeholder="token"
    readonly
  )

  button.device-new__submit(type="submit") Add
</template>

<script setup>
import { reactive } from 'vue'
import router from '@/router'
import deviceClient from '@/api/device-client'

async function create() {
  try {
    const b = await deviceClient.create(device)
    console.log(b)
    Object.assign(device, b)
  } catch (error) {
    console.log(error)
  }
}

const device = reactive({
  device_id: null,
  device_name: null,
  token: null
})
</script>

<style lang="sss">
.device-new
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  gap: 10px
  flex-grow: 1

.device-new__name
  width: 200px

.device-new__type
  width: 200px

.device-new__description
  width: 200px

.device-new__submit
  width: 200px

.device-new__active
  width: 200px
</style>
