## ADDED Requirements

### Requirement: Chatbot core module regression baseline
The chatbot UI module MUST maintain an executable regression baseline for its core non-visual logic before additional message types or orchestration features are added.

#### Scenario: Core tests can run in local development
- **WHEN** developers run the chatbot test suite in the local project
- **THEN** they can validate renderer dispatch, schema extraction, and submit-action behavior without launching the full application
