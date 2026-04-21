## ADDED Requirements

### Requirement: Non-form submitAction compatibility
The chatbot UI MUST allow the shared `submitAction` engine to execute for structured messages beyond forms when the message content declares a compatible action.

#### Scenario: Approval message action uses shared engine
- **WHEN** an approval card injects a `submitAction` into its message content
- **THEN** the shared action executor processes it without requiring the message type to be `form`
