# CloudBase AI Examples

云开发 AI 大模型调用示例代码，配合 [CloudBase AI 文档](https://docs.cloudbase.net/ai/model/model-access) 使用。

## 按接入方式

| 目录 | SDK | 说明 |
|------|-----|------|
| [nodejs-sdk](./nodejs-sdk) | @cloudbase/node-sdk | Node.js 服务端调用（独立服务 / 云托管） |
| [web-sdk](./web-sdk) | @cloudbase/js-sdk | 浏览器 Web 应用调用 |
| [wx-server-sdk](./wx-server-sdk) | wx-server-sdk | 微信云函数调用 |
| [openai-sdk](./openai-sdk) | openai | OpenAI SDK 兼容协议调用 |
| [anthropic-sdk](./anthropic-sdk) | @anthropic-ai/sdk | Anthropic SDK 兼容协议调用 |

## 按功能（进阶）

| 目录 | 功能 | 说明 |
|------|------|------|
| [multi-turn](./multi-turn) | 多轮对话 | 构建多轮上下文，维护消息历史 |
| [streaming](./streaming) | 流式输出 | SSE 流式返回，逐字输出效果 |
| [deep-thinking](./deep-thinking) | 深度思考 | 推理模型的思考过程 + 最终回答 |
| [context-caching](./context-caching) | 上下文缓存 | Anthropic 协议的提示词缓存 |
| [tool-calling](./tool-calling) | 工具调用 | Function Calling 扩展模型能力 |

## 快速开始

### Node SDK / OpenAI SDK / Anthropic SDK

```bash
cd nodejs-sdk  # 或 openai-sdk / anthropic-sdk
npm install
```

打开 `index.js`，修改顶部配置后运行：

```bash
node index.js
```

### Web SDK

直接在浏览器中打开 `web-sdk/index.html`，填入环境 ID 和 Publishable Key 即可使用。

### wx-server-sdk

将 `wx-server-sdk/` 目录部署为微信云函数，在微信开发者工具中右键上传并部署。

## 在线体验

点击下方链接在 CodeSandbox 中直接运行（需修改配置）：

- [Node SDK 示例](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/nodejs-sdk/index.js)
- [OpenAI SDK 示例](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/openai-sdk/index.js)
- [Anthropic SDK 示例](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/anthropic-sdk/index.js)
- [多轮对话](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/multi-turn/index.js)
- [流式输出](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/streaming/index.js)
- [深度思考](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/deep-thinking/index.js)
- [上下文缓存](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/context-caching/index.js)
- [工具调用](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/tool-calling/index.js)

## 配置获取

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `ENV_ID` | 云开发环境 ID | [云开发控制台](https://tcb.cloud.tencent.com) |
| `API_KEY` | AI API Key（OpenAI/Anthropic SDK 使用） | [AI 控制台](https://tcb.cloud.tencent.com/dev#/ai?tab=text-aiModel) |
| `SECRET_ID` / `SECRET_KEY` | 腾讯云 API 密钥（Node SDK 使用） | [CAM 控制台](https://console.cloud.tencent.com/cam/capi) |
| `accessKey` | Publishable Key（Web SDK 使用） | [环境配置 → API Key](https://tcb.cloud.tencent.com/dev#/env/apikey) |
