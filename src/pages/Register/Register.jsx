import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import heroFood from '../../assets/partyjollof.png'
import GoogleAuthButton from '../../components/GoogleAuthButton.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getAuthReturnPath } from '../../utils/authRedirect'
import loginStyles from '../Login/Login.module.css'
import styles from './Register.module.css'

function Icon({ name }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.7 5.3A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.1 3M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 7 9.5 7a9.5 9.5 0 0 0 3-.5" /></>,
    userPlus: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.8 3 8 7 10 4-2 7-5.2 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
  }

  return (
    <svg className={loginStyles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export default function Register() {
  const { register, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    const isAdmin = user.roles?.some((role) => role === 'admin' || role === 'super_admin')
    if (isAdmin) logout()
    else navigate(getAuthReturnPath(location.state), { replace: true })
  }, [user, navigate, logout, location.state])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const form = new FormData(event.currentTarget)

    const password = String(form.get('password'))
    const confirmation = String(form.get('confirmation'))
    if (password !== confirmation) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }

    try {
      await register({
        fullName: String(form.get('fullName')).trim(),
        email: String(form.get('email')).trim(),
        phone: String(form.get('phone')).trim(),
        password,
      })
      navigate(getAuthReturnPath(location.state), { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={loginStyles.page}>
      <div className={loginStyles.visual}>
        <img src={heroFood} alt="" className={loginStyles.visualImage} />
        <div className={loginStyles.visualShade} />
        <div className={loginStyles.visualContent}>
          <Link to="/" className={loginStyles.brand} aria-label="The Taste Bud home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
          <p className={styles.tagline}>
            Join Our Food,<br />
            <span>Loving Community!</span>
          </p>
          <p className={loginStyles.caption}>Discover great meals, place orders and enjoy more.</p>
        </div>
      </div>

      <section className={loginStyles.loginPanel} aria-labelledby="register-title">
        <Link to="/" className={loginStyles.mobileBrand} aria-label="The Taste Bud home">
          <img src={logo} alt="The Taste Bud by Joy" />
        </Link>

        <div className={`${loginStyles.card} ${styles.card}`}>
          <Link to="/" className={loginStyles.cardBrand} aria-label="The Taste Bud home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
          <h1 id="register-title">Create Your Account</h1>
          <p className={loginStyles.subtitle}>
            {location.state?.checkout
              ? 'Create an account to continue to checkout.'
              : 'Join The Taste Bud family and enjoy delicious meals delivered with love.'}
          </p>

          <GoogleAuthButton returnTo={getAuthReturnPath(location.state)} />

          <form className={loginStyles.form} onSubmit={submit}>
            <label className={loginStyles.field}>
              <span>Full name</span>
              <div className={loginStyles.inputWrap}>
                <Icon name="user" />
                <input name="fullName" type="text" minLength={2} maxLength={120} required autoComplete="name" placeholder="Full name" />
              </div>
            </label>

            <label className={loginStyles.field}>
              <span>Email address</span>
              <div className={loginStyles.inputWrap}>
                <Icon name="mail" />
                <input name="email" type="email" maxLength={254} required autoComplete="email" placeholder="Email address" />
              </div>
            </label>

            <label className={loginStyles.field}>
              <span>Phone number</span>
              <div className={loginStyles.inputWrap}>
                <Icon name="phone" />
                <input name="phone" type="tel" maxLength={24} required autoComplete="tel" placeholder="Phone number" />
              </div>
            </label>

            <label className={loginStyles.field}>
              <span>Password</span>
              <div className={loginStyles.inputWrap}>
                <Icon name="lock" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  minLength={1}
                  maxLength={128}
                  required
                  autoComplete="new-password"
                  placeholder="Password"
                />
                <button className={loginStyles.passwordToggle} type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
            </label>

            <label className={loginStyles.field}>
              <span>Confirm password</span>
              <div className={loginStyles.inputWrap}>
                <Icon name="lock" />
                <input
                  name="confirmation"
                  type={showConfirmation ? 'text' : 'password'}
                  minLength={1}
                  maxLength={128}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm password"
                />
                <button className={loginStyles.passwordToggle} type="button" aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'} onClick={() => setShowConfirmation((visible) => !visible)}>
                  <Icon name={showConfirmation ? 'eyeOff' : 'eye'} />
                </button>
              </div>
            </label>

            {error && <p className={loginStyles.error} role="alert">{error}</p>}

            <button className={loginStyles.submit} type="submit" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Register'}
              <Icon name="userPlus" />
            </button>
          </form>

          <p className={styles.loginLink}>Already have an account? <Link to="/login" state={location.state}>Login</Link></p>
          <p className={loginStyles.secure}><Icon name="shield" />Secure account access</p>
        </div>
      </section>
    </main>
  )
}
