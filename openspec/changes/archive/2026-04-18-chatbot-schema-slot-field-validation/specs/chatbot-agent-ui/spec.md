## ADDED Requirements

### Requirement: SchemaSlot field regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for the field types already declared as supported by the SchemaSlot default runtime.

#### Scenario: Field coverage tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** the supported field-type coverage for SchemaSlot is validated alongside other chatbot tests
