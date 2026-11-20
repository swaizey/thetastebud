import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AdminOrders.module.css'
import customerOne from '../../assets/customer.png'
import customerTwo from '../../assets/customer2.png'
import customerThree from '../../assets/story-ken.jpg'
import customerFour from '../../assets/ceo.png'
import jollof from '../../assets/partyjollof.png'
import grilledChicken from '../../assets/chickenbrest.png'
import friedRice from '../../assets/agoyinspecial.png'
import grilledFish from '../../assets/grilled fish.png'
import pasta from '../../assets/pastaspecial.png'
import plantain from '../../assets/plantainspecia.png'
import noodles from '../../assets/plainpasta.png'
import springRolls from '../../assets/creamyspringrol.png'

const pageSize = 6
const statusNames = ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled']
const statusKeys = {
  Pending: 'pending',
  Preparing: 'preparing',
  'On the Way': 'onTheWay',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
}
const itemOptions = [
  { name: 'Jollof Rice with Chicken', image: jollof },
  { name: 'Grilled Chicken', image: grilledChicken },
  { name: 'Fried Rice with Fish', image: friedRice },
  { name: 'Grilled Fish', image: grilledFish },
  { name: 'Pasta Special', image: pasta },
  { name: 'Fried Plantain', image: plantain },
  { name: 'Noodles', image: noodles },
  { name: 'Spring Rolls', image: springRolls },
]

const initialOrders = [
  { id: 'TB10468', customer: 'Chioma Nwosu', phone: '0806 123 4567', avatar: customerOne, items: [itemOptions[0], itemOptions[1], itemOptions[5]], amount: 8500, createdAt: '2026-11-17T16:32:00+01:00', status: 'On the Way', eta: 'Today, 7pm' },
  { id: 'TB10467', customer: 'Emeka Okafor', phone: '0812 987 6543', avatar: customerTwo, items: [itemOptions[2], itemOptions[3], itemOptions[5]], amount: 6000, createdAt: '2026-11-17T15:50:00+01:00', status: 'Preparing', eta: 'Today, 6pm' },
  { id: 'TB10466', customer: 'Ngozi Uche', phone: '0703 555 0123', avatar: null, items: [itemOptions[1]], amount: 5000, createdAt: '2026-11-17T14:15:00+01:00', status: 'Pending', eta: '—' },
  { id: 'TB10465', customer: 'Adaeze Okoye', phone: '0817 222 3344', avatar: customerThree, items: [itemOptions[4], itemOptions[1]], amount: 7500, createdAt: '2026-11-17T13:20:00+01:00', status: 'Delivered', eta: 'Delivered' },
  { id: 'TB10464', customer: 'David Eze', phone: '0809 111 2233', avatar: customerFour, items: [itemOptions[2], itemOptions[5]], amount: 6500, createdAt: '2026-11-16T08:45:00+01:00', status: 'Cancelled', eta: '—' },
  { id: 'TB10463', customer: 'Chinedu Ani', phone: '0701 999 8888', avatar: customerOne, items: [itemOptions[0], itemOptions[3], itemOptions[7]], amount: 9000, createdAt: '2026-11-16T19:30:00+01:00', status: 'Delivered', eta: 'Delivered' },
]

const extraOrders = Array.from({ length: 24 }, (_, index) => {
  const recordNumber = 10462 - index
  const baseOrder = initialOrders[index % initialOrders.length]
  const createdAt = new Date(Date.UTC(2026, 10, 16 - Math.floor(index / 6), 18 - index % 8, 30))
  const status = statusNames[(index + 2) % statusNames.length]

  return {
    ...baseOrder,
    id: `TB${recordNumber}`,
    createdAt: createdAt.toISOString(),
    status,
    eta: status === 'Delivered' ? 'Delivered' : status === 'On the Way' ? 'Today, 7pm' : status === 'Preparing' ? 'Today, 6pm' : '—',
    items: [...baseOrder.items],
  }
})

const seedOrders = [...initialOrders, ...extraOrders]
const initialStats = {
  total: 248,
  pending: 32,
  preparing: 28,
  onTheWay: 62,
  delivered: 118,
  cancelled: 10,
}

function OrderIcon({ name }) {
  const paths = {
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pending: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chef: <><path d="M6 12a4 4 0 1 1 3-6.8A4 4 0 1 1 15 6a4 4 0 1 1 3 6H6ZM6 12v8h12v-8M9 15h6" /></>,
    preparing: <><path d="M6 12a4 4 0 1 1 3-6.8A4 4 0 1 1 15 6a4 4 0 1 1 3 6H6ZM6 12v8h12v-8M9 15h6" /></>,
    delivery: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    onTheWay: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    delivered: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    close: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
    cancelled: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    filter: <path d="M3 5h18l-7 8v5l-4 2v-7z" />,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    previous: <path d="m15 18-6-6 6-6" />,
    next: <path d="m9 18 6-6-6-6" />,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function OrderAvatar({ order }) {
  if (order.avatar) return <img className={styles.avatar} src={order.avatar} alt="" />

  const initials = order.customer.split(' ').map((part) => part[0]).slice(0, 2).join('')
  return <span className={styles.avatarFallback} aria-label={`${order.customer} avatar`}>{initials}</span>
}

function formatAmount(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

function formatOrderDate(date) {
  const parsedDate = new Date(date)
  return {
    date: parsedDate.toLocaleDateString('en-NG', { dateStyle: 'medium' }),
    time: parsedDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
  }
}

function OrderDate({ date }) {
  const formattedDate = formatOrderDate(date)

  return (
    <time className={styles.orderDate} dateTime={date}>
      <span>{formattedDate.date}</span>
      <small>{formattedDate.time}</small>
    </time>
  )
}

function AdminOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState(seedOrders)
  const [stats, setStats] = useState(initialStats)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateFilter, setDateFilter] = useState('All Time')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [openActionsId, setOpenActionsId] = useState(null)

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    const now = new Date()
    return orders.filter((order) => {
      const matchesSearch = !query ||
        [order.id, order.customer, order.phone, ...order.items.map((item) => item.name)]
          .some((value) => value.toLowerCase().includes(query))
      const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
      const orderDate = new Date(order.createdAt)
      const matchesDate = dateFilter === 'All Time' ||
        (dateFilter === 'Today' && orderDate.toDateString() === now.toDateString()) ||
        (dateFilter === 'Last 7 Days' && now - orderDate <= 7 * 24 * 60 * 60 * 1000)
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [orders, search, statusFilter, dateFilter])

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allVisibleSelected = visibleOrders.length > 0 &&
    visibleOrders.every((order) => selectedIds.has(order.id))
  const pageWindowStart = Math.floor((currentPage - 1) / 5) * 5 + 1
  const pageNumbers = Array.from(
    { length: Math.min(5, pageCount - pageWindowStart + 1) },
    (_, index) => pageWindowStart + index,
  )

  const updateStatus = (orderId, nextStatus) => {
    const order = orders.find((savedOrder) => savedOrder.id === orderId)
    if (!order || order.status === nextStatus) {
      setOpenActionsId(null)
      return
    }

    setStats((current) => ({
      ...current,
      [statusKeys[order.status]]: Math.max(0, current[statusKeys[order.status]] - 1),
      [statusKeys[nextStatus]]: current[statusKeys[nextStatus]] + 1,
    }))
    setOrders((current) => current.map((savedOrder) =>
      savedOrder.id === orderId
        ? {
            ...savedOrder,
            status: nextStatus,
            eta: nextStatus === 'Delivered'
              ? 'Delivered'
              : nextStatus === 'On the Way'
                ? 'Today, 7pm'
                : nextStatus === 'Preparing'
                  ? 'Today, 6pm'
                  : '—',
          }
        : savedOrder,
    ))
    setOpenActionsId(null)
  }

  const refresh = () => {
    setOrders(seedOrders)
    setStats(initialStats)
    setSearch('')
    setStatusFilter('All Status')
    setDateFilter('All Time')
    setPage(1)
    setSelectedIds(new Set())
    setOpenActionsId(null)
  }

  const toggleOrder = (orderId) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(orderId)) next.delete(orderId)
      else next.add(orderId)
      return next
    })
  }

  const toggleVisibleOrders = () => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (allVisibleSelected) visibleOrders.forEach((order) => next.delete(order.id))
      else visibleOrders.forEach((order) => next.add(order.id))
      return next
    })
  }

  const handleFilter = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  const statsCards = [
    { label: 'Total Orders', value: stats.total, icon: 'bag', color: 'peach' },
    { label: 'Pending', value: stats.pending, icon: 'clock', color: 'orange' },
    { label: 'Preparing', value: stats.preparing, icon: 'chef', color: 'blue' },
    { label: 'On the Way', value: stats.onTheWay, icon: 'delivery', color: 'green' },
    { label: 'Delivered', value: stats.delivered, icon: 'check', color: 'green' },
    { label: 'Cancelled', value: stats.cancelled, icon: 'close', color: 'pink' },
  ]

  return (
    <main className={styles.ordersPage}>
      <section className={styles.orderMetrics} aria-label="Order summary">
        {statsCards.map(({ label, value, icon, color }) => (
          <article className={styles.metricCard} key={label}>
            <span className={`${styles.metricIcon} ${styles[color]}`}><OrderIcon name={icon} /></span>
            <strong>{value.toLocaleString('en-NG')}</strong>
            <span>{label}</span>
            <OrderIcon name={icon} />
          </article>
        ))}
      </section>

      <section className={styles.orderManagement} aria-label="Manage orders">
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <OrderIcon name="search" />
            <span className={styles.srOnly}>Search orders</span>
            <input
              type="search"
              placeholder="Search by customer name, phone or order ID..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <label className={styles.selectWrap}>
            <OrderIcon name="calendar" />
            <span className={styles.srOnly}>Filter orders by date</span>
            <select value={dateFilter} onChange={handleFilter(setDateFilter)}>
              <option>All Time</option>
              <option>Today</option>
              <option>Last 7 Days</option>
            </select>
            <OrderIcon name="chevron" />
          </label>
          <label className={styles.selectWrap}>
            <OrderIcon name="filter" />
            <span className={styles.srOnly}>Filter orders by status</span>
            <select value={statusFilter} onChange={handleFilter(setStatusFilter)}>
              <option>All Status</option>
              {statusNames.map((status) => <option key={status}>{status}</option>)}
            </select>
            <OrderIcon name="chevron" />
          </label>
          <button className={styles.refreshButton} type="button" onClick={refresh}>
            <OrderIcon name="refresh" /> Refresh
          </button>
        </div>

        <div className={styles.orderTableWrap}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all visible orders"
                    checked={allVisibleSelected}
                    onChange={toggleVisibleOrders}
                  />
                </th>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Amount</th>
                <th scope="col">Order Date</th>
                <th scope="col">Status</th>
                <th scope="col">ETA</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr className={selectedIds.has(order.id) ? styles.selectedRow : ''} key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select order ${order.id}`}
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleOrder(order.id)}
                    />
                  </td>
                  <td className={styles.orderId}>
                    <Link to={`/admin/orders/${order.id}`} state={{ order }}>#{order.id}</Link>
                  </td>
                  <td>
                    <div className={styles.customerCell}>
                      <OrderAvatar order={order} />
                      <span><strong>{order.customer}</strong><small>{order.phone}</small></span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.itemImages} aria-label={order.items.map((item) => item.name).join(', ')}>
                      {order.items.slice(0, 2).map((item) => <img src={item.image} alt="" key={item.name} />)}
                      {order.items.length > 2 && <span>+{order.items.length - 2}</span>}
                    </div>
                  </td>
                  <td className={styles.amount}>{formatAmount(order.amount)}</td>
                  <td><OrderDate date={order.createdAt} /></td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${order.status.replaceAll(' ', '')}`]}`}>
                      <OrderIcon name={statusKeys[order.status]} />
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.eta}>{order.eta}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" aria-label={`View order ${order.id}`} onClick={() => navigate(`/admin/orders/${order.id}`, { state: { order } })}>
                        <OrderIcon name="eye" />
                      </button>
                      <div className={styles.actionMenuWrap}>
                        <button
                          type="button"
                          aria-label={`More actions for order ${order.id}`}
                          aria-expanded={openActionsId === order.id}
                          onClick={() => setOpenActionsId(openActionsId === order.id ? null : order.id)}
                        >
                          <OrderIcon name="more" />
                        </button>
                        {openActionsId === order.id && (
                          <div className={styles.actionMenu}>
                            <span>Update status</span>
                            {statusNames.map((status) => (
                              <button
                                disabled={status === order.status}
                                key={status}
                                type="button"
                                onClick={() => updateStatus(order.id, status)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr><td className={styles.emptyResult} colSpan="9">No orders match these filters.</td></tr>
              )}
            </tbody>
          </table>

          <footer className={styles.tableFooter}>
            <span>
              {filteredOrders.length === 0
                ? 'Showing 0 orders'
                : `Showing ${(currentPage - 1) * pageSize + 1} – ${Math.min(currentPage * pageSize, filteredOrders.length)} of ${search || statusFilter !== 'All Status' || dateFilter !== 'All Time' ? `${filteredOrders.length} matching` : stats.total} orders`}
            </span>
            <nav className={styles.pagination} aria-label="Order list pages">
              <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                <OrderIcon name="previous" />
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
              <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
                <OrderIcon name="next" />
              </button>
            </nav>
          </footer>
        </div>
      </section>

    </main>
  )
}

export default AdminOrders
