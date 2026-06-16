/**
 * CloudBase AI - Anthropic SDK 调用示例
 *
 * 使用 Anthropic SDK 通过兼容协议调用 CloudBase AI 大模型。
 * 注意：CloudBase 使用 authToken（Bearer 认证），不是 apiKey。
 *
 * 文档：https://docs.cloudbase.net/ai/model/anthropic-sdk-access
 */
const Anthropic = require("@anthropic-ai/sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const API_KEY = "your-api-key"; // https://tcb.cloud.tencent.com/dev#/env/apikey
const MODEL = "hy3-preview";
// =========================================

const client = new Anthropic({
  authToken: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

// 示例 1：非流式调用
async function generateText() {
  console.log("=== 非流式调用 ===\n");

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: "用一句话介绍云计算" }],
  });

  console.log("回复:", message.content[0].text);
  console.log("Token:", message.usage);
  console.log();
}

// 示例 2：流式调用
async function streamText() {
  console.log("=== 流式调用 ===\n");

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: "用 100 字介绍 Serverless" }],
  });

  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      process.stdout.write(chunk.delta.text);
    }
  }
  console.log("\n");
}

// 示例 3：多轮对话
async function multiTurn() {
  console.log("=== 多轮对话 ===\n");

  const history = [];

  async function chat(input) {
    history.push({ role: "user", content: input });

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: "你是一个简洁的助手，回答不超过 50 字",
      messages: history,
    });

    const reply = message.content[0].text;
    history.push({ role: "assistant", content: reply });
    console.log(`用户: ${input}`);
    console.log(`AI: ${reply}\n`);
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
