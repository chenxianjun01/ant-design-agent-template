## 1. OpenSpec And Protocol

- [x] 1.1 Add proposal, design, and spec artifacts for the approval message type
- [x] 1.2 Extend chatbot message protocol and mock type declarations for approval

## 2. Core Implementation

- [x] 2.1 Implement `ApprovalMessage` and register it in `MessageRenderer`
- [x] 2.2 Add local mock approval payload support in chatbot service

## 3. Tests And Records

- [x] 3.1 Extend renderer and mock contract tests for approval
- [x] 3.2 Add approval component render test, update the development record, and add an OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
