'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Seed data ─────────────────────────────────────────────────────────────────
// TODO: replace with database query when platform is live

type QualityTier = 'official' | 'verified' | 'community'

interface Skill {
  id: string
  personName: string
  domain: string
  category: string
  tier: QualityTier
  rating: number
  callCount: number
  description: string
  tags: string[]
  isNew?: boolean
}

const SKILLS: Skill[] = [
  {
    id: 'wang-yangming',
    personName: '王阳明',
    domain: '心学 / 哲学',
    category: '人生',
    tier: 'official',
    rating: 4.9,
    callCount: 312,
    description: '知行合一、心即理、致良知。用王阳明的思维框架面对人生困境、道德抉择与自我修炼。',
    tags: ['知行合一', '心学', '人生哲学'],
    isNew: true,
  },
  {
    id: 'charlie-munger',
    personName: '查理·芒格',
    domain: '投资 / 商业',
    category: '投资',
    tier: 'official',
    rating: 4.8,
    callCount: 891,
    description: '多元思维模型、逆向思考、护城河理论。用芒格的认知框架做投资决策与商业判断。',
    tags: ['价值投资', '心智模型', '逆向思考'],
  },
  {
    id: 'richard-feynman',
    personName: '理查德·费曼',
    domain: '教育 / 物理',
    category: '学习',
    tier: 'official',
    rating: 4.9,
    callCount: 654,
    description: '费曼学习法、第一性原理思维。用费曼式的方法理解任何复杂概念，打破权威迷思。',
    tags: ['费曼学习法', '第一性原理', '深度理解'],
  },
  {
    id: 'zeng-guofan',
    personName: '曾国藩',
    domain: '管理 / 领导力',
    category: '管理',
    tier: 'official',
    rating: 4.7,
    callCount: 428,
    description: '识人用人、自我修炼、危机处置。以曾国藩的处世智慧解决组织管理与人际关系难题。',
    tags: ['识人', '领导力', '自我管理'],
  },
  {
    id: 'naval-ravikant',
    personName: 'Naval Ravikant',
    domain: '创业 / 人生',
    category: '创业',
    tier: 'verified',
    rating: 4.6,
    callCount: 276,
    description: '财富创造、杠杆原理、快乐哲学。Naval 的思维框架帮助你做关于创业、财富和人生的决策。',
    tags: ['财富自由', '杠杆', '人生哲学'],
  },
  {
    id: 'confucius',
    personName: '孔子',
    domain: '教育 / 伦理',
    category: '人生',
    tier: 'official',
    rating: 4.8,
    callCount: 203,
    description: '仁义礼智、因材施教、中庸之道。以孔子的教育思想和伦理框架面对人际关系与自我成长。',
    tags: ['仁义', '中庸', '修身'],
    isNew: true,
  },
  {
    id: 'paul-graham',
    personName: 'Paul Graham',
    domain: '创业 / 产品',
    category: '创业',
    tier: 'verified',
    rating: 4.5,
    callCount: 189,
    description: '做用户喜欢的东西、快速迭代、保持简单。YC 创始人的创业方法论，适合早期产品决策。',
    tags: ['创业', '产品', '早期团队'],
  },
  {
    id: 'sun-tzu',
    personName: '孙子',
    domain: '策略 / 管理',
    category: '管理',
    tier: 'community',
    rating: 4.4,
    callCount: 156,
    description: '知己知彼、不战而屈人之兵、奇正之变。用孙子兵法的策略思维处理竞争与博弈场景。',
    tags: ['竞争策略', '博弈', '决策'],
  },
]

const CATEGORIES = ['全部', '投资', '学习', '创业', '管理', '人生']

const TIER_CONFIG: Record<QualityTier, { label: string; bg: string; text: string }> = {
  official: { label: '⭐ 官方精选', bg: 'bg-amber-50', text: 'text-amber-700' },
  verified: { label: '✅ 认证 Skill', bg: 'bg-green-50', text: 'text-green-700' },
  community: { label: '📂 社区贡献', bg: 'bg-gray-50', text: 'text-gray-600' },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: Skill }) {
  const [showDialog, setShowDialog] = useState(false)
  const tier = TIER_CONFIG[skill.tier]

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col gap-3">
        {/* Tier badge + new tag */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tier.bg} ${tier.text}`}>
            {tier.label}
          </span>
          {skill.isNew && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              🆕 新上架
            </span>
          )}
        </div>

        {/* Person + domain */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{skill.personName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{skill.domain}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{skill.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>⭐ {skill.rating}</span>
          <span>💬 {skill.callCount.toLocaleString()} 次对话</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setShowDialog(true)}
            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            与他对话
          </button>
          <button
            onClick={() => setShowDialog(true)}
            className="py-2 px-3 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm rounded-xl transition-colors"
          >
            详情
          </button>
        </div>
      </div>

      {/* Coming soon dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl">🚀</div>
            <h3 className="font-bold text-gray-900 text-lg">对话功能即将开放</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              平台订阅功能正在开发中，订阅后可无限调用所有 skill 进行对话。
              <br /><br />
              现在你可以使用蒸馏工具，把自己或感兴趣的人物蒸馏成 skill。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <Link
                href="/distill"
                className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors text-center"
              >
                去蒸馏
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SkillsPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = SKILLS.filter((s) => {
    const matchCat = activeCategory === '全部' || s.category === activeCategory
    const matchQ =
      !query ||
      s.personName.includes(query) ||
      s.domain.includes(query) ||
      s.tags.some((t) => t.includes(query)) ||
      s.description.includes(query)
    return matchCat && matchQ
  })

  const topByCount = [...SKILLS].sort((a, b) => b.callCount - a.callCount).slice(0, 3)
  const topByRating = [...SKILLS].sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold gradient-text text-lg">与智</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/skills" className="text-indigo-600 font-medium">Skill 广场</Link>
            <Link href="/distill" className="text-gray-500 hover:text-gray-800 transition-colors">蒸馏工具</Link>
            <Link
              href="/distill"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              开始蒸馏
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Hero search */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Skill 广场</h1>
          <p className="text-gray-500">探索顶尖思维，找到适合你问题的 AI 认知框架</p>
          <div className="max-w-lg mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索人物、领域、场景……例如「投资决策」「人生迷茫」"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Leaderboards */}
        {!query && activeCategory === '全部' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Most calls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">🔥 本周最多对话</h2>
              <div className="space-y-3">
                {topByCount.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{s.personName}</span>
                      <span className="text-xs text-gray-400 ml-2">{s.domain}</span>
                    </div>
                    <span className="text-xs text-gray-400">{s.callCount} 次</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top rated */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">⭐ 用户评分最高</h2>
              <div className="space-y-3">
                {topByRating.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">{s.personName}</span>
                      <span className="text-xs text-gray-400 ml-2">{s.domain}</span>
                    </div>
                    <span className="text-xs text-amber-500">⭐ {s.rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">没有找到匹配的 skill</p>
            <p className="text-xs mt-1">试试换个关键词，或者自己蒸馏一个？</p>
            <Link href="/distill" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
              去蒸馏 →
            </Link>
          </div>
        )}

        {/* Upload CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">把你的思维蒸馏成 skill</h2>
          <p className="text-indigo-200 text-sm mb-6">
            上传素材 · 使用自己的 API Key · 永久免费 · 上传后获得收益分成
          </p>
          <Link
            href="/distill"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            免费开始蒸馏 →
          </Link>
        </div>
      </main>

      <footer className="mt-8 pb-8 text-center text-xs text-gray-400">
        与智 · 和顶尖思维对话
      </footer>
    </div>
  )
}
