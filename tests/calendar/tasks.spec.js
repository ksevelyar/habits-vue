import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { beforeEach, expect, it, vi } from 'vitest'

import router from '@/router'
import TaskEdit from '@/views/TaskEdit.vue'
import TaskList from '@/views/TaskList.vue'
import TaskNew from '@/views/TaskNew.vue'
import { mock } from '../support.js'

vi.mock('@/router', () => ({ default: { push: vi.fn() } }))
vi.mock('vue-router', () => ({ useRoute: () => ({ params: { id: '42' } }) }))

const task = {
  id: 42,
  name: 'Take vitamins',
  cron: '0 9 * * *',
  active: true,
}

beforeEach(() => {
  router.push.mockReset()
})

it('displays tasks', async () => {
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/tasks`, () => HttpResponse.json([task])),
  )
  try {
    const taskListWrapper = mount(TaskList)

    try {
      await flushPromises()

      expect(taskListWrapper.text()).toContain('Take vitamins')
    } finally {
      taskListWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('creates an active scheduled task', async () => {
  const submittedTasks = []
  const mockedServer = mock(
    http.post(`${import.meta.env.VITE_BACK}/tasks`, async ({ request }) => {
      submittedTasks.push(await request.json())
      return HttpResponse.json(task, { status: 201 })
    }),
  )
  try {
    const taskNewWrapper = mount(TaskNew, {
      global: { plugins: [createPinia()] },
    })

    try {
      await taskNewWrapper.find('.task-new__name').setValue('Take vitamins')
      await taskNewWrapper.find('.task-new__cron').setValue('0 9 * * *')
      await taskNewWrapper.find('.task-new__active input').setValue(true)
      await taskNewWrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedTasks).toEqual([{ name: 'Take vitamins', cron: '0 9 * * *', active: true }])
      expect(router.push).toHaveBeenCalledWith({ path: '/tasks/42/edit' })
    } finally {
      taskNewWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('updates a scheduled task', async () => {
  const submittedTasks = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/tasks/42`, () => HttpResponse.json(task)),
    http.patch(`${import.meta.env.VITE_BACK}/tasks/42`, async ({ request }) => {
      submittedTasks.push(await request.json())
      return HttpResponse.json({ ...task, cron: '0 8 * * *' })
    }),
  )
  try {
    const taskEditWrapper = mount(TaskEdit)

    try {
      await flushPromises()

      expect(taskEditWrapper.find('.task-new__name').element.value).toBe('Take vitamins')
      expect(taskEditWrapper.find('.task-new__cron').element.value).toBe('0 9 * * *')
      expect(taskEditWrapper.find('.task-new__active input').element.checked).toBe(true)

      await taskEditWrapper.find('.task-new__cron').setValue('0 8 * * *')
      await taskEditWrapper.find('form').trigger('submit')
      await flushPromises()

      expect(submittedTasks).toEqual([{ ...task, cron: '0 8 * * *' }])
      expect(router.push).toHaveBeenCalledWith({ path: '/tasks/' })
    } finally {
      taskEditWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('activates an inactive scheduled task', async () => {
  const inactiveTask = { ...task, active: false }
  let savedTask = inactiveTask
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/tasks/42`, () => HttpResponse.json(savedTask)),
    http.patch(`${import.meta.env.VITE_BACK}/tasks/42`, async ({ request }) => {
      savedTask = await request.json()
      return HttpResponse.json(savedTask)
    }),
  )
  try {
    const taskEditWrapper = mount(TaskEdit)

    try {
      await flushPromises()
      await taskEditWrapper.find('.task-new__active input').setValue(true)
      await taskEditWrapper.find('form').trigger('submit')
      await flushPromises()
    } finally {
      taskEditWrapper.unmount()
    }

    const reopenedTaskEditWrapper = mount(TaskEdit)

    try {
      await flushPromises()

      expect(reopenedTaskEditWrapper.find('.task-new__active input').element.checked).toBe(true)
    } finally {
      reopenedTaskEditWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})
