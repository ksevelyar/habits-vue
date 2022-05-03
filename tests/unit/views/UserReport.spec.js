import { mount } from '@vue/test-utils'
import UserReport from '@/views/UserReport.vue'
import { expect, test } from 'vitest';

test('renders form', async () => {
  const form = mount(UserReport)
  const date = form.get('.report__date')

  const kebabCase = 'fr-CA'
  expect(date.element.value).toBe((new Date).toLocaleDateString(kebabCase))
})
