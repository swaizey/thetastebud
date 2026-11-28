import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from './AccountSidebar.jsx'
import customerAvatar from '../../assets/customer2.png'
import heroFood from '../../assets/partyjollof.png'
import { useFavorites } from '../../hooks/useFavorites.js'
import { useAccountProfile } from '../../hooks/useAccountProfile.js'
import { apiRequest } from '../../utils/api.js'
import styles from './Profile.module.css'

const ordersPerPage = 100

async function fetchOrders() {
  const orders = []
  let offset = 0

  while (true) {
    const response = await apiRequest(`/orders?limit=${ordersPerPage}&offset=${offset}`)
    if (!Array.isArray(response.data)) throw new TypeError('The orders response must contain an array.')
    orders.push(...response.data)
    if (response.data.length < ordersPerPage) return orders
    offset += ordersPerPage
  }
}

function ProfileIcon({ name }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    orders: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    favorites: <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
    address: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    payment: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    heart: <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
    wallet: <><rect x="3" y="6" width="18" height="15" rx="2" /><path d="M3 9h18M16 14h2M6 6V4a1 1 0 0 1 1-1h12" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a14 14 0 0 1-7-7l3-2-3-5Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 12H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7H4Zm16 0h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7h1ZM18 19a6 6 0 0 1-6 3h-1" /></>,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function formatAmount(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

function formatDate(date) {
  const parsedDate = new Date(date)
  const dateLabel = parsedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const timeLabel = parsedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${dateLabel} • ${timeLabel}`
}

function statusLabel(status) {
  const labels = {
    pending: 'Pending',
    confirmed: 'Preparing',
    approved: 'Preparing',
    preparing: 'Preparing',
    ready_for_pickup: 'Preparing',
    on_the_way: 'On The Way',
    'on the way': 'On The Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return labels[status.toLowerCase()] || status
}

function CustomerProfile() {
  const { favorites } = useFavorites()
  const { profile } = useAccountProfile()
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([
      fetchOrders(),
      apiRequest('/addresses').then((response) => {
        if (!Array.isArray(response.data)) throw new TypeError('The addresses response must contain an array.')
        return response.data
      }),
    ])
      .then(([savedOrders, savedAddresses]) => {
        if (!active) return
        setOrders(savedOrders)
        setAddresses(savedAddresses)
      })
      .catch((error) => {
        if (active) setDataError(error.message || 'Unable to load your account summary.')
      })
      .finally(() => {
        if (active) setDataLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const recentOrders = orders.slice(0, 3)
  const orderCount = orders.length
  const totalSpent = orders.reduce((total, order) => total + Number(order.total_minor || 0) / 100, 0)
  const defaultAddress = addresses.find((address) => address.is_default) || addresses[0]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="profile-hero-title">
        <img className={styles.heroImage} src={heroFood} alt="" />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <h1 id="profile-hero-title">My <span>Profile</span></h1>
          <p>Manage your account, track your orders<br className={styles.desktopBreak} /> and enjoy a seamless ordering experience.</p>
        </div>
      </section>

      <div className={styles.dashboard}>
        <AccountSidebar profile={profile} active="profile" />

        <div className={styles.mainColumn}>
          <section className={styles.informationCard} id="profile-information" aria-labelledby="profile-information-title">
            <div className={styles.sectionHeading}>
              <h2 id="profile-information-title"><span className={styles.headingIcon}><ProfileIcon name="profile" /></span>Profile Information</h2>
              <Link
                className={styles.editButton}
                to="/profile/edit"
                state={{ profile }}
              >
                <ProfileIcon name="edit" />Edit Profile
              </Link>
            </div>
            <div className={styles.informationBody}>
              <div className={styles.largeAvatarWrap}>
                <img className={styles.largeAvatar} src={profile.photo || customerAvatar} alt={`${profile.name} profile`} />
                <span className={styles.cameraBadge}><ProfileIcon name="camera" /></span>
              </div>
              <div className={styles.profileDetails}>
                <div className={styles.profileContact}>
                  <h3>{profile.name}</h3>
                  <p><ProfileIcon name="mail" />{profile.email}</p>
                  <p><ProfileIcon name="phone" />{profile.phone}</p>
                </div>
                <div className={styles.profileMeta}>
                  <span><ProfileIcon name="calendar" /><span>Member Since<strong>{profile.memberSince}</strong></span></span>
                  <span id="addresses"><ProfileIcon name="pin" /><span>Default Address<strong>{defaultAddress ? `${defaultAddress.city}, ${defaultAddress.region}` : 'Add an address'}</strong></span></span>
                  <span className={styles.activeBadge}><span />Active</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.metrics} aria-label="Account summary">
            <article className={styles.metricCard}>
              <span className={`${styles.metricIcon} ${styles.orange}`}><ProfileIcon name="cart" /></span>
              <strong>{dataLoading ? '…' : dataError ? '—' : orderCount}</strong><span>Total Orders</span>
            </article>
            <article className={styles.metricCard}>
              <span className={`${styles.metricIcon} ${styles.pink}`}><ProfileIcon name="heart" /></span>
              <strong>{favorites.length}</strong><span>Favorite Items</span>
            </article>
            <article className={styles.metricCard}>
              <span className={`${styles.metricIcon} ${styles.orange}`}><ProfileIcon name="wallet" /></span>
              <strong>{dataLoading ? '…' : dataError ? '—' : formatAmount(totalSpent)}</strong><span>Total Spent</span>
            </article>
            <article className={styles.metricCard}>
              <span className={`${styles.metricIcon} ${styles.orange}`}><ProfileIcon name="star" /></span>
              <strong>—</strong><span>Customer Rating</span>
            </article>
          </section>

          <section className={styles.ordersCard} aria-labelledby="recent-orders-title">
            <div className={styles.sectionHeading}>
              <h2 id="recent-orders-title"><span className={styles.ordersHeadingIcon}><ProfileIcon name="orders" /></span>Recent Orders</h2>
              <Link className={styles.viewAllButton} to="/order">View All Orders <ProfileIcon name="arrow" /></Link>
            </div>
            <div className={styles.ordersTableWrap}>
              <table className={styles.ordersTable}>
                <thead><tr><th scope="col">Order ID</th><th scope="col">Date</th><th scope="col">Total</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
                <tbody>
                  {dataLoading && <tr><td colSpan="5" role="status">Loading your orders…</td></tr>}
                  {!dataLoading && dataError && <tr><td colSpan="5" role="alert">{dataError}</td></tr>}
                  {!dataLoading && !dataError && recentOrders.length === 0 && (
                    <tr><td colSpan="5">You have no orders yet.</td></tr>
                  )}
                  {recentOrders.map((order) => {
                    const label = statusLabel(order.status)
                    return (
                      <tr key={order.id}>
                        <td>{order.order_number || order.id}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{formatAmount(Number(order.total_minor || 0) / 100)}</td>
                        <td><span className={`${styles.orderStatus} ${styles[`status${label.replaceAll(' ', '')}`]}`}>{label}</span></td>
                        <td><Link to={`/order/${order.id}`}>View Details <ProfileIcon name="arrow" /></Link></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.supportCard} aria-label="Customer support">
            <span className={styles.supportIcon}><ProfileIcon name="headset" /></span>
            <div><h2>Need Help?</h2><p>Our support team is always here to help you.</p></div>
            <Link to="/contact"><ProfileIcon name="headset" />Contact Support<ProfileIcon name="arrow" /></Link>
          </section>
        </div>
      </div>

    </main>
  )
}

export default CustomerProfile
