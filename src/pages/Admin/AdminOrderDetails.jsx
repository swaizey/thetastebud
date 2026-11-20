import { useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './AdminOrderDetails.module.css'

const deliveryAddress = '123 Market Road, Onitsha, Anambra State, Nigeria'
const deliveryFee = 1000
const statusNames = ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled']
const progressStatuses = statusNames.slice(0, 4)

function DetailsIcon({ name }) {
  const paths = {
    back: <path d="M19 12H5m7 7-7-7 7-7" />,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    phone: <path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 3a14 14 0 0 1-7-7l3-2-3-5Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    utensils: <><path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3v18M17 3c-3 3-3 8 0 10h3V3" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    delivery: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    calendarClock: <><rect x="3" y="5" width="13" height="16" rx="2" /><path d="M8 3v4M3 10h13M19 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 1.5V15l1 1" /></>,
    print: <><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6zM18 12h.01" /></>,
    cancel: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
    reschedule: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5" /></>,
  }

  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function OrderCustomerAvatar({ order }) {
  if (order.avatar) return <img className={styles.customerAvatar} src={order.avatar} alt="" />

  const initials = order.customer.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  return <span className={styles.avatarFallback} aria-label={`${order.customer} avatar`}>{initials}</span>
}

function formatAmount(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

function formatOrderDate(date) {
  const parsedDate = new Date(date)
  return `${parsedDate.toLocaleDateString('en-NG', { dateStyle: 'medium' })} • ${parsedDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}`
}

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function AdminOrderDetails() {
  const { state } = useLocation()
  const { orderId } = useParams()
  const etaInputRef = useRef(null)
  const deliveryDateInputRef = useRef(null)
  const order = state?.order
  const [status, setStatus] = useState(order?.status || 'Pending')
  const [draftStatus, setDraftStatus] = useState(order?.status || 'Pending')
  const [eta, setEta] = useState(order?.eta && order.eta !== '—' ? order.eta : 'Today, 7pm')
  const [draftEta, setDraftEta] = useState(order?.eta && order.eta !== '—' ? order.eta : 'Today, 7pm')
  const [deliveryDate, setDeliveryDate] = useState(getLocalDateValue)
  const [notice, setNotice] = useState('')

  if (!order) {
    return (
      <main className={styles.missingOrder}>
        <h2>Order details are unavailable</h2>
        <p>Open an order from the Orders page to view its information.</p>
        <Link to="/admin/orders">Back to Orders</Link>
      </main>
    )
  }

  const orderItems = order.items || []
  const fee = order.amount > 0 ? Math.min(deliveryFee, order.amount) : 0
  const subtotal = order.amount - fee
  const baseItemAmount = orderItems.length ? Math.floor(subtotal / orderItems.length) : 0
  const items = orderItems.map((item, index) => ({
    ...item,
    quantity: 1,
    amount: index === orderItems.length - 1
      ? subtotal - baseItemAmount * (orderItems.length - 1)
      : baseItemAmount,
  }))
  const currentStep = progressStatuses.indexOf(status)

  const updateOrder = (event) => {
    event.preventDefault()
    setStatus(draftStatus)
    setEta(draftEta.trim() || '—')
    setNotice('Order information updated.')
  }

  const openDeliveryDatePicker = () => {
    const dateInput = deliveryDateInputRef.current
    if (!dateInput) return

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker()
    } else {
      dateInput.click()
    }
  }

  const updateDeliveryDate = (event) => {
    const selectedDate = event.target.value
    setDeliveryDate(selectedDate)
    if (!selectedDate) return

    const time = draftEta.match(/,\s*(.+)$/)?.[1]
    const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-NG', { dateStyle: 'medium' })
    setDraftEta(`${formattedDate}${time ? `, ${time}` : ''}`)
  }

  const cancelOrder = () => {
    setStatus('Cancelled')
    setDraftStatus('Cancelled')
    setNotice('Order cancelled.')
  }

  return (
    <main className={styles.detailsPage}>
      <div className={styles.topGrid}>
        <section className={styles.orderInfoCard} aria-label="Order and customer information">
          <div className={styles.orderSummary}>
            <span className={styles.bagIcon}><DetailsIcon name="bag" /></span>
            <span className={styles.label}>Order ID</span>
            <strong className={styles.orderId}>#{order.id || orderId}</strong>
            <span className={`${styles.statusBadge} ${styles[`status${status.replaceAll(' ', '')}`]}`}>
              <span />{status}
            </span>
            <div className={styles.orderPlaced}>
              <DetailsIcon name="calendar" />
              <span><small>Order Date</small><strong>{formatOrderDate(order.createdAt)}</strong></span>
            </div>
          </div>
          <div className={styles.customerDetails}>
            <div className={styles.customerIdentity}>
              <OrderCustomerAvatar order={order} />
              <span><small>Customer</small><strong>{order.customer}</strong></span>
            </div>
            <p><DetailsIcon name="phone" />{order.phone}</p>
            <p><DetailsIcon name="mail" />{order.email || `${order.customer.toLowerCase().replaceAll(' ', '.')}@gmail.com`}</p>
            <div className={styles.deliveryAddress}>
              <DetailsIcon name="pin" />
              <span><small>Delivery Address</small>{deliveryAddress}</span>
            </div>
          </div>
        </section>

        <section className={styles.deliveryEstimate} aria-labelledby="delivery-estimate-title">
          <h2 id="delivery-estimate-title"><DetailsIcon name="clock" />Estimated Delivery</h2>
          <strong>{eta}</strong>
          <span>(in ~ 1h 25m)</span>
          <button type="button" onClick={() => etaInputRef.current?.focus()}>
            <DetailsIcon name="calendar" />Update Date
          </button>
        </section>
      </div>

      <div className={styles.contentGrid}>
        <section className={`${styles.panel} ${styles.orderedItemsPanel}`} aria-labelledby="ordered-items-title">
          <h2 className={styles.panelTitle} id="ordered-items-title"><DetailsIcon name="utensils" />Ordered Items</h2>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <article className={styles.orderItem} key={item.name}>
                <img src={item.image} alt="" />
                <span className={styles.itemName}><strong>{item.name}</strong><small>Special instructions available</small></span>
                <strong className={styles.unitAmount}>{formatAmount(item.amount)}</strong>
                <span className={styles.quantity}>× {item.quantity}</span>
                <strong className={styles.itemTotal}>{formatAmount(item.amount * item.quantity)}</strong>
              </article>
            ))}
            {items.length === 0 && <p className={styles.noItems}>No items were recorded for this order.</p>}
          </div>
          <dl className={styles.amountSummary}>
            <div><dt>Subtotal</dt><dd>{formatAmount(subtotal)}</dd></div>
            <div><dt>Delivery Fee</dt><dd>{formatAmount(fee)}</dd></div>
            <div className={styles.totalAmount}><dt>Total Amount</dt><dd>{formatAmount(order.amount)}</dd></div>
          </dl>
        </section>

        <section className={`${styles.panel} ${styles.statusPanel}`} aria-labelledby="update-status-title">
          <h2 className={styles.panelTitle} id="update-status-title"><DetailsIcon name="refresh" />Update Order Status</h2>
          <ol className={styles.statusTimeline}>
            {statusNames.map((name, index) => {
              const isCancelled = status === 'Cancelled' && name === 'Cancelled'
              const isComplete = status !== 'Cancelled' && index < currentStep
              const isCurrent = name === status
              return (
                <li className={`${isComplete ? styles.stepComplete : ''} ${isCurrent || isCancelled ? styles.stepCurrent : ''} ${isCancelled ? styles.stepCancelled : ''}`} key={name}>
                  <span className={styles.stepIcon}>
                    <DetailsIcon name={name === 'On the Way' ? 'delivery' : name === 'Cancelled' ? 'close' : 'check'} />
                  </span>
                  <span>{name}</span>
                </li>
              )
            })}
          </ol>
          <form className={styles.statusForm} onSubmit={updateOrder}>
            <label>
              Set Status
              <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
                {statusNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label>
              Expected Delivery Date &amp; Time
              <span className={styles.etaInputWrap}>
                <button
                  type="button"
                  className={styles.datePickerButton}
                  aria-label="Choose expected delivery date"
                  onClick={openDeliveryDatePicker}
                >
                  <DetailsIcon name="calendar" />
                </button>
                <input
                  ref={deliveryDateInputRef}
                  className={styles.datePicker}
                  type="date"
                  value={deliveryDate}
                  aria-hidden="true"
                  tabIndex={-1}
                  onChange={updateDeliveryDate}
                />
                <input ref={etaInputRef} value={draftEta} onChange={(event) => setDraftEta(event.target.value)} />
                <DetailsIcon name="clock" />
              </span>
            </label>
            <button className={styles.updateButton} type="submit"><DetailsIcon name="check" />Update Order Status</button>
            {notice && <p className={styles.notice} role="status">{notice}</p>}
          </form>
        </section>
      </div>

      <div className={styles.bottomGrid}>
        <section className={`${styles.panel} ${styles.notesPanel}`} aria-labelledby="order-notes-title">
          <h2 className={styles.panelTitle} id="order-notes-title"><DetailsIcon name="bag" />Order Notes / Special Instructions</h2>
          <p>Please make sure the order is prepared as requested. Thank you!</p>
        </section>
        <section className={`${styles.panel} ${styles.actionsPanel}`} aria-labelledby="order-actions-title">
          <h2 className={styles.panelTitle} id="order-actions-title"><DetailsIcon name="refresh" />Order Actions</h2>
          <div className={styles.actions}>
            <button type="button" onClick={() => window.print()}><DetailsIcon name="print" />Print Receipt</button>
            <button type="button" onClick={cancelOrder} disabled={status === 'Cancelled'}><DetailsIcon name="cancel" />Cancel Order</button>
            <button type="button" onClick={() => etaInputRef.current?.focus()}><DetailsIcon name="reschedule" />Reschedule</button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminOrderDetails
