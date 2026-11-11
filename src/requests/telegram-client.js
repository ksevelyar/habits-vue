import { requestJson } from '@/requests/request'

export const get_status = () => requestJson('/telegram/link')

export const create_code = () =>
  requestJson('/telegram/link', {
    method: 'POST',
  })

export const remove_bot = () =>
  requestJson('/telegram/link', {
    method: 'DELETE',
  })
