<template lang="pug">
form.metrics-form
  label.metrics-form__label {{ metric.chain }}
  input.metrics-form__value(
    placeholder="value"
    v-model="metricData.value"
    @input="update"
  )
</template>

<script setup>
import { reactive } from 'vue'
import metricClient from '@/api/metric-client'

const props = defineProps({
  metric: {
    type: Object,
    default: () => {},
    date: ''
  },
  date: { type: String, default: '' }
})

const metricData = { ...props.metric, date: props.date }

const update = async () => {
  try {
    await metricClient.upsert({ metric: metricData })
  } catch(error) {
    console.log(error)
  }
}
</script>

<style lang="sss">
.metrics-form
  display: flex
  align-items: center
  justify-content: center
  gap: 10px

.metrics-form__name
  width: 200px

.metrics-form__type
  width: 200px

.metrics-form__description
  width: 200px

.metrics-form__submit
  width: 200px

.metrics-form__active
  width: 200px


.metrics-form__label
  min-width: 90px
</style>
