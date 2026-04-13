import { NextRequest } from 'next/server'
import { callAI, extractJSON } from '@/lib/api-client'
import { buildValidationPrompt } from '@/lib/prompts'
import { ApiConfig, PROVIDER_MODELS } from '@/types'

interface ValidationResult {
  scores: {
    consistency: number
    coverage: number
    accuracy: number
    honesty: number
    noFabrication: number
  }
  overallScore: number
  verdict: '通过' | '需要修改' | '拒绝上架'
  reason: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { materialSummary, skillContent, apiConfig } = body as {
      materialSummary: string
      skillContent: string
      apiConfig: ApiConfig
    }

    if (!materialSummary || !skillContent) {
      return Response.json({ error: '缺少素材或 skill 内容' }, { status: 400 })
    }
    if (!apiConfig?.apiKey) {
      return Response.json({ error: '请提供 API Key' }, { status: 400 })
    }

    const model = PROVIDER_MODELS[apiConfig.provider].generate
    const prompt = buildValidationPrompt(materialSummary.slice(0, 2000), skillContent)

    const rawResult = await callAI(apiConfig, model, prompt, 1024)
    const jsonStr = extractJSON(rawResult)
    const validation: ValidationResult = JSON.parse(jsonStr)

    return Response.json({ validation })
  } catch (error) {
    const message = error instanceof Error ? error.message : '校验失败'
    return Response.json({ error: message }, { status: 500 })
  }
}
