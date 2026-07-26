'use client'

import { useState, useRef, useCallback } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled: boolean
  maxLength: number
}

export default function ChatInput({ onSend, disabled, maxLength }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(() => {
    const content = fileContent
      ? `[File: ${fileName}]\n\n${fileContent}`
      : value.trim()
    if (!content || disabled) return
    onSend(content)
    setValue('')
    setFileContent(null)
    setFileName(null)
  }, [value, fileContent, fileName, disabled, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // If exceeds limit, auto-create file instead
    if (newValue.length > maxLength) {
      const blob = new Blob([newValue], { type: 'text/plain' })
      const reader = new FileReader()
      reader.onload = () => {
        setFileContent(newValue)
        setFileName(`message_${Date.now()}.txt`)
        setValue('')
      }
      reader.readAsText(blob)
    } else {
      setValue(newValue)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setFileContent(text)
      setFileName(file.name)
      setValue('')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const clearFile = () => {
    setFileContent(null)
    setFileName(null)
  }

  const isOverLimit = value.length > maxLength * 0.8

  return (
    <div className="border-t border-alzz-border bg-alzz-dark/80 backdrop-blur-sm px-4 py-3">
      {/* File indicator */}
      {fileContent && fileName && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-alzz-red/10 border border-alzz-red/30 rounded">
          <span className="font-mono text-[10px] text-alzz-red-bright tracking-wider">📄 {fileName}</span>
          <span className="font-mono text-[10px] text-alzz-muted">({fileContent.length} karakter)</span>
          <button
            onClick={clearFile}
            className="ml-auto font-mono text-[10px] text-alzz-muted hover:text-alzz-red-bright transition-colors"
          >
            ✕ HAPUS
          </button>
        </div>
      )}

      <div className="flex gap-3 items-end">
        {/* File upload button */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 w-9 h-9 border border-alzz-border hover:border-alzz-red text-alzz-muted hover:text-alzz-red-bright rounded flex items-center justify-center transition-all disabled:opacity-40"
          title="Upload file .txt"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.csv,.json,.py,.js,.ts,.html,.css"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Textarea */}
        <div className="flex-1 relative">
          {!fileContent && (
            <>
              <TextareaAutosize
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="Ketik pesan... (Shift+Enter untuk baris baru)"
                maxRows={6}
                minRows={1}
                className="w-full bg-alzz-surface border border-alzz-border hover:border-alzz-red/50 focus:border-alzz-red focus:outline-none rounded px-3 py-2 font-body text-sm text-alzz-text placeholder-alzz-muted resize-none transition-all duration-200 disabled:opacity-50"
              />
              {/* Character counter */}
              {value.length > 0 && (
                <div className={`absolute right-2 bottom-2 font-mono text-[9px] ${isOverLimit ? 'text-orange-400' : 'text-alzz-muted'} pointer-events-none`}>
                  {value.length}/{maxLength}
                </div>
              )}
            </>
          )}
          {fileContent && (
            <div className="w-full bg-alzz-surface border border-alzz-border rounded px-3 py-2 font-mono text-[10px] text-alzz-muted min-h-[40px] flex items-center">
              File siap dikirim: {fileName}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || (!value.trim() && !fileContent)}
          className="flex-shrink-0 w-9 h-9 bg-alzz-red hover:bg-alzz-red-bright disabled:opacity-40 disabled:cursor-not-allowed rounded flex items-center justify-center transition-all duration-200 glow-red group"
        >
          <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="font-mono text-[9px] text-alzz-muted mt-2 tracking-wider">
        ENTER = KIRIM · SHIFT+ENTER = BARIS BARU · 1000+ KARAKTER OTOMATIS JADI FILE
      </p>
    </div>
  )
}
