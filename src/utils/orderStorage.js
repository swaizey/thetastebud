import { nanoid } from 'nanoid'

const CART_KEY = 'tastebud-cart'
const ORDERS_KEY = 'tastebud-orders'
export const CART_CHANGE_EVENT = 'tastebud-cart-change'

function readCollection(key) {
  const value = window.localStorage.getItem(key)
  if (value === null) return []

  const parsedValue = JSON.parse(value)
  if (!Array.isArray(parsedValue)) {
    throw new TypeError(`Saved data for ${key} must be an array.`)
  }

  return parsedValue
}

export function readCart() {
  return readCollection(CART_KEY)
}

export function saveCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event(CART_CHANGE_EVENT))
}

export function readOrders() {
  return readCollection(ORDERS_KEY)
}

export function saveOrders(orders) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function createOrderId(email) {
  const emailName = email.trim().split('@')[0]
  const userPrefix = emailName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'USR'
  const randomCode = nanoid(8).toUpperCase()

  return `TBJ-${userPrefix}-${randomCode}`
}
