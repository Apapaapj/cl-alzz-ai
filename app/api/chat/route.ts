// ============================================================
// CL-ALZZ — Chat API Route (SERVER SIDE ONLY)
// API keys TIDAK PERNAH keluar dari file ini ke client.
// Semua provider dihandle di sini.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getModel } from '@/config/models'
import { buildSystemPrompt } from '@/config/system-prompts'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// Rate limit: simple in-memory (for production, use Upstash Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30  // requests per window
const RATE_WINDOW = 60 * 1000  // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  // Get IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak request. Coba lagi dalam 1 menit.' },
      { status: 429 }
    )
  }

  let body: { modelId: string; messages: { role: string; content: string }[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { modelId, messages } = body

  if (!modelId || !messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'modelId dan messages diperlukan' }, { status: 400 })
  }

  const model = getModel(modelId)
  if (!model) {
    return NextResponse.json({ error: 'Model tidak ditemukan' }, { status: 404 })
  }

  // Check API key availability
  const apiKey = process.env[model.envKey]
  if (!apiKey) {
    return NextResponse.json(
      { error: `Maaf kemungkinan mode ini sedang maintenance — API key tidak tersedia.` },
      { status: 503 }
    )
  }

  const systemPrompt = buildSystemPrompt(modelId)

  try {
    switch (model.provider) {
      case 'anthropic':
        return handleAnthropic(apiKey, model.modelId, systemPrompt, messages, model.maxTokens)
      case 'openai':
        return handleOpenAI(apiKey, model.modelId, systemPrompt, messages, model.maxTokens)
      case 'gemini':
        return handleGemini(apiKey, model.modelId, systemPrompt, messages, model.maxTokens)
      case 'groq':
        return handleGroq(apiKey, model.modelId, systemPrompt, messages, model.maxTokens)
      case 'huggingface':
        return handleHuggingFace(apiKey, model.modelId, systemPrompt, messages, model.maxTokens)
      default:
        return NextResponse.json({ error: 'Provider tidak dikenali' }, { status: 400 })
    }
  } catch (err) {
    console.error('[CL-ALZZ API Error]', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server. Coba lagi.' },
      { status: 500 }
    )
  }
}

// ── ANTHROPIC ──────────────────────────────────────────────────
async function handleAnthropic(
  apiKey: string,
  modelId: string,
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
) {
  const client = new Anthropic({ apiKey })

  const formattedMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const stream = await client.messages.stream({
    model: modelId,
    max_tokens: maxTokens,
    system,
    messages: formattedMessages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          const data = JSON.stringify({ delta: chunk.delta.text })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// ── OPENAI ─────────────────────────────────────────────────────
async function handleOpenAI(
  apiKey: string,
  modelId: string,
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
) {
  const client = new OpenAI({ apiKey })

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: system },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  const stream = await client.chat.completions.create({
    model: modelId,
    max_tokens: maxTokens,
    messages: openaiMessages,
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          const data = JSON.stringify({ delta })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}

// ── GEMINI ─────────────────────────────────────────────────────
async function handleGemini(
  apiKey: string,
  modelId: string,
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: system,
    generationConfig: { maxOutputTokens: maxTokens },
  })

  // Build Gemini history format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }))

  const lastMessage = messages[messages.length - 1].content

  const chat = geminiModel.startChat({ history })
  const result = await chat.sendMessageStream(lastMessage)

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          const data = JSON.stringify({ delta: text })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}

// ── GROQ ───────────────────────────────────────────────────────
async function handleGroq(
  apiKey: string,
  modelId: string,
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
) {
  const client = new Groq({ apiKey })

  const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: system },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ]

  const stream = await client.chat.completions.create({
    model: modelId,
    max_tokens: maxTokens,
    messages: groqMessages,
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          const data = JSON.stringify({ delta })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}

// ── HUGGING FACE ───────────────────────────────────────────────
async function handleHuggingFace(
  apiKey: string,
  modelId: string,
  system: string,
  messages: { role: string; content: string }[],
  maxTokens: number
) {
  // Build prompt for HF inference API
  const prompt = [
    `<s>[INST] <<SYS>>\n${system}\n<</SYS>>\n\n`,
    ...messages.map((m, i) => {
      if (m.role === 'user') {
        const isFirst = i === 0
        return isFirst ? `${m.content} [/INST]` : `[INST] ${m.content} [/INST]`
      }
      return ` ${m.content} </s><s>`
    }),
  ].join('')

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${modelId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          return_full_text: false,
          temperature: 0.7,
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HuggingFace error: ${err}`)
  }

  const data = await res.json()
  const content = data[0]?.generated_text || ''

  return NextResponse.json({ content })
}
