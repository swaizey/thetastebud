import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { readProfile, saveProfile as saveProfileToStorage } from '../utils/accountStorage.js'
import { initialProfile, profileFromUser } from '../pages/Profile/profileData.js'

export function useAccountProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(() => (
    user ? profileFromUser(user, readProfile(user.id) || {}) : initialProfile
  ))

  useEffect(() => {
    if (!user) {
      setProfile(initialProfile)
      return
    }

    const updatedProfile = profileFromUser(user, readProfile(user.id) || {})
    saveProfileToStorage(user.id, updatedProfile)
    setProfile(updatedProfile)
  }, [user])

  const saveProfile = useCallback((nextProfile, profileUser = user) => {
    if (!profileUser) throw new Error('Cannot save a profile without an authenticated user.')

    const updatedProfile = profileFromUser(profileUser, nextProfile)
    saveProfileToStorage(profileUser.id, updatedProfile)
    setProfile(updatedProfile)
    return updatedProfile
  }, [user])

  return { profile, saveProfile }
}
