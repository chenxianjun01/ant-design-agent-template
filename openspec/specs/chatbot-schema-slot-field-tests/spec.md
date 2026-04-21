# chatbot-schema-slot-field-tests Specification

## Purpose
TBD - created by archiving change chatbot-schema-slot-field-validation. Update Purpose after archive.
## Requirements
### Requirement: SchemaSlot field mapping coverage
The system MUST provide automated runtime tests for the field types currently supported by the default SchemaSlot runtime.

#### Scenario: Multiple supported field types render without fallback
- **WHEN** a form schema contains supported field types such as select, switch, number, date, and textarea
- **THEN** SchemaSlot renders the form runtime and keeps the submit path available

#### Scenario: Supported field values can be submitted through the bridge
- **WHEN** a rendered supported field schema is submitted
- **THEN** the bridged submit payload contains the expected normalized values

### Requirement: SchemaSlot malformed input coverage
The system MUST provide automated runtime tests for malformed or edge schema inputs.

#### Scenario: Non-object schema-like inputs do not crash the runtime
- **WHEN** SchemaSlot receives malformed or incomplete schema input for a form message
- **THEN** it degrades safely instead of throwing

