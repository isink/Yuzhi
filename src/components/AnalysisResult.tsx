'use client'

import { MaterialAnalysis } from '@/types'

interface AnalysisResultProps {
  analysis: MaterialAnalysis
  onContinue: () => void
  onBack: () => void
}

const DIMENSION_LABELS: Record<string, string> = {
  writings: '著作与系统思考',
  interviews: '对话与访谈',
  fragments: '碎片表达',
  decisions: '决策记录',
  external: '外部视角',
  timeline: '人生时间线',
}

const QUALITY_COLORS: Record<string, string> = {
  优秀: 'text-green-700 bg-green-50 border-green-200',
  良好: 'text-blue-700 bg-blue-50 border-blue-200',
  一般: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  较差: 'text-red-700 bg-red-50 border-red-200',
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 w-4">{score}</span>
    </div>
  )
}

export default function AnalysisResult({ analysis, onContinue, onBack }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">素材分析结果</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${QUALITY_COLORS[analysis.overallQuality] || 'text-gray-700 bg-gray-50 border-gray-200'}`}>
          {analysis.overallQuality}
        </span>
      </div>

      {/* Dimension scores */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        {Object.entries(analysis.scores).map(([key, score]) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">{DIMENSION_LABELS[key] || key}</span>
            </div>
            <ScoreBar score={score} />
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">补充建议</h4>
          <ul className="space-y-1.5">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI recommendation */}
      <div className={`rounded-xl p-4 border ${analysis.shouldContinue ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">{analysis.shouldContinue ? '✅' : '⚠️'}</span>
          <div>
            <p className={`text-sm font-medium ${analysis.shouldContinue ? 'text-green-800' : 'text-yellow-800'}`}>
              {analysis.shouldContinue ? '建议继续蒸馏' : '建议补充素材'}
            </p>
            <p className={`text-sm mt-1 ${analysis.shouldContinue ? 'text-green-700' : 'text-yellow-700'}`}>
              {analysis.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          返回修改素材
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
        >
          {analysis.shouldContinue ? '开始蒸馏' : '仍然继续蒸馏'}
        </button>
      </div>
    </div>
  )
}
