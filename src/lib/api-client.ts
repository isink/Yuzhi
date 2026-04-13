import { jsonrepair } from 'jsonrepair'
import { ApiConfig, ApiProvider } from '@/types'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ApiEndpoint {
  baseUrl: string
  path: string
  authHeader: string
}

const ENDPOINTS: Record<ApiProvider, ApiEndpoint> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    path: '/chat/completions',
    authHeader: 'Bearer',
  },
  claude: {
    baseUrl: 'https://api.anthropic.com',
    path: '/v1/messages',
    authHeader: 'x-api-key',
  },
  openai: {
    baseUrl: 'https://api.openai.com',
    path: '/v1/chat/completions',
    authHeader: 'Bearer',
  },
  doubao: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    path: '/api/v3/chat/completions',
    authHeader: 'Bearer',
  },
  kimi: {
    baseUrl: 'https://api.moonshot.cn',
    path: '/v1/chat/completions',
    authHeader: 'Bearer',
  },
}

async function callOpenAICompatible(
  config: ApiConfig,
  model: string,
  messages: ChatMessage[],
  maxTokens: number = 4096
): Promise<string> {
  const endpoint = ENDPOINTS[config.provider]
  const url = `${endpoint.baseUrl}${endpoint.path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `${endpoint.authHeader} ${config.apiKey}`,
  }

  const body = JSON.stringify({
    model,
    messages,
    max_tokens: maxTokens,
    temperature: 0.3,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callClaudeAPI(
  config: ApiConfig,
  model: string,
  userMessage: string,
  maxTokens: number = 4096
): Promise<string> {
  const endpoint = ENDPOINTS.claude
  const url = `${endpoint.baseUrl}${endpoint.path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': config.apiKey,
    'anthropic-version': '2023-06-01',
  }

  const body = JSON.stringify({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userMessage }],
  })

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

export async function callAI(
  config: ApiConfig,
  model: string,
  prompt: string,
  maxTokens: number = 4096
): Promise<string> {
  if (config.provider === 'claude') {
    return callClaudeAPI(config, model, prompt, maxTokens)
  }

  const messages: ChatMessage[] = [{ role: 'user', content: prompt }]
  return callOpenAICompatible(config, model, messages, maxTokens)
}

/** Detect common non-JSON error responses from AI providers and return a
 *  human-readable Chinese message, or null if the text looks like real JSON. */
export function detectAIError(text: string): string | null {
  const t = text.trim()
  if (t.startsWith('{') || t.startsWith('[')) return null // looks like JSON, let caller parse
  // Map common AI provider error strings to friendly messages
  if (/quota|rate.?limit|insufficient.?balance|余额不足|账户欠费/i.test(t))
    return 'API 余额不足或触发限流，请检查账户余额后重试'
  if (/content.?policy|content.?filter|sensitive|违规|审核/i.test(t))
    return '素材内容触发了 AI 内容审核，请精简或调整素材后重试'
  if (/invalid.?api.?key|authentication|api key/i.test(t))
    return 'API Key 无效，请检查后重新填写'
  if (/timeout|timed.?out|超时/i.test(t))
    return '请求超时，素材过长或网络不稳定，请缩短素材或稍后重试'
  if (/error/i.test(t))
    return `AI 返回了错误响应，请稍后重试（${t.slice(0, 60)}）`
  return `AI 未返回有效内容，请重试（${t.slice(0, 60)}）`
}

export function extractJSON(text: string): string {
  // Step 1: extract candidate from markdown code block or raw object
  let candidate = text
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (codeBlock) {
    candidate = codeBlock[1]
  } else {
    const objectMatch = text.match(/\{[\s\S]*\}/)
    if (objectMatch) candidate = objectMatch[0]
  }

  // Step 2: fast path — valid as-is
  try {
    JSON.parse(candidate)
    return candidate
  } catch {
    // fall through to repair
  }

  // Step 3: jsonrepair handles unescaped quotes, trailing commas,
  //         missing quotes, and most other LLM JSON quirks
  try {
    return jsonrepair(candidate)
  } catch {
    // fall through
  }

  // Step 4: last resort — replace Chinese/fullwidth quotes then repair
  try {
    const withAsciiQuotes = candidate
      .replace(/[\u201c\u201d\u300c\u300d\uff02]/g, '"')
      .replace(/[\u2018\u2019\u300e\u300f\uff07]/g, "'")
    return jsonrepair(withAsciiQuotes)
  } catch {
    // fall through
  }

  // Step 5: return best candidate and let callers surface the error
  return candidate
}
