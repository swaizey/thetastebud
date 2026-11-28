const configuredApiOrigin = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
export const apiBaseUrl = configuredApiOrigin
  ? `${configuredApiOrigin}/api/v1`
  : import.meta.env.DEV
    ? '/api/v1'
    : 'https://api.thetastebudbyjoy.ng/api/v1'

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const contentType = response.headers.get('Content-Type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'The API request failed.')
    error.status = response.status
    error.code = payload?.error?.code
    error.details = payload?.error?.details
    throw error
  }

  return payload
}
