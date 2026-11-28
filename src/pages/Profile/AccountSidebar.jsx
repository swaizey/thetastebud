import { Link, useNavigate } from 'react-router-dom'
import customerAvatar from '../../assets/customer2.png'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Profile.module.css'

function AccountIcon({ name }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    messages: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6a7.5 7.5 0 1 1 17-3.5Z" /><path d="M8 11h8M8 14h5" /></>,
    orders: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    favorites: <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />,
    address: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    payment: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function AccountSidebar({ profile, active }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const profileLink = active === 'edit'
    ? { key: 'edit', label: 'Edit Profile', to: '/profile/edit', icon: 'profile' }
    : { key: 'profile', label: 'My Profile', to: '/profile', icon: 'profile' }
  const links = [
    profileLink,
    { key: 'orders', label: 'My Orders', to: '/order', icon: 'orders' },
    { key: 'messages', label: 'Messages', to: '/messages', icon: 'messages' },
    { key: 'favorites', label: 'My Favorites', to: '/profile/favorites', icon: 'favorites' },
    { key: 'addresses', label: 'My Addresses', to: '/profile/addresses', icon: 'address' },
    { key: 'payment', label: 'Payment Methods', to: '/coming-soon', icon: 'payment' },
    { key: 'settings', label: 'Settings', to: '/coming-soon', icon: 'settings' },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarProfile}>
        <img src={profile.photo || customerAvatar} alt="" />
        <strong>{profile.name}</strong>
        <span>{profile.email}</span>
      </div>
      <nav className={styles.accountNav} aria-label="My account">
        {links.map(({ key, label, icon, to }) => (
          <Link
            aria-current={active === key ? 'page' : undefined}
            className={`${styles.accountNavLink} ${active === key ? styles.accountNavActive : ''}`}
            key={label}
            to={to}
            state={to.startsWith('/profile') ? { profile } : undefined}
          >
            <AccountIcon name={icon} />
            <span>{label}</span>
          </Link>
        ))}
        <button className={`${styles.accountNavLink} ${styles.accountNavLogout}`} type="button" onClick={handleLogout}>
          <AccountIcon name="logout" /><span>Log Out</span>
        </button>
      </nav>
      <div className={styles.sidebarPromo}>
        <span>Good Food.<br />Great Mood.</span>
      </div>
    </aside>
  )
}

export default AccountSidebar
