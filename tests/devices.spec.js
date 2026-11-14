import { flushPromises, mount } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { expect, test } from 'vitest'

import DeviceNew from '@/views/DeviceNew.vue'
import { mock } from './support.js'

test('User creates a device and views its ID and token', async () => {
  const submittedDevices = []
  const createdDevice = {
    device_id: 'device-123',
    device_name: 'Kitchen timer',
    token: 'secret-token',
  }
  const mockedServer = mock(
    http.post(`${import.meta.env.VITE_BACK}/devices`, async ({ request }) => {
      submittedDevices.push(await request.json())
      return HttpResponse.json(createdDevice, { status: 201 })
    }),
  )
  try {
    const deviceFormWrapper = mount(DeviceNew)

    try {
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
    } finally {
      deviceFormWrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})
