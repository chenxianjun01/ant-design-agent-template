## ADDED Requirements

### Requirement: SchemaSlot runtime regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for SchemaSlot after the Formily integration.

#### Scenario: Runtime validation can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** SchemaSlot runtime behavior is validated alongside other chatbot tests
