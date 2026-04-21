## 1. OpenSpec And Runtime Scope

- [x] 1.1 Add proposal, design, and spec artifacts for agent execution runtime updates
- [x] 1.2 Define the first-round scope around patch protocol, store update, and local demo progression

## 2. Runtime Update Implementation

- [x] 2.1 Add `agent-execution` patch types to the chatbot message protocol
- [x] 2.2 Extend structured message store and hook to update an existing message by `message.id`
- [x] 2.3 Add a local execution demo that patches one `agent-execution` message through multiple states

## 3. Validation And Records

- [x] 3.1 Extend structured message store tests for `agent-execution` runtime updates
- [x] 3.2 Update the development record and add an OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
