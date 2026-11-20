import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { Link, useParams } from 'react-router-dom'
import ProfilePageShell from '../Profile/ProfilePageShell.jsx'
import styles from './MessagePages.module.css'
import { appendMessage, MESSAGE_CHANGE_EVENT, readConversations } from '../../utils/messageStorage.js'
import { readChatAttachment, saveChatAttachment } from '../../utils/chatAttachmentStorage.js'
import {
  getVideoDuration,
  MAX_IMAGE_SIZE_BYTES,
  MAX_SOURCE_VIDEO_SIZE_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_SIZE_BYTES,
  trimAndCompressVideo,
} from '../../utils/videoProcessing.js'

function formatSentAt(date) {
  return new Date(date).toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatFileSize(size) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`
}

function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function MessageAttachment({ attachment }) {
  const [src, setSrc] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    let objectUrl = ''

    readChatAttachment(attachment.id).then((file) => {
      if (!file) throw new Error('This attachment is no longer available.')
      objectUrl = URL.createObjectURL(file)
      if (active) setSrc(objectUrl)
      else URL.revokeObjectURL(objectUrl)
    }).catch((error) => {
      if (active) setLoadError(error instanceof Error ? error.message : 'Could not load this attachment.')
    })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [attachment.id])

  if (loadError) return <p className={styles.attachmentError} role="alert">{loadError}</p>
  if (!src) return <p className={styles.attachmentLoading} role="status">Loading attachment…</p>

  return attachment.kind === 'image' ? (
    <img className={styles.sharedImage} src={src} alt={attachment.name} loading="lazy" />
  ) : (
    <video className={styles.sharedVideo} src={src} controls preload="metadata">
      Your browser does not support video playback.
    </video>
  )
}

function Chat({ isAdmin = false }) {
  const { conversationId } = useParams()
  const fileInputRef = useRef(null)
  const [conversation, setConversation] = useState(() =>
    readConversations().find((item) => item.id === conversationId) || null,
  )
  const [draft, setDraft] = useState('')
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const [trimJob, setTrimJob] = useState(null)
  const [trimStartSeconds, setTrimStartSeconds] = useState(0)
  const [isTrimming, setIsTrimming] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [mediaError, setMediaError] = useState('')

  useEffect(() => {
    const refreshConversation = () => {
      setConversation(readConversations().find((item) => item.id === conversationId) || null)
    }

    refreshConversation()
    window.addEventListener(MESSAGE_CHANGE_EVENT, refreshConversation)
    window.addEventListener('storage', refreshConversation)
    return () => {
      window.removeEventListener(MESSAGE_CHANGE_EVENT, refreshConversation)
      window.removeEventListener('storage', refreshConversation)
    }
  }, [conversationId])

  useEffect(() => {
    if (!trimJob) return undefined
    return () => URL.revokeObjectURL(trimJob.previewUrl)
  }, [trimJob])

  const handleAttachmentSelect = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setMediaError('')
    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setMediaError(`Images must be ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} or smaller.`)
        return
      }

      setSelectedAttachment({ id: nanoid(), kind: 'image', file, name: file.name, size: file.size })
      return
    }

    if (!file.type.startsWith('video/')) {
      setMediaError('Choose an image or video file.')
      return
    }

    if (file.size > MAX_SOURCE_VIDEO_SIZE_BYTES) {
      setMediaError(`Videos larger than ${formatFileSize(MAX_SOURCE_VIDEO_SIZE_BYTES)} cannot be processed here.`)
      return
    }

    try {
      const duration = await getVideoDuration(file)
      if (file.size > MAX_VIDEO_SIZE_BYTES || duration > MAX_VIDEO_DURATION_SECONDS) {
        setTrimStartSeconds(0)
        setTrimJob({
          file,
          duration,
          clipDuration: Math.min(MAX_VIDEO_DURATION_SECONDS, duration),
          previewUrl: URL.createObjectURL(file),
        })
        return
      }

      setSelectedAttachment({
        id: nanoid(),
        kind: 'video',
        file,
        name: file.name,
        size: file.size,
        duration,
      })
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'This video could not be opened.')
    }
  }

  const trimSelectedVideo = async () => {
    if (!trimJob) return

    setIsTrimming(true)
    setMediaError('')
    try {
      const trimmedFile = await trimAndCompressVideo(
        trimJob.file,
        trimStartSeconds,
        trimJob.clipDuration,
      )
      if (trimmedFile.size > MAX_VIDEO_SIZE_BYTES) {
        setMediaError('The trimmed video is still too large. Choose a shorter or smaller video.')
        return
      }

      setSelectedAttachment({
        id: nanoid(),
        kind: 'video',
        file: trimmedFile,
        name: trimmedFile.name,
        size: trimmedFile.size,
        duration: trimJob.clipDuration,
      })
      setTrimJob(null)
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'The video could not be trimmed.')
    } finally {
      setIsTrimming(false)
    }
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text && !selectedAttachment) return

    setIsSending(true)
    setMediaError('')
    try {
      const attachment = selectedAttachment
        ? {
            id: selectedAttachment.id,
            kind: selectedAttachment.kind,
            name: selectedAttachment.name,
            size: selectedAttachment.size,
            duration: selectedAttachment.duration,
          }
        : null

      if (selectedAttachment) {
        await saveChatAttachment(selectedAttachment.id, selectedAttachment.file)
      }
      setConversation(appendMessage(
        conversationId,
        isAdmin ? 'admin' : 'user',
        text,
        attachment,
      ))
      setDraft('')
      setSelectedAttachment(null)
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Your message could not be sent.')
    } finally {
      setIsSending(false)
    }
  }

  const inboxPath = isAdmin ? '/admin/messages' : '/messages'
  const maxTrimStart = trimJob
    ? Math.max(0, Math.floor(trimJob.duration - trimJob.clipDuration))
    : 0
  const chatContent = !conversation ? (
    <section className={styles.inboxPanel}>
      <div className={styles.emptyInbox}>
        <h2>Conversation not found</h2>
        <p>This message thread may have been removed.</p>
        <Link to={inboxPath}>Back to inbox</Link>
      </div>
    </section>
  ) : (
    <section className={styles.chatPanel} aria-label={`Conversation: ${conversation.subject}`}>
      <header className={styles.chatHeader}>
        <Link to={inboxPath} aria-label="Back to inbox">←</Link>
        <span className={styles.conversationAvatar} aria-hidden="true">
          {(isAdmin ? conversation.name : 'TB').slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h2>{isAdmin ? conversation.name : 'The Taste Bud Support'}</h2>
          <p>{isAdmin ? conversation.email : 'Support team'}</p>
        </div>
        <strong className={styles.chatSubject}>{conversation.subject}</strong>
      </header>

      <div className={styles.messageThread} aria-live="polite">
        <p className={styles.threadNotice}>Messages are shown in this conversation.</p>
        {conversation.messages.map((message) => {
          const ownMessage = message.sender === (isAdmin ? 'admin' : 'user')
          return (
            <article
              className={`${styles.messageRow} ${ownMessage ? styles.ownMessage : ''}`}
              key={message.id}
            >
              <div className={styles.messageBubble}>
                <span>{message.sender === 'admin' ? 'The Taste Bud Support' : conversation.name}</span>
                {message.text && <p>{message.text}</p>}
                {message.attachment && <MessageAttachment attachment={message.attachment} />}
                <time dateTime={message.sentAt}>{formatSentAt(message.sentAt)}</time>
              </div>
            </article>
          )
        })}
      </div>

      <form className={styles.replyForm} onSubmit={sendMessage}>
        {selectedAttachment && (
          <div className={styles.pendingAttachment}>
            <span>{selectedAttachment.kind === 'image' ? 'Image' : 'Video'} · {selectedAttachment.name}</span>
            <span>{formatFileSize(selectedAttachment.size)}</span>
            <button type="button" onClick={() => setSelectedAttachment(null)} aria-label="Remove attachment">×</button>
          </div>
        )}
        <div className={styles.replyControls}>
          <button
            className={styles.attachButton}
            type="button"
            aria-label="Attach an image or video"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5 12.5 20a6 6 0 0 1-8.5-8.5l8.5-8.5a4 4 0 0 1 5.7 5.7l-8.5 8.5a2 2 0 0 1-2.8-2.8l7.8-7.8" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            className={styles.srOnly}
            type="file"
            accept="image/*,video/*"
            aria-label="Choose an image or video"
            onChange={handleAttachmentSelect}
          />
          <label className={styles.srOnly} htmlFor="reply-message">Your message</label>
          <textarea
            id="reply-message"
            value={draft}
            maxLength={2000}
            aria-describedby="reply-message-hint"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            rows="2"
          />
          <button
            type="submit"
            disabled={isSending || (!draft.trim() && !selectedAttachment)}
          >
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </div>
        <p className={styles.attachmentHint} id="reply-message-hint">
          Up to 2,000 characters · Images up to 5 MB · Videos up to 20 MB and 1 minute
        </p>
        {mediaError && <p className={styles.attachmentError} role="alert">{mediaError}</p>}
      </form>

      {trimJob && (
        <div className={styles.modalBackdrop}>
          <section
            className={styles.trimModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trim-modal-title"
          >
            <button
              className={styles.modalClose}
              type="button"
              onClick={() => setTrimJob(null)}
              aria-label="Close video trim dialog"
              disabled={isTrimming}
            >
              ×
            </button>
            <p className={styles.modalEyebrow}>Video is over the recommended limit</p>
            <h2 id="trim-modal-title">Trim your video</h2>
            <p className={styles.modalIntro}>
              Videos can be up to 1 minute and 20 MB. Choose a start point and we’ll compress a
              {` ${formatDuration(trimJob.clipDuration)} `}clip for sharing.
            </p>
            <video className={styles.trimPreview} src={trimJob.previewUrl} controls preload="metadata">
              Your browser does not support video playback.
            </video>
            <p className={styles.videoInfo}>
              {trimJob.file.name} · {formatDuration(trimJob.duration)} · {formatFileSize(trimJob.file.size)}
            </p>
            <label className={styles.trimControl}>
              Start at {formatDuration(trimStartSeconds)}
              <input
                type="range"
                min="0"
                max={maxTrimStart}
                step="1"
                value={trimStartSeconds}
                onChange={(event) => setTrimStartSeconds(Number(event.target.value))}
                disabled={maxTrimStart === 0 || isTrimming}
              />
            </label>
            {mediaError && <p className={styles.attachmentError} role="alert">{mediaError}</p>}
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setTrimJob(null)} disabled={isTrimming}>Cancel</button>
              <button type="button" onClick={trimSelectedVideo} disabled={isTrimming}>
                {isTrimming ? 'Trimming…' : 'Trim & Attach'}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )

  if (isAdmin) {
    return <main className={styles.adminMessagePage}>{chatContent}</main>
  }

  return (
    <ProfilePageShell
      active="messages"
      title="Messages"
      description="Chat with our support team about your enquiry."
    >
      {chatContent}
    </ProfilePageShell>
  )
}

export default Chat
