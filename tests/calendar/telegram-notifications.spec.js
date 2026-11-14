import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import TelegramConnect from '@/components/TelegramConnect.vue'
import { create_code, get_status, remove_bot } from '@/requests/telegram-client'

vi.mock('@/requests/telegram-client', () => ({
  get_status: vi.fn(),
  create_code: vi.fn(),
  remove_bot: vi.fn(),
}))

const linkUrl = 'https://t.me/habits_test_bot?start=token'

const backend_error = { error: 'telegram is not configured' }

afterEach(() => {
  get_status.mockReset()
  create_code.mockReset()
  remove_bot.mockReset()
})

describe('TelegramConnect', () => {
  test('User sees Telegram connection status', async () => {
    get_status.mockResolvedValue({ linked: false })

    const wrapper = mount(TelegramConnect)
    await flushPromises()

    expect(wrapper.text()).toContain('Connect Telegram')
    expect(wrapper.text()).not.toContain('Disconnect')
  })

  test('User disconnects Telegram', async () => {
    get_status.mockResolvedValue({ linked: true })
    remove_bot.mockResolvedValue()

    const wrapper = mount(TelegramConnect)
    await flushPromises()
    await wrapper.find('a').trigger('click')
    await flushPromises()

    expect(remove_bot).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('Telegram not connected')
    expect(wrapper.text()).toContain('Connect Telegram')
    expect(wrapper.text()).not.toContain('Disconnect')

    wrapper.unmount()
  })

  test('User connects Telegram', async () => {
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

  test('User sees a Telegram configuration error', async () => {
    get_status.mockRejectedValue(backend_error)

    const wrapper = mount(TelegramConnect)
    await flushPromises()

    expect(wrapper.text()).toContain('telegram is not configured')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
