export function getCalendarPeriodDateRange(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  const currentDate = getDateInTimezone(currentTime, timeZone)

  if (period === 'month') {
    const startDate = currentDate.with({ day: 1 }).add({ months: periodOffset })

    return getDateRange(startDate, { months: 1 })
  }

  if (period === 'quarter') {
    const firstMonthOfQuarter = Math.floor((currentDate.month - 1) / 3) * 3 + 1
    const startDate = currentDate
      .with({ month: firstMonthOfQuarter, day: 1 })
      .add({ months: periodOffset * 3 })

    return getDateRange(startDate, { months: 3 })
  }

  if (period === 'year') {
    const startDate = currentDate.with({ month: 1, day: 1 }).add({ years: periodOffset })

    return getDateRange(startDate, { years: 1 })
  }

  throw new Error(`Unsupported calendar period: ${period}`)
}

export function getCurrentDateTime(timeZone = 'UTC', currentTime = new Date()) {
  return getZonedDateTime(currentTime, timeZone)
    .toPlainDateTime()
    .toString({ smallestUnit: 'minute' })
}

export function convertTimestampToLocalDateTime(timestamp, timeZone = 'UTC') {
  return Temporal.Instant.from(timestamp)
    .toZonedDateTimeISO(timeZone)
    .toPlainDateTime()
    .toString({ smallestUnit: 'minute' })
}

export function convertLocalDateTimeToTimestamp(localDateTime, timeZone = 'UTC') {
  return Temporal.ZonedDateTime.from(`${localDateTime}[${timeZone}]`)
    .toInstant()
    .toString({ fractionalSecondDigits: 3 })
}

export function formatDateInTimezone(timestamp, timeZone = 'UTC') {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeZone,
  }).format(new Date(timestamp))
}

export function formatTimestampInTimezone(timestamp, timeZone = 'UTC') {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(timestamp))
}

function getDateInTimezone(currentTime, timeZone) {
  return getZonedDateTime(currentTime, timeZone).toPlainDate()
}

function getZonedDateTime(currentTime, timeZone) {
  return Temporal.Instant.from(currentTime.toISOString()).toZonedDateTimeISO(timeZone)
}

function getDateRange(startDate, duration) {
  return {
    startDate: startDate.toString(),
    endDate: startDate.add(duration).subtract({ days: 1 }).toString(),
  }
}
