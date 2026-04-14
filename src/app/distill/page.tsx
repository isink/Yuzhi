import type { Metadata } from 'next'
import Link from 'next/link'
import DistillationWizard from '@/components/DistillationWizard'

export const metadata: Metadata = {
  title: '蒸馏工具 · 与智',
  description: '将领域专家的知识蒸馏成可运行的 skill 文件。上传素材，配置 API Key，AI 自动提炼认知框架。',
}

export default function DistillPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold gradient-text">与智</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600">蒸馏工具</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/skills" className="text-gray-500 hover:text-gray-700 transition-colors">
              Skill 广场
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              ← 首页
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            思维资产蒸馏工具
          </h1>
          <p className="text-gray-500 text-sm">
            上传素材 → AI 分析 → 蒸馏认知框架 → 生成 SKILL.md 文件
          </p>
        </div>

        {/* Wizard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <DistillationWizard />
        </div>

        {/* Tips */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: '💡',
              title: '什么素材最好？',
              desc: '文章 + 访谈组合效果最佳。内容越多、维度越广，蒸馏质量越高。',
            },
            {
              icon: '💰',
              title: 'API 费用参考',
              desc: 'DeepSeek 蒸馏一次约 ¥0.1。Claude 约 ¥0.5-2。使用自己的 Key。',
            },
            {
              icon: '🔒',
              title: '数据安全',
              desc: 'API Key 和素材仅在本次请求中传输，平台不存储任何数据。',
            },
          ].map((tip) => (
            <div key={tip.title} className="bg-white rounded-xl p-4 border border-gray-100 flex gap-3">
              <span className="text-xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{tip.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-xs text-gray-400">
        与智蒸馏工具 · 基于
        <a
          href="https://github.com/alchaincyf/nuwa-skill"
          className="underline mx-1 hover:text-gray-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          女娲.skill
        </a>
        (MIT) 改造
      </footer>
    </div>
  )
}
