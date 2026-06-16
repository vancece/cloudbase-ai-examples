/**
 * CloudBase AI - 工具调用示例（CloudBase SDK）
 *
 * 演示如何使用 @cloudbase/node-sdk 的 registerFunctionTool 实现工具调用。
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

// 定义工具
const getWeatherTool = {
  name: "get_weather",
  description: "获取指定城市的实时天气信息",
  fn: async ({ city }) => {
    const weatherData = {
      北京: "26°C，晴，东北风 2 级",
      上海: "28°C，多云，东南风 3 级",
      广州: "32°C，阵雨，南风 2 级",
    };
    return weatherData[city] || `${city}：暂无数据`;
  },
  parameters: {
    type: "object",
    properties: {
      city: { type: "string", description: "城市名称" },
    },
    required: ["city"],
  },
};

// 注册工具
ai.registerFunctionTool(getWeatherTool);

async function main() {
  const result = await model.generateText({
    model: MODEL,
    tools: [getWeatherTool],
    messages: [{ role: "user", content: "北京今天天气怎么样？" }],
  });

  console.log("AI:", result.text);
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * AI: 北京今天天气晴朗，气温 26°C，东北风 2 级，适宜外出活动。
 */
