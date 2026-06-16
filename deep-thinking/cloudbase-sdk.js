/**
 * CloudBase AI - 深度思考示例（CloudBase SDK）
 *
 * 演示如何使用 @cloudbase/node-sdk 获取模型的思考过程（reasoning_content）。
 */
const cloudbase = require("@cloudbase/node-sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const SECRET_ID = "your-secret-id"; // 腾讯云 API 密钥，https://console.cloud.tencent.com/cam/capi
const SECRET_KEY = "your-secret-key";
const MODEL = "hy3-preview"; // 支持深度思考的模型：hy3-preview、deepseek-r1
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
  const result = await model.generateText({
    model: MODEL,
    messages: [{ role: "user", content: "证明 √2 是无理数" }],
  });

  // 通过 rawResponses 获取思考内容
  const rawResponse = result.rawResponses[0];
  const message = rawResponse.choices[0].message;

  if (message.reasoning_content) {
    console.log("💭 思考过程:");
    console.log(message.reasoning_content);
    console.log();
  }

  console.log("✅ 最终回答:");
  console.log(result.text);
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * 💭 思考过程:
 * 要证明√2是无理数，我使用反证法。假设√2是有理数，则可以表示为 p/q（p、q互质）...
 *
 * ✅ 最终回答:
 * 证明：使用反证法。
 * 假设 √2 是有理数，可表示为最简分数 p/q...
 */
