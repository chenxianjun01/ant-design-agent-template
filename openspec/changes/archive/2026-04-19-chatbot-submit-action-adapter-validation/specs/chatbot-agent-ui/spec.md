## ADDED Requirements

### Requirement: Submit-action adapter regression baseline
The chatbot UI MUST maintain an executable regression baseline for `submitActionAdapter` runtime behavior in both mock and remote modes.

#### Scenario: Adapter runtime tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** adapter mode selection, remote request behavior, and remote failure handling are validated alongside other chatbot tests
