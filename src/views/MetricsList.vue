<template lang="pug">
table.metrics-history(v-for="metricsHistory in sprints")
    tr
      td.metrics-history__head.metrics-history__cell
      td.metrics-history__head.metrics-history__cell(v-for="metric in metrics") {{ metric.chain }}

    tr
      td.metrics-history__head.metrics-history__cell total
      td.metrics-history__head.metrics-history__cell(v-for="metric in metrics") {{ metricsHistory.total[metric.chain_id] }}

    tr.metrics-history__report(v-for="(metrics, date) in metricsHistory.week" @click="getForm(date)")
      td.metrics-history__cell {{ date }}
      td.metrics-history__cell(v-for="chain in chains")
        | {{ historyValue(metrics, chain) }}

table.metrics-form
  tr
    td.metrics-history__head.metrics-history__cell {{ formDate }}
    td.metrics-history__head.metrics-history__cell(v-for="(metric, ind) in metrics") 
      MetricInput(v-model="metrics[ind]" :date="formDate" @updated="getHistory()")

</template>

<script setup>
import { ref } from 'vue'
import metricClient from '@/api/metric-client'
import router from '@/router'
import MetricInput from '@/components/MetricInput.vue'

const metrics = ref([])
const sprints = ref([])
const chains = ref([])
const formDate = ref(new Date().toISOString().split('T')[0])

const getForm = async (date) => {
  formDate.value = date
  metrics.value = (await metricClient.index(date)).map(x => ({ ...x, date }))
}

const getHistory = async () => {
  const history = (await metricClient.history())

  sprints.value = history.sprints
  chains.value = history.chains
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
  padding-bottom: 50px

.metrics-history
  margin-bottom: 50px

.metrics-history__cell
  padding: 4px
  width: 80px
</style>
