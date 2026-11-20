import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import customerAvatar from '../../assets/customer2.png'
import heroFood from '../../assets/partyjollof.png'
import AccountSidebar from './AccountSidebar.jsx'
import { initialProfile } from './profileData.js'
import profileStyles from './Profile.module.css'
import styles from './EditProfile.module.css'

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
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function EditProfile() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const profile = state?.profile || initialProfile
  const [draft, setDraft] = useState(profile)
  const [photoError, setPhotoError] = useState('')
  const [saveError, setSaveError] = useState('')

  const updateField = (event) => {
    const { name, value, checked, type } = event.target
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setSaveError('')
  }

  const choosePhoto = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setPhotoError('Choose a JPG or PNG image.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('The photo must be 2 MB or smaller.')
      return
    }

    setPhotoError('')
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((current) => ({ ...current, photo: reader.result }))
      } else {
        setPhotoError('The selected photo could not be loaded.')
      }
    }
    reader.onerror = () => setPhotoError('The selected photo could not be loaded.')
    reader.readAsDataURL(file)
  }

  const saveProfile = (event) => {
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
    if (updatedProfile.name.length < 2 || updatedProfile.phone.length < 7 ||
      updatedProfile.address.length < 5 || updatedProfile.city.length < 2) {
      setSaveError('Check that each required field is complete and meets its minimum length.')
      return
    }

    navigate('/profile', { state: { profile: updatedProfile } })
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
                  <button className={styles.changePhotoButton} type="button" onClick={() => photoInputRef.current?.click()}>
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
                  <small>JPG, PNG (Max 2MB)</small>
                  {photoError && <p className={styles.photoError} role="alert">{photoError}</p>}
                </div>

                <div className={styles.personalFields}>
                  <h3 id="personal-info-title"><EditIcon name="profile" />Personal Information</h3>
                  <div className={styles.fieldsGrid}>
                    <label>Full Name <em>*</em><input autoComplete="name" name="name" minLength={2} maxLength={100} required value={draft.name} onChange={updateField} /></label>
                      <label>Email Address <em>*</em><span className={styles.inputWithIcon}><EditIcon name="mail" /><input autoComplete="email" name="email" type="email" maxLength={254} required readOnly value={draft.email} /></span></label>
                      <label>Phone Number <em>*</em><span className={styles.inputWithIcon}><EditIcon name="phone" /><input autoComplete="tel" name="phone" type="tel" inputMode="tel" minLength={7} maxLength={24} required value={draft.phone} onChange={updateField} /></span></label>
                      <label>Username<input autoComplete="username" name="username" maxLength={30} value={draft.username} onChange={updateField} /></label>
                  </div>
                </div>
              </section>

              <section className={styles.formSection} aria-labelledby="delivery-address-title">
                <h3 id="delivery-address-title"><EditIcon name="pin" />Delivery Address</h3>
                <label className={styles.fullWidth}>Address <em>*</em><input autoComplete="street-address" name="address" minLength={5} maxLength={200} required value={draft.address} onChange={updateField} /></label>
                <div className={styles.fieldsGrid}>
                  <label>City <em>*</em><input autoComplete="address-level2" name="city" minLength={2} maxLength={100} required value={draft.city} onChange={updateField} /></label>
                  <label>State <em>*</em>
                    <select autoComplete="address-level1" name="state" required value={draft.state} onChange={updateField}>
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
    </main>
  )
}

export default EditProfile
