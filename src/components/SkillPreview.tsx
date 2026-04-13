'use client'

import { SkillPackage } from '@/types'

interface SkillPreviewProps {
  skillPackage: SkillPackage
  onDownload: () => void
  onRestart: () => void
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^---$/gm, '<hr/>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$2</h2>'.replace('$2', '$1'))
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

export default function SkillPreview({ skillPackage, onDownload, onRestart }: SkillPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🎉</span>
        <div>
          <p className="font-semibold text-green-800">Skill 文件生成成功！</p>
          <p className="text-sm text-green-700 mt-1">
            已为 <strong>{skillPackage.personName}</strong> 生成认知框架 skill 文件
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '人物', value: skillPackage.personName },
          { label: '领域', value: skillPackage.domain },
          { label: '蒸馏日期', value: skillPackage.date },
          { label: '素材字数', value: `约 ${skillPackage.materialCount.toLocaleString()} 字` },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="text-sm font-medium text-gray-800 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* SKILL.md preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-600">SKILL.md</span>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">预览</span>
          </div>
          <span className="text-xs text-gray-400">{skillPackage.skillMd.length.toLocaleString()} 字符</span>
        </div>
        <div className="p-4 max-h-72 overflow-y-auto">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {skillPackage.skillMd}
          </pre>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载 SKILL.md 文件
        </button>
        <button
          onClick={onRestart}
          className="sm:w-auto py-3.5 px-6 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          蒸馏新的 Skill
        </button>
      </div>

      {/* Upload teaser */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <p className="text-sm font-medium text-indigo-800 mb-1">想让更多人用上这个 skill？</p>
        <p className="text-sm text-indigo-600">
          平台上传功能即将开放，上传后用户调用时你将获得收益分成。敬请期待。
        </p>
      </div>
    </div>
  )
}
