/**
 * CloudBase AI - 流式输出示例
 *
 * 演示如何使用 SSE 流式返回，逐字输出模型生成内容。
 * 流式输出可以大幅降低用户等待时间，提升交互体验。
 */
const OpenAI = require("openai");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const API_KEY = "your-api-key";
const MODEL = "hy3-preview";
// =========================================

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

async function main() {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: "用 200 字介绍一下云计算的发展历程" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }

  console.log("\n");
}

main().catch(console.error);

/**
 * 预期输出（逐字实时输出）：
 *
 * 云计算起源于20世纪60年代的分时系统概念，经历了网格计算、效用计算等阶段。
 * 2006年亚马逊推出AWS标志着现代云计算的诞生，随后谷歌、微软相继入局。
 * 从IaaS到PaaS再到SaaS，云计算不断演进...
 */
