## 1. OpenSpec And Todo Scope

- [x] 1.1 Add proposal, design, and spec artifacts for agent execution controls
- [x] 1.2 Add the new execution control change to `todo.md` and mark current status

## 2. Execution Control Implementation

- [x] 2.1 Extend the `agent-execution` message protocol with declarative control metadata and local pending state support
- [x] 2.2 Add execution control request contracts, remote endpoint configuration, and local mock parity
- [x] 2.3 Render control actions inside `AgentExecutionMessage` and wire them to message-scoped runtime control handling

## 3. Validation And Records

- [x] 3.1 Add tests for execution control protocol, request handling, or rendering behavior
- [x] 3.2 Update `todo.md`, development record, and OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
