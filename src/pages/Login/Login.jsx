import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import heroFood from '../../assets/partyjollof.png'
import GoogleAuthButton from '../../components/GoogleAuthButton.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiRequest } from '../../utils/api'
import { getAuthReturnPath } from '../../utils/authRedirect'
import styles from './Login.module.css'

function Icon({ name }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.7 5.3A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.1 3M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 7 9.5 7a9.5 9.5 0 0 0 3-.5" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.8 3 8 7 10 4-2 7-5.2 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const googleErrorMessages = {
  account_exists: 'An account with that Google email already exists. Sign in with your password instead.',
  cancelled: 'Google sign-in was cancelled.',
  failed: 'Google sign-in could not be completed. Please try again.',
  invalid_state: 'Google sign-in expired or could not be verified. Please try again.',
  not_allowed: 'Google sign-in is not available for administrator accounts.',
  unavailable: 'Google sign-in is not configured yet. Please use email and password.',
}

export default function Login() {
  const { login, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [resetCodeSent, setResetCodeSent] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetPhone, setResetPhone] = useState('')
  const searchParams = new URLSearchParams(location.search)
  const authState = location.state ?? {
    from: searchParams.get('return_to'),
    checkout: searchParams.get('return_to') === '/order',
  }
  const returnTo = getAuthReturnPath(authState)
  const googleErrorCode = searchParams.get('google_error')
  const googleError = Object.hasOwn(googleErrorMessages, googleErrorCode)
    ? googleErrorMessages[googleErrorCode]
    : ''

  useEffect(() => {
    if (!user) return
    const isAdmin = user.roles?.some((role) => role === 'admin' || role === 'super_admin')
    if (isAdmin) {
      logout().then(() => setError('Administrator login is disabled on this customer login page.'))
    } else {
      navigate(returnTo, { replace: true })
    }
  }, [user, navigate, logout, returnTo])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    const form = new FormData(event.currentTarget)

    try {
      if (mode === 'reset') {
        if (!resetCodeSent) {
          const email = String(form.get('email')).trim()
          const phone = String(form.get('phone')).trim()
          await apiRequest('/auth/password-reset/request', {
            method: 'POST',
            body: JSON.stringify({ email, phone }),
          })
          setResetEmail(email)
          setResetPhone(phone)
          setResetCodeSent(true)
          setNotice('If a credential-based account matches those details, a confirmation code will be emailed.')
        } else {
          const password = String(form.get('newPassword'))
          const confirmation = String(form.get('newConfirmation'))
          if (password !== confirmation) {
            setError('Passwords do not match.')
            return
          }
          await apiRequest('/auth/password-reset/complete', {
            method: 'POST',
            body: JSON.stringify({
              email: resetEmail,
              phone: resetPhone,
              code: String(form.get('code')).trim(),
              password,
            }),
          })
          setMode('login')
          setResetCodeSent(false)
          setResetEmail('')
          setResetPhone('')
          setNotice('Your password has been reset. Sign in with your new password.')
        }
      } else {
        const authenticatedUser = await login(String(form.get('login')).trim(), String(form.get('password')))
        const isAdmin = authenticatedUser.roles?.some((role) => role === 'admin' || role === 'super_admin')
        if (isAdmin) {
          await logout()
          setError('Administrator login is disabled on this customer login page.')
          return
        }
        navigate(returnTo, { replace: true })
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to complete your request.')
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setNotice('')
    setResetCodeSent(false)
    setResetEmail('')
    setResetPhone('')
  }

  return (
    <main className={styles.page}>
      <div className={styles.visual}>
        <img src={heroFood} alt="" className={styles.visualImage} />
        <div className={styles.visualShade} />
        <div className={styles.visualContent}>
          <Link to="/" className={styles.brand} aria-label="The Taste Bud home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
          <p className={styles.tagline}>
            Good Food,<br />
            <span>Great Mood!</span>
          </p>
          <p className={styles.caption}>Delicious meals, delivered with love.</p>
        </div>
      </div>

      <section className={styles.loginPanel} aria-labelledby="login-title">
        <Link to="/" className={styles.mobileBrand} aria-label="The Taste Bud home">
          <img src={logo} alt="The Taste Bud by Joy" />
        </Link>

        <div className={styles.card}>
          <Link to="/" className={styles.cardBrand} aria-label="The Taste Bud home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>

          {mode === 'login' && (
            <>
              <p className={styles.kicker}>Welcome back</p>
              <h1 id="login-title">Sign In</h1>
              <p className={styles.subtitle}>
                {authState.checkout || returnTo === '/order'
                  ? 'Sign in to continue to checkout.'
                  : 'Sign in to manage your Taste Bud account'}
              </p>
            </>
          )}
          {mode === 'reset' && (
            <>
              <p className={styles.kicker}>Account recovery</p>
              <h1 id="login-title">Reset Password</h1>
              <p className={styles.subtitle}>
                {resetCodeSent
                  ? 'Enter the emailed confirmation code and choose a new password.'
                  : 'Enter the email and phone number registered to your account.'}
              </p>
            </>
          )}

          {mode === 'login' && <GoogleAuthButton returnTo={returnTo} />}
          {mode === 'login' && googleError && <p className={styles.error} role="alert">{googleError}</p>}

          <form className={styles.form} onSubmit={submit}>
            {mode === 'login' ? (
              <label className={styles.field}>
                <span>Username, email, or phone</span>
                <div className={styles.inputWrap}>
                  <Icon name="user" />
                  <input
                    name="login"
                    type="text"
                    required
                    maxLength={254}
                    autoComplete="username"
                    placeholder="Username, email, or phone"
                  />
                </div>
              </label>
            ) : (
              <>
                <label className={styles.field}>
                  <span>Email address</span>
                  <div className={styles.inputWrap}>
                    <Icon name="mail" />
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      readOnly={resetCodeSent}
                      onChange={(event) => setResetEmail(event.target.value)}
                    />
                  </div>
                </label>
                <label className={styles.field}>
                  <span>Phone number</span>
                  <div className={styles.inputWrap}>
                    <Icon name="user" />
                    <input
                      name="phone"
                      type="tel"
                      required
                      maxLength={24}
                      autoComplete="tel"
                      placeholder="+2347012345678 or 07012345678"
                      value={resetPhone}
                      readOnly={resetCodeSent}
                      onChange={(event) => setResetPhone(event.target.value)}
                    />
                  </div>
                </label>
              </>
            )}

            {mode === 'login' && (
              <label className={styles.field}>
                <span>Password</span>
                <div className={styles.inputWrap}>
                  <Icon name="lock" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={1}
                    maxLength={128}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                  <button
                    className={styles.passwordToggle}
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
              </label>
            )}
            {mode === 'reset' && resetCodeSent && (
              <>
                <label className={styles.field}>
                  <span>Confirmation code</span>
                  <div className={styles.inputWrap}>
                    <Icon name="mail" />
                    <input
                      name="code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{8}"
                      maxLength={8}
                      required
                      placeholder="8-digit code"
                    />
                  </div>
                </label>
                <label className={styles.field}>
                  <span>New password</span>
                  <div className={styles.inputWrap}>
                    <Icon name="lock" />
                    <input name="newPassword" type="password" autoComplete="new-password" maxLength={128} required placeholder="New password" />
                  </div>
                </label>
                <label className={styles.field}>
                  <span>Confirm new password</span>
                  <div className={styles.inputWrap}>
                    <Icon name="lock" />
                    <input name="newConfirmation" type="password" autoComplete="new-password" maxLength={128} required placeholder="Confirm new password" />
                  </div>
                </label>
              </>
            )}

            {mode === 'login' && (
              <div className={styles.options}>
                <label className={styles.remember}>
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                  <span>Remember me</span>
                </label>
                <button type="button" className={styles.textButton} onClick={() => switchMode('reset')}>
                  Forgot Password?
                </button>
              </div>
            )}

            {error && <p className={styles.error} role="alert">{error}</p>}
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            <button className={styles.submit} type="submit" disabled={submitting}>
              {submitting
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign In'
                  : resetCodeSent
                    ? 'Reset Password'
                    : 'Send Confirmation Code'}
              <Icon name="arrow" />
            </button>
          </form>

          <div className={styles.switchMode}>
            {mode === 'login' ? (
              <p>
                New here? <Link
                  to="/register"
                  state={{ ...authState, from: returnTo, checkout: authState.checkout || returnTo === '/order' }}
                >
                  Create an account
                </Link>
              </p>
            ) : (
              <p><button type="button" onClick={() => switchMode('login')}>Back to sign in</button></p>
            )}
          </div>

          <p className={styles.secure}><Icon name="shield" />Secure account access</p>
        </div>
      </section>
    </main>
  )
}
