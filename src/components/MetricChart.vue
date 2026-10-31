<template lang="pug">
.metric-chart
  span.metric-chart__title {{ chain.name }}
  svg.metric-chart__svg(
    viewBox="0 0 720 300"
    role="img"
    :aria-label="chartLabel"
  )
    title {{ chartLabel }}

    g.metric-chart__value-tick(v-for="tick in verticalTicks" :key="`value-${tick}`")
      line(
        :x1="chartMarginLeft"
        :x2="chartWidth - chartMarginRight"
        :y1="verticalScale(tick)"
        :y2="verticalScale(tick)"
      )
      text(
        :x="chartMarginLeft - 10"
        :y="verticalScale(tick) + 4"
        text-anchor="end"
      ) {{ formatValueTick(tick) }}

    g.metric-chart__date-tick(v-for="tick in horizontalTicks" :key="tick.toISOString()")
      line(
        :x1="horizontalScale(tick)"
        :x2="horizontalScale(tick)"
        :y1="chartMarginTop"
        :y2="chartHeight - chartMarginBottom"
      )
      text(
        :x="horizontalScale(tick)"
        :y="chartHeight - chartMarginBottom + 24"
        text-anchor="middle"
      ) {{ formatDateTick(tick) }}

    path.metric-chart__line(
      :d="linePath"
      fill="none"
    )

    circle.metric-chart__point(
      v-for="point in chartPoints"
      :key="point.date.toISOString()"
      :cx="horizontalScale(point.date)"
      :cy="verticalScale(point.value)"
      r="4"
    )
</template>

<script setup>
import { computed } from 'vue'
import { curveMonotoneX, line, scaleLinear, scaleUtc } from 'd3'

const properties = defineProps({
  chain: { type: Object, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
})

const chartWidth = 720
const chartHeight = 300
const chartMarginTop = 20
const chartMarginRight = 24
const chartMarginBottom = 40
const chartMarginLeft = 56
const chartLabel = computed(() => `${properties.chain.name} daily metrics`)
const chartPoints = computed(() =>
  properties.chain.points
    .map((point) => ({
      date: new Date(`${point.date}T00:00:00Z`),
      value: point.value,
    }))
    .sort((firstPoint, secondPoint) => firstPoint.date - secondPoint.date),
)
const horizontalScale = computed(() =>
  scaleUtc()
    .domain([
      new Date(`${properties.startDate}T00:00:00Z`),
      new Date(`${properties.endDate}T00:00:00Z`),
    ])
    .range([chartMarginLeft, chartWidth - chartMarginRight]),
)
const verticalDomain = computed(() => {
  if (properties.chain.type === 'boolean') return [0, 1]

  const values = chartPoints.value.map((point) => point.value)
  if (values.length === 0) return [0, 1]

  const minimumValue = Math.min(...values)
  const maximumValue = Math.max(...values)
  const valuePadding = minimumValue === maximumValue ? Math.abs(minimumValue) * 0.1 || 1 : 0

  return [Math.min(0, minimumValue - valuePadding), Math.max(0, maximumValue + valuePadding)]
})
const verticalScale = computed(() =>
  scaleLinear()
    .domain(verticalDomain.value)
    .nice()
    .range([chartHeight - chartMarginBottom, chartMarginTop]),
)
const horizontalTicks = computed(() => horizontalScale.value.ticks(6))
const verticalTicks = computed(() =>
  properties.chain.type === 'boolean' ? [0, 1] : verticalScale.value.ticks(5),
)
const linePath = computed(() => {
  const chartLine = line()
    .x((point) => horizontalScale.value(point.date))
    .y((point) => verticalScale.value(point.value))
    .curve(curveMonotoneX)

  return chartLine(chartPoints.value)
})

function formatValueTick(value) {
  return String(value)
}

function formatDateTick(date) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>

<style lang="sss">
.metric-chart
  min-width: 0
  padding: 12px
  background: var(--color-7)
  border-radius: 4px

.metric-chart__title
  margin: 0 0 8px
  font-size: 1.1em
  font-weight: normal

.metric-chart__svg
  display: block
  width: 100%
  height: auto
  overflow: visible

.metric-chart__value-tick line, .metric-chart__date-tick line
  stroke: var(--color-5)

.metric-chart__value-tick text, .metric-chart__date-tick text
  fill: var(--color-4)
  font-size: 12px

.metric-chart__line
  stroke: var(--color-4)
  stroke-width: 2

.metric-chart__point
  fill: var(--color-4)
</style>
