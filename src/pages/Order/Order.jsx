import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrder } from '../../context/useOrder'
import styles from './Order.module.css'
import orderHero from '../../assets/orderhero.png'
import {
  createOrderId,
  readCart,
  saveCart,
} from '../../utils/orderStorage'

const tabs = [
  { id: 'cart', label: 'Cart', icon: 'cart' },
  { id: 'pending', label: 'Pending Orders', icon: 'clock' },
  { id: 'approved', label: 'Approved Orders', icon: 'check' },
  { id: 'delivered', label: 'Delivered Orders', icon: 'delivery' },
  { id: 'payment', label: 'Payment Instructions', icon: 'card' },
]

const money = (amount) => `₦${amount.toLocaleString('en-NG')}`

function TabIcon({ name }) {
  const paths = {
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    delivery: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    bank: <><path d="m3 9 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" /></>,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function EmptyState({ title, description, action, to = '/menu' }) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyMark} aria-hidden="true">
        <TabIcon name="cart" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to={to}>{action} <span aria-hidden="true">→</span></Link>
    </div>
  )
}

function PendingEmptyState() {
  return (
    <div className={styles.pendingEmpty}>
      <svg className={styles.pendingIllustration} viewBox="0 0 240 175" aria-hidden="true">
        <path className={styles.illustrationLeaf} d="M37 106c-20-9-24-26-23-40 16 4 29 15 30 33m5 21c-20-2-32 8-39 21 18 5 35 0 42-16" />
        <path className={styles.illustrationLeaf} d="M203 106c20-9 24-26 23-40-16 4-29 15-30 33m-5 21c20-2 32 8 39 21-18 5-35 0-42-16" />
        <rect x="68" y="24" width="100" height="119" rx="8" />
        <path d="M96 24v-9h44v9M88 61l7 7 12-14M116 64h31M88 88l7 7 12-14M116 91h23M88 115l7 7 12-14" />
        <circle cx="158" cy="121" r="32" />
        <path d="M158 102v20l13 8" />
        <path d="m187 45 12-11m-5 26 16-3m-29-28 3-15" />
      </svg>
      <h2>No Pending Orders</h2>
      <p>
        You have no orders currently being processed.
        <br />
        Start ordering your favorite meals now!
      </p>
      <Link className={styles.browseButton} to="/menu">
        Browse Menu <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function DeliveredEmptyState() {
  return (
    <div className={styles.deliveredEmpty}>
      <span className={styles.deliveredEmptyIcon} aria-hidden="true">
        <TabIcon name="delivery" />
      </span>
      <h2>No Delivered Orders Yet</h2>
      <p>Your completed deliveries will appear here once an order has been delivered.</p>
      <Link to="/menu">Browse Menu <span aria-hidden="true">→</span></Link>
    </div>
  )
}

function OrderCard({ order }) {
  const firstItem = order.items[0]
  const statusClass = {
    pending: styles.statusPending,
    approved: styles.statusApproved,
    delivered: styles.statusDelivered,
  }[order.status]

  return (
    <article className={`${styles.orderCard} ${order.status === 'delivered' ? styles.deliveredOrderCard : ''}`}>
      <img className={styles.orderImage} src={firstItem.image} alt={firstItem.name} />
      <div className={styles.orderDetails}>
        <h2>{firstItem.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</h2>
        <p>Order #{order.id}</p>
        <p className={styles.orderDate}>
          <TabIcon name="calendar" />
          {new Date(order.createdAt).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
        <p className={styles.orderTotal}>Total: <strong>{money(order.total)}</strong></p>
      </div>
      <div className={styles.orderActions}>
        <span className={`${styles.statusBadge} ${statusClass}`}>
          <TabIcon name={order.status === 'pending' ? 'clock' : 'check'} />
          {order.status[0].toUpperCase() + order.status.slice(1)}
        </span>
        <Link to={`/order/${order.id}`}>
          View Details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

function Order() {
  const [cart, setCart] = useState(readCart)
  const { orders, setOrders } = useOrder()
  const [activeTab, setActiveTab] = useState('cart')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = cart.length > 0 ? 1000 : 0
  const total = subtotal + deliveryFee
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ||
    orders.find((order) => order.status === 'pending')

  const updateCart = (nextCart) => {
    setCart(nextCart)
    saveCart(nextCart)
  }

  const changeQuantity = (itemId, difference) => {
    const nextCart = cart
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + difference } : item,
      )
      .filter((item) => item.quantity > 0)
    updateCart(nextCart)
  }

  const removeItem = (itemId) => {
    updateCart(cart.filter((item) => item.id !== itemId))
  }

  const placeOrder = (event) => {
    event.preventDefault()
    const email = customerEmail.trim()
    if (cart.length === 0) return
    if (!email || email.length > 254) {
      setCheckoutError('Enter a valid email address to continue.')
      return
    }

    const order = {
      id: createOrderId(email),
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
    }
    const nextOrders = [order, ...orders]

    saveCart([])
    setOrders(nextOrders)
    setCart([])
    setSelectedOrderId(order.id)
    setActiveTab('payment')
  }

  const heroCopy = {
    cart: { eyebrow: 'Your Cart', firstLine: 'Good Food', secondLine: 'One Click Away', description: 'Review your items and proceed to checkout.' },
    pending: { eyebrow: 'Order Updates', firstLine: 'Pending Orders', secondLine: '', description: 'Your orders that are being processed.' },
    approved: { eyebrow: 'Order Updates', firstLine: 'Approved Orders', secondLine: '', description: 'Orders that have been approved and are being processed.' },
    delivered: { eyebrow: 'Order Updates', firstLine: 'My Orders', secondLine: '', description: 'Track your orders and stay updated.' },
    payment: { eyebrow: 'Checkout', firstLine: 'Payment', secondLine: 'Instructions', description: 'Complete your payment to confirm your order.' },
  }[activeTab]
  const visibleOrders = orders.filter((order) => order.status === activeTab)
  const paymentHref = selectedOrder
    ? `mailto:hello@thetastebud.ng?subject=${encodeURIComponent(`Payment confirmation for order ${selectedOrder.id}`)}`
    : 'mailto:hello@thetastebud.ng?subject=Payment%20instructions'

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="order-page-title">
        <img className={styles.heroImage} src={orderHero} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p>{heroCopy.eyebrow}</p>
          <h1 id="order-page-title">
            {heroCopy.firstLine}
            {heroCopy.secondLine && (
              <>
                <br />
                <span>{heroCopy.secondLine}</span>
              </>
            )}
          </h1>
          <p className={styles.heroDescription}>{heroCopy.description}</p>
        </div>
        <span className={styles.heroWave} aria-hidden="true" />
      </section>

      <div className={styles.orderContent}>
        <nav className={styles.tabs} aria-label="Order sections">
          {tabs.map(({ id, label, icon }) => {
            const count = id === 'cart'
              ? cart.reduce((itemCount, item) => itemCount + item.quantity, 0)
              : orders.filter((order) => order.status === id).length
            return (
              <button
                className={`${styles.tab} ${activeTab === id ? styles.activeTab : ''}`}
                key={id}
                type="button"
                aria-pressed={activeTab === id}
                onClick={() => setActiveTab(id)}
              >
                <TabIcon name={icon} />
                <span>{label}</span>
                {count > 0 && <span className={styles.tabCount}>{count}</span>}
              </button>
            )
          })}
        </nav>

        {activeTab === 'cart' && (
          cart.length > 0 ? (
            <section className={styles.cartView} aria-label="Shopping cart">
              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <article className={styles.cartItem} key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className={styles.cartItemInfo}>
                      <h2>{item.name}</h2>
                      <p className={styles.itemPrice}>{money(item.price)}</p>
                      <div className={styles.quantityControl} aria-label={`${item.name} quantity`}>
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          <TabIcon name="minus" />
                        </button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          <TabIcon name="plus" />
                        </button>
                      </div>
                    </div>
                    <strong className={styles.itemTotal}>{money(item.price * item.quantity)}</strong>
                    <button
                      className={styles.removeButton}
                      type="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.id)}
                    >
                      <TabIcon name="trash" />
                    </button>
                  </article>
                ))}
              </div>

              <form className={styles.summary} aria-labelledby="summary-title" onSubmit={placeOrder}>
                <h2 id="summary-title">Order Summary</h2>
                <div><span>Subtotal ({cart.reduce((count, item) => count + item.quantity, 0)} items)</span><strong>{money(subtotal)}</strong></div>
                <div><span>Delivery Fee</span><strong>{money(deliveryFee)}</strong></div>
                <div className={styles.summaryTotal}><span>Total</span><strong>{money(total)}</strong></div>
                <label className={styles.checkoutEmail}>
                  <span>Email for your order code</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    required
                    value={customerEmail}
                    onChange={(event) => {
                      setCustomerEmail(event.target.value)
                      setCheckoutError('')
                    }}
                  />
                  <small>Your code uses the first 3 letters before @.</small>
                </label>
                {checkoutError && <p className={styles.checkoutError} role="alert">{checkoutError}</p>}
                <button className={styles.checkoutButton} type="submit">
                  <TabIcon name="card" /> Proceed to Checkout <span aria-hidden="true">→</span>
                </button>
              </form>

              <Link className={styles.continueShopping} to="/menu">
                <span aria-hidden="true">←</span> Continue Shopping
              </Link>
            </section>
          ) : (
            <EmptyState
              title="Your cart is waiting"
              description="Browse our menu and add something delicious to your order."
              action="Browse Menu"
            />
          )
        )}

        {['pending', 'approved', 'delivered'].includes(activeTab) && (
          <section className={styles.ordersView} aria-label={heroCopy.firstLine}>
            {visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : activeTab === 'pending' ? (
              <PendingEmptyState />
            ) : activeTab === 'delivered' ? (
              <DeliveredEmptyState />
            ) : (
              <EmptyState
                title={`No ${activeTab} orders`}
                description={`You don’t have any ${activeTab} orders yet. Start with one of your favorites.`}
                action="Browse Menu"
              />
            )}
            {['pending', 'delivered'].includes(activeTab) && (
              <div className={styles.orderEncouragement}>
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M5 34h38M9 34a15 15 0 0 1 30 0M24 19v-6" />
                  <circle cx="24" cy="10" r="3" />
                  <path d="M4 40h40" />
                </svg>
                <div>
                  <h2>Enjoy your meal!</h2>
                  <p>Thank you for choosing The Taste Bud</p>
                </div>
                <span aria-hidden="true">♡</span>
              </div>
            )}
          </section>
        )}

        {activeTab === 'payment' && (
          selectedOrder ? (
            <section className={styles.paymentView} aria-label="Payment instructions">
              <article className={styles.paymentOrder}>
                <img src={selectedOrder.items[0].image} alt={selectedOrder.items[0].name} />
                <div className={styles.paymentOrderInfo}>
                  <h2>{selectedOrder.items[0].name}{selectedOrder.items.length > 1 ? ` + ${selectedOrder.items.length - 1} more` : ''}</h2>
                  <p>Order #{selectedOrder.id}</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div className={styles.paymentAmount}>
                  <span>Total Amount</span>
                  <strong>{money(selectedOrder.total)}</strong>
                </div>
              </article>

              <section className={styles.paymentPanel} aria-labelledby="transfer-title">
                <h2 id="transfer-title"><TabIcon name="bank" /> Bank Transfer</h2>
                <p>
                  Please transfer <strong className={styles.transferAmount}>{money(selectedOrder.total)}</strong> to the
                  account below and include your <strong>order code</strong> in the narration.
                </p>
                <div className={styles.bankAccount}>
                  <span className={styles.bankMark} aria-hidden="true">W</span>
                  <div>
                    <span>Bank</span>
                    <strong>Wema Bank</strong>
                  </div>
                  <div>
                    <span>Account Number</span>
                    <strong>0123 4567 8901</strong>
                  </div>
                </div>
                <div className={styles.orderReference}>
                  <p>Use this Order Code in your Narration:</p>
                  <strong>{selectedOrder.id}</strong>
                  <small>Use the code exactly as shown so we can identify your payment.</small>
                </div>
              </section>

              <section className={styles.paymentNotesSection} aria-labelledby="payment-notes-title">
                <h2 id="payment-notes-title"><span aria-hidden="true">!</span> Important Notes:</h2>
                <ul className={styles.paymentNotes}>
                  <li>Ensure you include the <strong>order code</strong> in the narration.</li>
                  <li>Make payment from the same account used for checkout.</li>
                  <li>Our team will review your payment and update your order status.</li>
                </ul>
              </section>

              <div className={styles.paymentActions}>
                <a href={paymentHref}><span aria-hidden="true">↻</span> I Have Made Payment</a>
                <button type="button" onClick={() => setActiveTab('pending')}>
                  <span aria-hidden="true">←</span> Back to Orders
                </button>
              </div>
            </section>
          ) : (
            <EmptyState
              title="No payment instructions yet"
              description="Place an order first and we’ll show its payment and reference details here."
              action="Browse Menu"
            />
          )
        )}
      </div>

      {activeTab !== 'payment' && (
        <section className={styles.finalCta} aria-labelledby="order-cta-title">
          <span className={styles.ctaIcon} aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M5 34h38M9 34a15 15 0 0 1 30 0M24 19v-6" />
              <circle cx="24" cy="10" r="3" />
              <path d="M4 40h40" />
            </svg>
          </span>
          <div>
            <h2 id="order-cta-title">Craving Something Delicious?</h2>
            <p>Order now and let The Taste Bud bring the goodness to you!</p>
          </div>
          <Link to="/delivery">Order for Delivery <span aria-hidden="true">→</span></Link>
        </section>
      )}
    </main>
  )
}

export default Order
