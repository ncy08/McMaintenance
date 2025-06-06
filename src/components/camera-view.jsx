"use client";
import { useRef, useEffect } from "react"

export function CameraView({
  stream
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  if (!stream) {
    return (
      (<div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div
            className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gray-500 rounded-full" />
          </div>
          <p className="text-gray-400">Camera not available</p>
        </div>
      </div>)
    );
  }

  return (
    (<div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg" />
      {/* Camera overlay indicators */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <span
          className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">LIVE</span>
      </div>
    </div>)
  );
}
