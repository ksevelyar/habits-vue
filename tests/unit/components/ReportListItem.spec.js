import { mount } from '@vue/test-utils'
import ReportListItem from '@/components/ReportsListItem.vue'
import { expect, test } from 'vitest'

test('render pipe if value is absent', () => {
  const wrapper = mount(ReportListItem)

  expect(wrapper.text()).toContain('|')
})

test('render value', () => {
  const wrapper = mount(
    ReportListItem, { props: { value: 42 } }
  )

  expect(wrapper.text()).toContain(42)
})
