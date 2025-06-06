"use client";
import { Mic, Square, Pause, Play, Video, VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function VoiceControls({
  isRecording,
  isPaused,
  isCameraOn,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onToggleCamera
}) {
  return (
    (<div className="flex items-center justify-center space-x-6">
      {/* Camera Toggle */}
      <button
        onClick={onToggleCamera}
        className={cn("p-4 rounded-full transition-all duration-200", isCameraOn
          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          : "bg-gray-700 hover:bg-gray-600 text-gray-300")}>
        {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
      </button>
      {/* Recording Controls */}
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          // Start Recording Button
          (<button
            onClick={onStartRecording}
            className="p-6 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-200 transform hover:scale-105">
            <Mic className="h-8 w-8" />
          </button>)
        ) : (
          <>
            {/* Pause/Resume Button */}
            <button
              onClick={isPaused ? onResumeRecording : onPauseRecording}
              className={cn("p-4 rounded-full transition-all duration-200", isPaused
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 text-white")}>
              {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
            </button>

            {/* Stop Recording Button */}
            <button
              onClick={onStopRecording}
              className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200">
              <Square className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {/* Spacer for symmetry */}
      <div className="w-16" />
    </div>)
  );
}
