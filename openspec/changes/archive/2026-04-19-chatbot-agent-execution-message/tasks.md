## 1. OpenSpec And Protocol Scope

- [x] 1.1 Add proposal, design, and spec artifacts for the agent execution message change
- [x] 1.2 Define the first-round scope around protocol, renderer, and local mock coverage

## 2. Agent Execution Message Implementation

- [x] 2.1 Extend chatbot message protocol and mock type declarations for `agent-execution`
- [x] 2.2 Implement `AgentExecutionMessage` and register it in `MessageRenderer`
- [x] 2.3 Add local mock payload support for `agent-execution`

## 3. Validation And Records

- [x] 3.1 Extend renderer and mock contract tests for `agent-execution`
- [x] 3.2 Update the development record and add an OpenSpec usage record
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
