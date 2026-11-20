import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import { readCart, saveCart } from '../../utils/orderStorage'
import styles from './OrderDetails.module.css'

const money = (amount) => `₦${amount.toLocaleString('en-NG')}`
const steps = ['Order Placed', 'Preparing', 'On The Way', 'Delivered']
const statusStep = { pending: 0, approved: 1, delivered: 3 }

function OrderIcon({ name }) {
  const paths = {
    back: <path d="m15 18-6-6 6-6" />,
    support: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 12H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7H4Zm16 0h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7h1ZM18 19a6 6 0 0 1-6 3h-1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    summary: <><path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
    reorder: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></>,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function OrderDetails() {
  const { orderId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { orders } = useOrder()
  const order = orders.find((savedOrder) => savedOrder.id === orderId) ||
    (state?.order?.id === orderId ? state.order : null)

  if (!order) {
    return (
      <main className={styles.page}>
        <section className={styles.notFound}>
          <h1>Order not found</h1>
          <p>We couldn’t find this order. It may have been removed from your order history.</p>
          <Link to="/order">Back to Orders</Link>
        </section>
      </main>
    )
  }

  const firstItem = order.items[0]
  const currentStep = statusStep[order.status] ?? 0
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)
  const placedAt = new Date(order.createdAt)
  const dateLabel = placedAt.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const reorder = () => {
    const itemsById = new Map(readCart().map((item) => [item.id, item]))
    order.items.forEach((item) => {
      const currentItem = itemsById.get(item.id)
      itemsById.set(item.id, {
        ...item,
        quantity: item.quantity + (currentItem?.quantity ?? 0),
      })
    })
    saveCart(Array.from(itemsById.values()))
    navigate('/order')
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <Link className={styles.headerButton} to="/order" aria-label="Back to orders">
            <OrderIcon name="back" />
          </Link>
          <h1>Order Details</h1>
          <Link className={styles.headerButton} to="/contact" aria-label="Contact support">
            <OrderIcon name="support" />
          </Link>
        </header>

        <section className={styles.orderHero} aria-labelledby="order-name">
          <img src={firstItem.image} alt={firstItem.name} />
          <div className={styles.orderIntro}>
            <h2 id="order-name">
              {firstItem.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
            </h2>
            <p>Order #{order.id}</p>
            <p className={styles.orderDate}>
              <OrderIcon name="calendar" />
              <time dateTime={order.createdAt}>{dateLabel}</time>
            </p>
            <span className={`${styles.status} ${styles[`status${order.status[0].toUpperCase()}${order.status.slice(1)}`]}`}>
              <OrderIcon name="check" />
              {order.status[0].toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </section>

        <section className={styles.progress} aria-label={`Order progress: ${order.status}`}>
          <ol>
            {steps.map((step, index) => (
              <li className={index <= currentStep ? styles.stepDone : ''} key={step}>
                <span className={styles.stepMarker}>
                  <OrderIcon name="check" />
                </span>
                <span className={styles.stepLabel}>{step}</span>
                {index === currentStep && (
                  <span className={styles.stepCurrent}>Current status</span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.panel} aria-labelledby="items-title">
          <div className={styles.panelHeading}>
            <h2 id="items-title"><OrderIcon name="bag" /> Items in Your Order</h2>
            <span>{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
          </div>
          <ul className={styles.items}>
            {order.items.map((item) => (
              <li className={styles.item} key={item.id}>
                <img src={item.image} alt="" />
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)} each</p>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
                <span className={styles.quantity}>Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${styles.panel} ${styles.summary}`} aria-labelledby="summary-title">
          <h2 id="summary-title"><OrderIcon name="summary" /> Order Summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
            <div><dt>Delivery Fee</dt><dd>{money(order.deliveryFee)}</dd></div>
          </dl>
          <div className={styles.total}><span>Total Amount</span><strong>{money(order.total)}</strong></div>
        </section>

        <div className={styles.actions}>
          <button className={styles.reorderButton} type="button" onClick={reorder}>
            <OrderIcon name="reorder" /> Reorder
          </button>
          <Link className={styles.homeButton} to="/">
            <OrderIcon name="home" /> Back to Home
          </Link>
        </div>

        <p className={styles.thankYou}>Thank you for choosing The Taste Bud!</p>
      </div>
    </main>
  )
}

export default OrderDetails
