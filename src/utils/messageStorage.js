import { nanoid } from 'nanoid'

const CONVERSATIONS_KEY = 'tastebud-conversations'
const USER_CONVERSATIONS_KEY = 'tastebud-user-conversations'
export const MESSAGE_CHANGE_EVENT = 'tastebud-messages-change'

function readArray(key) {
  const value = window.localStorage.getItem(key)
  if (value === null) return []

  const parsedValue = JSON.parse(value)
  if (!Array.isArray(parsedValue)) {
    throw new TypeError(`Saved data for ${key} must be an array.`)
  }

  return parsedValue
}

export function readConversations() {
  return readArray(CONVERSATIONS_KEY)
}

export function readUserConversations() {
  const userConversationIds = new Set(readArray(USER_CONVERSATIONS_KEY))
  return readConversations().filter((conversation) => userConversationIds.has(conversation.id))
}

export function saveConversations(conversations) {
  window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  window.dispatchEvent(new Event(MESSAGE_CHANGE_EVENT))
}

export function createConversation({ name, email, subject, message }) {
  const now = new Date().toISOString()
  const conversation = {
    id: nanoid(),
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim() || 'Website enquiry',
    createdAt: now,
    updatedAt: now,
    messages: [{ id: nanoid(), sender: 'user', text: message.trim(), sentAt: now }],
  }

  saveConversations([conversation, ...readConversations()])
  const userConversationIds = readArray(USER_CONVERSATIONS_KEY)
  window.localStorage.setItem(USER_CONVERSATIONS_KEY, JSON.stringify([...userConversationIds, conversation.id]))

  return conversation
}

export function appendMessage(conversationId, sender, text, attachment = null) {
  if (!text.trim() && !attachment) {
    throw new TypeError('A message must include text or an attachment.')
  }

  const now = new Date().toISOString()
  let updatedConversation
  const conversations = readConversations().map((conversation) => {
    if (conversation.id !== conversationId) return conversation

    updatedConversation = {
      ...conversation,
      updatedAt: now,
      messages: [
        ...conversation.messages,
        { id: nanoid(), sender, text: text.trim(), attachment, sentAt: now },
      ],
    }
    return updatedConversation
  })

  if (!updatedConversation) {
    throw new Error(`Conversation ${conversationId} was not found.`)
  }

  saveConversations(conversations)
  return updatedConversation
}
