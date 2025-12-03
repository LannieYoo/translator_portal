import { useState, useRef } from 'react'
import './speech-to-recording.css'

function SpeechToRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const timestamp = new Date().toISOString()
        
        setRecordings(prev => [...prev, {
          id: Date.now(),
          url: audioUrl,
          timestamp,
          blob: audioBlob,
        }])

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Microphone access error:', error)
      alert('Microphone access permission is required.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleDownload = (recording) => {
    const a = document.createElement('a')
    a.href = recording.url
    a.download = `recording_${recording.timestamp.slice(0, 19).replace(/:/g, '-')}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDelete = (id) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id)
      if (recording) {
        URL.revokeObjectURL(recording.url)
      }
      return prev.filter(r => r.id !== id)
    })
  }

  return (
    <div className="speech-to-recording">
      <div className="speech-to-recording-container">
        <div className="flex flex-col items-center text-center gap-4 -mt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter" style={{ color: '#3E424D' }}>Audio Recording</h1>
        </div>

        <div className="recording-controls">
          <button
            onClick={handleToggle}
            className={`record-btn ${isRecording ? 'recording' : ''}`}
          >
            {isRecording ? '⏹ Stop Recording' : '▶ Start Recording'}
          </button>
        </div>

        {isRecording && (
          <div className="recording-indicator">
            <span className="pulse-dot"></span>
            Recording...
          </div>
        )}

        <div className="recordings-list">
          <h2 className="recordings-title">Recordings</h2>
          {recordings.length === 0 ? (
            <div className="no-recordings">No recordings found.</div>
          ) : (
            <div className="recordings-grid">
              {recordings.map(recording => (
                <div key={recording.id} className="recording-item">
                  <audio controls src={recording.url} className="audio-player" />
                  <div className="recording-info">
                    <div className="recording-time">
                      {new Date(recording.timestamp).toLocaleString('en-US')}
                    </div>
                    <div className="recording-actions">
                      <button
                        onClick={() => handleDownload(recording)}
                        className="download-btn"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(recording.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpeechToRecording

