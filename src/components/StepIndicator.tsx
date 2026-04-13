'use client'

interface Step {
  label: string
  key: string
}

const STEPS: Step[] = [
  { label: '基本信息', key: 'info' },
  { label: '上传素材', key: 'upload' },
  { label: '素材分析', key: 'analyze' },
  { label: '核心蒸馏', key: 'distill' },
  { label: '生成文件', key: 'generate' },
  { label: '下载', key: 'done' },
]

const STEP_ORDER = ['info', 'upload', 'analyzing', 'analyzed', 'distilling', 'distilled', 'generating', 'done']

function getStepIndex(key: string): number {
  const mapping: Record<string, number> = {
    info: 0,
    upload: 1,
    analyzing: 2,
    analyzed: 2,
    distilling: 3,
    distilled: 3,
    generating: 4,
    done: 5,
  }
  return mapping[key] ?? 0
}

interface StepIndicatorProps {
  currentStep: string
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const current = getStepIndex(currentStep)

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-8">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i < current
                  ? 'bg-indigo-600 text-white'
                  : i === current
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < current ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`mt-1.5 text-xs hidden sm:block ${
                i <= current ? 'text-gray-700 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* Connector */}
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-12 mx-1 sm:mx-2 transition-all ${
                i < current ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
