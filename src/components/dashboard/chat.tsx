"use client"

import * as React from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Message } from "@/types/messages"

export default function AiChat() {
  function generateRandomWelcomeMessage() {
    const messages = [
      "Hello! This is Sthira Sense AI. Ask me anything about the current coin or market trends!",
      "Hi there! I'm your Sthira Sense AI assistant. Feel free to ask me anything about the current coin or market trends!",
      "Welcome! I'm Sthira Sense AI, here to help you with insights on the current coin and market trends. What would you like to know?",
      "Hey! This is Sthira Sense AI. I'm here to provide you with information about the current coin and market trends. Ask me anything!",
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: generateRandomWelcomeMessage(),
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.content }),
      })

      if (!res.ok) throw new Error("Failed to fetch response")

      const data: { answer: string } = await res.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
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
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-10 bg-linear-to-b from-white to-transparent dark:from-neutral-900" />

        <ScrollArea className="h-full px-4">
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
                          m.role === "user"
                            ? "bg-chart-1 text-primary-foreground dark:text-white"
                            : "bg-muted"
                        }
                      >
                        {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`prose prose-sm dark:prose-invert max-w-none rounded-lg px-4 py-2 text-sm shadow-sm ${
                        m.role === "user"
                          ? "bg-chart-1 text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground dark:text-white"
                          : "bg-muted border"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({
                              inline,
                              children,
                            }: {
                              inline?: boolean
                              children?: React.ReactNode
                            }) {
                              return inline ? (
                                <code className="rounded bg-black/10 px-1 py-0.5 text-xs">
                                  {children}
                                </code>
                              ) : (
                                <pre className="overflow-x-auto rounded-lg bg-black/10 p-3">
                                  <code>{children}</code>
                                </pre>
                              )
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is thinking...
              </div>
            )}

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
            disabled={loading}
          />

          <Button
            className="bg-chart-1"
            type="submit"
            size="icon"
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
