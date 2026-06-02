<template lang="pug">
.user-events
  .user-event(v-for="event in events" :key="event.task_id")
    .user-event__time {{ event.scheduled_time }}
    .user-event__name {{ event.task_name }}
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const storage_key = 'task-reminders'
const events = ref([])
let ws = null
let reconnectTimer = null
let manuallyClosed = false

function connect() {
  const backUrl = new URL(import.meta.env.VITE_BACK)
  const wsProtocol = backUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsEndpoint = `${wsProtocol}//${backUrl.host}/websocket/notifications`
  ws = new WebSocket(wsEndpoint)

  ws.onopen = handleOpen
  ws.onmessage = handleMessage
  ws.onerror = handleError
  ws.onclose = handleClose
}

function reconnect() {
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(connect, 3000)
}

function handleOpen(event) {
  console.log('[ws] open', event)
}

function handleMessage(event) {
  console.log('[ws] message', event.data)

  const payload = JSON.parse(event.data)

  if (payload.event !== 'TaskReminder') {
    return
  }

  events.value.push(payload)

  const buffer_size = 5
  if (events.value.length > buffer_size) {
    events.value.shift()
  }

  localStorage.setItem(storage_key, JSON.stringify(events.value))
}

function handleError(event) {
  console.log('[ws] error', event)
}

function handleClose(event) {
  console.log('[ws] close', event)

  if (manuallyClosed) return

  reconnect()
}

onMounted(() => {
  const stored = localStorage.getItem(storage_key)
  events.value = JSON.parse(stored) || []

  connect()
})

onUnmounted(() => {
  manuallyClosed = true


  clearTimeout(reconnectTimer)

  ws?.close()
})
</script>

<style lang="sss">
.user-events
  margin-top: 10vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 4px

.user-event
  display: flex
  gap: 1ch

.user-event__name
  font-size: 24px
  padding: 4px

.user-event__time
  font-size: 24px
  color: #fff
  background: #3c3c3c
  border-radius: 4px
  padding: 4px
</style>
