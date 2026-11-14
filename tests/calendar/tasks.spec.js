import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { expect, test, vi } from 'vitest'

import { mock, mountApplicationAtPath } from '../support.js'

const task = {
  id: 42,
  name: 'Take a walk',
  cron: '0 9 * * *',
  active: true,
}

const signedInUser = {
  name: 'person',
  email: 'person@example.com',
  timezone: 'UTC',
}

function currentUserRequest() {
  return http.get(`${import.meta.env.VITE_BACK}/sessions/current`, () =>
    HttpResponse.json(signedInUser),
  )
}

test('User views tasks', async () => {
  const mockedServer = mock(
    currentUserRequest(),
    http.get(`${import.meta.env.VITE_BACK}/tasks`, () => HttpResponse.json([task])),
  )
  try {
    const { applicationWrapper, applicationRouter } = await mountApplicationAtPath('/tasks')

    try {
      await flushPromises()

      expect(applicationRouter.currentRoute.value.path).toBe('/tasks')
      expect(applicationWrapper.text()).toContain('Take a walk')
    } finally {
      applicationWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

test('User creates a scheduled task', async () => {
  const submittedTasks = []
  const mockedServer = mock(
    currentUserRequest(),
    http.post(`${import.meta.env.VITE_BACK}/tasks`, async ({ request }) => {
      submittedTasks.push(await request.json())
      return HttpResponse.json(task, { status: 201 })
    }),
    http.get(`${import.meta.env.VITE_BACK}/tasks/42`, () => HttpResponse.json(task)),
  )
  try {
    const { applicationWrapper, applicationRouter } = await mountApplicationAtPath('/tasks/new')

    try {
      await applicationWrapper.find('.task-new__name').setValue('Take a walk')
      await applicationWrapper.find('.task-new__cron').setValue('0 9 * * *')
      await applicationWrapper.find('.task-new__active input').setValue(true)
      await applicationWrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedTasks).toEqual([{ name: 'Take a walk', cron: '0 9 * * *', active: true }])
      await vi.waitFor(() => {
        expect(applicationRouter.currentRoute.value.path).toBe('/tasks/42/edit')
      })
    } finally {
      applicationWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

test('User updates a scheduled task', async () => {
  const submittedTasks = []
  const mockedServer = mock(
    currentUserRequest(),
    http.get(`${import.meta.env.VITE_BACK}/tasks/42`, () => HttpResponse.json(task)),
    http.patch(`${import.meta.env.VITE_BACK}/tasks/42`, async ({ request }) => {
      submittedTasks.push(await request.json())
      return HttpResponse.json({ ...task, cron: '0 8 * * *' })
    }),
    http.get(`${import.meta.env.VITE_BACK}/tasks`, () => HttpResponse.json([task])),
  )
  try {
    const { applicationWrapper, applicationRouter } = await mountApplicationAtPath('/tasks/42/edit')

    try {
      await flushPromises()

      expect(applicationWrapper.find('.task-new__name').element.value).toBe('Take a walk')
      expect(applicationWrapper.find('.task-new__cron').element.value).toBe('0 9 * * *')
      expect(applicationWrapper.find('.task-new__active input').element.checked).toBe(true)

      await applicationWrapper.find('.task-new__cron').setValue('0 8 * * *')
      await applicationWrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedTasks).toEqual([{ ...task, cron: '0 8 * * *' }])
      await vi.waitFor(() => {
        expect(applicationRouter.currentRoute.value.path).toBe('/tasks/')
      })
    } finally {
      applicationWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

test('User activates or deactivates a scheduled task', async () => {
  const inactiveTask = { ...task, active: false }
  let savedTask = inactiveTask
  const mockedServer = mock(
    currentUserRequest(),
    http.get(`${import.meta.env.VITE_BACK}/tasks/42`, () => HttpResponse.json(savedTask)),
    http.patch(`${import.meta.env.VITE_BACK}/tasks/42`, async ({ request }) => {
      savedTask = await request.json()
      return HttpResponse.json(savedTask)
    }),
    http.get(`${import.meta.env.VITE_BACK}/tasks`, () => HttpResponse.json([savedTask])),
  )
  try {
    const { applicationWrapper, applicationRouter } = await mountApplicationAtPath('/tasks/42/edit')

    try {
      await flushPromises()
      await applicationWrapper.find('.task-new__active input').setValue(true)
      await applicationWrapper.find('form').trigger('submit')
      await flushPromises()
      await applicationRouter.push('/tasks/42/edit')
      await flushPromises()

      expect(applicationWrapper.find('.task-new__active input').element.checked).toBe(true)
    } finally {
      applicationWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})
