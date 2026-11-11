import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { expect, it } from 'vitest'

import App from '@/App.vue'
import router from '@/router'
import { mock } from './support.js'

it('redirects unauthenticated protected route to login', async () => {
  const receivedCurrentSessionRequests = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/sessions/current`, () => {
      receivedCurrentSessionRequests.push(true)
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }),
  )

  try {
    const wrapper = await mountApplicationAtPath('/chains')

    try {
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/login')
      expect(wrapper.find('.user-login').exists()).toBe(true)
      expect(receivedCurrentSessionRequests).toHaveLength(1)
    } finally {
      wrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('keeps login accessible without an authenticated session', async () => {
  const receivedCurrentSessionRequests = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/sessions/current`, () => {
      receivedCurrentSessionRequests.push(true)
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }),
  )

  try {
    const wrapper = await mountApplicationAtPath('/login')

    try {
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/login')
      expect(wrapper.find('.user-login').exists()).toBe(true)
      expect(receivedCurrentSessionRequests).toHaveLength(0)
    } finally {
      wrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

it('keeps registration accessible without an authenticated session', async () => {
  const receivedCurrentSessionRequests = []
  const mockedServer = mock(
    http.get(`${import.meta.env.VITE_BACK}/sessions/current`, () => {
      receivedCurrentSessionRequests.push(true)
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }),
  )

  try {
    const wrapper = await mountApplicationAtPath('/register')

    try {
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/register')
      expect(wrapper.find('.user-registration').exists()).toBe(true)
      expect(receivedCurrentSessionRequests).toHaveLength(0)
    } finally {
      wrapper.unmount()
    }
  } finally {
    mockedServer.close()
  }
})

async function mountApplicationAtPath(routePath) {
  const piniaInstance = createPinia()
  setActivePinia(piniaInstance)

  let stagingRoutePath = '/login'
  if (routePath === '/login') {
    stagingRoutePath = '/register'
  }

  await router.push(stagingRoutePath)
  await router.push(routePath)

  const applicationWrapper = mount(App, {
    global: {
      plugins: [piniaInstance, router],
    },
  })

  return applicationWrapper
}
