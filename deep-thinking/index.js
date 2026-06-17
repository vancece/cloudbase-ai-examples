/**
 * CloudBase AI - 深度思考示例（OpenAI SDK）
 *
 * 演示如何通过 reasoning_effort 参数开启深度思考。
 * hy3-preview 默认不开启深度思考，需传 reasoning_effort: "low" / "medium" / "high"。
 * 模型会先输出思考过程（reasoning_content），再给出最终回答（content）。
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
  // 非流式调用
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: "证明 √2 是无理数" }],
    reasoning_effort: "high", // 开启深度思考：low / medium / high
  });

  const message = completion.choices[0].message;

  if (message.reasoning_content) {
    console.log("💭 思考过程:");
    console.log(message.reasoning_content);
    console.log();
  }

  console.log("✅ 最终回答:");
  console.log(message.content);
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * 💭 思考过程:
 * 要证明√2是无理数，我使用反证法。假设√2是有理数，则可以表示为 p/q（p、q互质）。
 * 两边平方得 2 = p²/q²，即 p² = 2q²。这说明 p² 是偶数，所以 p 是偶数...
 *
 * ✅ 最终回答:
 * 证明：使用反证法。
 * 假设 √2 是有理数，可表示为最简分数 p/q...
 */
