export const initialProfile = {
  name: '',
  email: '',
  phone: '',
  username: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  cuisine: 'African',
  dietaryPreference: 'None',
  newsletter: false,
  photo: null,
  memberSince: '',
}

export function profileFromUser(user, cachedProfile = {}) {
  const createdAt = user.createdAt ? new Date(user.createdAt) : null
  const memberSince = createdAt && !Number.isNaN(createdAt.getTime())
    ? createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : cachedProfile.memberSince || ''

  return {
    ...initialProfile,
    ...cachedProfile,
    name: user.fullName || '',
    email: user.email || '',
    username: user.username || user.email?.split('@', 1)[0] || '',
    phone: user.phone || '',
    photo: user.avatarUrl || (user.avatarMediaId
      ? `/api/v1/media/${encodeURIComponent(user.avatarMediaId)}`
      : cachedProfile.photo || null),
    memberSince,
  }
}
