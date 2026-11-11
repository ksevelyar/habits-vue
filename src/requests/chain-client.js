import { requestJson } from '@/requests/request'

export default {
  list() {
    return requestJson('/chains')
  },

  get(id) {
    return requestJson(`/chains/${id}`)
  },

  create(chain) {
    return requestJson('/chains', {
      method: 'POST',
      body: JSON.stringify(chain),
    })
  },

  update(chain) {
    return requestJson(`/chains/${chain.id}`, {
      method: 'PATCH',
      body: JSON.stringify(chain),
    })
  },

  order(chainID1, chainID2) {
    return requestJson('/chains/order', {
      method: 'POST',
      body: JSON.stringify({ chain_id_1: chainID1, chain_id_2: chainID2 }),
    })
  },
}
