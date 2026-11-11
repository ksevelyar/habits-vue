export function getCalendarPeriodDateRange(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  const dateParts = getCalendarDateParts(currentTime, timeZone)

  if (period === 'month') {
    const absoluteMonth = dateParts.year * 12 + dateParts.month - 1 + periodOffset
    const selectedYear = Math.floor(absoluteMonth / 12)
    const selectedMonth = ((absoluteMonth % 12) + 12) % 12

    return createMonthDateRange(selectedYear, selectedMonth)
  }

  if (period === 'quarter') {
    const quartersPerYear = 4
    const currentQuarter = Math.floor((dateParts.month - 1) / 3)
    const absoluteQuarter = dateParts.year * quartersPerYear + currentQuarter + periodOffset
    const selectedYear = Math.floor(absoluteQuarter / quartersPerYear)
    const selectedQuarter =
      ((absoluteQuarter % quartersPerYear) + quartersPerYear) % quartersPerYear

    return createMonthDateRange(selectedYear, selectedQuarter * 3, 3)
  }

  if (period === 'year') {
    const selectedYear = dateParts.year + periodOffset

    return {
      startDate: formatCalendarDate(new Date(Date.UTC(selectedYear, 0, 1))),
      endDate: formatCalendarDate(new Date(Date.UTC(selectedYear, 11, 31))),
    }
  }

  throw new Error(`Unsupported calendar period: ${period}`)
}

export function getCalendarPeriodAnchorDate(
  period,
  timeZone,
  periodOffset = 0,
  currentTime = new Date(),
) {
  return getCalendarPeriodDateRange(period, timeZone, periodOffset, currentTime).startDate
}

export function getCurrentDateTime(timeZone = 'UTC', currentTime = new Date()) {
  return formatCalendarDateTimeParts(getCalendarDateTimeParts(currentTime, timeZone))
}

export function convertTimestampToLocalDateTime(timestamp, timeZone = 'UTC') {
  return formatCalendarDateTimeParts(getCalendarDateTimeParts(timestamp, timeZone))
}

export function convertLocalDateTimeToTimestamp(localDateTime, timeZone = 'UTC') {
  const localDateTimeMatch = localDateTime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  )

  if (!localDateTimeMatch) {
    throw new Error('Enter a valid date and time.')
  }

  const localDateTimeParts = {
    year: Number(localDateTimeMatch[1]),
    month: Number(localDateTimeMatch[2]),
    day: Number(localDateTimeMatch[3]),
    hour: Number(localDateTimeMatch[4]),
    minute: Number(localDateTimeMatch[5]),
    second: Number(localDateTimeMatch[6] || 0),
  }

  validateCalendarDateTimeParts(localDateTimeParts)

  const localDateTimeAsUtcMilliseconds = Date.UTC(
    localDateTimeParts.year,
    localDateTimeParts.month - 1,
    localDateTimeParts.day,
    localDateTimeParts.hour,
    localDateTimeParts.minute,
    localDateTimeParts.second,
  )
  const timezoneOffsets = getTimezoneOffsetsAroundDate(localDateTimeAsUtcMilliseconds, timeZone)
  const possibleTimestamps = [...timezoneOffsets].map(
    (timezoneOffset) => localDateTimeAsUtcMilliseconds - timezoneOffset,
  )
  const matchingTimestamps = possibleTimestamps
    .filter((timestamp) => isMatchingLocalDateTime(timestamp, localDateTimeParts, timeZone))
    .sort((firstTimestamp, secondTimestamp) => firstTimestamp - secondTimestamp)

  if (matchingTimestamps.length > 0) {
    return new Date(matchingTimestamps[0]).toISOString()
  }

  const compatibleTimestamp = possibleTimestamps
    .map((timestamp) => ({
      timestamp,
      localDateTimeDifference: getLocalDateTimeDifference(timestamp, localDateTimeParts, timeZone),
    }))
    .filter(({ localDateTimeDifference }) => localDateTimeDifference > 0)
    .sort((firstCandidate, secondCandidate) => {
      if (firstCandidate.localDateTimeDifference !== secondCandidate.localDateTimeDifference) {
        return firstCandidate.localDateTimeDifference - secondCandidate.localDateTimeDifference
      }

      return firstCandidate.timestamp - secondCandidate.timestamp
    })[0]

  if (!compatibleTimestamp) {
    throw new Error('This date and time cannot be represented in the selected timezone.')
  }

  return new Date(compatibleTimestamp.timestamp).toISOString()
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

function getCalendarDateParts(dateValue, timeZone) {
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split('-').map(Number)
    return { year, month, day }
  }

  return getCalendarDateTimeParts(dateValue, timeZone)
}

function getCalendarDateTimeParts(dateValue, timeZone) {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(new Date(dateValue))
    .filter(({ type }) => type !== 'literal')
    .map(({ type, value }) => [type, Number(value)])

  return Object.fromEntries(dateParts)
}

function getTimezoneOffsetsAroundDate(dateMilliseconds, timeZone) {
  const timezoneOffsets = new Set()
  const timezoneOffsetSampleHours = Array.from({ length: 25 }, (_, index) => index * 3 - 36)

  for (const sampleOffsetHours of timezoneOffsetSampleHours) {
    const sampleTimestamp = dateMilliseconds + sampleOffsetHours * 60 * 60 * 1000
    const localParts = getCalendarDateTimeParts(sampleTimestamp, timeZone)
    const localPartsAsUtcMilliseconds = Date.UTC(
      localParts.year,
      localParts.month - 1,
      localParts.day,
      localParts.hour,
      localParts.minute,
      localParts.second,
    )

    timezoneOffsets.add(localPartsAsUtcMilliseconds - sampleTimestamp)
  }

  return timezoneOffsets
}

function isMatchingLocalDateTime(timestamp, localDateTimeParts, timeZone) {
  const timestampParts = getCalendarDateTimeParts(timestamp, timeZone)

  return Object.keys(localDateTimeParts).every(
    (partName) => timestampParts[partName] === localDateTimeParts[partName],
  )
}

function getLocalDateTimeDifference(timestamp, localDateTimeParts, timeZone) {
  const timestampParts = getCalendarDateTimeParts(timestamp, timeZone)
  const timestampAsLocalUtcMilliseconds = Date.UTC(
    timestampParts.year,
    timestampParts.month - 1,
    timestampParts.day,
    timestampParts.hour,
    timestampParts.minute,
    timestampParts.second,
  )
  const targetAsUtcMilliseconds = Date.UTC(
    localDateTimeParts.year,
    localDateTimeParts.month - 1,
    localDateTimeParts.day,
    localDateTimeParts.hour,
    localDateTimeParts.minute,
    localDateTimeParts.second,
  )

  return timestampAsLocalUtcMilliseconds - targetAsUtcMilliseconds
}

function validateCalendarDateTimeParts(dateTimeParts) {
  const calendarDate = new Date(
    Date.UTC(dateTimeParts.year, dateTimeParts.month - 1, dateTimeParts.day),
  )
  const dateIsValid =
    calendarDate.getUTCFullYear() === dateTimeParts.year &&
    calendarDate.getUTCMonth() === dateTimeParts.month - 1 &&
    calendarDate.getUTCDate() === dateTimeParts.day
  const timeIsValid =
    dateTimeParts.hour >= 0 &&
    dateTimeParts.hour <= 23 &&
    dateTimeParts.minute >= 0 &&
    dateTimeParts.minute <= 59 &&
    dateTimeParts.second >= 0 &&
    dateTimeParts.second <= 59

  if (!dateIsValid || !timeIsValid) {
    throw new Error('Enter a valid date and time.')
  }
}

function formatCalendarDateTimeParts(dateTimeParts) {
  return `${formatCalendarDateParts(dateTimeParts)}T${String(dateTimeParts.hour).padStart(2, '0')}:${String(dateTimeParts.minute).padStart(2, '0')}`
}

function formatCalendarDateParts(dateParts) {
  return `${String(dateParts.year).padStart(4, '0')}-${String(dateParts.month).padStart(2, '0')}-${String(dateParts.day).padStart(2, '0')}`
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
