import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "与智 · 和顶尖思维对话",
  description: "基于思维资产蒸馏与交易的平台。将领域专家的知识、经验、决策框架提炼成可运行的 skill 文件，让每个人都能和顶尖思维对话。",
  keywords: "与智, 思维资产, skill, 知识蒸馏, AI, 专家对话",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
