/**
 * CloudBase AI - 多轮对话示例
 *
 * 演示如何维护消息历史实现多轮对话。
 * 大模型 API 是无状态的，每次请求需要携带完整的历史消息。
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

// 维护消息历史
const messages = [{ role: "system", content: "你是一个诗词专家" }];

async function chat(userMessage) {
  // 1. 追加用户消息
  messages.push({ role: "user", content: userMessage });

  // 2. 调用模型（携带完整历史）
  const completion = await client.chat.completions.create({
    model: "deepseek-v4-flash",
    messages,
  });

  const assistantMessage = completion.choices[0].message.content;

  // 3. 追加助手回复到历史
  messages.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
}

async function main() {
  console.log("=== CloudBase AI 多轮对话示例 ===\n");

  // 第 1 轮
  const reply1 = await chat("李白最著名的诗是什么？");
  console.log("用户: 李白最著名的诗是什么？");
  console.log("AI:", reply1);
  console.log();

  // 第 2 轮（模型能理解"这首诗"指的是上一轮提到的诗）
  const reply2 = await chat("这首诗的创作背景是什么？");
  console.log("用户: 这首诗的创作背景是什么？");
  console.log("AI:", reply2);
  console.log();

  // 第 3 轮
  const reply3 = await chat("再推荐几首类似风格的诗");
  console.log("用户: 再推荐几首类似风格的诗");
  console.log("AI:", reply3);
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * === CloudBase AI 多轮对话示例 ===
 *
 * 用户: 李白最著名的诗是什么？
 * AI: 李白最著名的诗之一是《静夜思》："床前明月光，疑是地上霜。举头望明月，低头思故乡。"
 *
 * 用户: 这首诗的创作背景是什么？
 * AI: 《静夜思》创作于唐玄宗开元十四年（726年），当时李白26岁，客居扬州旅舍，
 *     在一个月明之夜思念故乡而作。
 *
 * 用户: 再推荐几首类似风格的诗
 * AI: 推荐几首类似的思乡诗：
 *     1. 王维《九月九日忆山东兄弟》
 *     2. 杜甫《月夜忆舍弟》
 *     3. 张九龄《望月怀远》
 */
