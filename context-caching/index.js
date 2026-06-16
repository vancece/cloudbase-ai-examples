/**
 * CloudBase AI - 上下文缓存示例
 *
 * 演示 Anthropic Messages API 协议的提示词缓存功能。
 * 缓存可以大幅降低重复前缀内容的 Token 费用（命中缓存仅 10% 价格）。
 *
 * 注意：上下文缓存仅 Anthropic Messages API 协议支持。
 */
require("dotenv").config();

const BASE_URL = `https://${process.env.ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`;
const API_KEY = process.env.API_KEY;

// 模拟一个较长的 system prompt
const LONG_SYSTEM_PROMPT = `你是一个专业的法律顾问。以下是你需要遵循的规则和参考资料：

1. 回答问题时必须引用具体法条
2. 区分民事责任和刑事责任
3. 考虑地区差异
4. 给出实际可操作的建议

参考资料摘要：
- 《中华人民共和国民法典》相关条文...
- 《中华人民共和国劳动法》相关条文...
- 《中华人民共和国消费者权益保护法》相关条文...
（此处省略大量文本，实际使用时可放入数万字的参考资料）`;

async function sendMessage(userMessage, isFirstRequest) {
  const response = await fetch(`${BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "hy3-preview",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: LONG_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  return response.json();
}

async function main() {
  console.log("=== CloudBase AI 上下文缓存示例 ===\n");

  // 第 1 次请求：写入缓存
  console.log("--- 第 1 次请求（写入缓存）---");
  const result1 = await sendMessage("租房合同到期房东不退押金怎么办？");
  console.log("回答:", result1.content?.[0]?.text?.slice(0, 100) + "...");
  console.log("Token 用量:", JSON.stringify(result1.usage, null, 2));
  console.log();

  // 第 2 次请求：命中缓存
  console.log("--- 第 2 次请求（命中缓存）---");
  const result2 = await sendMessage("网购商品质量有问题如何维权？");
  console.log("回答:", result2.content?.[0]?.text?.slice(0, 100) + "...");
  console.log("Token 用量:", JSON.stringify(result2.usage, null, 2));
  console.log();

  // 对比缓存效果
  if (result1.usage && result2.usage) {
    console.log("--- 缓存效果对比 ---");
    console.log(
      `第 1 次 cache_creation_input_tokens: ${result1.usage.cache_creation_input_tokens || 0}`
    );
    console.log(
      `第 2 次 cache_read_input_tokens: ${result2.usage.cache_read_input_tokens || 0}`
    );
    if (result2.usage.cache_read_input_tokens > 0) {
      console.log("✅ 缓存命中！第 2 次请求的 system prompt 费用仅为正常价格的 10%");
    }
  }
}

main().catch(console.error);
