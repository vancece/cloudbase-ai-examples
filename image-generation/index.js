/**
 * CloudBase AI - 图片生成（Node SDK）示例
 *
 * 使用 @cloudbase/node-sdk 调用混元生图模型，生成图片并获取 URL。
 * 支持自定义尺寸、prompt 改写和 thinking 模式。
 *
 * 文档：https://docs.cloudbase.net/ai/image-model/node-sdk
 *
 * 注意：图片生成仅支持服务端调用（云函数/云托管），
 * 本示例通过环境变量注入凭证在本地 Node.js 环境运行。
 */
const cloudbase = require("@cloudbase/node-sdk");

// ====== 配置区（替换为你自己的值）======
const ENV_ID = "your-env-id"; // 云开发环境 ID
const SECRET_ID = "your-secret-id"; // 腾讯云 SecretId
const SECRET_KEY = "your-secret-key"; // 腾讯云 SecretKey
// ==========================================

const app = cloudbase.init({
  env: ENV_ID,
  secretId: SECRET_ID,
  secretKey: SECRET_KEY,
  timeout: 120000, // 生图耗时较长，建议 120s 以上
});

const ai = app.ai();

async function main() {
  const imageModel = ai.createImageModel("hunyuan-image");

  // 基础用法：生成一张图片
  console.log("=== 生成图片 ===");
  console.log("正在生成，请稍候（通常需要 10-30 秒）...\n");

  const result = await imageModel.generateImage({
    model: "hunyuan-image-v3.0-v1.0.4",
    prompt: "一只胖胖的橘猫坐在窗台上打盹，水彩风格，温暖色调",
    size: "1024x1024",
    revise: { value: true }, // 启用 prompt 改写（模型优化你的描述）
    enable_thinking: { value: false }, // 是否启用 thinking 模式
  });

  console.log("图片 URL:", result.data[0].url);
  console.log("改写后的 prompt:", result.data[0].revised_prompt);
  console.log("\n注意：图片 URL 24 小时后失效，建议下载保存或上传至云存储。");
}

main().catch(console.error);

/**
 * 预期输出：
 *
 * === 生成图片 ===
 * 正在生成，请稍候（通常需要 10-30 秒）...
 *
 * 图片 URL: https://xxx.cos.ap-xxx.myqcloud.com/xxx.jpg
 * 改写后的 prompt: A chubby orange tabby cat dozing on a windowsill...
 *
 * 注意：图片 URL 24 小时后失效，建议下载保存或上传至云存储。
 */
