import { NextRequest } from 'next/server'
import { callAI, extractJSON } from '@/lib/api-client'
import { buildAnalysisPrompt } from '@/lib/prompts'
import { ApiConfig, MaterialAnalysis, PROVIDER_MODELS } from '@/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, apiConfig } = body as { content: string; apiConfig: ApiConfig }

    if (!content?.trim()) {
      return Response.json({ error: '素材内容不能为空' }, { status: 400 })
    }
    if (!apiConfig?.apiKey) {
      return Response.json({ error: '请提供 API Key' }, { status: 400 })
    }

    const model = PROVIDER_MODELS[apiConfig.provider].analysis
    const prompt = buildAnalysisPrompt(content.slice(0, 12000)) // limit for analysis

    const rawResult = await callAI(apiConfig, model, prompt, 2048)
    const jsonStr = extractJSON(rawResult)
    const analysis: MaterialAnalysis = JSON.parse(jsonStr)

    return Response.json({ analysis, rawText: rawResult })
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失败'
    return Response.json({ error: message }, { status: 500 })
  }
}
