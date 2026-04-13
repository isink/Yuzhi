import { NextRequest } from 'next/server'

export const maxDuration = 15

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: '未收到文件' }, { status: 400 })
    }

    const mimeType = file.type
    const fileName = file.name.toLowerCase()

    // Handle plain text files
    if (mimeType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      const text = await file.text()
      return Response.json({ text, charCount: text.length })
    }

    // Handle PDF files
    if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)

      const { PDFParse } = await import('pdf-parse')
      const parser = new PDFParse({ data })
      const result = await parser.getText()
      const text = result.text

      return Response.json({ text, charCount: text.length })
    }

    return Response.json(
      { error: `不支持的文件类型: ${mimeType || fileName}，请上传 PDF 或 TXT 文件` },
      { status: 400 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '文件解析失败'
    return Response.json({ error: message }, { status: 500 })
  }
}
