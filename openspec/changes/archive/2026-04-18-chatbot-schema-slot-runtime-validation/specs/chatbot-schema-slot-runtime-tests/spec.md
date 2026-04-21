## ADDED Requirements

### Requirement: SchemaSlot runtime fallback behavior
The system MUST provide automated runtime tests for SchemaSlot fallback behavior.

#### Scenario: External renderer overrides default runtime
- **WHEN** `schemaFieldRender` is provided
- **THEN** SchemaSlot renders the external output instead of the default Formily runtime

#### Scenario: Unsupported schema degrades safely
- **WHEN** a form message contains a schema that cannot be rendered by the default runtime
- **THEN** SchemaSlot renders a visible fallback message instead of throwing

### Requirement: SchemaSlot form bridge runtime behavior
The system MUST provide automated runtime tests for the Formily submit bridge.

#### Scenario: Supported schema submits through onFormSubmit
- **WHEN** a supported form schema is rendered and submitted
- **THEN** the runtime forwards normalized values to `onFormSubmit(message, values)`

#### Scenario: Non-form message does not render Formily runtime
- **WHEN** SchemaSlot receives a non-form message without external renderer
- **THEN** it returns no default schema runtime content
