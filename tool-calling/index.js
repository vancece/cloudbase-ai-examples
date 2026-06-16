/**
 * CloudBase AI - 工具调用示例
 *
 * 演示 Function Calling 能力，让大模型调用自定义函数获取外部信息。
 * 完整流程：用户提问 → 模型决定调用工具 → 执行工具函数 → 模型生成最终回答。
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

// 定义工具：模拟天气查询
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
  {
    type: "function",
    function: {
      name: "get_time",
      description: "获取指定城市的当前时间",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称" },
        },
        required: ["city"],
      },
    },
  },
];

// 工具执行函数
function executeFunction(name, args) {
  switch (name) {
    case "get_weather":
      // 模拟天气 API 返回
      const weatherData = {
        北京: "26°C，晴，东北风 2 级",
        上海: "28°C，多云，东南风 3 级",
        广州: "32°C，阵雨，南风 2 级",
      };
      return weatherData[args.city] || `${args.city}：暂无数据`;

    case "get_time":
      return `${args.city}当前时间：${new Date().toLocaleTimeString("zh-CN")}`;

    default:
      return "未知工具";
  }
}

async function chat(userMessage) {
  console.log(`用户: ${userMessage}`);

  const messages = [{ role: "user", content: userMessage }];

  // 第 1 次请求：发送消息 + 工具定义
  let completion = await client.chat.completions.create({
    model: "deepseek-v4-flash",
    messages,
    tools,
  });

  let choice = completion.choices[0];

  // 如果模型要求调用工具
  while (choice.finish_reason === "tool_calls") {
    const toolCalls = choice.message.tool_calls;

    // 追加助手消息（包含 tool_calls）
    messages.push(choice.message);

    // 执行每个工具调用
    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = executeFunction(toolCall.function.name, args);

      console.log(`  🔧 调用工具: ${toolCall.function.name}(${JSON.stringify(args)}) → ${result}`);

      // 追加工具结果
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    // 第 2 次请求：携带工具结果
    completion = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      messages,
      tools,
    });

    choice = completion.choices[0];
  }

  console.log(`AI: ${choice.message.content}\n`);
}

async function main() {
  console.log("=== CloudBase AI 工具调用示例 ===\n");

  // 单工具调用
  await chat("北京今天天气怎么样？");

  // 多工具调用
  await chat("对比一下北京和上海的天气");

  // 不需要工具的普通问题（模型会自动判断）
  await chat("你好，介绍一下你自己");
}

main().catch(console.error);
