/**
 * CloudBase AI - 流式输出示例（CloudBase SDK）
 *
 * 演示如何使用 @cloudbase/node-sdk 流式返回文本，逐字输出。
 */
const cloudbase = require("@cloudbase/node-sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const SECRET_ID = "your-secret-id"; // 腾讯云 API 密钥，https://console.cloud.tencent.com/cam/capi
const SECRET_KEY = "your-secret-key";
const MODEL = "hy3-preview";
// =========================================

const app = cloudbase.init({
  env: ENV_ID,
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  timeout: 60000,
});
const ai = app.ai();
const model = ai.createModel("cloudbase");

async function main() {
  const res = await model.streamText({
    model: MODEL,
    messages: [{ role: "user", content: "用 200 字介绍一下云计算的发展历程" }],
  });

  // 方式一：迭代文本流（推荐）
  for await (const text of res.textStream) {
    process.stdout.write(text);
  }

  console.log("\n");

  // 流结束后可获取汇总信息
  const usage = await res.usage;
  console.log("Token 用量:", usage);
}

main().catch(console.error);

/**
 * 预期输出（逐字实时输出）：
 *
 * 云计算起源于20世纪60年代的分时系统概念，经历了网格计算、效用计算等阶段。
 * 2006年亚马逊推出AWS标志着现代云计算的诞生...
 *
 * Token 用量: { prompt_tokens: 20, completion_tokens: 203, total_tokens: 223 }
 */
