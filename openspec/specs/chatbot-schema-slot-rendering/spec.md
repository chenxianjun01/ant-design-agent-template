# chatbot-schema-slot-rendering Specification

## Purpose
TBD - created by archiving change chatbot-formily-schema-slot. Update Purpose after archive.
## Requirements
### Requirement: SchemaSlot default rendering
The system MUST provide a default runtime implementation for `SchemaSlot` so that supported chatbot schemas can render without requiring an external `schemaFieldRender`.

#### Scenario: External renderer takes precedence
- **WHEN** `schemaFieldRender` is provided for a message
- **THEN** `SchemaSlot` uses that renderer instead of the default Formily implementation

#### Scenario: Default schema renderer is used
- **WHEN** `schemaFieldRender` is not provided and the message contains a supported schema
- **THEN** `SchemaSlot` renders the schema through the built-in Formily-based runtime

### Requirement: Form schema submission bridge
The system MUST bridge Formily form submission to the existing chatbot `onFormSubmit` contract.

#### Scenario: Formily form submits values
- **WHEN** a user submits a form rendered through `SchemaSlot`
- **THEN** the submitted values are normalized and passed to the existing `onFormSubmit(message, values)` flow

#### Scenario: Formily submission fails
- **WHEN** the downstream submit handler returns an error result
- **THEN** the form-rendered UI surfaces a visible error state and preserves retry semantics

