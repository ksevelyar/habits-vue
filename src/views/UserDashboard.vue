<template lang="pug">
.user-dashboard
  TelegramConnect

  .user-dashboard__charts
    span.user-dashboard__title Charts

    .user-dashboard__controls
      span.user-dashboard__previous-period(
        role="button"
        tabindex="0"
        @click="navigateToPreviousPeriod"
        @keydown.enter.space.prevent="navigateToPreviousPeriod"
      ) Previous period
      span.user-dashboard__period(
        v-for="period in chartPeriods"
        :key="period.value"
        role="button"
        tabindex="0"
        :aria-pressed="selectedPeriod === period.value"
        @click="selectPeriod(period.value)"
        @keydown.enter.space.prevent="selectPeriod(period.value)"
      ) {{ period.label }}

    .user-dashboard__date-range
      span {{ periodDateRange.startDate }}
      span –
      span {{ periodDateRange.endDate }}

    span.user-dashboard__error(v-if="errorMessage" role="alert") {{ errorMessage }}
    span.user-dashboard__empty(v-else-if="hasLoaded && chartChains.length === 0") No chains are enabled for charts.

    .user-dashboard__chart-list(v-else-if="chartChains.length > 0")
      MetricChart(
        v-for="chain in chartChains"
        :key="chain.id"
        :chain="chain"
        :start-date="periodDateRange.startDate"
        :end-date="periodDateRange.endDate"
      )
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import TelegramConnect from '@/components/TelegramConnect.vue'
import MetricChart from '@/components/MetricChart.vue'
import metricClient from '@/api/metric-client'
import { useUserStore } from '@/stores/user'
import { getCalendarPeriodDateRange } from '@/utils/chart-period'

const chartPeriods = [
  { value: 'month', label: '1 month' },
  { value: 'fourMonths', label: '4 months' },
  { value: 'year', label: '1 year' },
]
const userStore = useUserStore()
const selectedPeriod = ref('month')
const previousPeriodOffset = ref(0)
const chartChains = ref([])
const hasLoaded = ref(false)
const errorMessage = ref(null)
const requestNumber = ref(0)
const timeZone = computed(
  () => userStore.user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
)
const periodDateRange = computed(() =>
  getCalendarPeriodDateRange(selectedPeriod.value, timeZone.value, previousPeriodOffset.value),
)

function selectPeriod(period) {
  selectedPeriod.value = period
  previousPeriodOffset.value = 0
}

function navigateToPreviousPeriod() {
  previousPeriodOffset.value -= 1
}

async function loadChartHistory([startDate, endDate]) {
  const currentRequestNumber = ++requestNumber.value
  errorMessage.value = null

  try {
    const response = await metricClient.charts(startDate, endDate)

    if (currentRequestNumber !== requestNumber.value) return

    chartChains.value = response.chains
    hasLoaded.value = true
  } catch (error) {
    if (currentRequestNumber !== requestNumber.value) return

    errorMessage.value = error.error || error.message || 'Unable to load charts.'
    chartChains.value = []
    hasLoaded.value = true
  }
}

watch(() => [periodDateRange.value.startDate, periodDateRange.value.endDate], loadChartHistory, {
  immediate: true,
})
</script>

<style lang="sss">
.user-dashboard__charts
  display: flex
  flex-direction: column
  gap: 12px
  padding: 0 12px 24px

.user-dashboard__title
  margin: 8px 0
  font-size: 1.5em

.user-dashboard__controls
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: 8px

.user-dashboard__previous-period, .user-dashboard__period
  padding: 6px 10px
  border: 1px solid var(--color-3)
  border-radius: 4px
  background: var(--color-7)
  color: var(--color-4)
  cursor: pointer

.user-dashboard__period[aria-pressed="true"]
  background: var(--color-4)
  color: var(--color-7)

.user-dashboard__previous-period:focus-visible, .user-dashboard__period:focus-visible
  outline: 2px solid var(--color-4)

.user-dashboard__date-range
  display: flex
  gap: 6px
  color: var(--color-4)

.user-dashboard__error, .user-dashboard__empty
  margin: 0

.user-dashboard__chart-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr))
  gap: 12px
</style>
