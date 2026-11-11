import { requestJson } from '@/requests/request'

export default {
  list() {
    return requestJson('/tasks')
  },

  get(id) {
    return requestJson(`/tasks/${id}`)
  },

  create(task) {
    return requestJson('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  },

  update(task) {
    return requestJson(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify(task),
    })
  },
}
