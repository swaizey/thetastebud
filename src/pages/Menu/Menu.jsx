import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Menu.module.css'
import { readCart, saveCart } from '../../utils/orderStorage'
import { useFavorites } from '../../hooks/useFavorites.js'
import heroDish from '../../assets/partyjollof.png'
import { menuProducts as products } from '../../data/menuProducts'

const categories = [
  'All Items',
  'Local Favorites',
  'Swallows',
  'Pasta',
  'Grills',
  'Snacks & Drinks',
]

function CategoryIcon({ category }) {
  const paths = {
    'All Items': <><path d="M5 3v5M8 3v5M11 3v5M8 8v13M17 3c-2 2-2 5 0 7v11" /></>,
    'Local Favorites': <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />,
    Swallows: <><path d="M3 13h18l-2 6H5z" /><path d="M5 10c1.5-3 3.8-4 7-4s5.5 1 7 4" /></>,
    Pasta: <><path d="M4 5c4 0 4 14 8 14S16 5 20 5" /><path d="M4 9c4 0 4 10 8 10s4-10 8-10" /></>,
    Grills: <><path d="M5 14h14l-2 6H7z" /><path d="M7 11c-2-2 2-3 0-5M12 11c-2-2 2-3 0-5M17 11c-2-2 2-3 0-5" /></>,
    'Snacks & Drinks': <><path d="M5 8h14l-1 13H6z" /><path d="M8 8V5a4 4 0 0 1 8 0v3M9 13h6" /></>,
  }

  return (
    <svg className={styles.categoryIcon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[category]}
    </svg>
  )
}

function Menu() {
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [search, setSearch] = useState('')
  const { favorites, toggleFavorite } = useFavorites()
  const [cart, setCart] = useState(() =>
    Object.fromEntries(readCart().map(({ id, quantity }) => [id, quantity])),
  )

  useEffect(() => {
    const cartItems = products
      .filter((product) => cart[product.id] > 0)
      .map((product) => ({ ...product, quantity: cart[product.id] }))
    saveCart(cartItems)
  }, [cart])

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'All Items' || product.category === activeCategory
    const query = search.trim().toLowerCase()
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  const addToCart = (productId) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 }))
  }

  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0)

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="menu-hero-title">
        <img className={styles.heroImage} src={heroDish} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Fresh from our kitchen</p>
          <h1 id="menu-hero-title">
            Our
            <br />
            <span>Menu</span>
          </h1>
          <p>Delicious meals, perfectly prepared for every occasion.</p>
        </div>
        <span className={`${styles.heroCircle} ${styles.heroCircleOne}`} aria-hidden="true" />
        <span className={`${styles.heroCircle} ${styles.heroCircleTwo}`} aria-hidden="true" />
      </section>

      <div className={styles.content}>
        <nav className={styles.categoryBar} aria-label="Filter menu by category">
          {categories.map((category) => (
            <button
              className={`${styles.categoryButton} ${activeCategory === category ? styles.categoryActive : ''}`}
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              <CategoryIcon category={category} />
              <span>{category}</span>
            </button>
          ))}
        </nav>

        <section className={styles.menuSection} aria-labelledby="menu-section-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Our delicious menu</p>
              <h2 id="menu-section-title">Taste the Goodness</h2>
            </div>
            <label className={styles.searchBox}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <span className={styles.srOnly}>Search for a dish</span>
              <input
                type="search"
                placeholder="Search for a dish..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {cartCount > 0 && (
            <p className={styles.cartStatus} role="status" aria-live="polite">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} added to your order
            </p>
          )}

          {visibleProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => {
                const isFavorite = favorites.includes(product.id)
                const quantityInCart = cart[product.id] || 0

                return (
                  <article className={styles.productCard} key={product.id}>
                    <div className={styles.productImageWrap}>
                      <img
                        className={styles.productImage}
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                      <button
                        className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
                        type="button"
                        aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.name} ${isFavorite ? 'from' : 'to'} favorites`}
                        aria-pressed={isFavorite}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />
                        </svg>
                      </button>
                    </div>
                    <div className={styles.productDetails}>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className={styles.productFooter}>
                        <strong>₦{product.price.toLocaleString('en-NG')}</strong>
                        <button
                          className={styles.addButton}
                          type="button"
                          aria-label={`Add ${product.name} to cart`}
                          onClick={() => addToCart(product.id)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" />
                            <circle cx="10" cy="21" r="1" />
                            <circle cx="18" cy="21" r="1" />
                          </svg>
                          {quantityInCart > 0 ? `Added (${quantityInCart})` : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className={styles.emptyState}>No dishes found. Try another search or category.</p>
          )}
        </section>

        <section className={styles.orderBanner} aria-labelledby="order-banner-title">
          <div>
            <h2 id="order-banner-title">Craving Something Special?</h2>
            <p>Order now and enjoy delicious meals at your convenience.</p>
            <Link to="/order">Order Now <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Menu
