<template lang="pug">
table.metrics-history(v-for="metricsHistory in sprints")
  tr
    td.metrics-history__head.metrics-history__cell
    td.metrics-history__head.metrics-history__cell(v-for="metric in metrics") {{ metric.chain }}

  tr
    td.metrics-history__head.metrics-history__cell.metrics-history__copy(
      @click.stop="copyTotals(metricsHistory.total)"
    ) total
    td.metrics-history__head.metrics-history__cell(v-for="metric in metrics")
      | {{ formatValue(chains.find(chain => chain.id === metric.chain_id), metricsHistory.total[metric.chain_id]) }}

  tr.metrics-history__report(v-for="(metrics, date) in metricsHistory.week" @click="getForm(date)")
    td.metrics-history__cell {{ date }}
    td.metrics-history__cell(v-for="chain in chains")
      | {{ historyValue(metrics, chain) }}

table.metrics-form
  tr
    td.metrics-history__cell {{ formDate }}
    td.metrics-history__input.metrics-history__cell(v-for="(metric, ind) in metrics")
      MetricInput(v-model="metrics[ind]" :date="formDate" @updated="getHistory()")

UserEvents
</template>

<script setup>
import { ref } from 'vue'
import metricClient from '@/api/metric-client'
import router from '@/router'
import MetricInput from '@/components/MetricInput.vue'
import UserEvents from '@/components/UserEvents.vue'

const metrics = ref([])
const sprints = ref([])
const chains = ref([])
const formDate = ref(new Date().toISOString().split('T')[0])

const emojiMap = {
  rest: '🏖️',
  work: '💼',
  pet: '🚀',
  drill: '🥼',
  activity: '🏃',
  workout: '🏋️‍♂️'
}

const displayOrder = ['rest', 'work', 'pet', 'drill', 'activity', 'workout']

const formatValue = (chain, value) => chain.type === 'time' ? formatMinutes(value) : value

const copyTotals = (sprintTotal) => {
  const { header, separator, values } = displayOrder.reduce((accumulator, word) => {
    const chain = chains.value.find(chain => chain.name === emojiMap[word])

    accumulator.header.push(word)
    accumulator.separator.push('---')
    accumulator.values.push(String(formatValue(chain, sprintTotal[chain.id])))

    return accumulator
  }, { header: [], separator: [], values: [] })

  navigator.clipboard.writeText([
    `| ${header.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    `| ${values.join(' | ')} |`
  ].join('\n'))
}

const getForm = async (date) => {
  formDate.value = date
  metrics.value = (await metricClient.index(date)).map(x => ({ ...x, date }))
}

const getHistory = async () => {
  const history = (await metricClient.history())

  sprints.value = history.sprints
  chains.value = history.chains
}

const formatMinutes = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  const mins = String(minutes % 60).padStart(2, '0')
  return `${hours}:${mins}`
}

const historyValue = (metrics, chain) => {
  const value = metrics[chain.id]?.value
  if (!value) return '|'
  if (chain.type === 'time') return formatMinutes(value)
  return value
}


getForm(formDate.value)
getHistory()
</script>

<style lang="sss">
.metrics-history__head
  text-align: left
  color: var(--color-1)

.metrics-history__copy
  cursor: pointer

.metrics-history__input
  background: #e3e3e3
  border-radius: 4px
  border: 1px solid rgb(193, 193, 193)

.metrics-history__report
  cursor: pointer
  padding-bottom: 50px

.metrics-history
  margin-bottom: 50px

.metrics-history__cell
  padding: 2px 4px
  width: 50px
</style>
