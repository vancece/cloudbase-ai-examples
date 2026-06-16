/**
 * CloudBase AI - wx-server-sdk 调用示例
 *
 * wx-server-sdk 底层基于 @cloudbase/node-sdk，可在任何 Node.js 环境运行。
 * 只需配置环境 ID 和腾讯云凭证即可直接调用 AI 大模型。
 *
 * 文档：https://docs.cloudbase.net/ai/model/wx-server-sdk-access
 */
const cloud = require("wx-server-sdk");

// ====== 配置区（替换为你自己的值）======
const ENV_ID = "your-env-id"; // 云开发环境 ID
const SECRET_ID = "your-secret-id"; // 腾讯云 SecretId
const SECRET_KEY = "your-secret-key"; // 腾讯云 SecretKey
const MODEL = "hy3-preview"; // 模型名称
// ==========================================

// 通过环境变量注入凭证（wx-server-sdk 内部会读取这些变量）
process.env.TENCENTCLOUD_SECRETID = SECRET_ID;
process.env.TENCENTCLOUD_SECRETKEY = SECRET_KEY;

cloud.init({
  env: ENV_ID,
  timeout: 60000,
});

async function main() {
  const ai = cloud.ai();
  const model = ai.createModel("cloudbase");

  // 非流式文本生成
  console.log("=== 非流式生成 ===");
  const result = await model.generateText({
    model: MODEL,
    messages: [{ role: "user", content: "用一句话介绍云计算" }],
  });
  console.log("回复:", result.text);
  console.log("token 用量:", result.usage);

  // 流式输出
  console.log("\n=== 流式生成 ===");
  const stream = await model.streamText({
    model: MODEL,
    messages: [{ role: "user", content: "用 100 字介绍 Serverless" }],
  });

  process.stdout.write("回复: ");
  for await (const text of stream.textStream) {
    process.stdout.write(text);
  }
  console.log("\ntoken 用量:", await stream.usage);
}

main().catch(console.error);
