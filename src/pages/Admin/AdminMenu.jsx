import { useMemo, useRef, useState } from 'react'
import { menuProducts as catalogProducts } from '../../data/menuProducts'
import styles from './AdminMenu.module.css'

const pageSize = 6
const productInsights = {
  'agoyin-special': { likes: 128, orders: 245, available: true },
  'ewa-agoyin': { likes: 97, orders: 187, available: true },
  'fried-plantain': { likes: 74, orders: 120, available: true },
  'pasta-special': { likes: 62, orders: 98, available: true },
  'plain-pasta': { likes: 51, orders: 87, available: false },
  'grilled-chicken': { likes: 45, orders: 73, available: true },
  'beef-steak': { likes: 42, orders: 68, available: true },
  'grilled-fish': { likes: 39, orders: 64, available: true },
  'grilled-pork': { likes: 34, orders: 56, available: true },
  'spring-rolls': { likes: 29, orders: 48, available: true },
  'chocolate-cookies': { likes: 26, orders: 42, available: true },
  chapman: { likes: 22, orders: 39, available: true },
  cheesecake: { likes: 19, orders: 32, available: true },
}

const initialItems = catalogProducts.map((product) => ({
  ...product,
  ...(productInsights[product.id] || { likes: 0, orders: 0, available: true }),
}))

const emptyDraft = {
  name: '',
  description: '',
  category: 'Local Favorites',
  price: '',
  imageId: catalogProducts[0].id,
  image: '',
  available: true,
}

function MenuIcon({ name }) {
  const paths = {
    meal: <><path d="M3 13h18l-2 7H5z" /><path d="M5 10c1.5-3 3.8-4 7-4s5.5 1 7 4" /></>,
    heart: <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    sales: <><path d="M4 20V11h4v9M10 20V5h4v15M16 20V8h4v12" /><path d="m3 9 6-5 4 3 7-5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    sort: <><path d="M4 6h16M7 12h10M10 18h4" /><path d="m17 9 3 3 3-3" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" /></>,
    previous: <path d="m15 18-6-6 6-6" />,
    next: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m8 10 4 4 4-4" />,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function MenuItemModal({
  modal,
  draft,
  setDraft,
  onClose,
  onSave,
  onDelete,
  onImageUpload,
  imageError,
  formError,
  onFormChange,
  isReadingImage,
}) {
  const imageInputRef = useRef(null)
  const selectedImage = draft.image || catalogProducts.find((product) => product.id === draft.imageId)?.image

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="menu-modal-title">
        <div className={styles.modalHeading}>
          <h2 id="menu-modal-title">
            {modal.type === 'add' ? 'Add Menu Item' : modal.type === 'edit' ? 'Edit Menu Item' : 'Delete Menu Item'}
          </h2>
          <button type="button" aria-label="Close dialog" onClick={onClose}><MenuIcon name="close" /></button>
        </div>

        {(modal.type === 'add' || modal.type === 'edit') && (
          <form className={styles.itemForm} onSubmit={onSave} onChange={onFormChange}>
            <label>Item name
              <input autoFocus minLength={2} maxLength={100} required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label>Description
              <textarea minLength={5} maxLength={500} required rows="3" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
            <div className={styles.formColumns}>
              <label>Category
                <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                  {['Local Favorites', 'Swallows', 'Pasta', 'Grills', 'Snacks & Drinks'].map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>Price (₦)
                <input required min="0" max="1000000000" step="100" type="number" inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} />
              </label>
            </div>
            <div className={styles.photoField}>
              <span>Photo</span>
              <div className={styles.imageChoices}>
                <span className={styles.photoSelect}>
                  <img src={selectedImage} alt="" />
                  <select
                    value={draft.imageId}
                    onChange={(event) => setDraft({ ...draft, imageId: event.target.value, image: '' })}
                  >
                    {catalogProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                </span>
                <button
                  className={styles.uploadImageButton}
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isReadingImage}
                >
                  {isReadingImage ? 'Loading…' : 'Upload image'}
                </button>
                <input
                  ref={imageInputRef}
                  className={styles.srOnly}
                  type="file"
                  accept="image/*"
                  aria-label="Upload a menu item image from this device"
                  tabIndex={-1}
                  onChange={onImageUpload}
                />
              </div>
              <small className={styles.imageHint}>Choose an image from this device (up to 5 MB).</small>
              {imageError && <p className={styles.imageError} role="alert">{imageError}</p>}
            </div>
            {formError && <p className={styles.formError} role="alert">{formError}</p>}
            <label className={styles.stockToggle}>
              <input type="checkbox" checked={draft.available} onChange={(event) => setDraft({ ...draft, available: event.target.checked })} />
              Available to order
            </label>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
              <button className={styles.primaryButton} type="submit" disabled={isReadingImage}>
                {isReadingImage ? 'Loading image…' : modal.type === 'add' ? 'Add Item' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {modal.type === 'delete' && (
          <div className={styles.deleteConfirmation}>
            <p>Delete <strong>{modal.item.name}</strong> from your menu? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
              <button className={styles.deleteButton} type="button" onClick={onDelete}>Delete Item</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function AdminMenu() {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [sortBy, setSortBy] = useState('Popular')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [modal, setModal] = useState({ type: null })
  const [draft, setDraft] = useState(emptyDraft)
  const [imageError, setImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [isReadingImage, setIsReadingImage] = useState(false)
  const imageReaderRef = useRef(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matches = items.filter((item) => {
      const matchesQuery =
        !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter
      return matchesQuery && matchesCategory
    })

    return matches.sort((first, second) => {
      if (sortBy === 'Price: Low to High') return first.price - second.price
      if (sortBy === 'Price: High to Low') return second.price - first.price
      if (sortBy === 'Name: A to Z') return first.name.localeCompare(second.name)
      if (sortBy === 'Newest First') return (second.createdAt || 0) - (first.createdAt || 0)
      return second.orders - first.orders
    })
  }, [items, search, categoryFilter, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allVisibleSelected = visibleItems.length > 0 &&
    visibleItems.every((item) => selectedIds.has(item.id))

  const openAdd = () => {
    imageReaderRef.current?.abort()
    imageReaderRef.current = null
    setImageError('')
    setFormError('')
    setIsReadingImage(false)
    setDraft(emptyDraft)
    setModal({ type: 'add' })
  }

  const openEdit = (item) => {
    imageReaderRef.current?.abort()
    imageReaderRef.current = null
    setImageError('')
    setFormError('')
    setIsReadingImage(false)
    setDraft({
      name: item.name,
      description: item.description,
      category: item.category,
      price: String(item.price),
      imageId: catalogProducts.find((product) => product.image === item.image)?.id || catalogProducts[0].id,
      image: item.image,
      available: item.available,
    })
    setModal({ type: 'edit', item })
  }

  const closeModal = () => {
    imageReaderRef.current?.abort()
    imageReaderRef.current = null
    setIsReadingImage(false)
    setImageError('')
    setFormError('')
    setModal({ type: null })
  }

  const uploadImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setImageError('Choose a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('The image must be 5 MB or smaller.')
      return
    }

    imageReaderRef.current?.abort()
    setImageError('')
    setIsReadingImage(true)

    const reader = new FileReader()
    imageReaderRef.current = reader
    reader.onload = () => {
      if (imageReaderRef.current !== reader) return

      if (typeof reader.result !== 'string') {
        setImageError('The selected image could not be loaded.')
      } else {
        setDraft((current) => ({ ...current, imageId: '', image: reader.result }))
      }

      imageReaderRef.current = null
      setIsReadingImage(false)
    }
    reader.onerror = () => {
      if (imageReaderRef.current !== reader) return
      imageReaderRef.current = null
      setIsReadingImage(false)
      setImageError('The selected image could not be loaded.')
    }
    reader.readAsDataURL(file)
  }

  const saveItem = (event) => {
    event.preventDefault()
    if (isReadingImage) return

    const name = draft.name.trim()
    const description = draft.description.trim()
    const price = Number(draft.price)
    if (name.length < 2 || description.length < 5 || !draft.price.trim() || !Number.isFinite(price) || price < 0) {
      setFormError('Enter a name, description, and valid non-negative price.')
      return
    }

    const selectedProduct = catalogProducts.find((product) => product.id === draft.imageId)
    const isNewItem = modal.type === 'add'
    const nextItem = {
      id: modal.type === 'edit' ? modal.item.id : `admin-${Date.now()}`,
      createdAt: isNewItem ? Date.now() : modal.item.createdAt,
      name,
      description,
      category: draft.category,
      price,
      image: draft.image || selectedProduct?.image || catalogProducts[0].image,
      likes: modal.type === 'edit' ? modal.item.likes : 0,
      orders: modal.type === 'edit' ? modal.item.orders : 0,
      available: draft.available,
    }

    if (modal.type === 'edit') {
      setItems((current) => current.map((item) => item.id === modal.item.id ? nextItem : item))
    } else {
      setItems((current) => [nextItem, ...current])
      setSortBy('Newest First')
      setPage(1)
    }

    closeModal()
  }

  const deleteItem = () => {
    setItems((current) => current.filter((item) => item.id !== modal.item.id))
    setSelectedIds((current) => {
      const next = new Set(current)
      next.delete(modal.item.id)
      return next
    })
    closeModal()
  }

  const toggleItem = (itemId) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const toggleVisibleItems = () => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (allVisibleSelected) visibleItems.forEach((item) => next.delete(item.id))
      else visibleItems.forEach((item) => next.add(item.id))
      return next
    })
  }

  const totalOrders = items.reduce((total, item) => total + item.orders, 0)

  return (
    <main className={styles.menuPage}>
      <section className={styles.menuMetrics} aria-label="Menu summary">
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.peach}`}><MenuIcon name="meal" /></span>
          <strong>{items.length}</strong><span>Total Menu Items</span>
          <MenuIcon name="meal" />
        </article>
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.pink}`}><MenuIcon name="heart" /></span>
          <strong>4.8</strong><span>Avg. Likes</span>
          <MenuIcon name="heart" />
        </article>
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.yellow}`}><MenuIcon name="cart" /></span>
          <strong>{Math.max(3428, totalOrders).toLocaleString('en-NG')}</strong><span>Total Orders</span>
          <MenuIcon name="cart" />
        </article>
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.green}`}><MenuIcon name="sales" /></span>
          <strong>₦1,247,500</strong><span>Total Sales</span>
          <MenuIcon name="sales" />
        </article>
      </section>

      <section className={styles.menuManagement} aria-label="Manage menu items">
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <MenuIcon name="search" />
            <span className={styles.srOnly}>Search menu items</span>
            <input
              type="search"
              placeholder="Search menu items..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </label>
          <label className={styles.selectWrap}>
            <span className={styles.srOnly}>Filter by category</span>
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value)
                setPage(1)
              }}
            >
              <option>All Categories</option>
              {['Local Favorites', 'Swallows', 'Pasta', 'Grills', 'Snacks & Drinks'].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <MenuIcon name="chevron" />
          </label>
          <label className={styles.selectWrap}>
            <MenuIcon name="sort" />
            <span className={styles.srOnly}>Sort menu items</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option>Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A to Z</option>
              <option>Newest First</option>
            </select>
            <MenuIcon name="chevron" />
          </label>
          <button className={styles.addButton} type="button" onClick={openAdd}>
            <MenuIcon name="plus" /> Add Menu Item
          </button>
        </div>

        <div className={styles.menuTableWrap}>
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all visible menu items"
                    checked={allVisibleSelected}
                    onChange={toggleVisibleItems}
                  />
                </th>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">Info</th>
                <th scope="col">Likes</th>
                <th scope="col">Orders</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr className={selectedIds.has(item.id) ? styles.selectedRow : ''} key={item.id}>
                  <td><input type="checkbox" aria-label={`Select ${item.name}`} checked={selectedIds.has(item.id)} onChange={() => toggleItem(item.id)} /></td>
                  <td><img className={styles.itemImage} src={item.image} alt="" /></td>
                  <td className={styles.itemName}>{item.name}</td>
                  <td className={styles.price}>₦{item.price.toLocaleString('en-NG')}</td>
                  <td className={styles.description}>{item.description}</td>
                  <td><span className={styles.likes}><span aria-hidden="true">♥</span> {item.likes}</span></td>
                  <td><span className={styles.orders}><MenuIcon name="cart" /> {item.orders}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.available ? styles.available : styles.outOfStock}`}>
                      <span aria-hidden="true" />{item.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button type="button" aria-label={`Edit ${item.name}`} onClick={() => openEdit(item)}>
                        <MenuIcon name="edit" />
                      </button>
                      <button className={styles.deleteAction} type="button" aria-label={`Delete ${item.name}`} onClick={() => setModal({ type: 'delete', item })}>
                        <MenuIcon name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleItems.length === 0 && (
                <tr><td className={styles.emptyResult} colSpan="9">No menu items match your search.</td></tr>
              )}
            </tbody>
          </table>

          <footer className={styles.tableFooter}>
            <span>
              {filteredItems.length === 0
                ? 'Showing 0 menu items'
                : `Showing ${(currentPage - 1) * pageSize + 1} – ${Math.min(currentPage * pageSize, filteredItems.length)} of ${filteredItems.length} menu items`}
            </span>
            <nav className={styles.pagination} aria-label="Menu item pages">
              <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                <MenuIcon name="previous" />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
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
                <MenuIcon name="next" />
              </button>
            </nav>
          </footer>
        </div>
      </section>

      {modal.type !== null && (
        <MenuItemModal
          modal={modal}
          draft={draft}
          setDraft={setDraft}
          onClose={closeModal}
          onSave={saveItem}
          onDelete={deleteItem}
          onImageUpload={uploadImage}
          imageError={imageError}
          formError={formError}
          onFormChange={() => setFormError('')}
          isReadingImage={isReadingImage}
        />
      )}
    </main>
  )
}

export default AdminMenu
