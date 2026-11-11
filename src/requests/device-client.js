import { requestJson } from '@/requests/request'

export default {
  create(device) {
    return requestJson('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    })
  },
}
