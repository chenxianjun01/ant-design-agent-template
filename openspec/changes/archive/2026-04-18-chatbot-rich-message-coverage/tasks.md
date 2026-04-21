## 1. OpenSpec And Protocol

- [x] 1.1 Add proposal, design, and spec artifacts for rich message coverage
- [x] 1.2 Extend chatbot message protocol and mock type declarations for `file / image / audio / map`

## 2. Core Implementation

- [x] 2.1 Implement `FileMessage`, `ImageMessage`, `AudioMessage`, and `MapMessage`
- [x] 2.2 Register the new message types in `MessageRenderer`
- [x] 2.3 Add local mock payload support for `file / image / audio / map`

## 3. Tests And Records

- [x] 3.1 Extend renderer and mock contract tests for the new message types
- [x] 3.2 Add focused component tests, update the development record, and add an OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
