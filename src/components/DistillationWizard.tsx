'use client'

import { useState, useRef, useCallback } from 'react'
import { ApiConfig, ApiProvider, DistillationState, DOMAINS, PROVIDER_LABELS, PROVIDER_MODELS } from '@/types'
import StepIndicator from './StepIndicator'
import LoadingDots from './LoadingDots'
import AnalysisResult from './AnalysisResult'
import SkillPreview from './SkillPreview'

const initialState: DistillationState = {
  step: 'info',
  personName: '',
  domain: DOMAINS[0],
  uploaderName: '匿名用户',
  apiConfig: null,
  rawMaterial: '',
  analysis: null,
  distillation: null,
  skillPackage: null,
  error: null,
}

export default function DistillationWizard() {
  const [state, setState] = useState<DistillationState>(initialState)
  const [provider, setProvider] = useState<ApiProvider>('deepseek')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<DistillationState>) =>
    setState((s) => ({ ...s, ...patch }))

  // ── Step 1: Info ──────────────────────────────────────────────────────────
  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!state.personName.trim()) {
      update({ error: '请填写被蒸馏人物的姓名' })
      return
    }
    if (!apiKey.trim()) {
      update({ error: '请填写 API Key' })
      return
    }
    const apiConfig: ApiConfig = { provider, apiKey }
    update({ apiConfig, error: null, step: 'upload' })
  }

  // ── Step 2: File upload ───────────────────────────────────────────────────
  async function handleFileUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      update({ error: '文件大小不能超过 10MB' })
      return
    }
    setFileName(file.name)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/parse-pdf', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      update({ rawMaterial: data.text, error: null })
    } catch (err) {
      update({ error: err instanceof Error ? err.message : '文件解析失败' })
    }
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleFileUpload(file)
  }, [])

  function handleMaterialSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!state.rawMaterial.trim() || state.rawMaterial.trim().length < 100) {
      update({ error: '素材内容太少（至少 100 字），请补充更多内容' })
      return
    }
    runAnalysis()
  }

  // ── Step 3: Analysis ──────────────────────────────────────────────────────
  async function runAnalysis() {
    update({ step: 'analyzing', error: null })
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: state.rawMaterial, apiConfig: state.apiConfig }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      update({ analysis: data.analysis, step: 'analyzed' })
    } catch (err) {
      update({ error: err instanceof Error ? err.message : '分析失败，请检查 API Key 是否正确', step: 'upload' })
    }
  }

  // ── Step 4: Distillation ──────────────────────────────────────────────────
  async function runDistillation() {
    update({ step: 'distilling', error: null })
    try {
      const res = await fetch('/api/distill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: state.rawMaterial,
          personName: state.personName,
          domain: state.domain,
          apiConfig: state.apiConfig,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      update({ distillation: data.distillation, step: 'distilled' })
      // Auto-proceed to generation
      await runGeneration(data.distillation)
    } catch (err) {
      update({ error: err instanceof Error ? err.message : '蒸馏失败，请检查 API Key 是否正确', step: 'analyzed' })
    }
  }

  // ── Step 5: Skill generation ──────────────────────────────────────────────
  async function runGeneration(distillation = state.distillation) {
    update({ step: 'generating', error: null })
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distillation,
          personName: state.personName,
          domain: state.domain,
          uploaderName: state.uploaderName,
          apiConfig: state.apiConfig,
          materialCount: state.rawMaterial.length,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      update({
        skillPackage: {
          skillMd: data.skillMd,
          personName: data.personName,
          domain: data.domain,
          date: data.date,
          materialCount: data.materialCount,
        },
        step: 'done',
      })
    } catch (err) {
      update({ error: err instanceof Error ? err.message : 'Skill 文件生成失败', step: 'distilled' })
    }
  }

  // ── Download ──────────────────────────────────────────────────────────────
  function handleDownload() {
    if (!state.skillPackage) return
    const blob = new Blob([state.skillPackage.skillMd], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.personName.replace(/\s+/g, '_')}.skill.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleRestart() {
    setState(initialState)
    setApiKey('')
    setFileName('')
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  const PROVIDER_OPTIONS: Array<{ value: ApiProvider; label: string; hint: string }> = [
    { value: 'deepseek', label: 'DeepSeek', hint: '推荐 · 国内可用 · 极低费用' },
    { value: 'claude', label: 'Claude', hint: '推理最强 · 需要梯子' },
    { value: 'openai', label: 'GPT (OpenAI)', hint: '通用 · 需要梯子' },
    { value: 'doubao', label: '豆包', hint: '国内可用' },
    { value: 'kimi', label: 'Kimi', hint: '国内可用 · 长文本好' },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator currentStep={state.step} />

      {/* Error banner */}
      {state.error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500 flex-shrink-0">⚠️</span>
          <p className="text-sm text-red-700">{state.error}</p>
          <button
            onClick={() => update({ error: null })}
            className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── STEP 1: Info ── */}
      {state.step === 'info' && (
        <form onSubmit={handleInfoSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">基本信息</h2>
            <p className="text-sm text-gray-500">填写被蒸馏对象的信息和你的 API Key</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                被蒸馏人物姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.personName}
                onChange={(e) => update({ personName: e.target.value })}
                placeholder="例如：张三、某创业导师"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                所在领域 <span className="text-red-500">*</span>
              </label>
              <select
                value={state.domain}
                onChange={(e) => update({ domain: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                你的昵称（可选）
              </label>
              <input
                type="text"
                value={state.uploaderName}
                onChange={(e) => update({ uploaderName: e.target.value })}
                placeholder="上传者昵称（将写入 skill 文件）"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API 提供商 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROVIDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setProvider(opt.value)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      provider === opt.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className={`text-xs mt-0.5 ${provider === opt.value ? 'text-indigo-500' : 'text-gray-400'}`}>
                      {opt.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                API Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`输入你的 ${PROVIDER_LABELS[provider]} API Key`}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                🔒 Key 仅在本次请求中使用，不存储于平台服务器
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            下一步：上传素材 →
          </button>
        </form>
      )}

      {/* ── STEP 2: Upload ── */}
      {state.step === 'upload' && (
        <form onSubmit={handleMaterialSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">上传素材</h2>
            <p className="text-sm text-gray-500">
              上传关于 <strong className="text-gray-700">{state.personName}</strong> 的文章、访谈、演讲等文字内容
            </p>
          </div>

          {/* Drag & drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) await handleFileUpload(file)
              }}
            />
            <div className="text-3xl mb-2">{fileName ? '📄' : '📁'}</div>
            {fileName ? (
              <div>
                <p className="text-sm font-medium text-indigo-600">{fileName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {state.rawMaterial.length.toLocaleString()} 字 · 点击重新上传
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">拖放或点击上传文件</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF、TXT、Markdown，最大 10MB</p>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">或直接粘贴文字</span>
            </div>
          </div>

          <div>
            <textarea
              value={state.rawMaterial}
              onChange={(e) => update({ rawMaterial: e.target.value })}
              placeholder="把文章、访谈记录、演讲稿等内容粘贴到这里……&#10;&#10;素材越丰富，蒸馏质量越高。建议至少 1000 字。"
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
            />
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-gray-400">建议 1000 字以上，内容越多越好</p>
              <p className="text-xs text-gray-400">{state.rawMaterial.length.toLocaleString()} 字</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => update({ step: 'info' })}
              className="py-3 px-5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              ← 返回
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              分析素材质量 →
            </button>
          </div>
        </form>
      )}

      {/* ── STEP: Analyzing ── */}
      {state.step === 'analyzing' && (
        <div className="text-center py-12">
          <LoadingDots label="AI 正在分析素材质量，大约需要 10-30 秒……" />
          <p className="text-xs text-gray-400 mt-4">
            使用 {PROVIDER_LABELS[state.apiConfig?.provider || 'deepseek']} 分析中
          </p>
        </div>
      )}

      {/* ── STEP: Analyzed ── */}
      {state.step === 'analyzed' && state.analysis && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">素材分析完成</h2>
          <AnalysisResult
            analysis={state.analysis}
            onContinue={runDistillation}
            onBack={() => update({ step: 'upload', analysis: null })}
          />
        </div>
      )}

      {/* ── STEP: Distilling ── */}
      {state.step === 'distilling' && (
        <div className="text-center py-12">
          <LoadingDots label="AI 正在深度蒸馏认知框架，这需要 30-120 秒……" />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>提炼心智模型 · 决策启发式 · 表达 DNA</p>
            <p>使用 {PROVIDER_LABELS[state.apiConfig?.provider || 'deepseek']} 推理中</p>
          </div>
        </div>
      )}

      {/* ── STEP: Generating ── */}
      {state.step === 'generating' && (
        <div className="text-center py-12">
          <LoadingDots label="正在生成标准格式 SKILL.md 文件……" />
        </div>
      )}

      {/* ── STEP: Done ── */}
      {state.step === 'done' && state.skillPackage && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">蒸馏完成</h2>
          <SkillPreview
            skillPackage={state.skillPackage}
            onDownload={handleDownload}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  )
}
