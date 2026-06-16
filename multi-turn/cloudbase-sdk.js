/**
 * CloudBase AI - 多轮对话示例（CloudBase SDK）
 *
 * 演示如何使用 @cloudbase/node-sdk 维护消息历史实现多轮对话。
 */
const cloudbase = require("@cloudbase/node-sdk");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const SECRET_ID = "your-secret-id"; // 腾讯云 API 密钥，https://console.cloud.tencent.com/cam/capi
const SECRET_KEY = "your-secret-key";
const MODEL = "hy3-preview";
// =========================================

const app = cloudbase.init({
  env: ENV_ID,
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  timeout: 60000,
});
const ai = app.ai();
const model = ai.createModel("cloudbase");

const messages = [{ role: "system", content: "你是一个诗词专家" }];

async function chat(userInput) {
  messages.push({ role: "user", content: userInput });

  const result = await model.generateText({
    model: MODEL,
    messages,
  });

  messages.push({ role: "assistant", content: result.text });

  console.log(`用户: ${userInput}`);
  console.log(`AI: ${result.text}\n`);
}

async function main() {
  await chat("李白最著名的诗是什么？");
  await chat("这首诗的创作背景是什么？");
  await chat("再推荐几首类似风格的诗");
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * 用户: 李白最著名的诗是什么？
 * AI: 李白最著名的诗之一是《静夜思》...
 *
 * 用户: 这首诗的创作背景是什么？
 * AI: 《静夜思》创作于唐玄宗开元十四年（726年）...
 *
 * 用户: 再推荐几首类似风格的诗
 * AI: 推荐几首类似的思乡诗...
 */
