/**
 * CloudBase AI - 深度思考示例
 *
 * 演示推理模型（deepseek-r1）的深度思考能力。
 * 模型会先输出思考过程（reasoning_content），再给出最终回答（content）。
 */
require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: `https://${process.env.ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

// 非流式调用
async function nonStreaming() {
  console.log("=== 非流式调用 ===\n");

  const completion = await client.chat.completions.create({
    model: "deepseek-r1",
    messages: [{ role: "user", content: "证明 √2 是无理数" }],
  });

  const message = completion.choices[0].message;
  console.log("💭 思考过程:");
  console.log(message.reasoning_content);
  console.log("\n✅ 最终回答:");
  console.log(message.content);
}

// 流式调用
async function streaming() {
  console.log("\n=== 流式调用 ===\n");

  const stream = await client.chat.completions.create({
    model: "deepseek-r1",
    messages: [{ role: "user", content: "计算 17 × 23 的结果，写出详细步骤" }],
    stream: true,
  });

  let reasoning = "";
  let answer = "";
  let isThinking = true;

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;

    // 思考过程
    if (delta?.reasoning_content) {
      if (isThinking && reasoning === "") {
        process.stdout.write("💭 思考中: ");
      }
      reasoning += delta.reasoning_content;
      process.stdout.write(delta.reasoning_content);
    }

    // 最终回答
    if (delta?.content) {
      if (isThinking) {
        isThinking = false;
        process.stdout.write("\n\n✅ 回答: ");
      }
      answer += delta.content;
      process.stdout.write(delta.content);
    }
  }

  console.log("\n");
}

async function main() {
  console.log("=== CloudBase AI 深度思考示例 ===\n");
  await nonStreaming();
  await streaming();
}

main().catch(console.error);
