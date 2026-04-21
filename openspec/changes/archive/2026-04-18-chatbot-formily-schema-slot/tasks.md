## 1. OpenSpec And Dependencies

- [x] 1.1 Add proposal, design, and spec artifacts for Formily-based SchemaSlot integration
- [x] 1.2 Add required Formily dependencies to the chatbot project

## 2. Core Implementation

- [x] 2.1 Implement Formily-backed default rendering in `SchemaSlot`
- [x] 2.2 Bridge Formily form submission to the existing chatbot submit-action flow
- [x] 2.3 Keep safe fallback behavior for unsupported schemas and preserve external `schemaFieldRender` override

## 3. Records And Validation

- [x] 3.1 Update chatbot development record with the SchemaSlot / Formily integration notes
- [x] 3.2 Add an OpenSpec usage record for this change
- [x] 3.3 Validate with `pnpm exec tsc --noEmit`
