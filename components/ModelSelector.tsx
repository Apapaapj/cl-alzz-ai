'use client'

import { useState, useRef, useEffect } from 'react'
import { type AIModel } from '@/config/models'

interface ModelSelectorProps {
  models: AIModel[]
  selected: AIModel
  onSelect: (model: AIModel) => void
}

const BADGE_COLORS: Record<string, string> = {
  'SMART': 'text-purple-400 border-purple-400/50 bg-purple-400/10',
  'FAST':  'text-green-400 border-green-400/50 bg-green-400/10',
  'FREE':  'text-blue-400 border-blue-400/50 bg-blue-400/10',
}

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: 'ANTHROPIC',
  openai: 'OPENAI',
  gemini: 'GOOGLE',
  groq: 'GROQ',
  huggingface: 'HF',
}

export default function ModelSelector({ models, selected, onSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Group by provider
  const grouped = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = []
    acc[m.provider].push(m)
    return acc
  }, {} as Record<string, AIModel[]>)

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-alzz-surface border border-alzz-border hover:border-alzz-red rounded transition-all duration-200 min-w-[160px]"
      >
        <span className="font-mono text-[10px] text-alzz-red tracking-wider">
          {PROVIDER_LABELS[selected.provider]}
        </span>
        <span className="font-mono text-xs text-alzz-text font-bold flex-1 text-left truncate">
          {selected.name}
        </span>
        {selected.badge && (
          <span className={`font-mono text-[9px] border rounded px-1.5 py-0.5 tracking-wider ${BADGE_COLORS[selected.badge]}`}>
            {selected.badge}
          </span>
        )}
        <span className={`font-mono text-alzz-muted text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-alzz-dark border border-alzz-border rounded shadow-2xl z-50 max-h-96 overflow-y-auto">
          {Object.entries(grouped).map(([provider, providerModels]) => (
            <div key={provider}>
              {/* Provider header */}
              <div className="px-3 py-2 border-b border-alzz-border/50">
                <span className="font-mono text-[9px] text-alzz-red tracking-[0.3em] uppercase">
                  ── {PROVIDER_LABELS[provider]} ──
                </span>
              </div>

              {providerModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => { onSelect(model); setOpen(false) }}
                  className={`
                    w-full text-left px-4 py-3 hover:bg-alzz-surface transition-colors
                    border-b border-alzz-border/30 last:border-0 group
                    ${selected.id === model.id ? 'bg-alzz-red/10 border-l-2 border-l-alzz-red' : ''}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-xs font-bold ${selected.id === model.id ? 'text-alzz-red-bright' : 'text-alzz-text group-hover:text-alzz-red-bright'} transition-colors`}>
                      {model.name}
                    </span>
                    {model.badge && (
                      <span className={`font-mono text-[9px] border rounded px-1.5 py-0.5 tracking-wider ${BADGE_COLORS[model.badge]}`}>
                        {model.badge}
                      </span>
                    )}
                    {selected.id === model.id && (
                      <span className="ml-auto font-mono text-[10px] text-alzz-red-bright">▶ ACTIVE</span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-alzz-muted leading-relaxed line-clamp-2">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
