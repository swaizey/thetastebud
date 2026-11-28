import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import styles from './AdminDashboard.module.css'
import { useAuth } from '../../context/AuthContext.jsx'

const navigation = [
  { label: 'Dashboard', icon: 'home', to: '/admin' },
  { label: 'Users', icon: 'users', to: '/admin/users' },
  { label: 'Orders', icon: 'cart', to: '/admin/orders' },
  { label: 'Inbox', icon: 'inbox', to: '/admin/messages' },
  { label: 'Menu', icon: 'menu', to: '/admin/menu' },
  { label: 'Sales', icon: 'sales', to: '/admin/sales' },
  { label: 'Settings', icon: 'settings', to: '/admin#admin-account' },
]

function AdminIcon({ name }) {
  const paths = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
    navToggle: <path d="M4 6h16M4 12h16M4 18h16" />,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.5V20" /></>,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    menu: <><path d="M3 11h18l-2 9H5zM5 11l2-7h10l2 7M8 15h.01M12 15h.01M16 15h.01" /></>,
    sales: <><path d="M4 20V11h4v9M10 20V5h4v15M16 20V8h4v12" /></>,
    inbox: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 13h5l2 3h4l2-3h5M7 8h10" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    back: <path d="M19 12H5m7 7-7-7 7-7" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isUserProfilePage = pathname.startsWith('/admin/users/')
  const isOrderDetailsPage = pathname.startsWith('/admin/orders/')
  const isMessageInboxPage = pathname === '/admin/messages'
  const isMessageThreadPage = pathname.startsWith('/admin/messages/')
  const isAdminMessagePage = isMessageInboxPage || isMessageThreadPage
  const isUsersPage = pathname === '/admin/users' || isUserProfilePage
  const isOrdersPage = pathname === '/admin/orders' || isOrderDetailsPage
  const isMenuPage = pathname === '/admin/menu'
  const isSalesPage = pathname === '/admin/sales'
  const logoutFromAdmin = async () => {
    await logout()
    setProfileOpen(false)
    setSidebarOpen(false)
    navigate('/admin/login', { replace: true })
  }
  const pageTitle = isOrderDetailsPage
    ? 'Order Details'
    : isUserProfilePage
    ? 'User Profile'
    : isMessageThreadPage
      ? 'Customer Conversation'
      : isMessageInboxPage
        ? 'Message Inbox'
    : isUsersPage
    ? 'Users Management'
    : isOrdersPage
      ? 'Orders Management'
      : isMenuPage
        ? 'Menu Management'
        : isSalesPage
          ? 'Sales Overview'
          : 'Admin Dashboard'
  const pageDescription = isOrderDetailsPage
    ? 'View and manage order information'
    : isUserProfilePage
    ? 'View and manage customer details'
    : isMessageThreadPage
      ? 'Respond to customer messages'
      : isMessageInboxPage
        ? 'Read and respond to customer enquiries'
    : isUsersPage
    ? 'View and manage your customers'
    : isOrdersPage
      ? 'Track and manage all customer orders'
      : isMenuPage
        ? 'Manage your menu items and details'
        : isSalesPage
          ? 'Track your business performance'
        : 'Welcome back, Admin!'

  return (
    <div className={styles.dashboard}>
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
        id="admin-sidebar"
        aria-label="Admin sidebar"
        aria-hidden={!sidebarOpen && window.matchMedia('(max-width: 650px)').matches}
      >
        <Link className={styles.brand} to="/" aria-label="The Taste Bud home" onClick={() => setSidebarOpen(false)}>
          <img src={logo} alt="The Taste Bud By Joy" />
        </Link>
        <button
          className={styles.sidebarClose}
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
        >
          <AdminIcon name="close" />
        </button>
        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          {navigation.map(({ label, icon, to }) => {
            const isActive = label === 'Dashboard'
              ? pathname === '/admin'
              : label === 'Users'
                ? isUsersPage
                : label === 'Orders'
                  ? isOrdersPage
                : label === 'Inbox'
                  ? isAdminMessagePage
                  : label === 'Menu'
                    ? isMenuPage
                    : label === 'Sales' && isSalesPage
            return (
              <Link
                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
                key={label}
                to={to}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <AdminIcon name={icon} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className={styles.sidebarArt} aria-hidden="true">
          <AdminIcon name="menu" />
        </div>
        <button className={styles.logout} type="button" onClick={logoutFromAdmin}>
          <AdminIcon name="logout" />
          <span>Logout</span>
        </button>
      </aside>
      {sidebarOpen && (
        <button
          className={styles.sidebarBackdrop}
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            <button
              className={styles.sidebarToggle}
              type="button"
              aria-label={sidebarOpen ? 'Close admin navigation' : 'Open admin navigation'}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <AdminIcon name="navToggle" />
            </button>
            <div className={isOrderDetailsPage || isMessageThreadPage ? styles.pageTitleWithBack : undefined}>
              {(isOrderDetailsPage || isMessageThreadPage) && (
                <Link
                  className={styles.backToOrders}
                  to={isMessageThreadPage ? '/admin/messages' : '/admin/orders'}
                  aria-label={isMessageThreadPage ? 'Back to Inbox' : 'Back to Orders'}
                >
                  <AdminIcon name="back" />
                </Link>
              )}
              <div>
                <h1>{pageTitle}</h1>
                <p>{pageDescription}</p>
              </div>
            </div>
          </div>
          <div className={styles.profileWrap}>
            <button
              className={styles.profileButton}
              id="admin-account"
              type="button"
              aria-expanded={profileOpen}
              aria-label="Admin account"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className={styles.profileAvatar}><AdminIcon name="user" /></span>
              <span className={styles.profileName}>Admin</span>
              <AdminIcon name="chevron" />
            </button>
            {profileOpen && (
              <div className={styles.profileMenu}>
                <span>Signed in as Admin</span>
                <button type="button" onClick={logoutFromAdmin}>Logout</button>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  )
}

export default AdminLayout
