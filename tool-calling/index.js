/**
 * CloudBase AI - 工具调用示例
 *
 * 演示 Function Calling 能力，让大模型调用自定义函数获取外部信息。
 * 完整流程：用户提问 → 模型决定调用工具 → 执行工具函数 → 模型生成最终回答。
 */
const OpenAI = require("openai");

// ====== 配置区域（替换为你的实际值）======
const ENV_ID = "your-env-id";
const API_KEY = "your-api-key";
const MODEL = "deepseek-v4-flash";
// =========================================

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: `https://${ENV_ID}.api.tcloudbasegateway.com/v1/ai/cloudbase`,
});

// 定义工具
const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取指定城市的实时天气信息",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称，如：北京" },
        },
        required: ["city"],
      },
    },
  },
];

// 工具执行函数
function executeFunction(name, args) {
  const weatherData = {
    北京: "26°C，晴，东北风 2 级",
    上海: "28°C，多云，东南风 3 级",
    广州: "32°C，阵雨，南风 2 级",
  };
  return weatherData[args.city] || `${args.city}：暂无数据`;
}

async function chat(userMessage) {
  console.log(`用户: ${userMessage}`);

  const messages = [{ role: "user", content: userMessage }];

  let completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    tools,
  });

  let choice = completion.choices[0];

  // 如果模型要求调用工具
  while (choice.finish_reason === "tool_calls") {
    const toolCalls = choice.message.tool_calls;
    messages.push(choice.message);

    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = executeFunction(toolCall.function.name, args);
      console.log(`  🔧 ${toolCall.function.name}(${JSON.stringify(args)}) → ${result}`);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    completion = await client.chat.completions.create({
      model: MODEL,
      messages,
      tools,
    });

    choice = completion.choices[0];
  }

  console.log(`AI: ${choice.message.content}\n`);
}

async function main() {
  await chat("北京今天天气怎么样？");
  await chat("对比一下北京和上海的天气");
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * 用户: 北京今天天气怎么样？
 *   🔧 get_weather({"city":"北京"}) → 26°C，晴，东北风 2 级
 * AI: 北京今天天气晴朗，气温 26°C，东北风 2 级，适宜外出活动。
 *
 * 用户: 对比一下北京和上海的天气
 *   🔧 get_weather({"city":"北京"}) → 26°C，晴，东北风 2 级
 *   🔧 get_weather({"city":"上海"}) → 28°C，多云，东南风 3 级
 * AI: 北京 26°C 晴天，上海 28°C 多云，北京天气更晴朗，上海略热一些。
 */
