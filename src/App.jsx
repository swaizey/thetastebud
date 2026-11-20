import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Nav from './components/Nav.jsx'
import styles from './App.module.css'
import Home from './pages/Home/Home.jsx'

const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx'))
const AdminMenu = lazy(() => import('./pages/Admin/AdminMenu.jsx'))
const AdminOrders = lazy(() => import('./pages/Admin/AdminOrders.jsx'))
const AdminOrderDetails = lazy(() => import('./pages/Admin/AdminOrderDetails.jsx'))
const AdminSales = lazy(() => import('./pages/Admin/AdminSales.jsx'))
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers.jsx'))
const AdminUserProfile = lazy(() => import('./pages/Admin/AdminUserProfile.jsx'))
const About = lazy(() => import('./pages/About/About.jsx'))
const Catering = lazy(() => import('./pages/Catering/Catering.jsx'))
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'))
const Delivery = lazy(() => import('./pages/Delivery/Delivery.jsx'))
const Gallery = lazy(() => import('./pages/Gallery/Gallery.jsx'))
const Menu = lazy(() => import('./pages/Menu/Menu.jsx'))
const Order = lazy(() => import('./pages/Order/Order.jsx'))
const OrderDetails = lazy(() => import('./pages/Order/OrderDetails.jsx'))
const UserProfile = lazy(() => import('./pages/Profile/Profile.jsx'))
const EditProfile = lazy(() => import('./pages/Profile/EditProfile.jsx'))
const UserFavorites = lazy(() => import('./pages/Profile/UserFavorites.jsx'))
const UserAddresses = lazy(() => import('./pages/Profile/UserAddresses.jsx'))
const Inbox = lazy(() => import('./pages/Messages/Inbox.jsx'))
const Chat = lazy(() => import('./pages/Messages/Chat.jsx'))
const ComingSoon = lazy(() => import('./pages/ComingSoon/ComingSoon.jsx'))

function PublicChatLink() {
  const [isVisible, setIsVisible] = useState(false)
  const hideTimeoutRef = useRef(null)

  useEffect(() => {
    const showWhileActive = () => {
      setIsVisible(true)
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = window.setTimeout(() => setIsVisible(false), 5000)
    }
    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll']

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, showWhileActive, { passive: true })
    })

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, showWhileActive)
      })
      window.clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  return (
    <Link
      className={`${styles.chatLink} ${isVisible ? styles.chatLinkVisible : ''}`}
      to="/messages"
      aria-label="Open inbox"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.5-3.1A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" />
      </svg>
    </Link>
  )
}

function App() {
  const { pathname } = useLocation()
  const isAdminPage = pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Nav />}
      <Suspense fallback={<div className={styles.routeLoading} role="status">Loading page…</div>}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:userId" element={<AdminUserProfile />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetails />} />
            <Route path="messages" element={<Inbox isAdmin />} />
            <Route path="messages/:conversationId" element={<Chat isAdmin />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="sales" element={<AdminSales />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/favorites" element={<UserFavorites />} />
          <Route path="/profile/addresses" element={<UserAddresses />} />
          <Route path="/messages" element={<Inbox />} />
          <Route path="/messages/:conversationId" element={<Chat />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </Suspense>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <PublicChatLink />}
    </>
  )
}

export default App
