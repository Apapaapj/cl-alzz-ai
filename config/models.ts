// ============================================================
// CL-ALZZ — Model Configuration
// Tambah/hapus mode di sini. User tidak bisa edit file ini.
// ============================================================

export type ModelProvider = 
  | 'anthropic' 
  | 'openai' 
  | 'gemini' 
  | 'groq' 
  | 'huggingface'

export interface AIModel {
  id: string
  name: string           // Nama yang tampil ke user
  provider: ModelProvider
  modelId: string        // Model ID yang dikirim ke API
  description: string
  badge?: string         // e.g. "FAST", "SMART", "FREE"
  maxTokens: number
  supportsStreaming: boolean
  envKey: string         // Nama env variable untuk cek ketersediaan
}

export const AI_MODELS: AIModel[] = [
  // ── ANTHROPIC ──────────────────────────────────────────
  {
    id: 'claude-dark',
    name: 'CLAUDE DARK',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    description: 'Model Claude terkuat. Analisis mendalam, coding kompleks, pemahaman konteks panjang. Cocok untuk tugas berat.',
    badge: 'SMART',
    maxTokens: 8192,
    supportsStreaming: true,
    envKey: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'claude-haiku-dark',
    name: 'CLAUDE HAIKU DARK',
    provider: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
    description: 'Claude versi cepat & ringan. Respons instan untuk chat kasual dan pertanyaan singkat.',
    badge: 'FAST',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'ANTHROPIC_API_KEY',
  },

  // ── OPENAI ─────────────────────────────────────────────
  {
    id: 'gpt4o-dark',
    name: 'GPT-4o DARK',
    provider: 'openai',
    modelId: 'gpt-4o',
    description: 'GPT terbaru dari OpenAI. Multimodal, logika kuat, nulis kreatif. Mode andalan untuk versatilitas.',
    badge: 'SMART',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'OPENAI_API_KEY',
  },
  {
    id: 'gpt4o-mini-dark',
    name: 'GPT-4o MINI DARK',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    description: 'GPT ringan dan hemat. Cocok untuk tugas sehari-hari tanpa perlu kekuatan penuh GPT-4o.',
    badge: 'FAST',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'OPENAI_API_KEY',
  },

  // ── GEMINI ─────────────────────────────────────────────
  {
    id: 'gemini-dark',
    name: 'GEMINI DARK',
    provider: 'gemini',
    modelId: 'gemini-1.5-pro',
    description: 'Google Gemini Pro. Context window terbesar, unggul dalam riset panjang dan multi-dokumen.',
    badge: 'SMART',
    maxTokens: 8192,
    supportsStreaming: true,
    envKey: 'GEMINI_API_KEY',
  },
  {
    id: 'gemini-flash-dark',
    name: 'GEMINI FLASH DARK',
    provider: 'gemini',
    modelId: 'gemini-1.5-flash',
    description: 'Gemini versi kilat. Respons super cepat, cocok untuk iterasi cepat dan brainstorming.',
    badge: 'FAST',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'GEMINI_API_KEY',
  },

  // ── GROQ ───────────────────────────────────────────────
  {
    id: 'llama-dark',
    name: 'LLAMA DARK',
    provider: 'groq',
    modelId: 'llama-3.1-70b-versatile',
    description: 'Meta LLaMA via Groq — inferensi tercepat di dunia. Open source, kenceng, gak minta maaf.',
    badge: 'FAST',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'GROQ_API_KEY',
  },
  {
    id: 'mixtral-dark',
    name: 'MIXTRAL DARK',
    provider: 'groq',
    modelId: 'mixtral-8x7b-32768',
    description: 'Mixtral MoE via Groq. Multi-expert architecture, strong untuk multilingual dan technical tasks.',
    badge: 'SMART',
    maxTokens: 4096,
    supportsStreaming: true,
    envKey: 'GROQ_API_KEY',
  },

  // ── HUGGING FACE ───────────────────────────────────────
  {
    id: 'hf-mistral-dark',
    name: 'MISTRAL DARK',
    provider: 'huggingface',
    modelId: 'mistralai/Mistral-7B-Instruct-v0.3',
    description: 'Mistral 7B via Hugging Face. Ringan tapi tajam. Pilihan solid untuk coding dan reasoning.',
    badge: 'FREE',
    maxTokens: 2048,
    supportsStreaming: false,
    envKey: 'HUGGINGFACE_API_KEY',
  },
]

// Helper: cek model by ID
export function getModel(id: string): AIModel | undefined {
  return AI_MODELS.find(m => m.id === id)
}

// Helper: cek apakah provider tersedia (ada env key-nya)
// Dipanggil SERVER-SIDE ONLY
export function isProviderAvailable(envKey: string): boolean {
  return !!process.env[envKey]
}
