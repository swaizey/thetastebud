import { initialProfile } from '../pages/Profile/profileData.js'

const FAVORITES_KEY = 'tastebud-favorites'
const ADDRESSES_KEY = 'tastebud-addresses'
const PROFILE_KEY_PREFIX = 'tastebud-profile:'

export const initialFavoriteIds = ['agoyin-special', 'fried-plantain', 'grilled-chicken']

function readArray(key, fallback) {
  const value = window.localStorage.getItem(key)
  if (value === null) return fallback

  const parsedValue = JSON.parse(value)
  if (!Array.isArray(parsedValue)) {
    throw new TypeError(`Saved data for ${key} must be an array.`)
  }

  return parsedValue
}

export function readFavorites() {
  return readArray(FAVORITES_KEY, initialFavoriteIds)
}

export function saveFavorites(favorites) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function readProfile(userId) {
  const value = window.localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`)
  if (value === null) return null

  const profile = JSON.parse(value)
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    throw new TypeError('Saved profile data must be an object.')
  }
  return profile
}

export function saveProfile(userId, profile) {
  window.localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(profile))
}

export function createDefaultAddress(profile = initialProfile) {
  return {
    id: 'home-address',
    label: 'Home',
    recipient: profile.name,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    isDefault: true,
  }
}

export function readAddresses() {
  return readArray(ADDRESSES_KEY, [])
}

export function saveAddresses(addresses) {
  window.localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses))
}
