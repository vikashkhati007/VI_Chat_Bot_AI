"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Image, MessageSquare, Mic, Music, PlusCircle, Send, Settings, Sparkles, TrendingUp, Menu } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Chat = {
  id: string
  name: string
  messages: Message[]
}

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentChatId, chats])

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: "New Chat",
      messages: []
    }
    setChats([...chats, newChat])
    setCurrentChatId(newChat.id)
    setIsSidebarOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    let updatedChats: Chat[]

    if (!currentChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        name: input,
        messages: [{ role: "user", content: input }]
      }
      updatedChats = [...chats, newChat]
      setCurrentChatId(newChat.id)
    } else {
      //@ts-ignore
      updatedChats = chats.map(chat => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages, { role: "user", content: input }]
          return {
            ...chat,
            name: chat.messages.length === 0 ? input : chat.name,
            messages: updatedMessages
          }
        }
        return chat
      })
    }

    setChats(updatedChats)
    setInput("")
    setIsLoading(true)

    try {
      const url = process.env.NEXT_PUBLIC_HOST_URL
      if (!url) {
        throw new Error('Host URL is not defined')
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_APIKEY_URL || '',
          "X-RapidAPI-Host": process.env.NEXT_PUBLIC_APIHOST || '',
        },
        body: JSON.stringify({ query: input }),
      }

      const res = await fetch(url, options)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()

      const newChats = updatedChats.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, { role: "assistant", content: JSON.stringify(data) }]
          }
        }
        return chat
      })
      //@ts-ignore
      setChats(newChats)
    } catch (error) {
      console.error('Error:', error)
      // You might want to add error handling here, such as displaying an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-black/95">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 p-4 flex flex-col gap-4 transition-all duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-white">My Chats</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <span className="sr-only">Close sidebar</span>
            <Menu className="w-5 h-5 text-white" />
          </Button>
        </div>
        <Input 
          className="bg-gray-800 border-0 text-white placeholder:text-gray-400" 
          placeholder="Search chats" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="text-sm text-gray-400 px-2">Chats</div>
          {filteredChats.map(chat => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start text-white ${currentChatId === chat.id ? 'bg-gray-800' : ''}`}
              onClick={() => {
                setCurrentChatId(chat.id)
                setIsSidebarOpen(false)
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {chat.name}
            </Button>
          ))}
        </div>
        <Button className="mt-auto bg-green-500 hover:bg-green-600" onClick={handleNewChat}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Header */}
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Menu className="w-5 h-5 text-white" />
          </Button>
          <h1 className="text-xl font-semibold text-white">{currentChat ? currentChat.name : "New chat"}</h1>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Settings</span>
            <Settings className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* Chat Area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {!currentChat || currentChat.messages.length === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
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
              {currentChat.messages.map((message, i) => (
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
                  <span className="sr-only">Voice input</span>
                  <Mic className="w-4 h-4" />
                </Button>
                <Button type="submit" variant="ghost" size="icon" className="text-gray-400 hover:text-white" disabled={isLoading}>
                  <span className="sr-only">Send message</span>
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
