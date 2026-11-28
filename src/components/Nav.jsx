import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import menuFood from '../assets/partyjollof.png'
import { CART_CHANGE_EVENT, readCart } from '../utils/orderStorage'
import styles from './components.module.css'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { label: 'Home', to: '/home' },
  { label: 'Menu', to: '/' },
  { label: 'Catering', to: '/catering' },
  { label: 'Delivery', to: '/delivery' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

function NavigationIcon({ label }) {
  const paths = {
    Home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
    Menu: <><path d="M5 3v6M8 3v6M11 3v6M8 9v12M18 3c-2 2-2 5 0 7v11" /><path d="M5 9h6" /></>,
    Catering: <><path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V7" /><circle cx="12" cy="5" r="2" /><path d="M4 20h16" /></>,
    Delivery: <><circle cx="7" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" /><path d="M9.5 17H15l2-6h3l2 4M4.5 17H3m5-9h5l2 4h3M10 8l-2 4h6M10 5h3" /></>,
    About: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    Contact: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></>,
    Gallery: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></>,
  }

  return (
    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[label]}
    </svg>
  )
}

function Nav() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [navScrolled, setNavScrolled] = useState(window.scrollY > 16)
  const [cartCount, setCartCount] = useState(() =>
    readCart().reduce((count, item) => count + item.quantity, 0),
  )

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setNavScrolled(currentScrollY > 16)

      if (menuOpen || currentScrollY <= 72) {
        setNavHidden(false)
      } else if (currentScrollY > previousScrollY + 4) {
        setNavHidden(true)
      } else if (currentScrollY < previousScrollY - 4) {
        setNavHidden(false)
      }

      previousScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen || !window.matchMedia('(max-width: 800px)').matches) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(readCart().reduce((count, item) => count + item.quantity, 0))
    }

    window.addEventListener(CART_CHANGE_EVENT, updateCartCount)
    window.addEventListener('storage', updateCartCount)
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <header
      className={`${styles.header} ${navScrolled && !menuOpen ? styles.headerScrolled : ''} ${navHidden ? styles.headerHidden : ''}`}
    >
      <Link className={styles.brand} to="/" aria-label="The Taste Bud by Joy home">
        <img src={logo} alt="The Taste Bud by Joy" />
      </Link>

      <button
        className={styles.menuToggle}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => {
          setMenuOpen(!menuOpen)
          setNavHidden(false)
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          {menuOpen ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 16h18" />
              <path d="M5 15.5a7 7 0 0 1 14 0" />
              <path d="M12 6v2" />
              <path d="M4.5 19.5h15" />
            </g>
          )}
        </svg>
      </button>

      <div
        id="primary-navigation"
        className={`${styles.navigationPanel} ${menuOpen ? styles.navigationPanelOpen : ''}`}
        aria-hidden={!menuOpen && window.matchMedia('(max-width: 800px)').matches}
      >
        <div className={styles.mobilePanelHeader}>
          <Link
            className={styles.mobileBrand}
            to="/"
            aria-label="The Taste Bud by Joy home"
            onClick={() => setMenuOpen(false)}
          >
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
        </div>
        <nav className={styles.navigation} aria-label="Main navigation">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              end={to === '/'}
              className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.currentLink : ''}`
              }
              to={to}
              onClick={() => setMenuOpen(false)}
            >
              <NavigationIcon label={label} />
              {label}
              <span className={styles.navArrow} aria-hidden="true">›</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link
            className={styles.cartLink}
            to="/order"
            aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
            <span className={styles.cartCount} aria-hidden="true">{cartCount}</span>
          </Link>
          <Link className={styles.orderLink} to="/order" onClick={() => setMenuOpen(false)}>
            <svg className={styles.orderIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V7" />
              <circle cx="12" cy="5" r="2" />
              <path d="M4 20h16" />
            </svg>
            Order Now <span aria-hidden="true">→</span>
          </Link>
          <NavLink
            className={({ isActive }) => `${styles.profileLink} ${isActive ? styles.profileLinkActive : ''}`}
            to={user ? '/profile' : '/login'}
            aria-label={user ? 'My Profile' : 'Sign in'}
            title={user ? 'My Profile' : 'Sign in'}
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </NavLink>
        </div>
        <div className={styles.mobileMenuFooter}>
          <div className={styles.footerRule}><span aria-hidden="true">✦</span></div>
          <p>Good Food. Great Mood.</p>
        </div>
        {menuOpen && <img className={styles.mobileMenuFood} src={menuFood} alt="" loading="lazy" decoding="async" />}
      </div>
      <button
        className={`${styles.menuBackdrop} ${menuOpen ? styles.menuBackdropOpen : ''}`}
        type="button"
        aria-label="Dismiss navigation overlay"
        onClick={() => setMenuOpen(false)}
      />
    </header>
  )
}

export default Nav