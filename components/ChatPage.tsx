'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AI_MODELS, type AIModel } from '@/config/models'
import ModelSelector from './ModelSelector'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ThinkingAnimation from './three/ThinkingAnimation'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  modelId?: string
}

const STORAGE_KEY = 'cl-alzz-chat-history'
const MAX_TEXT_LENGTH = 1000

function loadHistory(): Message[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(messages: Message[]) {
  if (typeof window === 'undefined') return
  // Keep last 100 messages only
  const toSave = messages.slice(-100)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setMounted(true)
    setMessages(loadHistory())
  }, [])

  useEffect(() => {
    if (mounted) saveHistory(messages)
  }, [messages, mounted])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isThinking) return
    setError(null)

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setIsThinking(true)

    // Abort previous request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    try {
      // Build conversation history for API
      const historyForApi = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }))
      historyForApi.push({ role: 'user', content: content.trim() })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.id,
          messages: historyForApi,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      // Handle streaming
      const assistantMsgId = crypto.randomUUID()
      let fullContent = ''

      if (selectedModel.supportsStreaming && res.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()

        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          modelId: selectedModel.id,
        }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.delta || parsed.chunk || ''
                fullContent += delta
                setMessages(prev => prev.map(m =>
                  m.id === assistantMsgId ? { ...m, content: fullContent } : m
                ))
              } catch {}
            }
          }
        }
      } else {
        // Non-streaming
        const data = await res.json()
        fullContent = data.content || ''
        setMessages(prev => [...prev, {
          id: assistantMsgId,
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
          modelId: selectedModel.id,
        }])
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(msg)
      // Remove user message if failed
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
    } finally {
      setIsThinking(false)
    }
  }, [messages, selectedModel, isThinking])

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-alzz-border bg-alzz-dark/50 backdrop-blur-sm">
        <ModelSelector
          models={AI_MODELS}
          selected={selectedModel}
          onSelect={setSelectedModel}
        />

        <div className="flex-1" />

        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="font-mono text-[10px] text-alzz-muted hover:text-alzz-red-bright tracking-widest uppercase border border-alzz-border hover:border-alzz-red px-3 py-1.5 transition-all"
          >
            CLEAR
          </button>
        )}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 font-mono text-[10px] text-alzz-red-bright tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 bg-alzz-red-bright rounded-full animate-ping" />
            THINKING
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative">
        {isThinking && <ThinkingAnimation />}
        <MessageList
          messages={messages}
          isThinking={isThinking}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-alzz-red/20 border-t border-alzz-red/50 font-mono text-xs text-red-400 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-alzz-muted hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isThinking}
        maxLength={MAX_TEXT_LENGTH}
      />
    </div>
  )
}
