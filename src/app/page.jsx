import { VoiceRecorderInterface } from "@/components/voice-recorder-interface"

export default function Home() {
  return (
    (<main
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md mx-auto">
        <VoiceRecorderInterface />
      </div>
    </main>)
  );
}
