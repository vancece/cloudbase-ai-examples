# CloudBase AI Examples

云开发 AI 大模型调用示例代码，配合 [CloudBase AI 文档](https://docs.cloudbase.net/ai/model/model-access) 使用。

## 示例列表

| 目录 | 功能 | 说明 |
|------|------|------|
| [multi-turn](./multi-turn) | 多轮对话 | 构建多轮上下文，维护消息历史 |
| [streaming](./streaming) | 流式输出 | SSE 流式返回，逐字输出效果 |
| [deep-thinking](./deep-thinking) | 深度思考 | 推理模型的思考过程 + 最终回答 |
| [context-caching](./context-caching) | 上下文缓存 | Anthropic 协议的提示词缓存 |
| [tool-calling](./tool-calling) | 工具调用 | Function Calling 扩展模型能力 |

## 快速开始

1. 选择一个示例目录，进入后安装依赖：

```bash
cd multi-turn
npm install
```

2. 配置环境变量：

```bash
cp .env.example .env
# 编辑 .env，填入你的 ENV_ID 和 API_KEY
```

3. 运行示例：

```bash
node index.js
```

## 在线体验

点击下方链接在 CodeSandbox 中直接运行：

- [多轮对话](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/multi-turn/index.js)
- [流式输出](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/streaming/index.js)
- [深度思考](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/deep-thinking/index.js)
- [上下文缓存](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/context-caching/index.js)
- [工具调用](https://codesandbox.io/p/github/vancece/cloudbase-ai-examples/main?file=/tool-calling/index.js)

## 配置说明

所有示例都需要以下配置：

| 变量 | 说明 | 获取方式 |
|------|------|---------|
| `ENV_ID` | 云开发环境 ID | [云开发控制台](https://tcb.cloud.tencent.com) |
| `API_KEY` | AI API Key | [AI 控制台](https://tcb.cloud.tencent.com/dev#/ai?tab=text-aiModel) |
