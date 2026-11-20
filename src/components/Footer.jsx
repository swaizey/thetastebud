import { Link } from 'react-router-dom'
import fastShippingIcon from '../assets/fast-shipping.png'
import logo from '../assets/logo.png'
import styles from './Footer.module.css'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Catering', to: '/order' },
  { label: 'Delivery', to: '/delivery' },
]

const exploreLinks = [
  { label: 'Our Story', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'Coming Soon', to: '/coming-soon' },
]

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerCta} aria-labelledby="footer-cta-title">
        <img className={styles.ctaIcon} src={fastShippingIcon} alt="" aria-hidden="true" />
        <div className={styles.ctaCopy}>
          <h2 id="footer-cta-title">Order Now or Book Catering Today!</h2>
          <p>Let us take care of the food, so you can enjoy the moment.</p>
        </div>
        <div className={styles.ctaActions}>
          <Link to="/order">Order Now <span aria-hidden="true">→</span></Link>
          <Link to="/catering">Book Catering</Link>
        </div>
      </section>

      <div className={styles.footerMain}>
        <div className={styles.footerBrand}>
          <Link to="/" aria-label="The Taste Bud by Joy home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
          <p>Good food. Beautiful moments.</p>
        </div>

        <nav className={styles.footerNav} aria-label="Quick links">
          <h3>Quick Links</h3>
          {quickLinks.map(({ label, to }) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
        </nav>

        <nav className={styles.footerNav} aria-label="Explore">
          <h3>Explore</h3>
          {exploreLinks.map(({ label, to }) => (
            <Link key={to} to={to}>{label}</Link>
          ))}
        </nav>

        <div className={styles.footerContact}>
          <h3>Get in Touch</h3>
          <p>Planning a meal or a special event?</p>
          <Link to="/contact">We’d love to hear from you <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} The Taste Bud by Joy. All rights reserved.</p>
        <p>Eat Well · Celebrate More</p>
      </div>
    </footer>
  )
}

export default Footer