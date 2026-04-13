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

export function extractJSON(text: string): string {
  // Try to find JSON in the response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (jsonMatch) return jsonMatch[1]

  // Try to find raw JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/)
  if (objectMatch) return objectMatch[0]

  return text
}
