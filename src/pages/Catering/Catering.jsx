import { Link } from 'react-router-dom'
import styles from './catering.module.css'
import buffet from '../../assets/dishes-optimized.jpg'
import celebrationTable from '../../assets/ceo.png'
import eventGuest from '../../assets/file_0000000096f082108a1289cb40a42f9e.png'
import grilledChicken from '../../assets/chickenbrest.png'
import grilledPork from '../../assets/grilledpork.png'
import cateredMeal from '../../assets/grilled fish.png'

const services = [
  { title: 'Delicious Menu', description: 'Irresistible flavours', icon: 'chef' },
  { title: 'Professional Service', description: 'Elegant & reliable', icon: 'people' },
  { title: 'On-Time Delivery', description: 'Always on schedule', icon: 'cloche' },
  { title: 'Customized Packages', description: 'For every occasion', icon: 'settings' },
]

const packages = [
  {
    name: 'Classic Package',
    description: 'A perfect choice for small gatherings and meetings.',
    image: grilledChicken,
    features: ['Delicious Main Dish', 'Salad & Drinks', 'Professional Service'],
  },
  {
    name: 'Premium Package',
    description: 'For larger events and celebrations.',
    image: grilledPork,
    features: ['Multiple Main Dishes', 'Salad & Drinks', 'Elegant Setup'],
  },
  {
    name: 'Deluxe Package',
    description: 'The ultimate dining experience.',
    image: cateredMeal,
    features: ['Premium Menu Selection', 'Salad & Drinks', 'Full Event Service'],
  },
]

const eventTypes = [
  'Weddings',
  'Birthdays',
  'Corporate Events',
  'Church Events',
  'Family Gatherings',
  'And More...',
]

const galleryImages = [
  { image: buffet, alt: 'A beautifully arranged catering buffet' },
  { image: celebrationTable, alt: 'An elegant celebration table setting' },
  { image: eventGuest, alt: 'A guest enjoying an elegant catered event' },
  { image: cateredMeal, alt: 'A freshly prepared meal served at an event' },
]

function ServiceIcon({ name }) {
  const paths = {
    chef: (
      <>
        <path d="M6 11a4 4 0 1 1 1-7.9A5 5 0 0 1 16 4a3.5 3.5 0 0 1 2 6.6V14H6z" />
        <path d="M9 14v6h6v-6M9 17h6" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1zM15 15a5 5 0 0 1 6 4v1h-4" />
      </>
    ),
    cloche: (
      <>
        <path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V7" />
        <circle cx="12" cy="5" r="2" />
        <path d="M4 20h16" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7z" />
      </>
    ),
  }

  return (
    <svg className={styles.serviceIcon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Catering() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="catering-hero-title">
        <img className={styles.heroImage} src={buffet} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <span className={`${styles.heroCircle} ${styles.heroCircleOne}`} aria-hidden="true" />
        <span className={`${styles.heroCircle} ${styles.heroCircleTwo}`} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Catering Services</p>
          <h1 id="catering-hero-title">
            Let Us Cater
            <br />
            <span>Your Special Moments</span>
          </h1>
          <p>
            From intimate gatherings to grand events, we bring delicious meals and warm
            hospitality to your table.
          </p>
          <Link className={styles.heroAction} to="/contact">
            Book a Catering Service <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className={styles.services} aria-label="Our catering services">
        {services.map(({ title, description, icon }) => (
          <article className={styles.service} key={title}>
            <ServiceIcon name={icon} />
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className={styles.packagesSection} aria-labelledby="packages-title">
        <div className={styles.packagesIntro}>
          <p className={styles.sectionEyebrow}>Our Catering Packages</p>
          <h2 id="packages-title">Perfect for Every Occasion</h2>
          <p>
            Choose from our thoughtfully curated packages or let us create a custom menu for your
            event.
          </p>
          <Link className={styles.outlineAction} to="/contact">
            Get a Custom Quote <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.packageGrid}>
          {packages.map(({ name, description, image, features }) => (
            <article className={styles.packageCard} key={name}>
              <img src={image} alt="" loading="lazy" />
              <div className={styles.packageDetails}>
                <h3>{name}</h3>
                <p>{description}</p>
                <ul>
                  {features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  Book Now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.eventsSection} aria-labelledby="events-title">
        <div className={styles.eventsCopy}>
          <p className={styles.sectionEyebrow}>Made for gathering</p>
          <h2 id="events-title">Events We Cater For</h2>
          <p>Make your event memorable with our exquisite catering services.</p>
          <ul>
            {eventTypes.map((event) => (
              <li key={event}>
                <span aria-hidden="true">✓</span>
                {event}
              </li>
            ))}
          </ul>
          <Link className={styles.heroAction} to="/contact">
            Enquire Now <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.eventImages} aria-label="Catering event photos">
          <img src={celebrationTable} alt="Flowers and place settings at a formal event" loading="lazy" />
          <img src={eventGuest} alt="A guest at a celebration dinner" loading="lazy" />
          <img src={buffet} alt="A buffet prepared for a special event" loading="lazy" />
        </div>
      </section>

      <section className={styles.gallerySection} aria-labelledby="gallery-title">
        <div className={styles.galleryIntro}>
          <p className={styles.sectionEyebrow}>A taste of the experience</p>
          <h2 id="gallery-title">Our Catering in Action</h2>
          <p>See how we make every event special.</p>
          <Link className={styles.outlineAction} to="/gallery">
            View Gallery <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className={styles.galleryImages}>
          {galleryImages.map(({ image, alt }) => (
            <img key={alt} src={image} alt={alt} loading="lazy" />
          ))}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.clocheMark} aria-hidden="true">
          <ServiceIcon name="cloche" />
        </div>
        <div>
          <h2 id="final-cta-title">Ready to Plan Your Event?</h2>
          <p>Let’s create an unforgettable dining experience together.</p>
        </div>
        <Link to="/contact">
          Book a Catering Service <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}

export default Catering