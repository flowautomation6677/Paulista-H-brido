import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    // We accept pretty much any audio/video
    const allowedTypes = [
      'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/aac', 'audio/ogg',
      'video/mp4', 'video/x-msvideo', 'video/x-matroska', 'video/quicktime', 'video/x-flv', 'video/webm'
    ]

    // Simple extension check as fallback usually works better for some containers
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    const allowedExts = ['mp3', 'wav', 'm4a', 'mp4', 'avi', 'mkv', 'mov', 'flv', 'webm']

    // Just pass everything for now, backend will validate too
    setFile(selectedFile)
    setError("")
    setTranscription("")
  }

  const handleTranscribe = async () => {
    if (!file) return

    setIsUploading(true)
    setError("")
    setTranscription("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || "Transcription failed")
      }

      const data = await response.json()
      setTranscription(data.text)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
      <div className="glass-card w-full max-w-3xl p-8 fade-in">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Whisper AI
        </h1>
        <p className="text-gray-400 mb-8">Premium Audio & Video Transcription</p>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 mb-8 transition-all duration-300 ${dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".mp3,.wav,.m4a,.mp4,.avi,.mkv,.mov,.flv,.webm"
          />

          {!file ? (
            <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium">Drag & Drop audio or video file here</p>
              <p className="text-sm text-gray-500 mt-2">or click to browse (MP3, MP4, MKV, etc)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-blue-600/20 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2">{file.name}</p>
              <p className="text-sm text-gray-400 mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setFile(null)}
                  className="px-6 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Change File
                </button>
                <button
                  onClick={handleTranscribe}
                  disabled={isUploading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/25"
                >
                  {isUploading ? "Transcribing..." : "Start Transcription"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isUploading && (
          <div className="mb-8 slide-up">
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-sm text-gray-400 animate-pulse">Processing audio... This may take a moment.</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-8 slide-up">
            {error}
          </div>
        )}

        {/* Result Area */}
        {transcription && (
          <div className="text-left slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Transcription Result</h2>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
                Copy Text
              </button>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-gray-700 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {transcription}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
