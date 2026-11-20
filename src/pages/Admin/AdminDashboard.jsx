import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdminDashboard.module.css'
import jollof from '../../assets/partyjollof.png'
import friedRice from '../../assets/agoyinspecial.png'
import noodles from '../../assets/plainpasta.png'
import customerOne from '../../assets/customer.png'
import customerTwo from '../../assets/customer2.png'
import customerThree from '../../assets/story-ken.jpg'
import customerFour from '../../assets/ceo.png'

const metrics = [
  { label: 'Total Users', value: '1,248', icon: 'users', color: 'peach', id: 'users' },
  { label: 'Total Orders', value: '892', icon: 'cart', color: 'green' },
  { label: 'Total Sales', value: '₦2,450,000', icon: 'naira', color: 'yellow' },
  { label: 'Avg Rating', value: '4.8', icon: 'star', color: 'pink' },
]

const orderStatuses = [
  { label: 'Pending', value: '48', icon: 'clock', color: 'peach' },
  { label: 'Preparing', value: '72', icon: 'chef', color: 'blue' },
  { label: 'On the Way', value: '110', icon: 'delivery', color: 'green' },
  { label: 'Delivered', value: '620', icon: 'check', color: 'green' },
  { label: 'Cancelled', value: '42', icon: 'close', color: 'red' },
  { label: 'Till Delivery', value: '2.6 days', icon: 'calendar', color: 'purple' },
]

const menuItems = [
  { name: 'Jollof Rice with Chicken', price: '₦5,000', orders: '245', likes: '128', image: jollof },
  { name: 'Fried Rice with Fish', price: '₦6,000', orders: '187', likes: '97', image: friedRice },
  { name: 'Noodles', price: '₦4,000', orders: '120', likes: '74', image: noodles },
]

const recentOrders = [
  { name: 'Blessing Okafor', id: 'TB10456', status: 'On the Way', ago: '2h ago', image: customerOne },
  { name: 'Emeka Nwosu', id: 'TB10455', status: 'Preparing', ago: '3h ago', image: customerTwo },
  { name: 'Chisom Peter', id: 'TB10454', status: 'Delivered', ago: '4h ago', image: customerThree },
  { name: 'Ngozi Martins', id: 'TB10453', status: 'Pending', ago: '5h ago', image: customerFour },
]

const weeklySales = [
  { day: 'Mon', height: 43 },
  { day: 'Tue', height: 65 },
  { day: 'Wed', height: 52 },
  { day: 'Thu', height: 34 },
  { day: 'Fri', height: 62 },
  { day: 'Sat', height: 87 },
  { day: 'Sun', height: 65 },
]

const monthlySales = [
  { day: 'Wk 1', height: 42 },
  { day: 'Wk 2', height: 58 },
  { day: 'Wk 3', height: 72 },
  { day: 'Wk 4', height: 88 },
]

function DashboardIcon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.5V20" /></>,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    menu: <><path d="M3 11h18l-2 9H5zM5 11l2-7h10l2 7M8 15h.01M12 15h.01M16 15h.01" /></>,
    sales: <><path d="M4 20V11h4v9M10 20V5h4v15M16 20V8h4v12" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" /></>,
    naira: <><path d="M7 4v16M17 4v16M7 8h10M7 16h10M7 4l10 16" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chef: <><path d="M6 12a4 4 0 1 1 3-6.8A4 4 0 1 1 15 6a4 4 0 1 1 3 6H6ZM6 12v8h12v-8M9 15h6" /></>,
    delivery: <><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    close: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9M15 6h6v6" /></>,
    document: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function AdminDashboard() {
  const [period, setPeriod] = useState('weekly')
  const sales = period === 'weekly' ? weeklySales : monthlySales

  return (
    <main className={styles.dashboardContent} id="dashboard" aria-label="Dashboard overview">
      <section className={styles.metrics} aria-label="Key metrics">
          {metrics.map(({ label, value, icon, color, id }) => (
            <article className={styles.metricCard} id={id} key={label}>
              <span className={`${styles.metricIcon} ${styles[color]}`}>
                <DashboardIcon name={icon} />
              </span>
              <strong>{value}</strong>
              <span>{label}</span>
              <DashboardIcon name={icon === 'users' ? 'users' : icon === 'cart' ? 'cart' : icon} />
            </article>
          ))}
      </section>

        <div className={styles.middleGrid}>
          <section className={`${styles.panel} ${styles.ordersPanel}`} id="orders-status" aria-labelledby="orders-title">
            <div className={styles.panelHeading}>
              <h2 id="orders-title"><DashboardIcon name="cart" /> Orders Status</h2>
              <Link to="/admin/orders">View All <DashboardIcon name="arrow" /></Link>
            </div>
            <div className={styles.statusGrid}>
              {orderStatuses.map(({ label, value, icon, color }) => (
                <article className={styles.statusCard} key={label}>
                  <span className={`${styles.statusIcon} ${styles[color]}`}>
                    <DashboardIcon name={icon} />
                  </span>
                  <div><strong>{value}</strong><span>{label}</span></div>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.panel} ${styles.salesPanel}`} id="sales-overview" aria-labelledby="sales-title">
            <div className={styles.panelHeading}>
              <h2 id="sales-title"><DashboardIcon name="sales" /> Sales Overview</h2>
              <div className={styles.periodToggle} aria-label="Sales chart period">
                {['weekly', 'monthly'].map((option) => (
                  <button
                    className={period === option ? styles.periodActive : ''}
                    key={option}
                    type="button"
                    aria-pressed={period === option}
                    onClick={() => setPeriod(option)}
                  >
                    {option[0].toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div
              className={styles.chart}
              role="img"
              aria-label={`${period} sales overview: ${sales.map(({ day }) => day).join(', ')}`}
            >
              <div className={styles.chartGrid}>
                {sales.map(({ day, height }) => (
                  <div className={styles.barGroup} key={day}>
                    <span className={styles.bar} style={{ height: `${height}%` }} />
                    <span className={styles.barLabel}>{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.bottomGrid}>
          <section className={`${styles.panel} ${styles.menuPanel}`} id="menu-management" aria-labelledby="menu-title">
            <div className={styles.panelHeading}>
              <h2 id="menu-title"><DashboardIcon name="menu" /> Menu Management</h2>
              <Link to="/admin/menu">View All <DashboardIcon name="arrow" /></Link>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr><th>Image</th><th>Title</th><th>Price</th><th>Orders</th><th>Likes</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {menuItems.map(({ name, price, orders, likes, image }) => (
                    <tr key={name}>
                      <td><img className={styles.dishImage} src={image} alt="" /></td>
                      <td className={styles.dishName}>{name}</td>
                      <td><strong>{price}</strong></td>
                      <td>{orders}</td>
                      <td><span className={styles.likes}><span aria-hidden="true">♥</span> {likes}</span></td>
                      <td><button className={styles.moreButton} type="button" aria-label={`More actions for ${name}`}><DashboardIcon name="more" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${styles.panel} ${styles.recentPanel}`} id="recent-orders" aria-labelledby="recent-title">
            <div className={styles.panelHeading}>
              <h2 id="recent-title"><DashboardIcon name="document" /> Recent Orders</h2>
              <Link to="/admin/orders">View All <DashboardIcon name="arrow" /></Link>
            </div>
            <ul className={styles.recentList}>
              {recentOrders.map(({ name, id, status, ago, image }) => (
                <li className={styles.recentOrder} key={id}>
                  <img src={image} alt="" />
                  <div className={styles.customerInfo}>
                    <strong>{name}</strong>
                    <span>#{id}</span>
                  </div>
                  <span className={`${styles.orderBadge} ${styles[`badge${status.replaceAll(' ', '')}`]}`}>{status}</span>
                  <time>{ago}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>
    </main>
  )
}

export default AdminDashboard
