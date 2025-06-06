import { MessageBubble } from "@/components/message-bubble"

export function MessageList({
  messages
}) {
  return (
    (<div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>)
  );
}
