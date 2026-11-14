import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { setupServer } from 'msw/node'
import { createMemoryHistory } from 'vue-router'

import App from '@/App.vue'
import { createApplicationRouter } from '@/router'

export function mock(...requestHandlers) {
  const mockedServer = setupServer(...requestHandlers)
  mockedServer.listen({ onUnhandledRequest: 'error' })

  return mockedServer
}

export async function mountApplicationAtPath(routePath) {
  const piniaInstance = createPinia()
  setActivePinia(piniaInstance)

  const applicationRouter = createApplicationRouter(createMemoryHistory())
  await applicationRouter.push(routePath)
  await applicationRouter.isReady()

  const applicationWrapper = mount(App, {
    global: { plugins: [piniaInstance, applicationRouter] },
  })

  return { applicationRouter, applicationWrapper }
}
