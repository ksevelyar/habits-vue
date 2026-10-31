<template lang="pug">
.user-dashboard
  .user-dashboard__charts
    span.user-dashboard__title Charts

    .user-dashboard__controls
      .user-dashboard__periods
        button.user-dashboard__period(
          v-for="period in chartPeriods"
          :key="period.value"
          type="button"
          :aria-pressed="selectedPeriod === period.value"
          @click="selectPeriod(period.value)"
        ) {{ period.label }}

      .user-dashboard__period-navigation
        button.user-dashboard__previous-period(
          type="button"
          aria-label="Previous period"
          @click="navigateToPreviousPeriod"
        ) ←
        .user-dashboard__date-range
          span {{ periodDateRange.startDate }}
          span –
          span {{ periodDateRange.endDate }}
        button.user-dashboard__next-period(
          v-if="previousPeriodOffset < 0"
          type="button"
          aria-label="Next period"
          @click="navigateToNextPeriod"
        ) →

    span.user-dashboard__error(v-if="errorMessage" role="alert") {{ errorMessage }}
    span.user-dashboard__empty(v-else-if="hasLoaded && chartChains.length === 0") No chains are enabled for charts.

    .user-dashboard__chart-list(v-else-if="chartChains.length > 0")
      MetricChart(
        v-for="chain in chartChains"
        :key="chain.id"
        :chain="chain"
        :previous-points="chain.previousPoints"
        :start-date="periodDateRange.startDate"
        :end-date="periodDateRange.endDate"
      )

  .user-dashboard__notifications
    span.user-dashboard__notifications-title Notifications
    TelegramConnect
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
  { value: 'quarter', label: 'quartal' },
  { value: 'year', label: '1 year' },
]
const userStore = useUserStore()
const selectedPeriod = ref('month')
const previousPeriodOffset = ref(0)
const chartChains = ref([])
const hasLoaded = ref(false)
const errorMessage = ref(null)
const requestNumber = ref(0)
const chartHistoryCache = new Map()
const timeZone = computed(
  () => userStore.user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
)
const periodDateRange = computed(() =>
  getCalendarPeriodDateRange(selectedPeriod.value, timeZone.value, previousPeriodOffset.value),
)
const previousPeriodDateRange = computed(() =>
  getCalendarPeriodDateRange(selectedPeriod.value, timeZone.value, previousPeriodOffset.value - 1),
)

function selectPeriod(period) {
  selectedPeriod.value = period
  previousPeriodOffset.value = 0
}

function navigateToPreviousPeriod() {
  previousPeriodOffset.value -= 1
}

function navigateToNextPeriod() {
  previousPeriodOffset.value += 1
}

function loadChartHistoryForRange(dateRange) {
  const dateRangeKey = `${dateRange.startDate}:${dateRange.endDate}`
  const cachedRequest = chartHistoryCache.get(dateRangeKey)
  if (cachedRequest) return cachedRequest

  const chartHistoryRequest = metricClient
    .charts(dateRange.startDate, dateRange.endDate)
    .catch((error) => {
      chartHistoryCache.delete(dateRangeKey)
      throw error
    })

  chartHistoryCache.set(dateRangeKey, chartHistoryRequest)

  return chartHistoryRequest
}

async function loadChartHistory(currentDateRange, previousDateRange) {
  const currentRequestNumber = ++requestNumber.value
  errorMessage.value = null

  try {
    const [currentHistoryResult, previousHistoryResult] = await Promise.allSettled([
      loadChartHistoryForRange(currentDateRange),
      loadChartHistoryForRange(previousDateRange),
    ])

    if (currentRequestNumber !== requestNumber.value) return
    if (currentHistoryResult.status === 'rejected') throw currentHistoryResult.reason

    const previousChains = getFulfilledChains(previousHistoryResult)

    chartChains.value = currentHistoryResult.value.chains.map((chain) => {
      const previousChain = previousChains.find((candidateChain) => candidateChain.id === chain.id)

      return { ...chain, previousPoints: previousChain?.points ?? [] }
    })
    hasLoaded.value = true
  } catch (error) {
    if (currentRequestNumber !== requestNumber.value) return

    errorMessage.value = error.error || error.message || 'Unable to load charts.'
    chartChains.value = []
    hasLoaded.value = true
  }
}

function getFulfilledChains(historyResult) {
  if (historyResult.status !== 'fulfilled') return []

  return historyResult.value.chains
}

watch(
  () => [
    periodDateRange.value.startDate,
    periodDateRange.value.endDate,
    previousPeriodDateRange.value.startDate,
    previousPeriodDateRange.value.endDate,
  ],
  ([startDate, endDate, previousStartDate, previousEndDate]) =>
    loadChartHistory(
      { startDate, endDate },
      { startDate: previousStartDate, endDate: previousEndDate },
    ),
  { immediate: true },
)
</script>

<style lang="sss">
.user-dashboard__charts
  display: flex
  flex-direction: column
  gap: 12px
  padding: 0 12px 24px

.user-dashboard__notifications
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
  justify-content: space-between
  flex-wrap: wrap
  gap: 8px

.user-dashboard__periods, .user-dashboard__period-navigation
  display: flex
  align-items: center
  gap: 8px

.user-dashboard__period-navigation
  margin-left: auto

.user-dashboard__previous-period, .user-dashboard__next-period, .user-dashboard__period
  padding: 6px 10px
  border: 1px solid var(--color-3)
  border-radius: 4px
  background: var(--color-7)
  color: var(--color-4)
  cursor: pointer

.user-dashboard__period[aria-pressed="true"]
  background: var(--color-4)
  color: var(--color-7)

.user-dashboard__previous-period:focus-visible, .user-dashboard__next-period:focus-visible, .user-dashboard__period:focus-visible
  outline: 2px solid var(--color-4)

.user-dashboard__date-range
  display: flex
  gap: 6px
  color: var(--color-4)

.user-dashboard__notifications-title
  margin: 8px 0
  font-size: 1.5em

.user-dashboard__error, .user-dashboard__empty
  margin: 0

.user-dashboard__chart-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr))
  gap: 12px
</style>
