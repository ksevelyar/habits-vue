<template lang='pug'>
.telegram-connect
  .telegram-connect__status {{ status }}
  a.telegram-connect__button(v-if='telegram_state === "linked"' @click='disconnect') Disconnect
  a.telegram-connect__button(v-if='telegram_state === "unlinked"' @click='connect') Connect Telegram
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { create_code, get_status, remove_bot } from '@/api/telegram-client'

const telegram_state = ref('checking')
const error_message = ref(null)
let timer = null

const status = computed(() => {
  if (telegram_state.value === 'error') { return error_message.value }
  if (telegram_state.value === 'checking') { return 'Checking telegram link...' }
  if (telegram_state.value === 'unlinked') { return 'Telegram not connected' }
  return 'Telegram connected'
})

const stop_polling = () => clearTimeout(timer)

const poll = async () => {
  try {
    const result = await get_status()
    if (result.linked) {
      telegram_state.value = 'linked'
      return
    }
    telegram_state.value = 'unlinked'
  } catch (error) {
    error_message.value = error.error
    telegram_state.value = 'error'
    return
  }
  timer = setTimeout(poll, 2000)
}

const connect = async () => {
  try {
    const result = await create_code()
    window.open(result.url, '_blank')
    poll()
  } catch (error) {
    error_message.value = error.error
    telegram_state.value = 'error'
  }
}

const disconnect = async () => {
  try {
    await remove_bot()
    telegram_state.value = 'unlinked'
  } catch (error) {
    error_message.value = error.error
    telegram_state.value = 'error'
  }
}

onMounted(poll)
onUnmounted(stop_polling)
</script>

<style lang="sss">
.telegram-connect__button
  cursor: pointer
</style>
