import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfilePageShell from '../Profile/ProfilePageShell.jsx'
import styles from './MessagePages.module.css'
import { MESSAGE_CHANGE_EVENT, readConversations, readUserConversations } from '../../utils/messageStorage.js'

function formatUpdatedAt(date) {
  return new Date(date).toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function Inbox({ isAdmin = false }) {
  const [conversations, setConversations] = useState(() =>
    isAdmin ? readConversations() : readUserConversations(),
  )

  useEffect(() => {
    const refreshConversations = () => {
      setConversations(isAdmin ? readConversations() : readUserConversations())
    }

    window.addEventListener(MESSAGE_CHANGE_EVENT, refreshConversations)
    window.addEventListener('storage', refreshConversations)
    return () => {
      window.removeEventListener(MESSAGE_CHANGE_EVENT, refreshConversations)
      window.removeEventListener('storage', refreshConversations)
    }
  }, [isAdmin])

  const sortedConversations = [...conversations].sort(
    (first, second) => new Date(second.updatedAt) - new Date(first.updatedAt),
  )

  const inboxContent = (
    <section className={styles.inboxPanel} aria-labelledby="inbox-title">
      <header className={styles.panelHeading}>
        <div>
          <p>{isAdmin ? 'Customer support' : 'Your conversations'}</p>
          <h2 id="inbox-title">{isAdmin ? 'Message Inbox' : 'Inbox'}</h2>
        </div>
        <span>{sortedConversations.length} {sortedConversations.length === 1 ? 'conversation' : 'conversations'}</span>
      </header>

      {sortedConversations.length > 0 ? (
        <div className={styles.conversationList}>
          {sortedConversations.map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1]
            const to = isAdmin
              ? `/admin/messages/${conversation.id}`
              : `/messages/${conversation.id}`

            return (
              <Link className={styles.conversationItem} key={conversation.id} to={to}>
                <span className={styles.conversationAvatar} aria-hidden="true">
                  {(isAdmin ? conversation.name : 'TB').slice(0, 1).toUpperCase()}
                </span>
                <span className={styles.conversationCopy}>
                  <span className={styles.conversationTopline}>
                    <strong>{conversation.subject}</strong>
                    <time dateTime={conversation.updatedAt}>{formatUpdatedAt(conversation.updatedAt)}</time>
                  </span>
                  <span className={styles.conversationSubline}>
                    {isAdmin ? `${conversation.name} · ${conversation.email}` : 'The Taste Bud Support'}
                  </span>
                  <span className={styles.conversationPreview}>
                    {lastMessage?.text || (lastMessage?.attachment?.kind === 'image' ? 'Photo' : lastMessage?.attachment ? 'Video' : '')}
                  </span>
                </span>
                <span className={styles.conversationArrow} aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyInbox}>
          <span className={styles.emptyInboxIcon} aria-hidden="true">✉</span>
          <h3>No messages yet</h3>
          <p>{isAdmin ? 'Customer enquiries will appear here when they contact you.' : 'Send us a message and your conversation will appear here.'}</p>
          {!isAdmin && <Link to="/contact">Contact us</Link>}
        </div>
      )}
    </section>
  )

  if (isAdmin) {
    return <main className={styles.adminMessagePage}>{inboxContent}</main>
  }

  return (
    <ProfilePageShell
      active="messages"
      title="Inbox"
      description="Continue your conversations with our support team."
    >
      {inboxContent}
    </ProfilePageShell>
  )
}

export default Inbox
