## ADDED Requirements

### Requirement: Submit-action runtime regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for submit-action orchestration beyond the basic success and failure paths.

#### Scenario: Hook orchestration tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** submit-action hook combinations are validated alongside other chatbot tests
