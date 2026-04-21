## 1. OpenSpec And Test Scope

- [x] 1.1 Add proposal, design, and spec artifacts for submit-action adapter validation
- [x] 1.2 Define runtime validation scope around adapter mode selection, remote request shape, and failure handling

## 2. Adapter Runtime Test Implementation

- [x] 2.1 Add narrow testable exports or module-loading helpers for `submitActionAdapter` runtime verification in `service.ts`
- [x] 2.2 Extend `service.test.ts` to cover mock/remote adapter selection and remote `executeApiAction` normalization
- [x] 2.3 Extend `service.test.ts` to cover remote `trackEvent` request payload and swallowed failure behavior

## 3. Validation And Records

- [x] 3.1 Update the development record with submit-action adapter validation progress
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot/service.test.ts --runInBand` and `pnpm exec tsc --noEmit`
