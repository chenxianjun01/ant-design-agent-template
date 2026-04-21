## 1. OpenSpec And Runtime Scope

- [x] 1.1 Add proposal, design, and spec artifacts for submit-action hook validation
- [x] 1.2 Define validation scope around hook combinations and fallback request behavior

## 2. Runtime Test Implementation

- [x] 2.1 Extend formSubmitAction tests for requestAndInsert and fallback prompt behavior
- [x] 2.2 Extend formSubmitAction tests for callApi afterSuccess hook combinations

## 3. Records And Validation

- [x] 3.1 Update the development record with submit-action runtime validation progress
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec jest src/pages/chatbot --runInBand` and `pnpm exec tsc --noEmit`
