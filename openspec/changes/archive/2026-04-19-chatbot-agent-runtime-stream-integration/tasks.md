## 1. OpenSpec And Runtime Scope

- [x] 1.1 Add proposal, design, and spec artifacts for runtime stream integration
- [x] 1.2 Record the current completion assessment and the new implementation checklist in `todo.md`

## 2. Runtime Stream Integration

- [x] 2.1 Add runtime stream request/response contracts and default endpoint configuration
- [x] 2.2 Add local mock runtime stream handler for remote-mode development parity
- [x] 2.3 Sync remote `agent-execution` messages into local structured message state and consume runtime patch batches without duplicate rendering

## 3. Validation And Records

- [x] 3.1 Add runtime stream integration tests for service/store or page orchestration
- [x] 3.2 Update `todo.md`, development record, and OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
