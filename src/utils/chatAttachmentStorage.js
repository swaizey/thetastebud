const DATABASE_NAME = 'tastebud-chat-attachments'
const STORE_NAME = 'attachments'

function openDatabase() {
  if (!window.indexedDB) {
    return Promise.reject(new Error('This browser does not support saving chat attachments.'))
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1)

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open attachment storage.'))
    request.onblocked = () => reject(new Error('Attachment storage is busy in another tab.'))
  })
}

export async function saveChatAttachment(id, file) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(file, id)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error || new Error('Could not save this attachment.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error || new Error('Saving this attachment was cancelled.'))
    }
  })
}

export async function readChatAttachment(id) {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).get(id)
    let file = null

    request.onsuccess = () => {
      file = request.result || null
    }
    transaction.oncomplete = () => {
      database.close()
      resolve(file)
    }
    transaction.onerror = () => {
      database.close()
      reject(transaction.error || new Error('Could not load this attachment.'))
    }
    transaction.onabort = () => {
      database.close()
      reject(transaction.error || new Error('Loading this attachment was cancelled.'))
    }
  })
}
