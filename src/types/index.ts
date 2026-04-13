export type ApiProvider = 'deepseek' | 'claude' | 'openai' | 'doubao' | 'kimi'

export interface ApiConfig {
  provider: ApiProvider
  apiKey: string
  model?: string
}

export type DistillStep =
  | 'info'
  | 'upload'
  | 'analyzing'
  | 'analyzed'
  | 'distilling'
  | 'distilled'
  | 'generating'
  | 'done'

export interface MaterialAnalysis {
  scores: {
    writings: number
    interviews: number
    fragments: number
    decisions: number
    external: number
    timeline: number
  }
  overallQuality: '优秀' | '良好' | '一般' | '较差'
  suggestions: string[]
  shouldContinue: boolean
  reason: string
  rawText: string
}

export interface DistillationResult {
  mentalModels: MentalModel[]
  heuristics: string[]
  expressionDNA: ExpressionDNA
  examples: ScenarioExample[]
  honestLimits: string[]
  materialSources: string[]
  rawText: string
}

export interface MentalModel {
  name: string
  definition: string
  manifestation: string
  evidence: string
}

export interface ExpressionDNA {
  signatures: string
  rhythm: string
  tone: string
  responseStyle: string
}

export interface ScenarioExample {
  scenario: string
  response: string
}

export interface SkillPackage {
  skillMd: string
  personName: string
  domain: string
  date: string
  materialCount: number
  uploaderName: string
  distillation: DistillationResult
  rawMaterial: string
}

export interface DistillationState {
  step: DistillStep
  personName: string
  domain: string
  uploaderName: string
  apiConfig: ApiConfig | null
  rawMaterial: string
  analysis: MaterialAnalysis | null
  distillation: DistillationResult | null
  skillPackage: SkillPackage | null
  error: string | null
}

export const PROVIDER_LABELS: Record<ApiProvider, string> = {
  deepseek: 'DeepSeek',
  claude: 'Claude (Anthropic)',
  openai: 'GPT (OpenAI)',
  doubao: '豆包 (字节)',
  kimi: 'Kimi (月之暗面)',
}

export const PROVIDER_MODELS: Record<ApiProvider, { analysis: string; distill: string; generate: string }> = {
  deepseek: {
    analysis: 'deepseek-chat',
    distill: 'deepseek-reasoner',
    generate: 'deepseek-chat',
  },
  claude: {
    analysis: 'claude-opus-4-6',
    distill: 'claude-opus-4-6',
    generate: 'claude-sonnet-4-6',
  },
  openai: {
    analysis: 'gpt-4o-mini',
    distill: 'gpt-4o',
    generate: 'gpt-4o-mini',
  },
  doubao: {
    analysis: 'doubao-pro-32k',
    distill: 'doubao-pro-32k',
    generate: 'doubao-pro-32k',
  },
  kimi: {
    analysis: 'moonshot-v1-32k',
    distill: 'moonshot-v1-128k',
    generate: 'moonshot-v1-32k',
  },
}

export const DOMAINS = [
  '创业 / 商业',
  '投资 / 金融',
  '产品 / 设计',
  '技术 / 工程',
  '营销 / 增长',
  '管理 / 领导力',
  '写作 / 内容',
  '教育 / 培训',
  '心理 / 情感',
  '医疗 / 健康',
  '法律 / 合规',
  '艺术 / 创作',
  '其他',
]
