import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import customerAvatar from '../../assets/customer2.png'
import heroFood from '../../assets/partyjollof.png'
import AccountSidebar from './AccountSidebar.jsx'
import profileStyles from './Profile.module.css'
import styles from './EditProfile.module.css'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAccountProfile } from '../../hooks/useAccountProfile.js'
import { apiRequest } from '../../utils/api.js'

const maxAvatarBytes = 5 * 1024 * 1024
const qualityPromptThresholdBytes = 2 * 1024 * 1024

function EditIcon({ name }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3" /></>,
    phone: <path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a14 14 0 0 1-7-7l3-2-3-5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    utensils: <><path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3v18M17 3c-3 3-3 8 0 10h3V3" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M5 19c3-4 6-7 11-10" /></>,
    back: <path d="M19 12H5m7 7-7-7 7-7" />,
    save: <><path d="M4 3h14l3 3v15H3V3h1Z" /><path d="M7 3v6h10V3M7 21v-8h10v8" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function EditProfile() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const { profile, saveProfile: cacheProfile } = useAccountProfile()
  const photoInputRef = useRef(null)
  const changePhotoButtonRef = useRef(null)
  const keepOriginalQualityButtonRef = useRef(null)
  const photoReaderRef = useRef(null)
  const qualityModalWasOpenRef = useRef(false)
  const [draft, setDraft] = useState(profile)
  const [avatarFile, setAvatarFile] = useState(null)
  const [pendingQualityFile, setPendingQualityFile] = useState(null)
  const [avatarQualityChoice, setAvatarQualityChoice] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (pendingQualityFile) {
      qualityModalWasOpenRef.current = true
      keepOriginalQualityButtonRef.current?.focus()
    } else if (qualityModalWasOpenRef.current) {
      changePhotoButtonRef.current?.focus()
      qualityModalWasOpenRef.current = false
    }
  }, [pendingQualityFile])

  const updateField = (event) => {
    const { name, value, checked, type } = event.target
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setSaveError('')
  }

  const restoreProfilePhoto = () => {
    setDraft((current) => ({ ...current, photo: profile.photo }))
  }

  const loadPhoto = (file, qualityChoice) => {
    setAvatarQualityChoice(qualityChoice)
    setPhotoError('')

    const reader = new FileReader()
    photoReaderRef.current = reader
    reader.onload = () => {
      if (photoReaderRef.current !== reader) return
      photoReaderRef.current = null
      if (typeof reader.result === 'string') {
        setAvatarFile(file)
        setDraft((current) => ({ ...current, photo: reader.result }))
      } else {
        setAvatarFile(null)
        setAvatarQualityChoice(null)
        restoreProfilePhoto()
        setPhotoError('The selected photo could not be loaded.')
      }
    }
    reader.onerror = () => {
      if (photoReaderRef.current !== reader) return
      photoReaderRef.current = null
      setAvatarFile(null)
      setAvatarQualityChoice(null)
      restoreProfilePhoto()
      setPhotoError('The selected photo could not be loaded.')
    }
    reader.readAsDataURL(file)
  }

  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    const previousReader = photoReaderRef.current
    photoReaderRef.current = null
    previousReader?.abort()
    if (!file) return

    setAvatarFile(null)
    setPendingQualityFile(null)
    setAvatarQualityChoice(null)
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoError('Choose a JPG or PNG image.')
      restoreProfilePhoto()
      return
    }

    if (file.size > maxAvatarBytes) {
      setPhotoError('The photo must be 5 MB or smaller.')
      restoreProfilePhoto()
      return
    }

    setPhotoError('')
    if (file.size > qualityPromptThresholdBytes) {
      setPendingQualityFile(file)
      return
    }

    loadPhoto(file, null)
  }

  const choosePhotoQuality = (qualityChoice) => {
    if (!pendingQualityFile) return
    const file = pendingQualityFile
    setPendingQualityFile(null)
    loadPhoto(file, qualityChoice)
  }

  const cancelQualityChoice = () => {
    setPendingQualityFile(null)
    setAvatarFile(null)
    setAvatarQualityChoice(null)
    setPhotoError('Photo selection cancelled; it was not uploaded.')
    restoreProfilePhoto()
  }

  const handleQualityDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelQualityChoice()
      return
    }
    if (event.key !== 'Tab') return

    const buttons = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled)'))
    const firstButton = buttons[0]
    const lastButton = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === firstButton) {
      event.preventDefault()
      lastButton?.focus()
    } else if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault()
      firstButton?.focus()
    }
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    const updatedProfile = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      username: draft.username.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      state: draft.state.trim(),
    }
    const phone = updatedProfile.phone.replace(/[^\d+]/g, '')
    if (updatedProfile.name.length < 2 ||
      (phone && !/^\+?[1-9]\d{7,14}$/.test(phone)) ||
      (updatedProfile.address && updatedProfile.address.length < 5) ||
      (updatedProfile.city && updatedProfile.city.length < 2)) {
      setSaveError('Check that each required field is complete and meets its minimum length.')
      return
    }

    try {
      if (avatarFile) {
        const uploadPath = avatarQualityChoice === 'reduced'
          ? '/users/me/avatar?reduceQuality=true'
          : avatarQualityChoice === 'original'
            ? '/users/me/avatar?keepOriginalQuality=true'
            : '/users/me/avatar'
        await apiRequest(uploadPath, {
          method: 'POST',
          headers: { 'Content-Type': avatarFile.type },
          body: avatarFile,
        })
      }
      await apiRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: updatedProfile.name,
          phone: phone || null,
        }),
      })
      const currentUser = await refreshUser()
      const savedProfile = cacheProfile(updatedProfile, currentUser || user)
      navigate('/profile', { state: { profile: savedProfile } })
    } catch (error) {
      setSaveError(error.message || 'Unable to save your profile.')
    }
  }

  return (
    <main className={profileStyles.page}>
      <section className={profileStyles.hero} aria-labelledby="edit-profile-hero-title">
        <img className={profileStyles.heroImage} src={heroFood} alt="" />
        <div className={profileStyles.heroShade} />
        <div className={profileStyles.heroContent}>
          <h1 id="edit-profile-hero-title">My <span>Profile</span></h1>
          <p>Manage your account, update your details<br className={profileStyles.desktopBreak} /> and enjoy a seamless ordering experience.</p>
        </div>
      </section>

      <div className={profileStyles.dashboard}>
        <AccountSidebar profile={draft} active="edit" />
        <section className={styles.mainColumn} aria-label="Edit your account profile">
          <section className={styles.editCard} aria-labelledby="edit-profile-title">
            <header className={styles.editHeading}>
              <h2 id="edit-profile-title"><span><EditIcon name="profile" /></span>Edit Profile</h2>
              <Link to="/profile" state={{ profile }}><EditIcon name="back" />Back to Profile</Link>
            </header>

            <form className={styles.editForm} onSubmit={saveProfile}>
              <section className={styles.personalSection} aria-labelledby="personal-info-title">
                <div className={styles.photoColumn}>
                  <div className={styles.photoWrap}>
                    <img src={draft.photo || customerAvatar} alt={`${draft.name} profile`} />
                    <span><EditIcon name="camera" /></span>
                  </div>
                  <button
                    ref={changePhotoButtonRef}
                    className={styles.changePhotoButton}
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <EditIcon name="camera" />Change Photo
                  </button>
                  <input
                    ref={photoInputRef}
                    className={styles.srOnly}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={choosePhoto}
                    aria-label="Choose a profile photo"
                  />
                  <small>JPG, PNG (Max 5 MB; optional quality reduction above 2 MB)</small>
                  {photoError && <p className={styles.photoError} role="alert">{photoError}</p>}
                </div>

                <div className={styles.personalFields}>
                  <h3 id="personal-info-title"><EditIcon name="profile" />Personal Information</h3>
                  <div className={styles.fieldsGrid}>
                    <label>Full Name <em>*</em><input autoComplete="name" name="name" minLength={2} maxLength={100} required value={draft.name} onChange={updateField} /></label>
                      <label>Email Address <em>*</em><span className={styles.inputWithIcon}><EditIcon name="mail" /><input autoComplete="email" name="email" type="email" maxLength={254} required readOnly value={draft.email} /></span></label>
                      <label>Phone Number<span className={styles.inputWithIcon}><EditIcon name="phone" /><input autoComplete="tel" name="phone" type="tel" inputMode="tel" maxLength={24} value={draft.phone} onChange={updateField} /></span></label>
                      <label>Username<input autoComplete="username" name="username" value={draft.username} readOnly /></label>
                  </div>
                </div>
              </section>

              <section className={styles.formSection} aria-labelledby="delivery-address-title">
                <h3 id="delivery-address-title"><EditIcon name="pin" />Delivery Address</h3>
                <label className={styles.fullWidth}>Address<input autoComplete="street-address" name="address" maxLength={200} value={draft.address} onChange={updateField} /></label>
                <div className={styles.fieldsGrid}>
                  <label>City<input autoComplete="address-level2" name="city" maxLength={100} value={draft.city} onChange={updateField} /></label>
                  <label>State
                    <select autoComplete="address-level1" name="state" value={draft.state} onChange={updateField}>
                      <option value="">Select a state</option>
                      {['Anambra State', 'Abia State', 'Lagos', 'Rivers State', 'Enugu State', 'Federal Capital Territory'].map((state) => <option key={state}>{state}</option>)}
                    </select>
                  </label>
                  <label>Country <em>*</em>
                    <select autoComplete="country-name" name="country" required value={draft.country} onChange={updateField}>
                      <option>Nigeria</option><option>Ghana</option><option>Benin</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className={styles.formSection} aria-labelledby="preferences-title">
                <h3 id="preferences-title"><EditIcon name="star" />Preferences</h3>
                <div className={styles.fieldsGrid}>
                  <label>Favorite Cuisine <span className={styles.inputWithIcon}><EditIcon name="utensils" /><select name="cuisine" value={draft.cuisine} onChange={updateField}>
                    <option>African</option><option>Continental</option><option>Asian</option><option>Vegetarian</option>
                  </select></span></label>
                  <label>Dietary Preference <span className={styles.inputWithIcon}><EditIcon name="leaf" /><select name="dietaryPreference" value={draft.dietaryPreference} onChange={updateField}>
                    <option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-free</option>
                  </select></span></label>
                </div>
                <label className={styles.newsletter}>
                  <input name="newsletter" type="checkbox" checked={draft.newsletter} onChange={updateField} />
                  Subscribe to our newsletter for special offers and updates
                </label>
              </section>

              <div className={styles.formActions}>
                <Link to="/profile" state={{ profile }}>Cancel</Link>
                <button type="submit"><EditIcon name="save" />Save Changes</button>
              </div>
              {saveError && <p className={styles.saveError} role="alert">{saveError}</p>}
            </form>
          </section>
        </section>
      </div>

      {pendingQualityFile && (
        <div
          className={styles.qualityModalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelQualityChoice()
          }}
        >
          <section
            className={styles.qualityModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quality-modal-title"
            aria-describedby="quality-modal-description"
            onKeyDown={handleQualityDialogKeyDown}
          >
            <button
              className={styles.qualityModalClose}
              type="button"
              onClick={cancelQualityChoice}
              aria-label="Close image quality dialog"
            >
              <EditIcon name="close" />
            </button>
            <div className={styles.qualityArtwork} aria-hidden="true">
              <svg viewBox="0 0 128 112">
                <rect x="14" y="12" width="92" height="72" rx="12" />
                <circle cx="79" cy="33" r="9" />
                <path d="m23 72 23-25 16 17 10-10 25 20" />
              </svg>
              <span className={styles.qualityDownloadBadge}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v12m-5-5 5 5 5-5M5 20h14" />
                </svg>
              </span>
            </div>
            <h2 id="quality-modal-title">Reduce Image Quality?</h2>
            <p id="quality-modal-description">
              Your image is quite large. Do you want to reduce its quality to make the upload faster?
            </p>
            <small className={styles.qualitySecurityNote}>
              The server securely validates and re-encodes your image either way.
            </small>
            <div className={styles.qualityModalActions}>
              <button
                ref={keepOriginalQualityButtonRef}
                className={styles.keepOriginalQualityButton}
                type="button"
                onClick={() => choosePhotoQuality('original')}
              >
                Keep Original Quality
              </button>
              <button
                className={styles.reduceQualityButton}
                type="button"
                onClick={() => choosePhotoQuality('reduced')}
              >
                Yes, Reduce Quality <EditIcon name="arrow" />
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default EditProfile
