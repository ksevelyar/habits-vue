const back = import.meta.env.VITE_BACK

export const get_status = async () => {
  const response = await fetch(`${back}/telegram/link`, { credentials: 'include' })

  if (!response.ok) { return Promise.reject(await response.json()) }
  return response.json()
}

export const create_code = async () => {
  const response = await fetch(`${back}/telegram/link`, { method: 'POST', credentials: 'include' })

  if (!response.ok) { return Promise.reject(await response.json()) }
  return response.json()
}

export const remove_bot = async () => {
  const response = await fetch(`${back}/telegram/link`, { method: 'DELETE', credentials: 'include' })

  if (!response.ok) { return Promise.reject(await response.json()) }
  if (response.status === 204) { return null }
  return response.json()
}
