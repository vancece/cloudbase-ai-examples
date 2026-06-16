/**
 * CloudBase AI - 深度思考示例
 *
 * 演示推理模型（deepseek-r1）的深度思考能力。
 * 模型会先输出思考过程（reasoning_content），再给出最终回答（content）。
 */
const OpenAI = require("openai");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id"; // 云开发环境 ID
const API_KEY = "your-api-key"; // AI API Key
// =========================================

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
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

/**
 * 预期输出：
 *
 * === CloudBase AI 深度思考示例 ===
 *
 * === 非流式调用 ===
 *
 * 💭 思考过程:
 * 要证明√2是无理数，我使用反证法。假设√2是有理数，则可以表示为 p/q（p、q互质）。
 * 两边平方得 2 = p²/q²，即 p² = 2q²。这说明 p² 是偶数，所以 p 是偶数...
 *
 * ✅ 最终回答:
 * 证明：使用反证法。
 * 假设 √2 是有理数，可表示为最简分数 p/q...
 *
 * === 流式调用 ===
 *
 * 💭 思考中: 17 × 23，我可以拆分为 17 × (20 + 3) = 340 + 51 = 391...
 *
 * ✅ 回答: 17 × 23 = 391
 * 详细步骤：
 * 1. 拆分：17 × 23 = 17 × (20 + 3)
 * 2. 分配律：= 17 × 20 + 17 × 3
 * 3. 计算：= 340 + 51 = 391
 */
