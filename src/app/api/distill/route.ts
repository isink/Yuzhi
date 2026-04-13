import { NextRequest } from 'next/server'
import { callAI, extractJSON, detectAIError } from '@/lib/api-client'
import { buildDistillationPrompt } from '@/lib/prompts'
import { ApiConfig, DistillationResult, PROVIDER_MODELS } from '@/types'

// Distillation (especially with deepseek-reasoner) can take 60-120s.
// Vercel Hobby: 60s max. Vercel Pro: 300s max.
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, personName, domain, apiConfig } = body as {
      content: string
      personName: string
      domain: string
      apiConfig: ApiConfig
    }

    if (!content?.trim()) {
      return Response.json({ error: '素材内容不能为空' }, { status: 400 })
    }
    if (!personName?.trim()) {
      return Response.json({ error: '请填写人物姓名' }, { status: 400 })
    }
    if (!apiConfig?.apiKey) {
      return Response.json({ error: '请提供 API Key' }, { status: 400 })
    }

    const model = PROVIDER_MODELS[apiConfig.provider].distill
    const prompt = buildDistillationPrompt(content, personName, domain)

    const rawResult = await callAI(apiConfig, model, prompt, 6000)

    const aiError = detectAIError(rawResult)
    if (aiError) return Response.json({ error: aiError }, { status: 502 })

    const jsonStr = extractJSON(rawResult)
    const distillation: DistillationResult = JSON.parse(jsonStr)

    return Response.json({ distillation, rawText: rawResult })
  } catch (error) {
    const message = error instanceof Error ? error.message : '蒸馏失败'
    return Response.json({ error: message }, { status: 500 })
  }
}
