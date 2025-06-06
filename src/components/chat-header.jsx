import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, MoreVertical } from "lucide-react"

export function ChatHeader() {
  return (
    (<div
      className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">AI Assistant</h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Video className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>)
  );
}
