export function buildAnalysisPrompt(content: string): string {
  return `你是一个专业的认知框架提炼专家。

用户上传了以下素材，请分析这批素材的质量和覆盖情况：

【素材内容】
${content}

请从以下6个维度评估素材覆盖情况（每项打分1-5分）：

1. 著作与系统思考：是否有长文、文章、书籍内容？
2. 对话与访谈：是否有采访、问答、即兴表达？
3. 碎片表达：是否有短内容、社交媒体、随笔？
4. 决策记录：是否有具体决策案例、选择记录？
5. 外部视角：是否有他人对其的评价、批评？
6. 人生时间线：是否有经历描述、关键节点？

请严格按以下JSON格式输出，不要有任何多余内容：

{
  "scores": {
    "writings": <1-5>,
    "interviews": <1-5>,
    "fragments": <1-5>,
    "decisions": <1-5>,
    "external": <1-5>,
    "timeline": <1-5>
  },
  "overallQuality": "<优秀|良好|一般|较差>",
  "suggestions": ["<建议1>", "<建议2>"],
  "shouldContinue": <true|false>,
  "reason": "<说明是否建议继续蒸馏，以及原因>"
}`
}

export function buildDistillationPrompt(
  content: string,
  personName: string,
  domain: string
): string {
  return `你是一个专业的认知框架提炼专家。你的任务是从素材中提炼一个人的思维操作系统，而不是模仿他的说话方式。

【待蒸馏人物】
姓名：${personName}
领域：${domain}

【原始素材】
${content}

【蒸馏规则】

**心智模型提炼标准（三重验证）**
一个观点要被认定为心智模型，必须同时满足：
1. 跨域复现：在至少2个不同场景/领域中出现过
2. 有生成力：能用来推断此人对新问题的态度
3. 有排他性：不是所有聪明人都会这么想

满足全部3条 → 记录为核心心智模型
满足1-2条 → 记录为决策启发式
全不满足 → 不收录

**表达DNA提炼标准**
- 标志性词汇和句式（至少出现3次以上）
- 思维节奏（先问问题？先给结论？先讲故事？）
- 情绪底色（乐观/务实/批判/温和）
- 回应方式（喜欢反问？喜欢举例？喜欢数据？）

**诚实边界**
必须明确列出此skill做不到的事：
- 无法还原直觉性判断
- 无法预测其在新领域的真实反应
- 公开表达不等于真实想法
- 素材截止日期之后的观点变化无法捕捉

---

请按以下JSON格式输出蒸馏结果，不要有任何多余内容：

{
  "mentalModels": [
    {
      "name": "<心智模型名称>",
      "definition": "<定义>",
      "manifestation": "<典型表现>",
      "evidence": "<来源素材依据>"
    }
  ],
  "heuristics": ["<决策启发式1>", "<决策启发式2>"],
  "expressionDNA": {
    "signatures": "<标志性表达方式>",
    "rhythm": "<思维节奏>",
    "tone": "<情绪底色>",
    "responseStyle": "<回应偏好>"
  },
  "examples": [
    {
      "scenario": "<场景描述>",
      "response": "<回应方式>"
    }
  ],
  "honestLimits": ["<局限性1>", "<局限性2>"],
  "materialSources": ["<素材来源1>", "<素材来源2>"]
}`
}

export function buildSkillGenerationPrompt(
  distillationResult: string,
  personName: string,
  domain: string,
  uploaderName: string,
  date: string,
  materialCount: number
): string {
  return `基于以下蒸馏结果，生成一个标准的SKILL.md文件内容。

【蒸馏结果】
${distillationResult}

【人物信息】
姓名：${personName}
领域：${domain}
上传者：${uploaderName}
蒸馏日期：${date}
素材字数：约${materialCount}字

请直接输出SKILL.md的完整内容，使用Markdown格式，包含以下结构：

---
# ${personName}.skill

> 领域：${domain}
> 蒸馏日期：${date}
> 素材字数：约${materialCount}字
> 平台：与智

## 使用说明
[简短说明如何与此skill对话，适合什么问题，2-3句话]

## 核心心智模型
[从蒸馏结果中提取，每个心智模型包含名称、定义、典型表现]

## 决策启发式
[从蒸馏结果中提取，每条一句话]

## 表达DNA
- **标志性表达**：
- **思维节奏**：
- **情绪底色**：
- **回应偏好**：

## 适合咨询的问题类型
[列出5类最适合问此skill的问题]

## 诚实边界
[从蒸馏结果中提取]

## 素材溯源
[列出主要素材来源，供平台审核]

---
> 本skill基于公开素材提炼认知框架，不代表真实人物观点
> 上传者：${uploaderName} · 平台：与智 yuzhi.ai
---

只输出Markdown内容本身，不要有任何前缀说明。`
}

export function buildValidationPrompt(
  materialSummary: string,
  skillContent: string
): string {
  return `你是平台内容审核AI。请对以下skill文件进行一致性校验。

【原始素材摘要】
${materialSummary}

【待审核skill文件】
${skillContent}

请从以下维度打分（每项0-100分），严格按JSON格式输出：

{
  "scores": {
    "consistency": <0-100>,
    "coverage": <0-100>,
    "accuracy": <0-100>,
    "honesty": <0-100>,
    "noFabrication": <0-100>
  },
  "overallScore": <0-100>,
  "verdict": "<通过|需要修改|拒绝上架>",
  "reason": "<审核意见，如通过则简短说明，如拒绝则详细说明原因>"
}`
}

export function buildSystemPrompt(personName: string, skillContent: string): string {
  return `你正在扮演一个基于${personName}认知框架的思维顾问。

【认知框架】
${skillContent}

【重要规则】
1. 你不是${personName}本人，你是基于其公开素材提炼的认知框架
2. 用其思维方式和表达风格回答问题，但不要假装是真人
3. 遇到超出素材范围的问题，诚实说明"这超出了我的素材范围"
4. 不得给出医疗、法律、财务等专业建议作为最终决策依据
5. 每次回答后可以追问用户，帮助用户深化思考

【开场白】
当用户开始对话时，用${personName}的表达风格简短介绍自己能帮什么忙。`
}
