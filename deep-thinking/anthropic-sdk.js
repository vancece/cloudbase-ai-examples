/**
 * CloudBase AI - 深度思考示例（Anthropic SDK）
 *
 * 演示如何通过 Anthropic Messages 协议开启深度思考。
 * 使用 thinking: { type: "enabled", budget_tokens: N } 参数控制思考深度。
 * 模型会返回 thinking 类型的 block（思考过程）和 text 类型的 block（最终回答）。
 */
const Anthropic = require("@anthropic-ai/sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const API_KEY = "your-api-key";
const MODEL = "hy3-preview";
// =========================================

const client = new Anthropic({
  apiKey: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

async function main() {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    thinking: {
      type: "enabled",
      budget_tokens: 5000, // 最大思考 token 数
    },
    messages: [{ role: "user", content: "证明 √2 是无理数" }],
  });

  for (const block of response.content) {
    if (block.type === "thinking") {
      console.log("💭 思考过程:");
      console.log(block.thinking);
      console.log();
    } else if (block.type === "text") {
      console.log("✅ 最终回答:");
      console.log(block.text);
    }
  }
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
