'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Message } from './ChatPage'
import { AI_MODELS } from '@/config/models'

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function getModelName(modelId?: string) {
  if (!modelId) return 'CL-ALZZ'
  return AI_MODELS.find(m => m.id === modelId)?.name || 'CL-ALZZ'
}

export default function MessageList({ messages, isThinking }: { messages: Message[]; isThinking: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="font-display text-alzz-red font-black text-3xl tracking-widest opacity-20 mb-3">
          CL-ALZZ
        </div>
        <p className="font-mono text-xs text-alzz-muted tracking-widest">
          PILIH MODE · MULAI CHAT · BY ALZZISBACK
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Avatar */}
          <div className={`
            flex-shrink-0 w-7 h-7 rounded flex items-center justify-center
            font-mono text-[10px] font-bold mt-1
            ${msg.role === 'user'
              ? 'bg-alzz-surface border border-alzz-border text-alzz-muted'
              : 'bg-alzz-red border border-alzz-red-mid text-white'
            }
          `}>
            {msg.role === 'user' ? 'U' : 'AI'}
          </div>

          {/* Bubble */}
          <div className={`
            max-w-[80%] md:max-w-[70%] rounded
            ${msg.role === 'user'
              ? 'bg-alzz-surface border border-alzz-border text-alzz-text'
              : 'bg-[#140000] border border-alzz-border text-alzz-text'
            }
          `}>
            {/* Bubble header */}
            <div className={`
              flex items-center gap-2 px-3 py-1.5 border-b border-alzz-border/50
              ${msg.role === 'user' ? 'flex-row-reverse' : ''}
            `}>
              <span className="font-mono text-[9px] font-bold tracking-wider text-alzz-red-bright">
                {msg.role === 'user' ? 'KAMU' : getModelName(msg.modelId)}
              </span>
              <span className="font-mono text-[9px] text-alzz-muted opacity-60">
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {/* Content */}
            <div className="px-3 py-2.5">
              {msg.role === 'user' ? (
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              ) : (
                <div className="prose-dark text-sm">
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              background: '#0D0D0D',
                              border: '1px solid #3D0000',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              margin: '0.5rem 0',
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-alzz-red/20 border border-alzz-red/30 rounded px-1 py-0.5 text-[0.8em] font-mono" {...props}>
                            {children}
                          </code>
                        )
                      },
                      p({ children }) {
                        return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                      },
                      ul({ children }) {
                        return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                      },
                      li({ children }) {
                        return <li className="text-alzz-text/90">{children}</li>
                      },
                      h1({ children }) {
                        return <h1 className="text-alzz-red-bright font-display font-bold text-lg mb-2 tracking-wide">{children}</h1>
                      },
                      h2({ children }) {
                        return <h2 className="text-alzz-red-bright font-bold text-base mb-2">{children}</h2>
                      },
                      h3({ children }) {
                        return <h3 className="text-alzz-text font-bold text-sm mb-1">{children}</h3>
                      },
                      strong({ children }) {
                        return <strong className="text-alzz-red-bright font-bold">{children}</strong>
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-2 border-alzz-red pl-3 italic text-alzz-muted my-2">
                            {children}
                          </blockquote>
                        )
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex gap-3 flex-row">
          <div className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold bg-alzz-red border border-alzz-red-mid text-white mt-1">
            AI
          </div>
          <div className="bg-[#140000] border border-alzz-border rounded px-4 py-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-alzz-red-bright rounded-full dot-1" />
            <span className="w-1.5 h-1.5 bg-alzz-red-bright rounded-full dot-2" />
            <span className="w-1.5 h-1.5 bg-alzz-red-bright rounded-full dot-3" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
