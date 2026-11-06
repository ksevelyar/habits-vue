import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import App from '@/App.vue'
import router from '@/router'

const backendBaseUrl = import.meta.env.VITE_BACK || 'http://habits.lcl:3003'
const server = setupServer()
let applicationWrapper = null

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  applicationWrapper?.unmount()
  applicationWrapper = null
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

it('redirects_unauthenticated_protected_route_to_login', async () => {
  const receivedCurrentSessionRequests = interceptUnauthenticatedCurrentSessionRequests()
  const wrapper = await mountApplicationAtPath('/chains')

  expect(router.currentRoute.value.path).toBe('/login')
  expect(wrapper.find('.user-login').exists()).toBe(true)
  expect(receivedCurrentSessionRequests).toHaveLength(1)
})

it('keeps_login_accessible_without_an_authenticated_session', async () => {
  const receivedCurrentSessionRequests = interceptUnauthenticatedCurrentSessionRequests()
  const wrapper = await mountApplicationAtPath('/login')

  expect(router.currentRoute.value.path).toBe('/login')
  expect(wrapper.find('.user-login').exists()).toBe(true)
  expect(receivedCurrentSessionRequests).toHaveLength(0)
})

it('keeps_registration_accessible_without_an_authenticated_session', async () => {
  const receivedCurrentSessionRequests = interceptUnauthenticatedCurrentSessionRequests()
  const wrapper = await mountApplicationAtPath('/register')

  expect(router.currentRoute.value.path).toBe('/register')
  expect(wrapper.find('.user-registration').exists()).toBe(true)
  expect(receivedCurrentSessionRequests).toHaveLength(0)
})

function interceptUnauthenticatedCurrentSessionRequests() {
  const receivedCurrentSessionRequests = []

  server.use(
    http.get(`${backendBaseUrl}/sessions/current`, () => {
      receivedCurrentSessionRequests.push(true)
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
    }),
  )

  return receivedCurrentSessionRequests
}

async function mountApplicationAtPath(routePath) {
  const piniaInstance = createPinia()
  setActivePinia(piniaInstance)

  let stagingRoutePath = '/login'
  if (routePath === '/login') {
    stagingRoutePath = '/register'
  }

  await router.push(stagingRoutePath)
  await router.push(routePath)

  applicationWrapper = mount(App, {
    global: {
      plugins: [piniaInstance, router],
    },
  })
  await flushPromises()

  return applicationWrapper
}
