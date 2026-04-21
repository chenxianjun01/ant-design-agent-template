## 1. OpenSpec And Todo Scope

- [x] 1.1 Add proposal, design, and spec artifacts for runtime observability and debugging
- [x] 1.2 Update `todo.md` with the new runtime observability change and current status

## 2. Observability And Debugging Implementation

- [x] 2.1 Add a local runtime observability event store and event model
- [x] 2.2 Instrument request / stream / control / patch flows with runtime events
- [x] 2.3 Add a developer-facing runtime debugging view for the current conversation

## 3. Validation And Records

- [x] 3.1 Add tests for runtime event recording or debugging view behavior
- [x] 3.2 Update `todo.md`, development record, and OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
