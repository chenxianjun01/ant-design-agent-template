## 1. OpenSpec And Protocol

- [x] 1.1 Add proposal, design, and spec artifacts for `chatbot-feature-video-support`
- [x] 1.2 Extend `src/pages/chatbot/data.ts` with the `video` message type and its payload interfaces (`url`, `poster`, `title`, `duration`, `format`)

## 2. Rendering And Integration

- [x] 2.1 Implement `VideoMessage` in `src/pages/chatbot/components/messages/` using inline bubble playback with native controls and fullscreen support
- [x] 2.2 Register `video` in `src/pages/chatbot/components/MessageRenderer.tsx` and keep fallback behavior unchanged for unsupported types
- [x] 2.3 Extend `src/pages/chatbot/service.ts` mock type declarations and `src/pages/chatbot/mockPayloadFactory.ts` to generate contract-safe `video` payloads for local and third-party direct media URL scenarios

## 3. Validation

- [x] 3.1 Add or update tests for protocol normalization, renderer dispatch, and video message component rendering
- [x] 3.2 Extend mock contract tests to cover `video` payload generation and parsing
- [x] 3.3 Validate with focused chatbot Jest coverage and `tsc --noEmit`
