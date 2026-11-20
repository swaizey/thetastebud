import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './AdminUserProfile.module.css'
import jollof from '../../assets/partyjollof.png'
import friedRice from '../../assets/agoyinspecial.png'
import noodles from '../../assets/plainpasta.png'
import grilledChicken from '../../assets/chickenbrest.png'
import plantainRice from '../../assets/plantainspecia.png'

const recentOrders = [
  { id: 'TB10472', item: 'Jollof Rice with Chicken', image: jollof, amount: 7500, date: 'Nov 15, 2026', time: '03:20 PM', status: 'Delivered' },
  { id: 'TB10470', item: 'Fried Rice with Fish', image: friedRice, amount: 6000, date: 'Nov 14, 2026', time: '06:45 PM', status: 'Preparing' },
  { id: 'TB10468', item: 'Noodles', image: noodles, amount: 4000, date: 'Nov 13, 2026', time: '01:30 PM', status: 'Delivered' },
  { id: 'TB10465', item: 'Grilled Chicken', image: grilledChicken, amount: 7000, date: 'Nov 10, 2026', time: '04:15 PM', status: 'Pending' },
  { id: 'TB10462', item: 'Fried Rice with Plantain', image: plantainRice, amount: 6500, date: 'Nov 08, 2026', time: '07:25 PM', status: 'Cancelled' },
]

const fallbackUser = {
  id: 'TB10461',
  name: 'Chinedu Ani',
  phone: '0701 999 8888',
  email: 'chinedu@gmail.com',
  joinDate: 'Sep 28, 2025',
  totalOrders: 10,
  status: 'Active',
  isPremium: false,
  avatar: null,
}

function ProfileIcon({ name }) {
  const paths = {
    chart: <><path d="M4 19V10h4v9M10 19V5h4v14M16 19V8h4v11" /><path d="M3 21h18" /></>,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
    phone: <path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a14 14 0 0 1-7-7l3-2-3-5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    wallet: <><rect x="3" y="6" width="18" height="15" rx="2" /><path d="M3 9h18M16 14h2" /><path d="M6 6V4a1 1 0 0 1 1-1h12" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    home: <><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function formatAmount(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

function AdminUserProfile() {
  const { state } = useLocation()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(state?.user || { ...fallbackUser, id: userId || fallbackUser.id })
  const [editOpen, setEditOpen] = useState(false)
  const [draft, setDraft] = useState({ name: user.name, phone: user.phone, email: user.email })
  const [formError, setFormError] = useState('')

  const saveProfile = (event) => {
    event.preventDefault()
    const updatedProfile = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
    }
    if (updatedProfile.name.length < 2 || updatedProfile.phone.length < 7 ||
      !updatedProfile.email || updatedProfile.email.length > 254) {
      setFormError('Enter a name, phone number, and valid email address.')
      return
    }

    setUser((current) => ({ ...current, ...updatedProfile }))
    setEditOpen(false)
    setFormError('')
  }

  const toggleBlocked = () => {
    setUser((current) => ({ ...current, status: current.status === 'Blocked' ? 'Active' : 'Blocked' }))
  }

  return (
    <main className={styles.profilePage}>
      <section className={styles.profileCard} aria-label={`${user.name} customer profile`}>
        <div className={styles.avatarWrap}>
          {user.avatar
            ? <img className={styles.avatar} src={user.avatar} alt="" />
            : <span className={styles.avatarFallback} aria-label={`${user.name} avatar`}>{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>}
          <span className={styles.cameraBadge}><ProfileIcon name="camera" /></span>
        </div>
        <h2>{user.name}</h2>
        <div className={styles.customerIdentity}>
          <strong>#{user.id}</strong>
          <span className={`${styles.statusBadge} ${user.status === 'Blocked' ? styles.statusBlocked : styles.statusActive}`}>
            <span />{user.status}
          </span>
        </div>

        <dl className={styles.contactDetails}>
          <div><dt><ProfileIcon name="phone" /><span className={styles.srOnly}>Phone</span></dt><dd>{user.phone}</dd></div>
          <div><dt><ProfileIcon name="mail" /><span className={styles.srOnly}>Email</span></dt><dd>{user.email}</dd></div>
          <div><dt><ProfileIcon name="calendar" /><span className={styles.srOnly}>Joined</span></dt><dd>Joined: {user.joinDate}</dd></div>
        </dl>

        <div className={styles.profileStats}>
          <div><span className={`${styles.statIcon} ${styles.peach}`}><ProfileIcon name="cart" /></span><span>Total Orders<strong>{user.totalOrders}</strong></span></div>
          <div><span className={`${styles.statIcon} ${styles.orange}`}><ProfileIcon name="star" /></span><span>Avg. Rating<strong>4.8</strong></span></div>
          <div><span className={`${styles.statIcon} ${styles.red}`}><ProfileIcon name="wallet" /></span><span>Total Spent<strong>{formatAmount(user.totalOrders * 14200)}</strong></span></div>
        </div>

        <div className={styles.profileActions}>
          <button className={styles.editButton} type="button" onClick={() => { setFormError(''); setEditOpen(true) }}>
            <ProfileIcon name="edit" /> Edit Profile
          </button>
          <button className={styles.blockButton} type="button" onClick={toggleBlocked}>
            <ProfileIcon name="lock" /> {user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </section>

      <div className={styles.profileDetails}>
        <section className={styles.panel} aria-labelledby="order-summary-title">
          <h2 className={styles.panelTitle} id="order-summary-title"><ProfileIcon name="chart" />Order Summary</h2>
          <div className={styles.summaryGrid}>
            <article className={styles.summaryCard}><span className={`${styles.summaryIcon} ${styles.peach}`}><ProfileIcon name="cart" /></span><strong>{user.totalOrders}</strong><span>Total Orders</span></article>
            <article className={styles.summaryCard}><span className={`${styles.summaryIcon} ${styles.green}`}><ProfileIcon name="check" /></span><strong>8</strong><span>Delivered</span></article>
            <article className={styles.summaryCard}><span className={`${styles.summaryIcon} ${styles.yellow}`}><ProfileIcon name="clock" /></span><strong>1</strong><span>Pending</span></article>
            <article className={styles.summaryCard}><span className={`${styles.summaryIcon} ${styles.pink}`}><ProfileIcon name="close" /></span><strong>1</strong><span>Cancelled</span></article>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.orderPanel}`} aria-labelledby="order-history-title">
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle} id="order-history-title"><ProfileIcon name="clock" />Order History</h2>
            <button type="button" className={styles.viewAllButton} onClick={() => navigate('/admin/orders')}>View All <ProfileIcon name="arrow" /></button>
          </div>
          <div className={styles.orderTableWrap}>
            <table className={styles.orderTable}>
              <thead><tr><th scope="col">Order ID</th><th scope="col">Items</th><th scope="col">Amount</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td><span className={styles.orderItem}><img src={order.image} alt="" /><span>{order.item}</span></span></td>
                    <td>{formatAmount(order.amount)}</td>
                    <td><time className={styles.orderDate}><span>{order.date}</span><small>{order.time}</small></time></td>
                    <td><span className={`${styles.orderStatus} ${styles[`order${order.status.replace(' ', '')}`]}`}><span />{order.status}</span></td>
                    <td><button className={styles.viewOrderButton} type="button" aria-label={`View order ${order.id}`} onClick={() => navigate('/admin/orders')}><ProfileIcon name="eye" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.addressPanel}`} aria-labelledby="addresses-title">
          <div className={styles.addressHeading}>
            <h2 className={styles.panelTitle} id="addresses-title"><ProfileIcon name="pin" />Delivery Addresses</h2>
            <button type="button" className={styles.manageAddressButton} onClick={() => document.getElementById('customer-address')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              Manage Addresses <ProfileIcon name="arrow" />
            </button>
          </div>
          <div className={styles.address} id="customer-address">
            <ProfileIcon name="home" />
            <p>123 Market Road, Onitsha, Anambra State<br />Lagos, Nigeria</p>
          </div>
        </section>
      </div>

      {editOpen && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditOpen(false)
        }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <div className={styles.modalHeading}>
              <h2 id="edit-profile-title">Edit Profile</h2>
              <button type="button" aria-label="Close dialog" onClick={() => setEditOpen(false)}><ProfileIcon name="close" /></button>
            </div>
            <form className={styles.editForm} onSubmit={saveProfile} onChange={() => setFormError('')}>
              <label>Name<input required minLength={2} maxLength={100} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label>Phone<input required type="tel" inputMode="tel" minLength={7} maxLength={24} value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
              <label>Email<input required type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
              {formError && <p className={styles.formError} role="alert">{formError}</p>}
              <div className={styles.modalActions}>
                <button className={styles.cancelButton} type="button" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className={styles.saveButton} type="submit">Save Changes</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default AdminUserProfile
