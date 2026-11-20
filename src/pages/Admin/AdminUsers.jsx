import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AdminUsers.module.css'
import customerOne from '../../assets/customer.png'
import customerTwo from '../../assets/customer2.png'
import customerThree from '../../assets/story-ken.jpg'
import customerFour from '../../assets/ceo.png'

const pageSize = 6
const avatarOptions = [customerOne, customerTwo, customerThree, customerFour]

const initialUsers = [
  { id: 'TB10456', name: 'Chioma Nwosu', phone: '0806 123 4567', email: 'chioma@gmail.com', joinDate: 'Oct 12, 2025', totalOrders: 12, status: 'Active', isPremium: true, avatar: customerOne },
  { id: 'TB10457', name: 'Emeka Okafor', phone: '0812 987 6543', email: 'emeka@gmail.com', joinDate: 'Oct 10, 2025', totalOrders: 8, status: 'Active', isPremium: false, avatar: customerTwo },
  { id: 'TB10458', name: 'Ngozi Uche', phone: '0703 555 0123', email: 'ngozi@gmail.com', joinDate: 'Oct 08, 2025', totalOrders: 5, status: 'Pending', isPremium: false, avatar: null },
  { id: 'TB10459', name: 'Adaeze Okoye', phone: '0817 222 3344', email: 'adaeze@gmail.com', joinDate: 'Oct 05, 2025', totalOrders: 7, status: 'Active', isPremium: true, avatar: customerThree },
  { id: 'TB10460', name: 'David Eze', phone: '0809 111 2233', email: 'david@gmail.com', joinDate: 'Oct 03, 2025', totalOrders: 3, status: 'Blocked', isPremium: false, avatar: customerFour },
  { id: 'TB10461', name: 'Chinedu Ani', phone: '0701 999 8888', email: 'chinedu@gmail.com', joinDate: 'Sep 28, 2025', totalOrders: 10, status: 'Active', isPremium: false, avatar: customerOne },
]

const additionalNames = [
  'Kelechi Okoye', 'Amina Yusuf', 'Tunde Bello', 'Fatima Musa',
  'Adaeze Ojo', 'Samuel Adebayo', 'Nneka Eze', 'Ibrahim Sule',
  'Esther James', 'Daniel Oko', 'Ifeoma Nnadi', 'Yusuf Mohammed',
  'Amaka Chukwu', 'Oluwaseun Ade', 'Chika Obi', 'Maryam Lawal',
  'Uche Okafor', 'Bisi Oladipo', 'Abubakar Garba', 'Ruth Eze',
  'Kenneth Nwankwo', 'Halima Abdullahi', 'Precious Nnamdi', 'Victor Eze',
]

const extraUsers = additionalNames.map((name, index) => {
  const recordNumber = 10462 + index
  const phoneDigits = String(61234567 + index * 10003).padStart(8, '0')
  const status = index % 9 === 2 ? 'Pending' : index % 7 === 4 ? 'Blocked' : 'Active'
  const month = ['Aug', 'Sep', 'Oct', 'Nov'][index % 4]
  const day = String(25 - (index % 24)).padStart(2, '0')

  return {
    id: `TB${recordNumber}`,
    name,
    phone: `080${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4)}`,
    email: `${name.toLowerCase().replaceAll(' ', '.')}@gmail.com`,
    joinDate: `${month} ${day}, 2025`,
    totalOrders: (index * 3) % 18,
    status,
    isPremium: index % 4 === 0,
    avatar: avatarOptions[index % avatarOptions.length],
  }
})

const emptyDraft = {
  name: '',
  phone: '',
  email: '',
  status: 'Pending',
  isPremium: false,
}

function UserIcon({ name }) {
  const paths = {
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.5V20" /></>,
    active: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 10-4.5M16 18l2 2 4-5" /></>,
    blocked: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 10-4.5M17 16l5 5m0-5-5 5" /></>,
    crown: <path d="m3 7 5 4 4-7 4 7 5-4-2 13H5L3 7Z" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    filter: <path d="M3 5h18l-7 8v5l-4 2v-7z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    previous: <path d="m15 18-6-6 6-6" />,
    next: <path d="m9 18 6-6-6-6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function UserAvatar({ user }) {
  if (user.avatar) {
    return <img className={styles.avatar} src={user.avatar} alt="" />
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return <span className={styles.avatarFallback} role="img" aria-label={`${user.name} avatar`}>{initials}</span>
}

function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([...initialUsers, ...extraUsers])
  const [stats, setStats] = useState({
    total: 1248,
    active: 1120,
    blocked: 128,
    premium: 265,
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Users')
  const [dateFilter, setDateFilter] = useState('All Time')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [modal, setModal] = useState({ type: null })
  const [draft, setDraft] = useState(emptyDraft)
  const [formError, setFormError] = useState('')

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch = !query ||
        [user.name, user.email, user.phone, user.id].some((value) =>
          value.toLowerCase().includes(query),
        )
      const matchesStatus = statusFilter === 'All Users' || user.status === statusFilter
      const matchesDate = dateFilter === 'All Time' || user.joinDate.endsWith(dateFilter)
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [users, search, statusFilter, dateFilter])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const hasFilters = Boolean(search.trim()) || statusFilter !== 'All Users' || dateFilter !== 'All Time'
  const allVisibleSelected = visibleUsers.length > 0 &&
    visibleUsers.every((user) => selectedIds.has(user.id))
  const pageWindowStart = Math.floor((currentPage - 1) / 5) * 5 + 1
  const pageNumbers = Array.from(
    { length: Math.min(5, pageCount - pageWindowStart + 1) },
    (_, index) => pageWindowStart + index,
  )

  const openAdd = () => {
    setFormError('')
    setDraft(emptyDraft)
    setModal({ type: 'add' })
  }

  const openEdit = (user) => {
    setFormError('')
    setDraft({
      name: user.name,
      phone: user.phone,
      email: user.email,
      status: user.status,
      isPremium: user.isPremium,
    })
    setModal({ type: 'edit', user })
  }

  const closeModal = () => {
    setFormError('')
    setModal({ type: null })
  }

  const updateStats = (user, direction) => {
    setStats((current) => ({
      total: current.total + direction,
      active: current.active + (user.status === 'Active' ? direction : 0),
      blocked: current.blocked + (user.status === 'Blocked' ? direction : 0),
      premium: current.premium + (user.isPremium ? direction : 0),
    }))
  }

  const saveUser = (event) => {
    event.preventDefault()
    const cleanDraft = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
    }
    if (cleanDraft.name.length < 2 || cleanDraft.phone.length < 7 ||
      !cleanDraft.email || cleanDraft.email.length > 254) {
      setFormError('Enter a name, phone number, and valid email address.')
      return
    }

    const duplicateEmail = users.some((user) =>
      user.email.toLowerCase() === cleanDraft.email.toLowerCase() && user.id !== modal.user?.id,
    )
    if (duplicateEmail) {
      setFormError('A user with this email address already exists.')
      return
    }

    if (modal.type === 'edit') {
      const existing = modal.user
      const updatedUser = { ...existing, ...cleanDraft }
      setUsers((current) => current.map((user) => user.id === existing.id ? updatedUser : user))
      setStats((current) => ({
        ...current,
        active: current.active + Number(cleanDraft.status === 'Active') - Number(existing.status === 'Active'),
        blocked: current.blocked + Number(cleanDraft.status === 'Blocked') - Number(existing.status === 'Blocked'),
        premium: current.premium + Number(cleanDraft.isPremium) - Number(existing.isPremium),
      }))
    } else {
      const nextNumber = Math.max(...users.map((user) => Number(user.id.slice(2)))) + 1
      const newUser = {
        ...cleanDraft,
        id: `TB${nextNumber}`,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        totalOrders: 0,
        avatar: null,
      }
      setUsers((current) => [newUser, ...current])
      updateStats(newUser, 1)
      setPage(1)
    }

    closeModal()
  }

  const deleteUser = () => {
    updateStats(modal.user, -1)
    setUsers((current) => current.filter((user) => user.id !== modal.user.id))
    setSelectedIds((current) => {
      const next = new Set(current)
      next.delete(modal.user.id)
      return next
    })
    closeModal()
  }

  const toggleUser = (userId) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const toggleVisibleUsers = () => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (allVisibleSelected) visibleUsers.forEach((user) => next.delete(user.id))
      else visibleUsers.forEach((user) => next.add(user.id))
      return next
    })
  }

  const setFilter = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const statsCards = [
    { label: 'Total Users', value: stats.total.toLocaleString('en-NG'), icon: 'users', color: 'peach' },
    { label: 'Active Users', value: stats.active.toLocaleString('en-NG'), icon: 'active', color: 'green' },
    { label: 'Blocked Users', value: stats.blocked.toLocaleString('en-NG'), icon: 'blocked', color: 'yellow' },
    { label: 'Premium Users', value: stats.premium.toLocaleString('en-NG'), icon: 'crown', color: 'purple' },
  ]

  return (
    <main className={styles.usersPage}>
      <section className={styles.userMetrics} aria-label="User summary">
        {statsCards.map(({ label, value, icon, color }) => (
          <article className={styles.userMetric} key={label}>
            <span className={`${styles.metricIcon} ${styles[color]}`}><UserIcon name={icon} /></span>
            <strong>{value}</strong>
            <span>{label}</span>
            <UserIcon name={icon} />
          </article>
        ))}
      </section>

      <section className={styles.userManagement} aria-label="Manage users">
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <UserIcon name="search" />
            <span className={styles.srOnly}>Search users</span>
            <input
              type="search"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </label>

          <label className={styles.selectWrap}>
            <UserIcon name="filter" />
            <span className={styles.srOnly}>Filter users by status</span>
            <select value={statusFilter} onChange={setFilter(setStatusFilter)}>
              <option>All Users</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Blocked</option>
            </select>
            <UserIcon name="chevron" />
          </label>

          <label className={styles.selectWrap}>
            <UserIcon name="calendar" />
            <span className={styles.srOnly}>Filter users by join year</span>
            <select value={dateFilter} onChange={setFilter(setDateFilter)}>
              <option>All Time</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <UserIcon name="chevron" />
          </label>

          <button className={styles.addButton} type="button" onClick={openAdd}>
            <UserIcon name="plus" /> Add User
          </button>
        </div>

        <div className={styles.userTableWrap}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all visible users"
                    checked={allVisibleSelected}
                    onChange={toggleVisibleUsers}
                  />
                </th>
                <th scope="col">User</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Join Date</th>
                <th scope="col">Total Orders</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id} className={selectedIds.has(user.id) ? styles.selectedRow : ''}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${user.name}`}
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <Link
                        className={styles.avatarLink}
                        to={`/admin/users/${user.id}`}
                        state={{ user }}
                        aria-label={`View ${user.name}'s profile`}
                      >
                        <UserAvatar user={user} />
                      </Link>
                      <span><strong>{user.name}</strong><small>#{user.id}</small></span>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.joinDate}</td>
                  <td className={styles.orderCount}>{user.totalOrders}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${user.status}`]}`}>
                      <span aria-hidden="true" />
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" aria-label={`View ${user.name}`} onClick={() => navigate(`/admin/users/${user.id}`, { state: { user } })}>
                        <UserIcon name="eye" />
                      </button>
                      <button type="button" aria-label={`Edit ${user.name}`} onClick={() => openEdit(user)}>
                        <UserIcon name="edit" />
                      </button>
                      <button className={styles.deleteAction} type="button" aria-label={`Delete ${user.name}`} onClick={() => setModal({ type: 'delete', user })}>
                        <UserIcon name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td className={styles.emptyResult} colSpan="8">No users match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>

          <footer className={styles.tableFooter}>
            <span>
              {filteredUsers.length === 0
                ? 'Showing 0 users'
                : `Showing ${(currentPage - 1) * pageSize + 1} – ${Math.min(currentPage * pageSize, filteredUsers.length)} of ${hasFilters ? `${filteredUsers.length} matching` : stats.total.toLocaleString('en-NG')} users`}
            </span>
            <nav className={styles.pagination} aria-label="User list pages">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <UserIcon name="previous" />
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  className={pageNumber === currentPage ? styles.currentPage : ''}
                  type="button"
                  aria-current={pageNumber === currentPage ? 'page' : undefined}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                <UserIcon name="next" />
              </button>
            </nav>
          </footer>
        </div>
      </section>

      {modal.type !== null && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal()
        }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
            <div className={styles.modalHeading}>
              <h2 id="user-modal-title">
                {modal.type === 'add' ? 'Add User' : modal.type === 'edit' ? 'Edit User' : modal.type === 'view' ? 'User Details' : 'Delete User'}
              </h2>
              <button type="button" aria-label="Close dialog" onClick={closeModal}><UserIcon name="close" /></button>
            </div>

            {modal.type === 'view' && (
              <div className={styles.userDetails}>
                <UserAvatar user={modal.user} />
                <h3>{modal.user.name}</h3>
                <p>Customer ID: #{modal.user.id}</p>
                <dl>
                  <div><dt>Email</dt><dd>{modal.user.email}</dd></div>
                  <div><dt>Phone</dt><dd>{modal.user.phone}</dd></div>
                  <div><dt>Joined</dt><dd>{modal.user.joinDate}</dd></div>
                  <div><dt>Total orders</dt><dd>{modal.user.totalOrders}</dd></div>
                  <div><dt>Status</dt><dd>{modal.user.status}</dd></div>
                  <div><dt>Plan</dt><dd>{modal.user.isPremium ? 'Premium' : 'Standard'}</dd></div>
                </dl>
                <button className={styles.modalPrimary} type="button" onClick={closeModal}>Done</button>
              </div>
            )}

            {(modal.type === 'add' || modal.type === 'edit') && (
              <form className={styles.userForm} onSubmit={saveUser} onChange={() => setFormError('')}>
                <label>Name<input autoFocus minLength={2} maxLength={100} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
                <label>Phone<input required type="tel" inputMode="tel" minLength={7} maxLength={24} value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
                <label>Email<input required type="email" maxLength={254} autoComplete="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
                <label>Status
                  <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                    <option>Active</option><option>Pending</option><option>Blocked</option>
                  </select>
                </label>
                <label className={styles.premiumToggle}>
                  <input type="checkbox" checked={draft.isPremium} onChange={(event) => setDraft({ ...draft, isPremium: event.target.checked })} />
                  Premium customer
                </label>
                {formError && <p className={styles.formError} role="alert">{formError}</p>}
                <div className={styles.modalActions}>
                  <button className={styles.cancelButton} type="button" onClick={closeModal}>Cancel</button>
                  <button className={styles.modalPrimary} type="submit">{modal.type === 'add' ? 'Add User' : 'Save Changes'}</button>
                </div>
              </form>
            )}

            {modal.type === 'delete' && (
              <div className={styles.deleteConfirmation}>
                <p>Are you sure you want to delete <strong>{modal.user.name}</strong>? This action cannot be undone.</p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelButton} type="button" onClick={closeModal}>Cancel</button>
                  <button className={styles.deleteConfirmButton} type="button" onClick={deleteUser}>Delete User</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default AdminUsers
