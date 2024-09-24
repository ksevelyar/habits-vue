<template lang="pug">
form.metric-input
  label.metric-input__label {{ metric.chain }}
  input.metric-input__value(
    placeholder="value"
    v-model="metric.value"
    @input="update"
  )
</template>

<script setup>
import { reactive } from 'vue'
import metricClient from '@/api/metric-client'

const metric = defineModel()

const update = async () => {
  try {
    await metricClient.upsert({ metric: metric.value })
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
  width: 8ch
  background: #E3E3E3
  border-radius: 4px
  border: 1px solid rgb(193, 193, 193)
  padding: 2px 1ch
  outline: none

.metric-input__label
  min-width: 90px
</style>
