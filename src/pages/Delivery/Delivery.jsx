import { Link } from 'react-router-dom'
import styles from './Delivery.module.css'
import heroImage from '../../assets/orderhero.png'
import mealImage from '../../assets/dishes-optimized.jpg'
import agoyinSpecial from '../../assets/agoyinspecial.png'
import pastaSpecial from '../../assets/pasta2.png'
import grilledChicken from '../../assets/chickenbrest.png'
import grilledFish from '../../assets/grilled fish.png'
import deliveryIcon from '../../assets/fast-shipping.png'

const benefits = [
  { title: <>Fresh &amp; Hot<br />Meals</>, icon: 'cloche' },
  { title: <>Fast &amp; Reliable<br />Delivery</>, icon: 'delivery' },
  { title: <>Safe &amp; Hygienic<br />Packaging</>, icon: 'shield' },
  { title: <>Customer Satisfaction<br />Guaranteed</>, icon: 'smile' },
]

const steps = [
  {
    title: 'Place Your Order',
    description: 'Browse our menu and place your order online or by phone.',
    icon: 'order',
  },
  {
    title: 'We Prepare It',
    description: 'Our chefs prepare your meal with love and care.',
    icon: 'chef',
  },
  {
    title: 'We Deliver',
    description: 'Sit back and relax while we bring your meal to you.',
    icon: 'delivery',
  },
]

const highlights = [
  { title: 'Agoyin Special', image: agoyinSpecial },
  { title: 'Pasta Special', image: pastaSpecial },
  { title: 'Grilled Chicken', image: grilledChicken },
  { title: 'Grilled Fish', image: grilledFish },
]

function DeliveryIcon({ name }) {
  const paths = {
    cloche: <><path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V7" /><circle cx="12" cy="5" r="2" /><path d="M4 20h16" /></>,
    delivery: <><circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" /><path d="M8.5 17H14l2-6h3l2 4M3 17h.5M9 8h4l2 4h3M9 8l-2 4h6" /></>,
    shield: <><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
    order: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 6h6M10 10v5M12 10v5M14 10v5M12 15v2" /></>,
    chef: <><path d="M6 11a4 4 0 1 1 1-7.9A5 5 0 0 1 16 4a3.5 3.5 0 0 1 2 6.6V14H6z" /><path d="M9 14v6h6v-6M9 17h6" /></>,
  }

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Delivery() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="delivery-title">
        <img className={styles.heroImage} src={heroImage} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Delivery Service</p>
          <h1 id="delivery-title">
            Delicious Meals,
            <br />
            <span>Right to Your Door</span>
          </h1>
          <p>Enjoy the signature taste of The Taste Bud, delivered fresh, hot and on time.</p>
          <Link className={styles.heroAction} to="/order">
            Order for Delivery <span aria-hidden="true">→</span>
          </Link>
        </div>
        <span className={styles.heroAccent} aria-hidden="true" />
      </section>

      <section className={styles.benefits} aria-label="Our delivery promise">
        {benefits.map(({ title, icon }) => (
          <article className={styles.benefit} key={icon}>
            <DeliveryIcon name={icon} />
            <h2>{title}</h2>
          </article>
        ))}
      </section>

      <section className={styles.stepsSection} aria-labelledby="steps-title">
        <div className={styles.stepsIntro}>
          <p className={styles.sectionEyebrow}>How it works</p>
          <h2 id="steps-title">Get Your Meal in 3 Easy Steps</h2>
          <p>
            Ordering from The Taste Bud is simple and hassle-free. Follow these easy steps to
            enjoy your delicious meals.
          </p>
          <Link className={styles.smallAction} to="/order">
            Order Now <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.steps}>
          {steps.map(({ title, description, icon }, index) => (
            <article className={styles.step} key={title}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <DeliveryIcon name={icon} />
              <h3>{title}</h3>
              <p>{description}</p>
              {index < steps.length - 1 && <span className={styles.stepArrow} aria-hidden="true">➜</span>}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.menuSection} aria-labelledby="highlights-title">
        <img
          className={styles.featuredMeal}
          src={mealImage}
          alt="A buffet of freshly prepared meals"
          loading="lazy"
        />
        <div className={styles.menuHighlights}>
          <div className={styles.menuHeading}>
            <div>
              <p className={styles.sectionEyebrow}>Made fresh for you</p>
              <h2 id="highlights-title">Our Delivery Menu Highlights</h2>
              <p>From our kitchen to your doorstep — full of flavour!</p>
            </div>
            <span aria-hidden="true" />
          </div>
          <div className={styles.highlightGrid}>
            {highlights.map(({ title, image }) => (
              <Link className={styles.highlight} to="/menu" key={title}>
                <img src={image} alt="" loading="lazy" />
                <span>{title}</span>
              </Link>
            ))}
          </div>
          <Link className={styles.smallAction} to="/menu">
            View Full Menu <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className={styles.coverage} id="coverage" aria-labelledby="coverage-title">
        <div className={styles.coverageCopy}>
          <svg className={styles.pinIcon} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <div>
            <h2 id="coverage-title">Our Delivery Coverage</h2>
            <p>We deliver across Lagos and surrounding areas.</p>
            <a href="mailto:hello@thetastebud.ng?subject=Delivery%20coverage">
              Check Your Area <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className={styles.mapIllustration} aria-hidden="true">
          <span className={styles.mapRoadOne} />
          <span className={styles.mapRoadTwo} />
          <span className={styles.mapRoadThree} />
          <span className={styles.mapRoute} />
          <span className={styles.mapPin}>
            <svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
          </span>
        </div>
        <img className={styles.mapDelivery} src={deliveryIcon} alt="" loading="lazy" />
      </section>

      <section className={styles.finalCta} aria-labelledby="delivery-cta-title">
        <span className={styles.ctaCloche}><DeliveryIcon name="cloche" /></span>
        <div>
          <h2 id="delivery-cta-title">Craving Something Delicious?</h2>
          <p>Order now and let The Taste Bud bring the goodness to you!</p>
        </div>
        <Link to="/order">
          Order for Delivery <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}

export default Delivery
