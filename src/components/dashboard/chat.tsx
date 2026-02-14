"use client"

import * as React from "react"
import { Send, Bot, User } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message } from "@/types/messages"

export default function AiChat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated AI response. Integrate your API here!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <Card className="flex min-h-1/2 w-full flex-col gap-0 overflow-hidden bg-white pb-0 dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader className="border-b dark:border-neutral-800">
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-chart-1 h-5 w-5" />
          AI Collaboration
        </CardTitle>
      </CardHeader>

      <CardContent className="relative flex-1 overflow-hidden p-0">
        {/* Opacity mask at the top */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-10 bg-linear-to-b from-white to-transparent dark:from-neutral-900" />

        <ScrollArea className="h-full px-4" ref={scrollRef}>
          <div className="flex flex-col gap-4 pt-4 pb-2">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] items-start gap-3 ${
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback
                        className={
                          m.role === "user" ? "bg-chart-1 text-primary-foreground" : "bg-muted"
                        }
                      >
                        {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 text-sm shadow-sm ${
                        m.role === "user" ? "bg-chart-1 text-primary-foreground" : "bg-muted border"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4 dark:border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            placeholder="Ask about this coin?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button className="bg-chart-1" type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
