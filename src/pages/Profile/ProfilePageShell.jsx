import { useLocation } from 'react-router-dom'
import heroFood from '../../assets/partyjollof.png'
import AccountSidebar from './AccountSidebar.jsx'
import styles from './Profile.module.css'
import { initialProfile } from './profileData.js'

function ProfilePageShell({ active, title, description, children }) {
  const { state } = useLocation()
  const profile = state?.profile || initialProfile
  const [firstWord, ...titleWords] = title.split(' ')

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label={title}>
        <img className={styles.heroImage} src={heroFood} alt="" />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <h1>My <span>{firstWord} {titleWords.join(' ')}</span></h1>
          <p>{description}</p>
        </div>
      </section>
      <div className={styles.dashboard}>
        <AccountSidebar profile={profile} active={active} />
        <div className={styles.mainColumn}>{children}</div>
      </div>
    </main>
  )
}

export default ProfilePageShell
