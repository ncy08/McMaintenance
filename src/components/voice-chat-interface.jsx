"use client";
import { useState, useRef, useEffect } from "react"
import { MessageList } from "@/components/message-list"
import { AudioRecorder } from "@/components/audio-recorder"
import { ChatHeader } from "@/components/chat-header"
import { useMobile } from "@/hooks/use-mobile"

export function VoiceChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hi there! Send me a voice message.",
      sender: "them",
      timestamp: new Date(),
      audioUrl: null,
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const isMobile = useMobile()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendAudio = (audioBlob, audioUrl) => {
    // Add user message with audio
    const userMessage = {
      id: Date.now().toString(),
      content: "",
      sender: "me",
      timestamp: new Date(),
      audioUrl,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate response after a short delay
    setIsLoading(true)
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your voice message! I've received it.",
        sender: "them",
        timestamp: new Date(),
        audioUrl: null,
      }
      setMessages((prev) => [...prev, responseMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    (<div
      className="flex flex-col h-[calc(100vh-2rem)] max-h-[800px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={messages} />
        {isLoading && (
          <div className="flex justify-center my-2">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <AudioRecorder
          onAudioReady={handleSendAudio}
          isRecording={isRecording}
          setIsRecording={setIsRecording} />
      </div>
    </div>)
  );
}
