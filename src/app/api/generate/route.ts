import { NextRequest } from 'next/server'
import { callAI } from '@/lib/api-client'
import { buildSkillGenerationPrompt } from '@/lib/prompts'
import { ApiConfig, DistillationResult, PROVIDER_MODELS } from '@/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { distillation, personName, domain, uploaderName, apiConfig, materialCount } = body as {
      distillation: DistillationResult
      personName: string
      domain: string
      uploaderName: string
      apiConfig: ApiConfig
      materialCount: number
    }

    if (!distillation) {
      return Response.json({ error: '缺少蒸馏结果' }, { status: 400 })
    }
    if (!apiConfig?.apiKey) {
      return Response.json({ error: '请提供 API Key' }, { status: 400 })
    }

    const date = new Date().toISOString().split('T')[0]
    const model = PROVIDER_MODELS[apiConfig.provider].generate
    const prompt = buildSkillGenerationPrompt(
      JSON.stringify(distillation, null, 2),
      personName,
      domain,
      uploaderName,
      date,
      materialCount
    )

    const skillMd = await callAI(apiConfig, model, prompt, 4096)

    return Response.json({
      skillMd,
      personName,
      domain,
      date,
      materialCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Skill 文件生成失败'
    return Response.json({ error: message }, { status: 500 })
  }
}
