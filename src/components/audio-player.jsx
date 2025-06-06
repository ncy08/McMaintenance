"use client";
import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"

export function AudioPlayer({
  audioUrl
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener("ended", () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    return () => {
      audio.pause()
      audio.src = ""
      audio.removeEventListener("loadedmetadata", () => {})
      audio.removeEventListener("timeupdate", () => {})
      audio.removeEventListener("ended", () => {})
    };
  }, [audioUrl])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgressClick = (e) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = percent * duration
    }
  }

  return (
    (<div className="flex flex-col space-y-2 w-full min-w-[200px]">
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlayPause}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <div className="flex-1">
          <div
            ref={progressRef}
            className="h-1.5 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}>
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
        </div>

        <Volume2 className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex justify-between text-xs">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>)
  );
}
