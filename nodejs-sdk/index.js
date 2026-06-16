/**
 * CloudBase AI - Node SDK 调用示例
 *
 * 使用 @cloudbase/node-sdk 在 Node.js 服务端调用 CloudBase AI 大模型。
 * 支持非流式生成、流式输出、多轮对话等。
 *
 * 文档：https://docs.cloudbase.net/ai/model/nodejs-access
 */
const tcb = require("@cloudbase/node-sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const SECRET_ID = "your-secret-id"; // https://console.cloud.tencent.com/cam/capi
const SECRET_KEY = "your-secret-key";
const MODEL = "hy3-preview";
// =========================================

const app = tcb.init({
  env: ENV_ID,
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  timeout: 60000,
});
const ai = app.ai();
const model = ai.createModel("cloudbase");

// 示例 1：非流式文本生成
async function generateText() {
  console.log("=== 非流式文本生成 ===\n");

  const result = await model.generateText({
    model: MODEL,
    messages: [{ role: "user", content: "用一句话介绍云计算" }],
  });

  console.log("回复:", result.text);
  console.log("Token:", result.usage);
  console.log();
}

// 示例 2：流式输出
async function streamText() {
  console.log("=== 流式输出 ===\n");

  const res = await model.streamText({
    model: MODEL,
    messages: [{ role: "user", content: "用 100 字介绍 Serverless" }],
  });

  for await (const text of res.textStream) {
    process.stdout.write(text);
  }

  const usage = await res.usage;
  console.log("\n\nToken:", usage);
  console.log();
}

// 示例 3：多轮对话
async function multiTurn() {
  console.log("=== 多轮对话 ===\n");

  const messages = [{ role: "system", content: "你是一个简洁的助手，回答不超过 50 字" }];

  async function chat(input) {
    messages.push({ role: "user", content: input });
    const result = await model.generateText({ model: MODEL, messages });
    messages.push({ role: "assistant", content: result.text });
    console.log(`用户: ${input}`);
    console.log(`AI: ${result.text}\n`);
  }

  await chat("什么是云函数？");
  await chat("它和传统服务器有什么区别？");
}

async function main() {
  await generateText();
  await streamText();
  await multiTurn();
}

main().catch(console.error);
