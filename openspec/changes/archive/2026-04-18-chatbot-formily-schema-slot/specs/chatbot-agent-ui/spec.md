## ADDED Requirements

### Requirement: SchemaSlot-backed form rendering
The chatbot UI MUST support rendering form messages through `SchemaSlot` when a supported dynamic schema is present.

#### Scenario: Form message with schema uses SchemaSlot
- **WHEN** a form message includes a supported schema payload
- **THEN** the UI renders the form through `SchemaSlot` instead of showing only a placeholder

#### Scenario: Unsupported schema falls back safely
- **WHEN** a form message includes an unsupported or incomplete schema payload
- **THEN** the UI keeps a safe fallback path instead of crashing the conversation view
