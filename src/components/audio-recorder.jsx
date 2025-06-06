"use client";
import { useState, useRef, useEffect } from "react"
import { Mic, Send, X } from "lucide-react"
import { AudioVisualizer } from "@/components/audio-visualizer"
import { cn } from "@/lib/utils"

export function AudioRecorder({
  onAudioReady,
  isRecording,
  setIsRecording
}) {
  const [audioData, setAudioData] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyserData, setAnalyserData] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const analyserRef = useRef(null)
  const timerRef = useRef(null)
  const audioContextRef = useRef(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    };
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio context and analyser for visualization
      const audioContext = new (window.AudioContext || (window).webkitAudioContext)()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      analyser.fftSize = 256

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      // Update visualization data at regular intervals
      const updateVisualization = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          setAnalyserData(new Uint8Array(dataArray))
        }
      }

      const visualizationInterval = setInterval(updateVisualization, 100)

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioData(audioBlob)
        setAudioUrl(url)

        // Clean up
        clearInterval(visualizationInterval)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsRecording(false)
  }

  const cancelRecording = () => {
    stopRecording()
    setAudioData(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setAnalyserData(null)
  }

  const sendAudio = () => {
    if (audioData && audioUrl) {
      onAudioReady(audioData, audioUrl)
      setAudioData(null)
      setAudioUrl(null)
      setRecordingTime(0)
      setAnalyserData(null)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    (<div className="flex flex-col space-y-2">
      {isRecording && (
        <div
          className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Recording... {formatTime(recordingTime)}</div>
          <button onClick={cancelRecording} className="p-1 rounded-full hover:bg-gray-200">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}
      {analyserData && (
        <div className="h-16 bg-gray-100 rounded-lg overflow-hidden">
          <AudioVisualizer data={analyserData} />
        </div>
      )}
      <div className="flex items-center space-x-2">
        {!audioData ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "p-3 rounded-full transition-colors",
              isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}>
            <Mic className={cn("h-6 w-6", isRecording && "animate-pulse")} />
          </button>
        ) : (
          <button
            onClick={sendAudio}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="h-6 w-6" />
          </button>
        )}

        <div
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-gray-500 text-sm">
          {isRecording
            ? "Recording voice message..."
            : audioData
              ? "Voice message ready to send"
              : "Tap the mic to record"}
        </div>
      </div>
    </div>)
  );
}
