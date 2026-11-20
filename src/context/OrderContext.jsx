import { useEffect, useMemo, useState } from 'react'
import { readOrders, saveOrders } from '../utils/orderStorage'
import OrderContext from './OrderContext'

function loadInitialOrders() {
  return readOrders().filter((order) => !order.isDemo)
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadInitialOrders)

  useEffect(() => {
    saveOrders(orders)
  }, [orders])

  const value = useMemo(() => ({ orders, setOrders }), [orders])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
