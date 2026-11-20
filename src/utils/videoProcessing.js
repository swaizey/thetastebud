export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024
export const MAX_VIDEO_DURATION_SECONDS = 60
export const MAX_SOURCE_VIDEO_SIZE_BYTES = 100 * 1024 * 1024

function loadVideo(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const duration = video.duration
      URL.revokeObjectURL(objectUrl)
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error('The selected video has no readable duration.'))
        return
      }
      resolve(duration)
    }
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('This video could not be opened. Try an MP4 or WebM file.'))
    }
    video.src = objectUrl
  })
}

export function getVideoDuration(file) {
  return loadVideo(file)
}

export async function trimAndCompressVideo(file, startSeconds, durationSeconds) {
  if (!window.MediaRecorder) {
    throw new Error('Video trimming is not supported in this browser.')
  }

  const objectUrl = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'auto'
  video.playsInline = true
  video.volume = 0.1
  video.src = objectUrl
  let stream
  let recorder
  let trimTimer

  try {
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve
      video.onerror = () => reject(new Error('This video could not be opened for trimming.'))
    })

    const captureStream = video.captureStream || video.mozCaptureStream
    if (!captureStream) {
      throw new Error('Video trimming is not supported in this browser.')
    }

    if (startSeconds > 0) {
      await new Promise((resolve, reject) => {
        video.onseeked = resolve
        video.onerror = () => reject(new Error('Could not seek to the selected trim point.'))
        video.currentTime = startSeconds
      })
    }

    stream = captureStream.call(video)
    const mimeType = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ].find((candidate) => MediaRecorder.isTypeSupported(candidate))

    if (!mimeType) {
      throw new Error('This browser cannot encode a trimmed video.')
    }

    recorder = new window.MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 1000000,
      audioBitsPerSecond: 96000,
    })
    const chunks = []
    const recording = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }
      recorder.onerror = () => reject(new Error('The video could not be compressed.'))
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }))
    })
    const stopRecording = () => {
      if (recorder.state === 'recording') recorder.stop()
    }
    const stopAt = startSeconds + durationSeconds
    trimTimer = window.setInterval(() => {
      if (video.currentTime >= stopAt || video.ended) stopRecording()
    }, 100)

    recorder.start(250)
    try {
      await video.play()
      const compressedVideo = await recording
      const filename = file.name.replace(/\.[^.]+$/, '') || 'video'
      return new File([compressedVideo], `${filename}-clip.webm`, { type: compressedVideo.type })
    } finally {
      video.pause()
    }
  } finally {
    if (trimTimer) window.clearInterval(trimTimer)
    if (recorder?.state === 'recording') recorder.stop()
    stream?.getTracks().forEach((track) => track.stop())
    URL.revokeObjectURL(objectUrl)
  }
}
