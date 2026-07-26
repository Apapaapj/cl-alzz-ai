// ============================================================
// CL-ALZZ — Models Availability API
// Hanya mengirim status available/not, TIDAK mengirim API key
// ============================================================

import { NextResponse } from 'next/server'
import { AI_MODELS } from '@/config/models'

export async function GET() {
  const availability = AI_MODELS.map(model => ({
    id: model.id,
    name: model.name,
    provider: model.provider,
    description: model.description,
    badge: model.badge,
    supportsStreaming: model.supportsStreaming,
    // HANYA available status, TIDAK API key
    available: !!process.env[model.envKey],
  }))

  return NextResponse.json({ models: availability })
}
