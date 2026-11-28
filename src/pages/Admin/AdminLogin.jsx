import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import heroFood from '../../assets/partyjollof.png'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiRequest } from '../../utils/api.js'
import styles from '../Login/Login.module.css'

function isAdmin(user) {
  return user?.roles?.some((role) => role === 'admin' || role === 'super_admin') ?? false
}

function AdminLogin() {
  const { logout, refreshUser, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const requestedPath = location.state?.from
  const returnTo = typeof requestedPath === 'string' && /^\/admin(?:\/|$)/.test(requestedPath)
    ? requestedPath
    : '/admin'
  const [mode, setMode] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAdmin(user)) navigate(returnTo, { replace: true })
  }, [navigate, returnTo, user])

  const requestCode = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      await apiRequest('/auth/admin-login/request', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      })
      setMode('code')
      setNotice('If this email belongs to an authorized admin, a login code has been sent.')
    } catch (requestError) {
      setError(requestError.message || 'Unable to request a login code.')
    } finally {
      setSubmitting(false)
    }
  }

  const verifyCode = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      await apiRequest('/auth/admin-login/complete', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      })
      const signedInUser = await refreshUser()
      if (!isAdmin(signedInUser)) {
        await logout()
        setError('Administrator access could not be verified.')
        return
      }
      navigate(returnTo, { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Unable to verify the login code.')
    } finally {
      setSubmitting(false)
    }
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
          <p className={styles.tagline}>Administrator<br /><span>Portal</span></p>
          <p className={styles.caption}>Secure access for your Taste Bud team.</p>
        </div>
      </div>

      <section className={styles.loginPanel} aria-labelledby="admin-login-title">
        <div className={styles.card}>
          <Link to="/" className={styles.cardBrand} aria-label="The Taste Bud home">
            <img src={logo} alt="The Taste Bud by Joy" />
          </Link>
          <p className={styles.kicker}>Administrator access</p>
          <h1 id="admin-login-title">{mode === 'email' ? 'Admin Sign In' : 'Enter Login Code'}</h1>
          <p className={styles.subtitle}>
            {mode === 'email'
              ? 'Enter your authorized admin email to receive a sign-in code.'
              : `Enter the six-digit code sent to ${email}.`}
          </p>

          {mode === 'email' ? (
            <form className={styles.form} onSubmit={requestCode}>
              <label className={styles.field}>
                <span>Email address</span>
                <div className={styles.inputWrap}>
                  <span aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={styles.submit} type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Login Code'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={verifyCode}>
              <label className={styles.field}>
                <span>Six-digit code</span>
                <div className={styles.inputWrap}>
                  <span aria-hidden="true" />
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </div>
              </label>
              {notice && <p className={styles.notice} role="status">{notice}</p>}
              {error && <p className={styles.error} role="alert">{error}</p>}
              <button className={styles.submit} type="submit" disabled={submitting}>
                {submitting ? 'Verifying…' : 'Sign In'}
              </button>
              <div className={styles.switchMode}>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => { setMode('email'); setCode(''); setError(''); setNotice('') }}
                >
                  Use another email or request a new code
                </button>
              </div>
            </form>
          )}

          <p className={styles.switchMode}><Link to="/login">Customer sign in</Link></p>
        </div>
      </section>
    </main>
  )
}

export default AdminLogin
