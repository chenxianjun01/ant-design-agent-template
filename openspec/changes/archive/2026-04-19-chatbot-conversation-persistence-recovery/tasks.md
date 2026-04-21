## 1. OpenSpec And Todo Scope

- [x] 1.1 Add proposal, design, and spec artifacts for conversation persistence and recovery
- [x] 1.2 Update `todo.md` with the new persistence-recovery change and current completion state

## 2. Persistence And Recovery Implementation

- [x] 2.1 Add a local chatbot workspace snapshot helper with load/save guards
- [x] 2.2 Extend local structured message state to support snapshot initialization and persistence
- [x] 2.3 Persist and restore conversation list, active conversation, chat message snapshots, and running execution context in the chatbot page

## 3. Validation And Records

- [x] 3.1 Add tests for workspace snapshot load/save and recovery-safe behavior
- [x] 3.2 Update `todo.md`, development record, and OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
