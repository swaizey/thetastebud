import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { useLocation } from 'react-router-dom'
import { initialProfile } from './profileData.js'
import ProfilePageShell from './ProfilePageShell.jsx'
import { createDefaultAddress, readAddresses, saveAddresses } from '../../utils/accountStorage.js'
import styles from './UserAddresses.module.css'
import profileStyles from './Profile.module.css'

const emptyAddress = {
  label: 'Home',
  recipient: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  isDefault: false,
}

const states = [
  'Abia State',
  'Anambra State',
  'Enugu State',
  'Federal Capital Territory',
  'Lagos',
  'Rivers State',
]

function UserAddresses() {
  const { state } = useLocation()
  const profile = state?.profile || initialProfile
  const [addresses, setAddresses] = useState(() => readAddresses(profile))
  const [draft, setDraft] = useState(emptyAddress)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    saveAddresses(addresses)
  }, [addresses])

  const updateDraft = (event) => {
    const { name, value, checked, type } = event.target
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setFormError('')
  }

  const addAddress = (event) => {
    event.preventDefault()
    const recipient = draft.recipient.trim()
    const phone = draft.phone.trim()
    const address = draft.address.trim()
    const city = draft.city.trim()

    if (recipient.length < 2 || phone.length < 7 || address.length < 5 || city.length < 2) {
      setFormError('Check that each field is complete and meets its minimum length.')
      return
    }

    const newAddress = {
      ...draft,
      id: nanoid(),
      recipient,
      phone,
      address,
      city,
      isDefault: addresses.length === 0 || draft.isDefault,
    }

    setAddresses((current) => [
      ...current.map((item) => ({ ...item, isDefault: newAddress.isDefault ? false : item.isDefault })),
      newAddress,
    ])
    setDraft(emptyAddress)
    setIsFormOpen(false)
    setNotice('Address saved.')
  }

  const makeDefault = (id) => {
    setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })))
  }

  const removeAddress = (id) => {
    setAddresses((current) => {
      const remaining = current.filter((address) => address.id !== id)
      if (current.find((address) => address.id === id)?.isDefault && remaining.length > 0) {
        return remaining.map((address, index) => ({ ...address, isDefault: index === 0 }))
      }
      return remaining
    })
  }

  return (
    <ProfilePageShell
      active="addresses"
      title="Addresses"
      description="Manage the delivery addresses saved to your account."
    >
      <section className={profileStyles.informationCard} aria-labelledby="addresses-title">
        <div className={profileStyles.sectionHeading}>
          <h2 id="addresses-title">My Addresses</h2>
          <button
            className={styles.addButton}
            type="button"
            onClick={() => setIsFormOpen((isOpen) => !isOpen)}
            aria-expanded={isFormOpen}
            aria-controls="address-form"
          >
            {isFormOpen ? 'Close form' : '+ Add Address'}
          </button>
        </div>

        {isFormOpen && (
          <form id="address-form" className={styles.addressForm} onSubmit={addAddress}>
            <h3>Add a delivery address</h3>
            <div className={styles.formGrid}>
              <label>
                Address label
                <select name="label" value={draft.label} onChange={updateDraft}>
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Recipient name
                <input autoComplete="name" name="recipient" minLength={2} maxLength={100} required value={draft.recipient} onChange={updateDraft} />
              </label>
              <label>
                Phone number
                <input autoComplete="tel" name="phone" type="tel" inputMode="tel" minLength={7} maxLength={24} required value={draft.phone} onChange={updateDraft} />
              </label>
              <label className={styles.fullWidth}>
                Street address
                <input autoComplete="street-address" name="address" minLength={5} maxLength={200} required value={draft.address} onChange={updateDraft} />
              </label>
              <label>
                City
                <input autoComplete="address-level2" name="city" minLength={2} maxLength={100} required value={draft.city} onChange={updateDraft} />
              </label>
              <label>
                State
                <select autoComplete="address-level1" name="state" required value={draft.state} onChange={updateDraft}>
                  <option value="" disabled>Select a state</option>
                  {states.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                Country
                <select autoComplete="country-name" name="country" required value={draft.country} onChange={updateDraft}>
                  <option>Nigeria</option>
                  <option>Ghana</option>
                  <option>Benin</option>
                </select>
              </label>
            </div>
            <label className={styles.defaultCheckbox}>
              <input name="isDefault" type="checkbox" checked={draft.isDefault} onChange={updateDraft} />
              Set as my default delivery address
            </label>
            {formError && <p className={styles.formError} role="alert">{formError}</p>}
            <div className={styles.formActions}>
              <button type="button" onClick={() => { setIsFormOpen(false); setDraft(emptyAddress) }}>Cancel</button>
              <button type="submit">Save Address</button>
            </div>
          </form>
        )}
        {notice && <p className={styles.formNotice} role="status">{notice}</p>}

        {addresses.length > 0 ? (
          <div className={styles.addressGrid}>
            {addresses.map((address) => (
              <article className={styles.addressCard} key={address.id}>
                <div className={styles.addressHeading}>
                  <h3>{address.label}</h3>
                  {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
                </div>
                <strong>{address.recipient}</strong>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state}, {address.country}</p>
                <div className={styles.addressActions}>
                  {!address.isDefault && (
                    <button type="button" onClick={() => makeDefault(address.id)}>Set as default</button>
                  )}
                  <button
                    className={styles.removeButton}
                    type="button"
                    aria-label={`Remove ${address.label} address`}
                    onClick={() => removeAddress(address.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No saved addresses</h3>
            <p>Add an address to make checkout quicker.</p>
            <button type="button" onClick={() => {
              setDraft({ ...emptyAddress, ...createDefaultAddress(profile), id: undefined, isDefault: true })
              setIsFormOpen(true)
            }}>
              Add your first address
            </button>
          </div>
        )}
      </section>
    </ProfilePageShell>
  )
}

export default UserAddresses
