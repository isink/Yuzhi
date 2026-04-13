'use client'

import { useState } from 'react'
import { SkillPackage } from '@/types'
import { buildSystemPrompt } from '@/lib/prompts'

interface SkillPreviewProps {
  skillPackage: SkillPackage
  onRestart: () => void
}

type LicenseType = 'personal' | 'commercial'

// ── File generators ──────────────────────────────────────────────────────────

function generateHonestLimitsMd(pkg: SkillPackage): string {
  const limits = pkg.distillation.honestLimits
  return `# ${pkg.personName} · 诚实边界（Honest Limits）

> 蒸馏日期：${pkg.date}
> 平台：与智 yuzhi.ai

## 此 Skill 无法做到的事

${limits.map((l) => `- ${l}`).join('\n')}

## 通用局限性

- 无法还原真实人物的直觉性判断
- 无法预测其在新领域的真实反应
- 公开表达不等于真实内心想法
- 素材截止日期之后的观点变化无法捕捉
- 本 skill 基于公开素材提炼，不代表真实人物观点

---
> 与智平台 · yuzhi.ai
`
}

function generateSystemPromptMd(pkg: SkillPackage): string {
  return buildSystemPrompt(pkg.personName, pkg.skillMd)
}

function generateArticlesMd(pkg: SkillPackage): string {
  const preview =
    pkg.rawMaterial.length > 8000
      ? pkg.rawMaterial.slice(0, 8000) + '\n\n[...内容较长，此处截取前 8000 字...]'
      : pkg.rawMaterial
  return `# ${pkg.personName} · 素材库：文章与著作

> 蒸馏日期：${pkg.date}
> 素材字数：约 ${pkg.materialCount.toLocaleString()} 字

## 原始素材内容

${preview}

---
> 本文档为与智平台蒸馏素材存档，仅供蒸馏结果溯源参考使用
`
}

function generateInterviewsMd(pkg: SkillPackage): string {
  return `# ${pkg.personName} · 素材库：访谈与对话

> 蒸馏日期：${pkg.date}

## 说明

如您的素材中包含访谈内容，请将其整理到此文件以提高 skill 质量。

## 访谈记录

（暂无单独整理的访谈素材 · 访谈内容已包含在 articles.md 中）

---
> 与智平台 · yuzhi.ai
`
}

function generateTimelineMd(pkg: SkillPackage): string {
  const examples = pkg.distillation.examples
    .map((e) => `### ${e.scenario}\n\n${e.response}`)
    .join('\n\n')
  return `# ${pkg.personName} · 素材库：人生时间线

> 蒸馏日期：${pkg.date}

## 典型场景与决策

${examples || '（从素材中未提取到明显的时间线信息，请手动补充）'}

---
> 与智平台 · yuzhi.ai
`
}

function generateCertificateMd(pkg: SkillPackage, certId: string): string {
  return `# 商业授权证书

**授权编号**：YZ-COMM-${certId}
**授权日期**：${pkg.date}
**授权产品**：${pkg.personName}.skill
**授权类型**：商业授权

---

**授权方**：与智平台（yuzhi.ai）
**被授权方**：授权购买者
**授权领域**：${pkg.domain}
**上传者**：${pkg.uploaderName}

---

## 授权范围

本商业授权许可被授权方在以下范围内使用上述 skill 文件包：

1. ✅ 企业内部无限制部署和使用
2. ✅ 集成到商业产品中
3. ✅ 在授权范围内进行二次开发
4. ❌ 不得对外分发、转售或发布 skill 文件包本身
5. ❌ 不得声称此 skill 代表真实人物观点

## 使用声明要求

商业使用场景需在显著位置声明：「基于与智平台提炼的 AI 认知框架」

## 法律效力

本授权基于购买者的用途自述，具有法律效力。
违反授权条款将承担违约金并赔偿与智平台损失。

---
> 与智平台 · yuzhi.ai · 正式商业授权文件
`
}

async function buildAndDownloadZip(
  pkg: SkillPackage,
  licenseType: LicenseType
): Promise<void> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  const safe = pkg.personName.replace(/[\s/\\:*?"<>|]/g, '_')
  const folder = zip.folder(`${safe}_skill_package`)!

  folder.file('SKILL.md', pkg.skillMd)
  folder.file('honest-limits.md', generateHonestLimitsMd(pkg))

  const prompts = folder.folder('prompts')!
  prompts.file('system_prompt.md', generateSystemPromptMd(pkg))

  const knowledge = folder.folder('knowledge')!
  knowledge.file('articles.md', generateArticlesMd(pkg))
  knowledge.file('interviews.md', generateInterviewsMd(pkg))
  knowledge.file('timeline.md', generateTimelineMd(pkg))

  if (licenseType === 'commercial') {
    const certId = Date.now().toString(36).toUpperCase()
    folder.file('LICENSE-CERTIFICATE.md', generateCertificateMd(pkg, certId))
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safe}_skill_package.zip`
  a.click()
  URL.revokeObjectURL(url)
}

// ── License text ─────────────────────────────────────────────────────────────

const PERSONAL_LICENSE = `一、授权范围
本授权仅限购买者本人在个人设备上使用，不得共享或转让。

二、使用限制
1. 仅限个人学习、研究和个人项目使用
2. 不得用于任何商业目的
3. 不得对外二次分发、转售或发布
4. 不得声称此 skill 代表真实人物观点

三、法律效力
勾选同意即表示你接受本授权协议的全部条款，具有与书面签字相同的法律效力。违反本协议需承担违约金并赔偿平台损失。`

const COMMERCIAL_LICENSE = `一、授权范围
本商业授权许可被授权方将 skill 文件包用于商业目的，包括企业内部部署、产品集成及二次开发。

二、授权内容
1. 企业内部无限制部署和使用
2. 集成到商业产品中
3. 在授权范围内进行二次开发

三、使用限制
1. 不得对外分发、转售或发布 skill 文件包本身
2. 不得声称此 skill 代表真实人物观点
3. 商业使用场景需声明「基于与智平台提炼的 AI 认知框架」

四、法律效力
勾选同意即表示贵方接受本授权协议全部条款。违反本协议将承担违约金并赔偿与智平台损失。购买后将获得正式授权证书（含于文件包中）。`

// ── Component ─────────────────────────────────────────────────────────────────

export default function SkillPreview({ skillPackage, onRestart }: SkillPreviewProps) {
  const [modal, setModal] = useState<LicenseType | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [downloading, setDownloading] = useState(false)

  function downloadSkillMd() {
    const safe = skillPackage.personName.replace(/[\s/\\:*?"<>|]/g, '_')
    const blob = new Blob([skillPackage.skillMd], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safe}.skill.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  function openModal(type: LicenseType) {
    setAgreed(false)
    setModal(type)
  }

  async function handleAgreedDownload() {
    if (!agreed || !modal) return
    setDownloading(true)
    try {
      await buildAndDownloadZip(skillPackage, modal)
    } finally {
      setDownloading(false)
      setModal(null)
    }
  }

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
        <div className="p-4 max-h-64 overflow-y-auto">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {skillPackage.skillMd}
          </pre>
        </div>
      </div>

      {/* Download options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">选择下载方式</h3>

        {/* Free */}
        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">免费下载</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">永久免费</span>
            </div>
            <p className="text-xs text-gray-400">仅包含 SKILL.md 单文件</p>
          </div>
          <button
            onClick={downloadSkillMd}
            className="flex-shrink-0 py-2 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            下载 .md
          </button>
        </div>

        {/* Personal ¥49 */}
        <div className="border border-indigo-200 rounded-xl p-4 flex items-center gap-4 bg-indigo-50/40">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">个人授权完整包</span>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">¥49</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Beta 免费</span>
            </div>
            <p className="text-xs text-gray-400">SKILL.md · knowledge/ · prompts/ · honest-limits.md</p>
          </div>
          <button
            onClick={() => openModal('personal')}
            className="flex-shrink-0 py-2 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            下载 .zip
          </button>
        </div>

        {/* Commercial ¥199 */}
        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900">商业授权完整包</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">¥199</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Beta 免费</span>
            </div>
            <p className="text-xs text-gray-400">完整包 + 授权证书 · 适用企业内部部署、商业用途</p>
          </div>
          <button
            onClick={() => openModal('commercial')}
            className="flex-shrink-0 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            下载 .zip
          </button>
        </div>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
      >
        蒸馏新的 Skill
      </button>

      {/* Upload teaser */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <p className="text-sm font-medium text-indigo-800 mb-1">想让更多人用上这个 skill？</p>
        <p className="text-sm text-indigo-600">
          平台上传功能即将开放，上传后用户调用时你将获得收益分成。敬请期待。
        </p>
      </div>

      {/* License modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">
                {modal === 'personal' ? '个人授权协议' : '商业授权协议'}
              </h3>
              <span
                className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                  modal === 'personal'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {modal === 'personal' ? '¥49' : '¥199'}
              </span>
            </div>

            {/* License text */}
            <div className="bg-gray-50 rounded-xl p-4 max-h-44 overflow-y-auto">
              <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                {modal === 'personal' ? PERSONAL_LICENSE : COMMERCIAL_LICENSE}
              </p>
            </div>

            {/* Beta notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5">
              <p className="text-xs text-yellow-800">
                <strong>Beta 说明：</strong>支付系统接入中，Beta 期间勾选同意即可免费下载完整包。
              </p>
            </div>

            {/* Agree checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-indigo-600 border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                我已阅读并同意以上授权协议，承诺按授权类型合规使用
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAgreedDownload}
                disabled={!agreed || downloading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {downloading ? '生成中…' : '同意并下载'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
