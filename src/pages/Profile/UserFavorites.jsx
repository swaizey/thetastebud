import { Link } from 'react-router-dom'
import { menuProducts } from '../../data/menuProducts.js'
import { useFavorites } from '../../hooks/useFavorites.js'
import ProfilePageShell from './ProfilePageShell.jsx'
import styles from './UserFavorites.module.css'
import profileStyles from './Profile.module.css'

function UserFavorites() {
  const { favorites, removeFavorite } = useFavorites()
  const favoriteProducts = menuProducts.filter((product) => favorites.includes(product.id))

  return (
    <ProfilePageShell
      active="favorites"
      title="Favorites"
      description="Your favorite meals, ready whenever you are."
    >
      <section className={profileStyles.informationCard} aria-labelledby="favorites-title">
        <div className={profileStyles.sectionHeading}>
          <h2 id="favorites-title">My Favorites</h2>
          <Link className={profileStyles.viewAllButton} to="/menu">Browse Menu <span aria-hidden="true">→</span></Link>
        </div>
        {favoriteProducts.length > 0 ? (
          <div className={styles.favoriteGrid}>
            {favoriteProducts.map((product) => (
              <article className={styles.favoriteCard} key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className={styles.favoriteDetails}>
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className={styles.favoriteActions}>
                    <strong>₦{product.price.toLocaleString('en-NG')}</strong>
                    <button
                      type="button"
                      aria-label={`Remove ${product.name} from favorites`}
                      onClick={() => removeFavorite(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No favorite meals yet</h3>
            <p>Save dishes from the menu and they’ll show up here.</p>
            <Link to="/menu">Explore the menu</Link>
          </div>
        )}
      </section>
    </ProfilePageShell>
  )
}

export default UserFavorites
