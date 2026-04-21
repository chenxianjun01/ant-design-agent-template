## ADDED Requirements

### Requirement: Mock payload regression baseline
The chatbot UI MUST maintain an executable regression baseline for local mock payload compatibility with the shared message protocol.

#### Scenario: Mock contract tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** local mock payload compatibility is validated alongside other chatbot tests
