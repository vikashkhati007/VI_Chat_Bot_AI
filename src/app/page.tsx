"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Image, MessageSquare, Mic, Music, PlusCircle, Send, Settings, Sparkles, TrendingUp } from "lucide-react"

export default function Component() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm here to help! What would you like to know?" }])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-black/95">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <Sparkles className="w-5 h-5 text-green-500" />
          <span className="font-semibold text-white">My Chats</span>
        </div>
        <Input className="bg-gray-800 border-0 text-white placeholder:text-gray-400" placeholder="Search" />
        <div className="space-y-2">
          <div className="text-sm text-gray-400 px-2">Folders</div>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Folder className="w-4 h-4 mr-2" />
            Work chats
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Folder className="w-4 h-4 mr-2" />
            Life chats
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Folder className="w-4 h-4 mr-2" />
            Projects chats
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Folder className="w-4 h-4 mr-2" />
            Clients chats
          </Button>
        </div>
        <Button className="mt-auto bg-green-500 hover:bg-green-600">
          <PlusCircle className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">New chat</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-8 text-center p-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">How can I help you today?</h2>
                <p className="text-gray-400 max-w-md">
                  This chat will display a prompt asking the user for their intent, and then it will display a streaming
                  message with the name entered by the user.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <MessageSquare className="w-8 h-8 text-green-500" />
                    <h3 className="font-medium text-white">Saved Prompt Templates</h3>
                    <p className="text-sm text-gray-400">Use & save prompt templates for better responses</p>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Image className="w-8 h-8 text-green-500" />
                    <h3 className="font-medium text-white">Media Type Selection</h3>
                    <p className="text-sm text-gray-400">Use different media types for better results</p>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <h3 className="font-medium text-white">Multilingual Support</h3>
                    <p className="text-sm text-gray-400">Choose language for better interaction</p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-green-500 text-white" : "bg-gray-800 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="all" className="text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="text" className="text-white">
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="text-white">
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="text-white">
                Video
              </TabsTrigger>
              <TabsTrigger value="music" className="text-white">
                Music
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white">
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your prompt here..."
                className="bg-gray-800 border-0 text-white placeholder:text-gray-400 pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button type="submit" variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
