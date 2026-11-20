import { Link } from 'react-router-dom'
import styles from './About.module.css'
import founder from '../../assets/ceo.png'
import storyImage from '../../assets/file_0000000096f082108a1289cb40a42f9e.png'
import cateringBuffet from '../../assets/dishes-optimized.jpg'
import caterer from '../../assets/caterer.png'


const values = [
  {
    title: 'Our Mission',
    description: 'To deliver delicious meals with excellence.',
    icon: 'mission',
  },
  {
    title: 'Our Vision',
    description: 'To be the number one catering brand for every occasion.',
    icon: 'vision',
  },
  {
    title: 'Our Values',
    description: 'Quality, Integrity, Creativity and Customer Satisfaction.',
    icon: 'values',
  },
  {
    title: 'Our Promise',
    description: 'Great taste, warm service and unforgettable moments.',
    icon: 'promise',
  },
]

function ValueIcon({ name }) {
  const paths = {
    mission: <><path d="M12 3 4 7v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V7z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    vision: <><path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6z" /><circle cx="12" cy="12" r="2.5" /></>,
    values: <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2z" />,
    promise: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9z" /></>,
  }

  return (
    <svg className={styles.valueIcon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function About() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <img className={styles.heroImage} src={founder} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>About Us</p>
          <h1 id="about-title">
            The Taste Bud
            <br />
            <span>By Joy</span>
          </h1>
          <p>Good Food. Beautiful Moments.</p>
        </div>
      </section>

      <section className={styles.storySection} aria-labelledby="story-title">
        <article className={styles.storyCopy}>
          <p className={styles.sectionEyebrow}>Our Story</p>
          <h2 id="story-title">A Passion for Great Food</h2>
          <p>
            The Taste Bud By Joy was born out of a simple passion—to create delicious meals that
            bring people together. What started as a love for cooking has grown into a trusted
            catering brand, known for its exceptional taste, quality service, and attention to
            detail.
          </p>
          <p>
            From intimate gatherings to grand events, we bring you special moments to life with
            food that delights and service that exceeds expectations.
          </p>
          <Link className={styles.primaryAction} to="/menu">
            Our Menu <span aria-hidden="true">→</span>
          </Link>
        </article>

        <img
          className={styles.storyImage}
          src={storyImage}
          alt="An elegant table setting with fresh flowers and dinnerware"
          loading="lazy"
        />

        <article className={styles.founderCopy}>
          <p className={styles.sectionEyebrow}>Our CEO</p>
          <h2>Joy</h2>
          <h3>Our Founder &amp; CEO</h3>
          <p>
            I’m Joy, the founder and CEO of The Taste Bud By Joy. Food has always been my language
            of love, and through this brand, I get to share that love with you.
          </p>
          <p>
            Our goal is to make every meal a memorable experience—whether it’s a small family
            dinner, a corporate event, or a special celebration.
          </p>
          <p>
            Thank you for being part of our journey. Let’s continue to celebrate life, one
            delicious meal at a time.
          </p>
          <span className={styles.signature} aria-label="Joy">Joy</span>
        </article>
      </section>

      <section className={styles.values} aria-label="Our values">
        {values.map(({ title, description, icon }) => (
          <article className={styles.valueCard} key={title}>
            <span className={styles.valueIconWrap}>
              <ValueIcon name={icon} />
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className={styles.cta} aria-labelledby="about-cta-title">
        <img className={styles.ctaImage} src={cateringBuffet} alt="" loading="lazy" />
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaCopy}>
          <p className={styles.ctaEyebrow}>Food made with love</p>
          <h2 id="about-cta-title">
            Let’s Create <span>Something Special</span> Together
          </h2>
          <p>Book our catering service today and experience The Taste Bud By Joy difference.</p>
          <Link to="/catering">
            Book a Catering Service <span aria-hidden="true">→</span>
          </Link>
        </div>
        <img className={styles.ctaCaterer} src={caterer} alt="" loading="lazy" />
      </section>
    </main>
  )
}

export default About
