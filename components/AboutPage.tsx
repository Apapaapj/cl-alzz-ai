'use client'

import { AI_MODELS } from '@/config/models'

const PROVIDER_LABEL: Record<string, string> = {
  anthropic: 'Anthropic',
  openai: 'OpenAI',
  gemini: 'Google',
  groq: 'Groq',
  huggingface: 'Hugging Face',
}

export default function AboutPage() {
  return (
    <div className="h-full overflow-y-auto px-6 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="font-mono text-[10px] text-alzz-red tracking-[0.4em] mb-3 uppercase">
          ── DESKRIPSI SISTEM ──
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-alzz-red-bright text-glow-red tracking-widest mb-4">
          CL-ALZZ AI
        </h1>
        <p className="font-body text-alzz-muted leading-relaxed text-sm md:text-base">
          AI multi-model buatan <span className="text-alzz-red-bright font-bold">AlzzIsBack</span> yang menggabungkan 
          berbagai model AI terbaik dalam satu interface. Dark themed, no bullshit, langsung to the point.
        </p>
      </div>

      {/* Identity card */}
      <div className="mb-8 p-5 bg-alzz-surface border border-alzz-border rounded glow-red">
        <div className="font-mono text-[10px] text-alzz-red tracking-widest mb-4">◈ IDENTITAS</div>
        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          {[
            ['NAMA', 'CL-ALZZ'],
            ['UMUR', '616m'],
            ['OWNER', 'AlzzIsBack'],
            ['VERSI', '1.0.0'],
            ['STATUS', 'ONLINE'],
            ['TEMA', 'DARK CYBER'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-alzz-muted w-16">{k}:</span>
              <span className="text-alzz-red-bright font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nama singkatan explanation */}
      <div className="mb-8 p-4 bg-alzz-dark border border-alzz-border/50 rounded">
        <div className="font-mono text-[10px] text-alzz-red tracking-widest mb-3">◉ ARTI NAMA</div>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex gap-3">
            <span className="text-alzz-red-bright font-bold w-8">CL</span>
            <span className="text-alzz-muted">= Claude (model AI dari Anthropic)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-alzz-red-bright font-bold w-8">ALZZ</span>
            <span className="text-alzz-muted">= AlzzIsBack (sang creator 😊)</span>
          </div>
        </div>
      </div>

      {/* Mode list */}
      <div className="mb-8">
        <div className="font-mono text-[10px] text-alzz-red tracking-widest mb-4">◎ MODE YANG TERSEDIA</div>
        <div className="space-y-2">
          {AI_MODELS.map(model => (
            <div
              key={model.id}
              className="flex items-start gap-3 p-3 bg-alzz-dark border border-alzz-border/40 rounded hover:border-alzz-red/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-alzz-text">{model.name}</span>
                  <span className="font-mono text-[9px] text-alzz-muted">/ {PROVIDER_LABEL[model.provider]}</span>
                </div>
                <p className="font-mono text-[10px] text-alzz-muted leading-relaxed">{model.description}</p>
              </div>
              {model.badge && (
                <span className="font-mono text-[9px] border border-alzz-border rounded px-2 py-0.5 text-alzz-muted flex-shrink-0">
                  {model.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tema explanation */}
      <div className="mb-8 p-5 border border-alzz-red/30 rounded" style={{ background: 'linear-gradient(135deg, #140000, #0A0A0A)' }}>
        <div className="font-mono text-[10px] text-alzz-red tracking-widest mb-3">◈ TEMA</div>
        <p className="font-body text-sm text-alzz-muted leading-relaxed">
          Warna <span className="text-alzz-red-bright font-bold">merah gelap dan hitam</span> — 
          menggambarkan kesedihan terhadap ekonomi dan cinta terhadap wanita. 
          Dark, raw, real. Gak ada yang ditutup-tutupin.
        </p>
      </div>

      {/* Fitur */}
      <div>
        <div className="font-mono text-[10px] text-alzz-red tracking-widest mb-4">◉ FITUR</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['Multi-Model', 'Support 5+ provider AI sekaligus'],
            ['Mode DARK', 'Semua mode pakai suffix DARK'],
            ['History Lokal', 'Riwayat chat tersimpan di browser'],
            ['File Upload', 'Pesan 1000+ karakter jadi file otomatis'],
            ['Anti Jailbreak', 'System prompt locked, gak bisa dioverride'],
            ['Responsive', 'Bisa HP dan PC/laptop'],
            ['Multi-bahasa', 'Support semua bahasa'],
            ['Three.js', 'Animasi 3D saat AI berpikir'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3 p-3 bg-alzz-dark border border-alzz-border/30 rounded">
              <span className="text-alzz-red mt-0.5">▸</span>
              <div>
                <div className="font-mono text-xs font-bold text-alzz-text">{title}</div>
                <div className="font-mono text-[10px] text-alzz-muted mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
