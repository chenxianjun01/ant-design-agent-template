## ADDED Requirements

### Requirement: Root TypeScript baseline coverage
The workspace MUST keep the root application TypeScript check executable without requiring dependencies from independent subprojects.

#### Scenario: Root project typecheck ignores independent subproject dependencies
- **WHEN** developers run `pnpm exec tsc --noEmit` from the repository root
- **THEN** the command validates the root application sources without failing on dependencies owned by `cloudflare-worker`

#### Scenario: Root project typecheck resolves root globals and dependencies
- **WHEN** developers run `pnpm exec tsc --noEmit` from the repository root
- **THEN** the root TypeScript config resolves Node globals, Jest globals, and root application package imports without ad hoc shim files

### Requirement: Chatbot preset mock typing
The workspace MUST type chatbot preset conversation mock selectors against the same mock type contract used by the chatbot runtime.

#### Scenario: Preset conversations use runtime-compatible mock types
- **WHEN** developers define `starterMockType` for chatbot preset conversations
- **THEN** the values are checked against the chatbot runtime mock type union instead of the rendered message enum
