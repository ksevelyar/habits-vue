<template lang="pug">
input.metric-input__value(
  v-model="metric.value"
  @input="update"
)
</template>

<script setup>
import { reactive } from 'vue'
import metricClient from '@/api/metric-client'

const metric = defineModel({type: Object})
const emit = defineEmits(['updated'])

const update = async () => {
  try {
    await metricClient.upsert({ metric: metric.value })
    emit('updated')
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.metric-input
  display: flex
  align-items: center
  margin: 10px

.metric-input__value
  width: 6ch
  background: #e3e3e3
  border-radius: 4px
  border: 1px solid rgb(193, 193, 193)
  outline: none
  font-size: 1em

.metric-input__label
  min-width: 90px
</style>
