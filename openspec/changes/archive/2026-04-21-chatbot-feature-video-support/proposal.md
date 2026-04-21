## Why

当前聊天工作台已经支持图片、音频、文件、地图等结构化消息，但缺少视频消息这一常见媒介，导致本地演示、知识回放、录屏说明和第三方媒体嵌入都需要退回纯链接文本。现在补齐视频消息，可以把多媒体联调能力扩展到更接近真实业务的消息场景。

## What Changes

- 为 chatbot 结构化消息协议新增 `video` 类型，支持 `url`、`poster`、`title`、`duration`、`format`
- 明确视频消息应用场景，覆盖本地可访问视频资源和第三方流媒体直链资源
- 为视频消息新增专用渲染组件，默认在气泡内直接预览，并保留浏览器原生全屏能力
- 扩展中央消息分发、mock 类型选择和本地 mock payload 生成逻辑，使 `video` 与现有富媒体类型保持一致
- 为视频消息补充协议、渲染和 mock 联调的测试覆盖

## Capabilities

### New Capabilities
- `chatbot-video-message`: 视频消息的协议字段、内联预览交互和播放约束

### Modified Capabilities
- `chatbot-rich-message-coverage`: 富媒体消息协议、渲染和 mock 覆盖范围扩展到 `video`
- `chatbot-agent-ui`: 中央消息分发与本地开发 mock 类型覆盖新增 `video`

## Impact

- 受影响代码包括 `src/pages/chatbot/data.ts`、`service.ts`、`mockPayloadFactory.ts`、`components/MessageRenderer.tsx`、`components/messages/*`
- 需要新增视频消息组件与对应测试，并更新当前消息协议的类型约束
- 不引入额外第三方播放器，优先使用浏览器原生 `video` 能力完成内联播放与全屏
