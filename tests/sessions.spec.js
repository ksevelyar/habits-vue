import { mount } from '@vue/test-utils'
import { expect, it, describe } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import UserLogin from '@/views/UserLogin.vue'

describe('UserLogin', () => {
  const wrapper = mount(UserLogin, {
    plugins: [
      createTestingPinia({
        user: {},
      }),
    ],
  })

  it('renders form', () => {
    expect(wrapper.text()).toContain('Authenticate')
  })
})
