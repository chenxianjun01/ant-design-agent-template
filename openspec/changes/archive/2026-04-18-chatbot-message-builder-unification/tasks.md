## 1. OpenSpec And Protocol

- [x] 1.1 Add proposal, design, and spec artifacts for structured message builder unification
- [x] 1.2 Define shared factory and normalization expectations for chatbot messages

## 2. Core Implementation

- [x] 2.1 Add shared message builder and normalization utilities in `src/pages/chatbot/data.ts`
- [x] 2.2 Refactor chatbot page parsing and local structured message insertion to use the shared builder
- [x] 2.3 Refactor mock payload generation and submitAction message insertion to use the shared builder

## 3. Records And Validation

- [x] 3.1 Update chatbot development record with this round's implementation notes
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec tsc --noEmit`
