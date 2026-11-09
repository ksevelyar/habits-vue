import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import DeviceNew from '@/views/DeviceNew.vue'

const backendBaseUrl = import.meta.env.VITE_BACK || 'http://habits.lcl:3003'
const server = setupServer()
let deviceFormWrapper = null

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  deviceFormWrapper?.unmount()
  deviceFormWrapper = null
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

it('creates_a_device_and_displays_its_id_and_token', async () => {
  const submittedDevices = []
  const createdDevice = {
    device_id: 'device-123',
    device_name: 'Kitchen timer',
    token: 'secret-token',
  }

  server.use(
    http.post(`${backendBaseUrl}/devices`, async ({ request }) => {
      submittedDevices.push(await request.json())
      return HttpResponse.json(createdDevice, { status: 201 })
    }),
  )

  deviceFormWrapper = mount(DeviceNew)

  await deviceFormWrapper.find('.device-new__name').setValue('Kitchen timer')
  await deviceFormWrapper.find('form').trigger('submit')
  await flushPromises()

  expect(submittedDevices).toHaveLength(1)
  expect(submittedDevices[0]).toMatchObject({ device_name: 'Kitchen timer' })

  const deviceIdInput = deviceFormWrapper.find('.device-new__device-id').element
  const tokenInput = deviceFormWrapper.find('.device-new__token').element

  expect(deviceIdInput.value).toBe('device-123')
  expect(deviceIdInput.readOnly).toBe(true)
  expect(tokenInput.value).toBe('secret-token')
  expect(tokenInput.readOnly).toBe(true)
})
