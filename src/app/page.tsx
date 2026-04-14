'use client'

import Link from 'next/link'

const features = [
  {
    icon: '🧬',
    title: '思维资产蒸馏',
    desc: '上传文章、访谈、演讲等素材，AI 自动提炼核心心智模型、决策启发式和表达 DNA。',
  },
  {
    icon: '🔑',
    title: '数据主权保障',
    desc: '使用你自己的 API Key，原始素材直接到达 AI 提供商，不经过平台服务器存储。',
  },
  {
    icon: '📦',
    title: '标准 Skill 格式',
    desc: '生成可移植的 SKILL.md 文件包，可下载到本地使用，或上传平台与他人分享。',
  },
  {
    icon: '💰',
    title: '思维资产变现',
    desc: '将 skill 上传平台，订阅用户调用时你获得分成。认证专家享有 70% 收益比例。',
  },
  {
    icon: '🛡️',
    title: '信任验证体系',
    desc: '素材溯源 + AI 一致性校验 + 社区举报，确保平台上每一个 skill 都有真实依据。',
  },
  {
    icon: '🗣️',
    title: '与顶尖思维对话',
    desc: '订阅平台会员，无限调用专家 skill，获得随时可用的、个性化的专业建议。',
  },
]

const steps = [
  { num: '01', title: '上传素材', desc: '文章、PDF、访谈记录，任意文本格式都支持' },
  { num: '02', title: '配置 API', desc: '填入你的 DeepSeek / Claude / GPT API Key' },
  { num: '03', title: 'AI 蒸馏', desc: '自动提炼心智模型、决策框架、表达 DNA' },
  { num: '04', title: '下载 Skill', desc: '获得标准格式的 SKILL.md 文件包' },
]

const pricing = [
  {
    name: '蒸馏工具',
    price: '永久免费',
    highlight: false,
    features: [
      '支持 DeepSeek / Claude / GPT',
      '无限次蒸馏',
      '使用自己的 API Key',
      '生成 SKILL.md 文件',
      '下载到本地使用',
    ],
    cta: '立即开始蒸馏',
    href: '/distill',
  },
  {
    name: '个人授权下载',
    price: '¥49',
    priceNote: '一次性',
    highlight: true,
    features: [
      '完整 skill 文件包',
      '个人永久使用授权',
      'knowledge/ + prompts/ 目录',
      '素材溯源文档',
      '不依赖平台部署',
    ],
    cta: '购买下载',
    href: '/distill',
  },
  {
    name: '商业授权下载',
    price: '¥199',
    priceNote: '一次性',
    highlight: false,
    features: [
      '包含个人授权全部内容',
      '企业内部部署授权',
      '二次开发商业用途',
      '正式授权证书 PDF',
      '平台开具发票',
    ],
    cta: '购买商业授权',
    href: '/distill',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">与智</span>
            <span className="text-xs text-gray-400 hidden sm:block">和顶尖思维对话</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/skills"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skill 广场
            </Link>
            <Link
              href="/distill"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              蒸馏工具
            </Link>
            <Link
              href="/distill"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              开始蒸馏
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            第一阶段 · 蒸馏工具现已上线
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            和顶尖思维
            <br />
            <span className="gradient-text">对话</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            把任何领域专家的知识、经验、决策框架，
            <br className="hidden sm:block" />
            提炼成随时可调用的 AI skill。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/distill"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
            >
              免费开始蒸馏
            </Link>
            <a
              href="#how-it-works"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-8 py-4 rounded-xl transition-colors"
            >
              了解工作原理
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            使用你自己的 API Key · 数据不过平台服务器 · 永久免费工具
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">四步完成蒸馏</h2>
            <p className="text-gray-500">从原始素材到可运行的 skill 文件，最快 5 分钟</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold gradient-text mb-3">{step.num}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">为什么选择与智</h2>
            <p className="text-gray-500">专为思维资产蒸馏与交易设计</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">透明定价</h2>
            <p className="text-gray-500">蒸馏工具永久免费，下载授权一次性付费</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${
                  plan.highlight
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                    : 'bg-white border border-gray-100'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                <div className="mb-6">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {'priceNote' in plan && plan.priceNote && (
                    <span className={`text-sm ml-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {plan.priceNote}
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-indigo-300' : 'text-indigo-500'}`}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data sovereignty pledge */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-10 border border-indigo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">数据主权承诺</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '🔒', text: '蒸馏过程数据不过服务器，使用你自己的 API Key' },
                { icon: '⬇️', text: '随时可申请将 skill 从平台下架，数据归你所有' },
                { icon: '🚫', text: 'A 用户数据绝不用于 B 用户的蒸馏，严格隔离' },
                { icon: '📁', text: '完整文件可导出，不依赖平台即可本地部署使用' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">开始蒸馏你的第一个 skill</h2>
          <p className="text-indigo-200 mb-8">
            永久免费 · 使用自己的 API Key · DeepSeek 蒸馏一次约 ¥0.1
          </p>
          <Link
            href="/distill"
            className="inline-block bg-white hover:bg-indigo-50 text-indigo-600 font-semibold px-10 py-4 rounded-xl transition-colors shadow-lg"
          >
            免费开始蒸馏 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold gradient-text">与智</span>
            <span>· 和顶尖思维对话</span>
          </div>
          <div className="flex items-center gap-6">
            <span>基于女娲.skill (MIT) 改造</span>
            <Link href="/distill" className="hover:text-gray-600 transition-colors">蒸馏工具</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
