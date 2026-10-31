export function getCalendarPeriodDateRange(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(currentTime)
  const currentYear = Number(dateParts.find((datePart) => datePart.type === 'year').value)
  const currentMonth = Number(dateParts.find((datePart) => datePart.type === 'month').value)

  if (period === 'month') {
    const absoluteMonth = currentYear * 12 + currentMonth - 1 + periodOffset
    const selectedYear = Math.floor(absoluteMonth / 12)
    const selectedMonth = ((absoluteMonth % 12) + 12) % 12

    return createMonthDateRange(selectedYear, selectedMonth)
  }

  if (period === 'fourMonths') {
    const fourMonthBucketsPerYear = 3
    const currentBucket = Math.floor((currentMonth - 1) / 4)
    const absoluteBucket = currentYear * fourMonthBucketsPerYear + currentBucket + periodOffset
    const selectedYear = Math.floor(absoluteBucket / fourMonthBucketsPerYear)
    const selectedBucket =
      ((absoluteBucket % fourMonthBucketsPerYear) + fourMonthBucketsPerYear) %
      fourMonthBucketsPerYear

    return createMonthDateRange(selectedYear, selectedBucket * 4, 4)
  }

  if (period === 'year') {
    const selectedYear = currentYear + periodOffset

    return {
      startDate: formatCalendarDate(new Date(Date.UTC(selectedYear, 0, 1))),
      endDate: formatCalendarDate(new Date(Date.UTC(selectedYear, 11, 31))),
    }
  }

  throw new Error(`Unsupported chart period: ${period}`)
}

function createMonthDateRange(year, firstMonth, monthCount = 1) {
  return {
    startDate: formatCalendarDate(new Date(Date.UTC(year, firstMonth, 1))),
    endDate: formatCalendarDate(new Date(Date.UTC(year, firstMonth + monthCount, 0))),
  }
}

function formatCalendarDate(date) {
  return date.toISOString().slice(0, 10)
}
