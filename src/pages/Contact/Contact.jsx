import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createConversation } from '../../utils/messageStorage.js'
import styles from './Contact.module.css'
import caterer from '../../assets/caterer.png'
import buffet from '../../assets/dishes-optimized.jpg'

const contactDetails = [
  {
    label: 'Phone',
    value: '+234 801 234 5678',
    href: 'tel:+2348012345678',
    icon: 'phone',
  },
  {
    label: 'Email',
    value: 'hello@thetastebud.ng',
    href: 'mailto:hello@thetastebud.ng',
    icon: 'mail',
  },
  {
    label: 'Our Location',
    value: '123 Foodie Lane, Lagos, NG',
    href: 'https://www.google.com/maps/search/?api=1&query=123+Foodie+Lane+Lagos+Nigeria',
    icon: 'pin',
  },
  {
    label: 'Business Hours',
    value: 'Mon – Sun: 8AM – 10PM',
    icon: 'clock',
  },
]

const faqs = [
  {
    question: 'Do you offer delivery services?',
    answer: 'Yes, we deliver freshly prepared meals. Contact us to confirm delivery availability for your area.',
  },
  {
    question: 'Can I customise a menu for my event?',
    answer: 'Absolutely. We can work with you to plan a menu that suits your event, guests and preferences.',
  },
  {
    question: 'What is your delivery area?',
    answer: 'Our delivery coverage depends on your location. Get in touch with your address and we will confirm.',
  },
  {
    question: 'How do I place an order?',
    answer: 'Browse our menu and contact us with your selections, or use the Order Now link to get started.',
  },
]

function ContactIcon({ name }) {
  const paths = {
    phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a14 14 0 0 1-6-6l3-2z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return (
    <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Contact() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const subject = String(formData.get('subject') || '')
    const message = String(formData.get('message') || '').trim()

    if (name.length < 2 || message.length < 5) {
      setSubmitError('Enter your name and a message of at least 5 characters.')
      return
    }

    try {
      const conversation = createConversation({ name, email, subject, message })
      navigate(`/messages/${conversation.id}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? 'Your message could not be saved. Please try again.' : 'An unexpected error occurred.')
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <img className={styles.heroBackground} src={buffet} alt="" fetchPriority="high" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Get in touch</p>
          <h1 id="contact-title">Contact Us</h1>
          <p>We’d love to hear from you. Reach out to us for inquiries, orders, or any support you need.</p>
          <svg className={styles.heroFlourish} viewBox="0 0 150 26" aria-hidden="true">
            <path d="M4 20c22-19 41-18 29-8-7 6-14 3-9-2 8-8 35-8 60-7 26 1 42 0 54-3" />
          </svg>
        </div>
        <img
          className={styles.heroCaterer}
          src={caterer}
          alt="A Taste Bud by Joy chef ready to serve a meal"
        />
        <span className={styles.heroCircle} aria-hidden="true" />
      </section>

      <section className={styles.contactDetails} aria-label="Contact information">
        {contactDetails.map(({ label, value, href, icon }) => (
          <article className={styles.contactDetail} key={label}>
            <span className={styles.iconCircle}>
              <ContactIcon name={icon} />
            </span>
            <div>
              <h2>{label}</h2>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith('https:') ? '_blank' : undefined}
                  rel={href.startsWith('https:') ? 'noreferrer' : undefined}
                >
                  {value}
                </a>
              ) : (
                <p>{value}</p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.contactMain} aria-label="Send us a message or visit">
        <div className={styles.formCard}>
          <p className={styles.sectionEyebrow}>Send us a message</p>
          <h2>Drop Us a Message</h2>
          <p className={styles.formIntro}>
            Have a question, special request, or feedback? Fill out the form below to start a
            conversation with our support team.
          </p>
          <form className={styles.contactForm} onSubmit={handleSubmit} onChange={() => setSubmitError('')}>
            <label>
              <span className={styles.srOnly}>Your name</span>
              <input name="name" type="text" placeholder="Your Name *" autoComplete="name" minLength={2} maxLength={100} required />
            </label>
            <label>
              <span className={styles.srOnly}>Your email</span>
              <input name="email" type="email" placeholder="Your Email *" autoComplete="email" maxLength={254} required />
            </label>
            <label className={styles.subjectField}>
              <span className={styles.srOnly}>Subject</span>
              <select name="subject" defaultValue="" required>
                <option value="" disabled>Choose a subject</option>
                <option value="Food order">Food order</option>
                <option value="Catering enquiry">Catering enquiry</option>
                <option value="Delivery question">Delivery question</option>
                <option value="General enquiry">General enquiry</option>
              </select>
            </label>
            <label className={styles.messageField}>
              <span className={styles.srOnly}>Your message</span>
              <textarea name="message" placeholder="Your Message *" rows="4" minLength={5} maxLength={2000} required />
            </label>
            {submitError && <p className={styles.formError} role="alert">{submitError}</p>}
            <button type="submit">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
              Send Message <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <div className={styles.locationColumn}>
          <img className={styles.locationFood} src={buffet} alt="A selection of freshly prepared catering dishes" loading="lazy" />
          <div className={styles.locationCard}>
            <div className={styles.locationCopy}>
              <ContactIcon name="pin" />
              <div>
                <h2>Visit Our Location</h2>
                <p>123 Foodie Lane,<br />Lagos, Nigeria</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Foodie+Lane+Lagos+Nigeria"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className={styles.mapIllustration} aria-label="Illustrated map of Lagos">
              <span className={styles.mapRoadOne} />
              <span className={styles.mapRoadTwo} />
              <span className={styles.mapRoadThree} />
              <span className={styles.mapWater} />
              <span className={styles.mapPin}>
                <ContactIcon name="pin" />
              </span>
              <span className={styles.mapLabel}>Lagos</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title">
        <div className={styles.faqIntro}>
          <p className={styles.sectionEyebrow}>Frequently asked questions</p>
          <h2 id="faq-title">Quick Answers</h2>
          <p>Find answers to common questions about our services.</p>
          <Link to="/delivery">View All FAQs <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.faqList}>
          {faqs.map(({ question, answer }) => (
            <details className={styles.faqItem} key={question}>
              <summary>{question}<span aria-hidden="true">+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.cloche} aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path d="M7 34h34M10 34a14 14 0 0 1 28 0M24 18v-5" />
            <circle cx="24" cy="10" r="3" />
            <path d="M5 39h38" />
          </svg>
        </div>
        <div>
          <h2 id="final-cta-title">Let’s Make Your Event Memorable</h2>
          <p>Contact us today and let’s create something special together.</p>
        </div>
        <a href="mailto:hello@thetastebud.ng">
          Contact Us <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
}

export default Contact
