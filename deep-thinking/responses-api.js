/**
 * CloudBase AI - 深度思考示例（OpenAI Responses API）
 *
 * 演示如何通过 OpenAI Responses 协议开启深度思考。
 * 使用 reasoning: { effort: "low" / "medium" / "high" } 参数控制推理深度。
 * 模型会返回 reasoning 类型的 output（思考过程）和 message 类型的 output（最终回答）。
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
  const response = await client.responses.create({
    model: MODEL,
    reasoning: { effort: "high" }, // 开启深度思考：low / medium / high
    input: "证明 √2 是无理数",
  });

  for (const item of response.output) {
    if (item.type === "reasoning") {
      console.log("💭 思考过程:");
      console.log(item.summary.map((s) => s.text).join(""));
      console.log();
    } else if (item.type === "message") {
      console.log("✅ 最终回答:");
      console.log(item.content.map((c) => c.text).join(""));
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
