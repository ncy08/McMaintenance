"use client"

import { useState, useRef, useEffect } from "react"
import { VoiceControls } from "@/components/voice-controls"
import { CameraView } from "@/components/camera-view"
import { AudioVisualizer } from "@/components/audio-visualizer"

export function VoiceRecorderInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyserData, setAnalyserData] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioStreamRef = useRef(null)
  const videoStreamRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  const timerRef = useRef(null)
  const pausedTimeRef = useRef(0)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop())
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
      audioStreamRef.current = stream

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
        if (analyserRef.current && isRecording && !isPaused) {
          analyserRef.current.getByteFrequencyData(dataArray)
          setAnalyserData(new Uint8Array(dataArray))
        }
      }

      const visualizationInterval = setInterval(updateVisualization, 100)

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.onstop = () => {
        clearInterval(visualizationInterval)
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)

      // Start timer
      const startTime = Date.now() - pausedTimeRef.current * 1000
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000)
          setRecordingTime(elapsed)
        }
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      pausedTimeRef.current = recordingTime
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
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
    setIsPaused(false)
    setRecordingTime(0)
    setAnalyserData(null)
    pausedTimeRef.current = 0
  }

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn off camera
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop())
        videoStreamRef.current = null
      }
      setIsCameraOn(false)
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        videoStreamRef.current = stream
        setIsCameraOn(true)
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    (<div
      className="flex flex-col h-[calc(100vh-2rem)] max-h-[800px] bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      {/* Header with recording status */}
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">Voice Recorder</h1>
        {isRecording && (
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"}`} />
            <span className="text-white font-mono text-lg">{formatTime(recordingTime)}</span>
            <span className="text-gray-400 text-sm">{isPaused ? "PAUSED" : "RECORDING"}</span>
          </div>
        )}
      </div>
      {/* Camera View */}
      {isCameraOn && (
        <div className="flex-1 relative bg-black">
          <CameraView stream={videoStreamRef.current} />
        </div>
      )}
      {/* Audio Visualizer */}
      {isRecording && analyserData && !isCameraOn && (
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-8">
          <div className="w-full h-32 bg-gray-700 rounded-lg overflow-hidden">
            <AudioVisualizer data={analyserData} />
          </div>
        </div>
      )}
      {/* Empty state when not recording and camera is off */}
      {!isRecording && !isCameraOn && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div
              className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full" />
            </div>
            <p className="text-gray-400 text-lg">Ready to record</p>
            <p className="text-gray-500 text-sm mt-2">Tap the record button to start</p>
          </div>
        </div>
      )}
      {/* Voice Controls */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <VoiceControls
          isRecording={isRecording}
          isPaused={isPaused}
          isCameraOn={isCameraOn}
          onStartRecording={startRecording}
          onPauseRecording={pauseRecording}
          onResumeRecording={resumeRecording}
          onStopRecording={stopRecording}
          onToggleCamera={toggleCamera} />
      </div>
    </div>)
  );
}
