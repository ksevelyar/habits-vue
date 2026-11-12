export function getCalendarPeriodBounds(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  const currentDate = getDateInTimezone(currentTime, timeZone)
  let startDate
  let nextPeriodStartDate

  if (period === 'month') {
    startDate = currentDate.with({ day: 1 }).add({ months: periodOffset })
    nextPeriodStartDate = startDate.add({ months: 1 })
  } else if (period === 'quarter') {
    const firstMonthOfQuarter = Math.floor((currentDate.month - 1) / 3) * 3 + 1
    startDate = currentDate
      .with({ month: firstMonthOfQuarter, day: 1 })
      .add({ months: periodOffset * 3 })
    nextPeriodStartDate = startDate.add({ months: 3 })
  } else if (period === 'year') {
    startDate = currentDate.with({ month: 1, day: 1 }).add({ years: periodOffset })
    nextPeriodStartDate = startDate.add({ years: 1 })
  } else {
    throw new Error(`Unsupported calendar period: ${period}`)
  }

  return {
    startDate: startDate.toString(),
    endDate: nextPeriodStartDate.toString(),
  }
}

export function getCalendarPeriodTimestampBounds(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  const { startDate, endDate } = getCalendarPeriodBounds(
    period,
    timeZone,
    periodOffset,
    currentTime,
  )

  return {
    startAt: convertLocalDateToTimestamp(startDate, timeZone),
    endAt: convertLocalDateToTimestamp(endDate, timeZone),
  }
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

function convertLocalDateToTimestamp(localDate, timeZone) {
  return Temporal.ZonedDateTime.from(`${localDate}T00:00[${timeZone}]`)
    .toInstant()
    .toString({ fractionalSecondDigits: 3 })
}
