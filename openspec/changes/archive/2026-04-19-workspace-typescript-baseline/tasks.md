## 1. OpenSpec And Scope

- [x] 1.1 Add proposal, design, and spec artifacts for the workspace TypeScript baseline change
- [x] 1.2 Define the repair scope around root typecheck boundaries and chatbot preset mock typing

## 2. TypeScript Baseline Fixes

- [x] 2.1 Exclude `cloudflare-worker` from the root `tsconfig.json` typecheck scope
- [x] 2.2 Align chatbot `starterMockType` typing with the runtime `MockMessageType` contract
- [x] 2.3 Add the root TypeScript config needed for Node, Jest, and package import resolution

## 3. Validation And Records

- [x] 3.1 Update the development record with the TypeScript baseline repair
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec tsc --noEmit`
