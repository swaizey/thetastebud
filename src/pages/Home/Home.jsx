import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import agoyinSpecial from '../../assets/agoyinspecial.png'
import catererImage from '../../assets/caterer.png'
import cateringChef from '../../assets/dishes-optimized.jpg'
import cocktailDrinks from '../../assets/cocktailsp.png'
import customerOne from '../../assets/customer.png'
import customerTwo from '../../assets/customer2.png'
import ewaAgoyin from '../../assets/ewa agoyin.png'
import fastShippingIcon from '../../assets/fast-shipping.png'
import grilledBeef from '../../assets/grilledbeef.png'
import heroVideo from '../../assets/home-hero.mp4'
import plainPasta from '../../assets/plainpasta.png'
import customerThree from '../../assets/story-ken.jpg'

const menuCategories = [
  { name: 'Local Favorites', description: 'Traditional & hearty', image: agoyinSpecial },
  { name: 'Swallows', description: 'Soft & satisfying', image: ewaAgoyin },
  { name: 'Pasta', description: 'Comfort in every bite', image: plainPasta },
  { name: 'Grills', description: 'Perfectly spiced', image: grilledBeef },
  { name: 'Snacks & Drinks', description: 'Tasty & refreshing', image: cocktailDrinks },
]

const cateringEvents = [
  'Weddings & Engagements',
  'Birthdays & Parties',
  'Corporate Events',
  'Private Functions',
  'And more...',
]

const testimonials = [
  {
    quote: 'The food was delicious, and everyone at the table wanted seconds. We will be back!',
    customer: 'Food lover',
    image: customerOne,
  },
  {
    quote: 'Delivery arrived right on time, and every bite was as good as the last.',
    customer: 'Delivery customer',
    image: customerTwo,
  },
  {
    quote: 'The team made our event feel effortless. The food and service were wonderful.',
    customer: 'Catering client',
    image: customerThree,
  },
]

function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <video
          className={styles.backgroundVideo}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Catering · Food delivery · More</p>
          <h1 id="hero-title">
            Good Food.
            <br />
            <span>Beautiful Moments.</span>
          </h1>
          <p className={styles.description}>
            From delicious meals to unforgettable celebrations, The Taste Bud by Joy brings you
            the best in taste, quality, and service.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/order">
              Order Food Now <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/catering">
              Book Catering
            </Link>
          </div>
        </div>

        <p className={styles.signature} aria-hidden="true">
          Taste the
          <br />
          Joy!
        </p>
      </section>

      <section className={styles.benefits} aria-label="Why choose The Taste Bud by Joy">
        <ul className={styles.benefitList}>
          <li className={styles.benefitItem}>
            <img className={styles.benefitIcon} src={fastShippingIcon} alt="" aria-hidden="true" />
            <h2>Fast Delivery</h2>
            <p>Hot meals, delivered with care</p>
          </li>
          <li className={styles.benefitItem}>
            <svg className={styles.benefitIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 18h18M5 18a7 7 0 0 1 14 0" />
              <path d="M12 11V8" />
              <circle cx="12" cy="6" r="1.5" />
            </svg>
            <h2>Premium Catering</h2>
            <p>For all occasions</p>
          </li>
          <li className={styles.benefitItem}>
            <svg className={styles.benefitIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 3 8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
              <path d="m8.5 11.5 2.3 2.3 4.7-5" />
            </svg>
            <h2>Quality Assured</h2>
            <p>Fresh &amp; healthy meals</p>
          </li>
          <li className={styles.benefitItem}>
            <svg className={styles.benefitIcon} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 14s1.3 3 4 3 4-3 4-3" />
              <path d="M8.5 9.5h.01M15.5 9.5h.01" />
            </svg>
            <h2>Customer Focused</h2>
            <p>Your satisfaction, our joy</p>
          </li>
        </ul>
      </section>

      <section className={styles.menuSection} aria-labelledby="menu-title">
        <div className={styles.menuIntro}>
          <p className={styles.sectionLabel}>Our Menu</p>
          <h2 id="menu-title">A Delightful Selection</h2>
          <p>
            From local favourites to tasty treats, explore our delicious menu made with love.
          </p>
          <Link className={styles.menuAction} to="/menu">
            View Full Menu <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.menuCards}>
          {menuCategories.map(({ name, description, image }) => (
            <Link
              className={styles.menuCard}
              key={name}
              to="/menu"
              aria-label={`${name}: ${description}`}
            >
              <img className={styles.menuCardImage} src={image} alt="" loading="lazy" />
              <span className={styles.menuCardText}>
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cateringSection} aria-labelledby="catering-title">
        <img
          className={styles.cateringImage}
          src={cateringChef}
          alt="A Taste Bud by Joy chef presenting a covered dish"
          loading="lazy"
        />
        <div className={styles.cateringContent}>
          <div className={styles.cateringCopy}>
            <p className={styles.cateringLabel}>Catering Services</p>
            <h2 id="catering-title">
              Make Your Event
              <br />
              <span>Extra Special</span>
            </h2>
            <p>
              From weddings to birthdays, corporate events and private gatherings, we cater to
              your needs with style and excellence.
            </p>
            <Link className={styles.cateringAction} to="/catering">
              Book Catering Now <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={styles.cateringEvents}>
            {cateringEvents.map((event) => (
              <li key={event}>
                <span aria-hidden="true">✓</span>
                {event}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.aboutSection} aria-labelledby="about-title">
        <div className={styles.aboutCopy}>
          <p className={styles.sectionLabel}>About Us</p>
          <h2 id="about-title">The Taste Bud by Joy</h2>
          <p>
            We are passionate about great food and exceptional service. Our mission is to bring
            you delicious meals, whether at your table or at your event.
          </p>
          <Link className={styles.menuAction} to="/about">
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.aboutVisual}>
          <img
            className={styles.aboutImage}
            src={catererImage}
            alt="A Taste Bud by Joy chef presenting a covered dish"
            loading="lazy"
          />
        </div>

        <ul className={styles.aboutHighlights} aria-label="Our values">
          <li className={styles.aboutHighlight}>
            <span className={styles.aboutIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12a4 4 0 1 1 2.5-7.1 4.5 4.5 0 0 1 8.2 1.3 3.5 3.5 0 0 1 2.3 6.6V20H5z" />
                <path d="M9 20v-4h6v4" />
              </svg>
            </span>
            <span>Expert Chefs</span>
          </li>
          <li className={styles.aboutHighlight}>
            <span className={styles.aboutIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 3 9 9-9 9-9-9z" />
                <path d="m8 12 4-5 4 5-4 5z" />
              </svg>
            </span>
            <span>Premium Quality</span>
          </li>
          <li className={styles.aboutHighlight}>
            <span className={styles.aboutIcon}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />
              </svg>
            </span>
            <span>Always With You</span>
          </li>
        </ul>
      </section>

      <section className={styles.reviewsSection} aria-labelledby="reviews-title">
        <div className={styles.reviewsInner}>
          <div className={styles.reviewsIntro}>
            <p>What our clients say</p>
            <h2 id="reviews-title">Happy Customers</h2>
          </div>
          <div className={styles.reviewList}>
            {testimonials.map(({ quote, customer, image }) => (
              <article className={styles.reviewCard} key={customer}>
                <p className={styles.reviewStars} aria-label="5 out of 5 stars">
                  ★★★★★
                </p>
                <blockquote>{quote}</blockquote>
                <div className={styles.reviewCustomer}>
                  <img src={image} alt="" loading="lazy" />
                  <p>{customer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
