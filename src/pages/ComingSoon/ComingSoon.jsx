import { useState } from 'react'
import styles from './ComingSoon.module.css'
import heroFood from '../../assets/partyjollof.png'

function ComingSoonIcon({ name }) {
  const paths = {
    chef: <><path d="M6 12a4 4 0 1 1 3-6.8A4 4 0 1 1 15 6a4 4 0 1 1 3 6H6ZM6 12v8h12v-8M9 15h6" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
    facebook: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    youtube: <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function ComingSoon() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const notifyMe = (event) => {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <main className={styles.hero}>
      <img className={styles.heroImage} src={heroFood} alt="" />
      <div className={styles.heroShade} />
      <div className={styles.leafLeft} aria-hidden="true" />
      <div className={styles.leafRight} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow}><ComingSoonIcon name="chef" />Something Delicious is on the Way!</p>
        <h1>Coming<br /><span>Soon</span></h1>
        <p className={styles.description}>We’re cooking up something special for you.<br />Our new website will be live shortly!</p>

        <section className={styles.notifyCard} aria-labelledby="notify-title">
          <div className={styles.notifyIntro}>
            <ComingSoonIcon name="bell" />
            <span><strong id="notify-title">Be the first to know!</strong><small>Subscribe to get notified when we launch.</small></span>
          </div>
          {subscribed ? (
            <p className={styles.successMessage} role="status">Thanks for your interest! We can’t wait to share what’s next.</p>
          ) : (
            <form className={styles.notifyForm} onSubmit={notifyMe}>
              <label>
                <ComingSoonIcon name="mail" />
                <span className={styles.srOnly}>Email address</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <button type="submit">Notify Me <ComingSoonIcon name="arrow" /></button>
            </form>
          )}
        </section>

        <div className={styles.followUs}>
          <span>Follow Us</span>
          <i aria-hidden="true" />
          <span className={styles.socialIcon} aria-hidden="true"><ComingSoonIcon name="facebook" /></span>
          <span className={styles.socialIcon} aria-hidden="true"><ComingSoonIcon name="instagram" /></span>
          <span className={styles.socialIcon} aria-hidden="true"><ComingSoonIcon name="youtube" /></span>
        </div>
      </div>

      <p className={styles.signature} aria-hidden="true">Good Food. Great Mood.</p>
    </main>
  )
}

export default ComingSoon
