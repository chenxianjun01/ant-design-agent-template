## 1. OpenSpec And Contract Scope

- [x] 1.1 Add proposal, design, and spec artifacts for mock contract validation
- [x] 1.2 Define validation scope around structured mock payload compatibility

## 2. Contract Test Implementation

- [x] 2.1 Add a narrow test access point for chatbot mock payload generation
- [x] 2.2 Add tests that validate table, chart, and form mock payloads normalize successfully
- [x] 2.3 Add tests that validate text mock mode remains stream-based

## 3. Records And Validation

- [x] 3.1 Update the development record with mock contract validation progress
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
