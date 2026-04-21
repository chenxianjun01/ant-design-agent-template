## 1. OpenSpec And Protocol

- [x] 1.1 Add proposal, design, and spec artifacts for approval action protocol
- [x] 1.2 Extend approval message protocol with action button definitions

## 2. Core Implementation

- [x] 2.1 Reuse the shared `submitAction` engine for approval message actions
- [x] 2.2 Add approval action buttons and feedback states in `ApprovalMessage`
- [x] 2.3 Add local approval mock payload actions

## 3. Tests And Records

- [x] 3.1 Extend runtime tests for approval action buttons and shared action execution
- [x] 3.2 Update development record and add an OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
