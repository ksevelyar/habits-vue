const backendBaseUrl = import.meta.env.VITE_BACK

export async function requestJson(path, options = {}) {
  const requestHeaders = new Headers(options.headers)
  const requestBodyIsFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (options.body !== undefined && !requestBodyIsFormData) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${backendBaseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: requestHeaders,
  })

  if (response.status === 204) return null

  let responseBody = {}
  try {
    responseBody = await response.json()
  } catch {
    responseBody = {}
  }

  if (!response.ok) {
    const errorMessage = responseBody.error || `Request failed with status ${response.status}`
    const requestError = new Error(errorMessage)
    requestError.error = responseBody.error || errorMessage
    requestError.status = response.status
    requestError.fields = responseBody.fields || []
    requestError.responseBody = responseBody
    throw requestError
  }

  return responseBody
}
