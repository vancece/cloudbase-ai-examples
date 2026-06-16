/**
 * CloudBase AI - wx-server-sdk 云函数调用示例
 *
 * 使用微信云开发内置的 wx-server-sdk 调用 CloudBase AI 大模型。
 * 无需额外安装 @cloudbase/node-sdk，适合微信小程序云函数场景。
 *
 * 文档：https://docs.cloudbase.net/ai/model/wx-server-sdk-access
 *
 * 注意：此文件需要部署为微信云函数才能运行，不能直接 node 执行。
 * 部署方法：在微信开发者工具中右键云函数目录 → 上传并部署
 */
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 60000,
});

// 云函数入口
exports.main = async (event, context) => {
  const { action = "generate", messages = [] } = event;
  const ai = cloud.ai();
  const model = ai.createModel("cloudbase");

  // 非流式文本生成
  if (action === "generate") {
    const result = await model.generateText({
      model: "hy3-preview",
      messages: messages.length
        ? messages
        : [{ role: "user", content: "用一句话介绍云计算" }],
    });

    return {
      text: result.text,
      usage: result.usage,
    };
  }

  // 流式输出（收集完整结果返回）
  if (action === "stream") {
    const res = await model.streamText({
      model: "hy3-preview",
      messages: messages.length
        ? messages
        : [{ role: "user", content: "用 100 字介绍 Serverless" }],
    });

    let fullText = "";
    for await (const text of res.textStream) {
      fullText += text;
    }

    const usage = await res.usage;
    return { text: fullText, usage };
  }

  return { error: "未知 action，支持: generate, stream" };
};

/**
 * 小程序端调用方式：
 *
 * wx.cloud.callFunction({
 *   name: 'ai-chat',  // 云函数名称
 *   data: {
 *     action: 'generate',
 *     messages: [{ role: 'user', content: '你好' }]
 *   }
 * }).then(res => {
 *   console.log(res.result.text);
 * });
 */
