export function getAuthReturnPath(state) {
  const requestedPath = state?.from
  if (
    typeof requestedPath === 'string' &&
    requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//') &&
    !requestedPath.startsWith('/admin')
  ) {
    return requestedPath
  }

  return '/profile'
}
