import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdminSales.module.css'
import jollof from '../../assets/partyjollof.png'
import friedRice from '../../assets/agoyinspecial.png'
import noodles from '../../assets/plainpasta.png'

const salesByPeriod = {
  monthly: [
    { label: 'Jan', value: 420 },
    { label: 'Feb', value: 610 },
    { label: 'Mar', value: 520 },
    { label: 'Apr', value: 590 },
    { label: 'May', value: 740 },
    { label: 'Jun', value: 870 },
    { label: 'Jul', value: 650 },
    { label: 'Aug', value: 780 },
  ],
  weekly: [
    { label: 'Mon', value: 380 },
    { label: 'Tue', value: 620 },
    { label: 'Wed', value: 480 },
    { label: 'Thu', value: 710 },
    { label: 'Fri', value: 560 },
    { label: 'Sat', value: 900 },
    { label: 'Sun', value: 740 },
  ],
}

const topItems = [
  { name: 'Jollof Rice with Chicken', orders: 842, revenue: 421000, image: jollof },
  { name: 'Fried Rice with Fish', orders: 621, revenue: 310500, image: friedRice },
  { name: 'Noodles', orders: 412, revenue: 164800, image: noodles },
]

const recentSales = [
  { date: 'Nov 17, 2026 04:32 PM', id: 'TB10468', customer: 'Chioma Nwosu', amount: 5000, status: 'Delivered' },
  { date: 'Nov 17, 2026 03:50 PM', id: 'TB10467', customer: 'Emeka Okafor', amount: 6000, status: 'Preparing' },
  { date: 'Nov 17, 2026 02:15 PM', id: 'TB10466', customer: 'Ngozi Uche', amount: 5000, status: 'Pending' },
]

const salesMetrics = [
  { label: 'Total Sales', value: '₦1,247,500', change: '12%', icon: 'cart' },
  { label: 'Total Orders', value: '3,428', change: '15%', icon: 'orders' },
  { label: 'Total Customers', value: '2,480', change: '18%', icon: 'users' },
  { label: 'Avg Rating', value: '4.8', change: '0.2', icon: 'star' },
]

function SalesIcon({ name }) {
  const paths = {
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    orders: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.2a3 3 0 0 1 0 5.6M18 14a5 5 0 0 1 3 4.5V20" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    trophy: <><path d="M8 4h8v6a4 4 0 0 1-8 0V4ZM8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 21h8M9 18h6" /></>,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function formatCurrency(value) {
  return `₦${value.toLocaleString('en-NG')}`
}

function SalesChart({ period, data }) {
  const width = 1000
  const height = 190
  const left = 18
  const right = 982
  const top = 14
  const bottom = 158
  const maxValue = 1000
  const points = data.map((item, index) => {
    const x = left + (right - left) * index / (data.length - 1)
    const y = bottom - (bottom - top) * item.value / maxValue
    return { ...item, x, y }
  })
  const linePath = points.map(({ x, y }, index) =>
    `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`,
  ).join(' ')
  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`

  return (
    <div className={styles.chart} role="img" aria-label={`${period} sales chart showing ${data.map(({ label }) => label).join(', ')}`}>
      <div className={styles.yLabels} aria-hidden="true">
        <span>1M</span><span>750k</span><span>500k</span><span>250k</span><span>0</span>
      </div>
      <svg className={styles.chartSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {[top, top + 36, top + 72, top + 108, bottom].map((y) => (
          <line className={styles.gridLine} key={y} x1={left} x2={right} y1={y} y2={y} />
        ))}
        {points.map(({ x }, index) => (
          <line className={styles.gridLineVertical} key={index} x1={x} x2={x} y1={top} y2={bottom} />
        ))}
        <path className={styles.chartArea} d={areaPath} />
        <path className={styles.chartLine} d={linePath} />
        {points.map(({ label, x, y }) => (
          <circle className={styles.chartPoint} key={label} cx={x} cy={y} r="5" />
        ))}
      </svg>
      <div className={styles.xLabels} aria-hidden="true">
        {data.map(({ label }) => <span key={label}>{label}</span>)}
      </div>
    </div>
  )
}

function AdminSales() {
  const [period, setPeriod] = useState('monthly')

  return (
    <main className={styles.salesPage}>
      <section className={styles.metrics} aria-label="Sales summary">
        {salesMetrics.map(({ label, value, change, icon }) => (
          <article className={styles.metricCard} key={label}>
            <span className={styles.metricIcon}><SalesIcon name={icon} /></span>
            <strong>{value}</strong>
            <span>{label}</span>
            <SalesIcon name={icon} />
            <span className={styles.metricChange}>
              <span aria-hidden="true">↑</span> {change}
              <small>vs last month</small>
            </span>
          </article>
        ))}
      </section>

      <section className={styles.panel} aria-labelledby="sales-chart-title">
        <div className={styles.panelHeading}>
          <h2 id="sales-chart-title"><SalesIcon name="cart" /> Sales Chart</h2>
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
        <SalesChart period={period} data={salesByPeriod[period]} />
      </section>

      <div className={styles.bottomGrid}>
        <section className={`${styles.panel} ${styles.topItems}`} aria-labelledby="top-items-title">
          <div className={styles.panelHeading}>
            <h2 id="top-items-title"><SalesIcon name="trophy" /> Top Selling Items</h2>
            <Link to="/admin/menu">View All <SalesIcon name="arrow" /></Link>
          </div>
          <ol className={styles.topList}>
            {topItems.map(({ name, orders, revenue, image }) => (
              <li key={name}>
                <img src={image} alt="" />
                <div><strong>{name}</strong><span>{orders.toLocaleString('en-NG')} orders</span></div>
                <strong className={styles.revenue}>{formatCurrency(revenue)}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.panel} ${styles.recentSales}`} aria-labelledby="recent-sales-title">
          <div className={styles.panelHeading}>
            <h2 id="recent-sales-title"><SalesIcon name="orders" /> Recent Sales</h2>
            <Link to="/admin/orders">View All <SalesIcon name="arrow" /></Link>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th>Date &amp; Time</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentSales.map(({ date, id, customer, amount, status }) => (
                  <tr key={id}>
                    <td>{date}</td>
                    <td>#{id}</td>
                    <td>{customer}</td>
                    <td className={styles.saleAmount}>{formatCurrency(amount)}</td>
                    <td><span className={`${styles.statusBadge} ${styles[`status${status}`]}`}>{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminSales
