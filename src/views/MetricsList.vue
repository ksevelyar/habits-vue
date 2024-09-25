<template lang="pug">
table.metrics-history
  tr
    td.metrics-history__head.metrics-history__cell date
    td.metrics-history__head.metrics-history__cell(v-for="chain in chainsHistory") {{ chain.name }}

  tr.metrics-history__report(v-for="(metrics, date) in metricsHistory" @click="getForm(date)")
    td.metrics-history__cell {{ date }}
    td.metrics-history__cell(v-for="chain in chainsHistory")
      | {{ historyValue(metrics, chain) }}

.metrics-form
  .metrics-form__date {{ formDate }}
  MetricInput(v-for="(metric, ind) in metrics" v-model="metrics[ind]" :date="formDate" @updated="getHistory()")
</template>

<script setup>
import { ref } from 'vue'
import metricClient from '@/api/metric-client'
import router from '@/router'
import MetricInput from '@/components/MetricInput.vue'

const metrics = ref([])
const metricsHistory = ref([])
const chainsHistory = ref([])
const formDate = ref(new Date().toISOString().split('T')[0])

const getForm = async (date) => {
  formDate.value = date
  metrics.value = (await metricClient.index(date)).map(x => ({ ...x, date }))
}

const getHistory = async () => {
  const {metrics, chains} = (await metricClient.history())

  metricsHistory.value = metrics
  chainsHistory.value = chains
}

const historyValue = (metrics, chain) => metrics[chain.id]?.value || '|'

getForm(formDate.value)
getHistory()
</script>

<style lang="sss">
.metrics-history__head
  text-align: left
  color: var(--color-1)

.metrics-history__report
  cursor: pointer

.metrics-form
  margin-top: 100px
  display: flex
  flex-direction: column
  align-items: center

.metrics-history__cell
  padding: 4px

</style>
