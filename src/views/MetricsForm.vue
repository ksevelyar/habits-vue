<template lang="pug">
MetricForm(v-for="metric in metrics" :metric="metric" :date="date")
</template>

<script setup>
import { ref } from 'vue'
import metricClient from '@/api/metric-client'
import router from '@/router'
import MetricForm from '@/components/MetricForm.vue'

// generate metrics from chains
const metrics = ref([])

//const upsert = async metric => {
//  try {
//    console.log(metric)
//  } catch(error) {
//    console.log(error)
//  }
//}

// fetch Metrics for today with values
//

const [date,] = new Date().toISOString().split('T')

const getList = async () => {
  metrics.value = (await metricClient.index(date))
}

getList()

// set interval for seconds until next date
</script>

<style lang="sss">
.metrics-form
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
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
</style>
