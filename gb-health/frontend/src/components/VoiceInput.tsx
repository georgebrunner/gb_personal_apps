import { useState, useEffect, useRef } from 'react'

interface VoiceInputProps {
  onResult: (text: string) => void
  placeholder?: string
}

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event & { error: string }) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoiceInput({ onResult, placeholder = 'Tap mic to speak' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      } else {
        setTranscript(prev => prev + interimTranscript)
      }
    }

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      // On iOS, "not-allowed" or "aborted" errors can happen when mic permission is denied or focus changes
      setIsListening(false)
      setTranscript('')
    }

    recognition.onend = () => {
      // Only reset if we're not in the middle of a transcript submission
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      // Send final transcript
      if (transcript.trim()) {
        onResult(transcript.trim())
        setTranscript('')
      }
    } else {
      setTranscript('')
      try {
        recognitionRef.current.start()
        // Note: isListening is set by onstart handler to ensure it actually started
      } catch (err) {
        console.error('Failed to start speech recognition:', err)
      }
    }
  }

  const handleDone = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (transcript.trim()) {
      onResult(transcript.trim())
      setTranscript('')
    }
    setIsListening(false)
  }

  if (!isSupported) {
    return null // Don't show if not supported
  }

  return (
    <div className="voice-input">
      <button
        type="button"
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
      {isListening && (
        <div className="voice-status">
          <span className="voice-indicator">Listening...</span>
          {transcript && (
            <div className="voice-transcript">
              "{transcript}"
              <button type="button" className="voice-done-btn" onClick={handleDone}>
                Done
              </button>
            </div>
          )}
        </div>
      )}
      {!isListening && !transcript && (
        <span className="voice-placeholder">{placeholder}</span>
      )}
    </div>
  )
}
