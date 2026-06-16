/**
 * CloudBase AI - OpenAI SDK 调用示例
 *
 * 使用 OpenAI SDK 通过兼容协议调用 CloudBase AI 大模型。
 * 只需修改 baseURL 和 apiKey，即可从 OpenAI 无缝迁移。
 *
 * 文档：https://docs.cloudbase.net/ai/model/openai-sdk-access
 */
const OpenAI = require("openai");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const API_KEY = "your-api-key"; // https://tcb.cloud.tencent.com/dev#/env/apikey
const MODEL = "hy3-preview";
// =========================================

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

// 示例 1：非流式调用
async function generateText() {
  console.log("=== 非流式调用 ===\n");

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: "用一句话介绍云计算" }],
  });

  console.log("回复:", completion.choices[0].message.content);
  console.log("Token:", completion.usage);
  console.log();
}

// 示例 2：流式调用
async function streamText() {
  console.log("=== 流式调用 ===\n");

  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: "用 100 字介绍 Serverless" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
  console.log("\n");
}

// 示例 3：多轮对话
async function multiTurn() {
  console.log("=== 多轮对话 ===\n");

  const messages = [{ role: "system", content: "你是一个简洁的助手，回答不超过 50 字" }];

  async function chat(input) {
    messages.push({ role: "user", content: input });
    const completion = await client.chat.completions.create({ model: MODEL, messages });
    const reply = completion.choices[0].message.content;
    messages.push({ role: "assistant", content: reply });
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
