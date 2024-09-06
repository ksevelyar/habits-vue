<template lang="pug">
form.metrics-form
  label {{ metric.chain }}
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
