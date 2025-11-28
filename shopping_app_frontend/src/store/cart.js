const CART_KEY = 'ocean_shop_cart_v1'

function readStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

function writeStorage(state) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state))
  } catch {
    // ignore write errors
  }
}

export class CartStore {
  constructor() {
    this.items = readStorage()
    this.subscribers = new Set()
  }

  // PUBLIC_INTERFACE
  subscribe(cb) {
    /** Subscribe to cart changes. Returns unsubscribe function. */
    this.subscribers.add(cb)
    return () => this.subscribers.delete(cb)
  }

  notify() {
    writeStorage(this.items)
    this.subscribers.forEach((cb) => {
      try {
        cb(this.snapshot())
      } catch {
        // no-op
      }
    })
  }

  // PUBLIC_INTERFACE
  snapshot() {
    /** Returns a computed snapshot of the cart including totals. */
    const entries = Object.entries(this.items).map(([id, item]) => ({
      id,
      ...item,
      lineTotal: +(item.price * item.quantity).toFixed(2),
    }))
    const count = entries.reduce((a, b) => a + b.quantity, 0)
    const total = +entries.reduce((a, b) => a + b.lineTotal, 0).toFixed(2)
    return { entries, count, total }
  }

  // PUBLIC_INTERFACE
  add(product, qty = 1) {
    /** Add product to cart with optional quantity. Enforces stock if provided. */
    const prev = this.items[product.id] || {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock ?? Infinity,
      quantity: 0,
    }
    const nextQty = Math.min(prev.quantity + qty, prev.stock ?? Infinity)
    this.items[product.id] = { ...prev, quantity: nextQty }
    this.notify()
  }

  // PUBLIC_INTERFACE
  update(id, quantity) {
    /** Update quantity for an item by id. Removes if quantity <= 0. */
    const item = this.items[id]
    if (!item) return
    const q = Math.max(0, Math.min(quantity, item.stock ?? Infinity))
    if (q === 0) delete this.items[id]
    else this.items[id] = { ...item, quantity: q }
    this.notify()
  }

  // PUBLIC_INTERFACE
  remove(id) {
    /** Remove an item from the cart by id. */
    if (this.items[id]) {
      delete this.items[id]
      this.notify()
    }
  }

  // PUBLIC_INTERFACE
  clear() {
    /** Clear the entire cart. */
    this.items = {}
    this.notify()
  }
}

export const cartStore = new CartStore()
