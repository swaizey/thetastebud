import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Gallery.module.css'
import heroImage from '../../assets/partyjollof.png'
import chicken from '../../assets/chickenbrest.png'
import pasta from '../../assets/pasta2.png'
import pastaSpecial from '../../assets/pastaspecial.png'
import buffet from '../../assets/dishes-optimized.jpg'
import delivery from '../../assets/orderhero.png'
import founder from '../../assets/ceo.png'
import grilledFish from '../../assets/grilled fish.png'
import agoyin from '../../assets/ewa agoyin.png'
import celebration from '../../assets/file_0000000096f082108a1289cb40a42f9e.png'

const categories = [
  'All',
  'Our Meals',
  'Catering',
  'Delivery',
  'Happy Customers',
  'Special Moments',
]

const photos = [
  {
    title: 'Grilled Chicken Platter',
    category: 'Our Meals',
    image: chicken,
    alt: 'Grilled chicken served with rice and fresh vegetables',
  },
  {
    title: 'Pasta Special',
    category: 'Our Meals',
    image: pastaSpecial,
    alt: 'A plate of pasta with grilled meat',
  },
  {
    title: 'Fresh Pasta Bowl',
    category: 'Our Meals',
    image: pasta,
    alt: 'A bowl of pasta with vegetables',
  },
  {
    title: 'A Taste Bud Buffet',
    category: 'Catering',
    image: buffet,
    alt: 'A beautifully arranged buffet with hot dishes',
  },
  {
    title: 'Ready for Delivery',
    category: 'Delivery',
    image: delivery,
    alt: 'A Taste Bud by Joy branded takeaway bag',
  },
  {
    title: 'Joy at the Table',
    category: 'Happy Customers',
    image: founder,
    alt: 'A smiling woman enjoying an elegant dinner setting',
  },
  {
    title: 'Grilled Fish',
    category: 'Our Meals',
    image: grilledFish,
    alt: 'Whole grilled fish served with plantain',
  },
  {
    title: 'Ewa Agoyin',
    category: 'Our Meals',
    image: agoyin,
    alt: 'A serving of Ewa Agoyin with plantain',
  },
  {
    title: 'A Special Table',
    category: 'Special Moments',
    image: celebration,
    alt: 'A formal table setting with flowers and place settings',
  },
]

function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const visiblePhotos =
    activeCategory === 'All'
      ? photos
      : photos.filter((photo) => photo.category === activeCategory)

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="gallery-title">
        <img className={styles.heroImage} src={heroImage} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Our Gallery</p>
          <h1 id="gallery-title">
            A Taste of
            <br />
            <span>Our World</span>
          </h1>
          <p>Explore our delicious meals, beautiful presentations and happy customers.</p>
        </div>
        <span className={styles.heroWave} aria-hidden="true" />
      </section>

      <section className={styles.gallerySection} aria-label="Photo gallery">
        <nav className={styles.categoryBar} aria-label="Filter gallery photos">
          {categories.map((category) => (
            <button
              className={`${styles.categoryButton} ${activeCategory === category ? styles.categoryActive : ''}`}
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className={styles.photoGrid} aria-live="polite">
          {visiblePhotos.map(({ title, image, alt }) => (
            <figure className={styles.photoCard} key={title}>
              <img src={image} alt={alt} loading="lazy" />
              <figcaption>{title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="gallery-cta-title">
        <span className={styles.ctaIcon} aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path d="M5 34h38M9 34a15 15 0 0 1 30 0M24 19v-6" />
            <circle cx="24" cy="10" r="3" />
            <path d="M4 40h40" />
          </svg>
        </span>
        <div className={styles.ctaCopy}>
          <h2 id="gallery-cta-title">Craving Something Delicious?</h2>
          <p>Order now and let The Taste Bud bring the goodness to you!</p>
        </div>
        <Link to="/order">
          Order for Delivery <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}

export default Gallery
