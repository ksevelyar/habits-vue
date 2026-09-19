import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import TelegramConnect from '@/components/TelegramConnect.vue'
import { create_code, get_status, remove_bot } from '@/api/telegram-client'

vi.mock('@/api/telegram-client', () => ({
  get_status: vi.fn(),
  create_code: vi.fn(),
  remove_bot: vi.fn()
}))

const linkUrl = 'https://t.me/habits_test_bot?start=token'

const backend_error = { error: 'telegram is not configured' }

afterEach(() => {
  get_status.mockReset()
  create_code.mockReset()
  remove_bot.mockReset()
})

describe('TelegramConnect', () => {
  it('offers to connect when not linked', async () => {
    get_status.mockResolvedValue({ linked: false })

    const wrapper = mount(TelegramConnect)
    await flushPromises()

    expect(wrapper.text()).toContain('Connect Telegram')
    expect(wrapper.text()).not.toContain('Disconnect')
  })

  it('offers to disconnect when linked', async () => {
    get_status.mockResolvedValue({ linked: true })

    const wrapper = mount(TelegramConnect)
    await flushPromises()

    expect(wrapper.text()).toContain('Disconnect')
    expect(wrapper.text()).not.toContain('Connect Telegram')
  })

  it('requests a link and opens it on connect', async () => {
    get_status.mockResolvedValue({ linked: false })
    create_code.mockResolvedValue({ url: linkUrl })

    const open = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper = mount(TelegramConnect)
    await flushPromises()
    await wrapper.find('a').trigger('click')
    await flushPromises()

    expect(open).toHaveBeenCalledWith(linkUrl, '_blank')

    wrapper.unmount()
  })

  it('shows the backend error message', async () => {
    get_status.mockRejectedValue(backend_error)

    const wrapper = mount(TelegramConnect)
    await flushPromises()

    expect(wrapper.text()).toContain('telegram is not configured')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve))
}
