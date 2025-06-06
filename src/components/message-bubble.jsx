import { AudioPlayer } from "@/components/audio-player"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function MessageBubble({
  message
}) {
  const isMe = message.sender === "me"

  return (
    (<div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-3",
          isMe ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"
        )}>
        {message.content && <p>{message.content}</p>}

        {message.audioUrl && <AudioPlayer audioUrl={message.audioUrl} />}

        <div className={cn("text-xs mt-1", isMe ? "text-blue-100" : "text-gray-500")}>
          {format(message.timestamp, "h:mm a")}
        </div>
      </div>
    </div>)
  );
}
