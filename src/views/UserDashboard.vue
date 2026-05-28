<template lang="pug">
.user-dashboard
  .user-dashboard__event(v-for="event in events" :key="event.task_id")
    | {{ event.task_name }}
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const events = ref([])

let ws = null
let reconnectTimer = null
let manuallyClosed = false
const wsDomain = (new URL(import.meta.env.VITE_BACK)).host

function connect() {
  ws = new WebSocket(`ws://${wsDomain}/websocket/notifications`)

  ws.onopen = handleOpen
  ws.onmessage = handleMessage
  ws.onerror = handleError
  ws.onclose = handleClose
}

function reconnect() {
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(connect, 20000)
}

function handleOpen(event) {
  console.log('[ws] open', event)
}

function handleMessage(event) {
  console.log('[ws] message', event.data)

  const parsed = JSON.parse(event.data)

  if (parsed.event !== 'TaskReminder') {
    return
  }

  events.value.unshift(parsed)

  if (events.value.length > 10) {
    events.value.pop()
  }
}

function handleError(event) {
  console.log('[ws] error', event)
}

function handleClose(event) {
  console.log('[ws] close', event)

  if (manuallyClosed) return

  reconnect()
}

onMounted(connect)

onUnmounted(() => {
  manuallyClosed = true

  clearTimeout(reconnectTimer)

  ws?.close()
})
</script>

<style lang="sss">
.user-dashboard
  display: flex
  flex-direction: column
  height: calc(100vh - 90px)
  align-items: center
  justify-content: center

.user-dashboard__event
  text-align: center
</style>
