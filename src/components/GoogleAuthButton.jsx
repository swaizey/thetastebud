import styles from '../pages/Login/Login.module.css'
import { apiBaseUrl } from '../utils/api.js'

export default function GoogleAuthButton({ returnTo }) {
  const query = new URLSearchParams({ return_to: returnTo })

  return (
    <a className={styles.googleButton} href={`${apiBaseUrl}/auth/google?${query}`}>
      <span className={styles.googleIcon} aria-hidden="true">G</span>
      Continue with Google
    </a>
  )
}
