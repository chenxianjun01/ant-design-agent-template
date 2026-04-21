## ADDED Requirements

### Requirement: Shared structured message normalization
The chatbot UI MUST normalize assistant structured JSON responses through a shared message normalization entry rather than implementing ad hoc parsing rules in the page container.

#### Scenario: Assistant returns valid structured JSON
- **WHEN** the assistant response contains a valid structured message payload
- **THEN** the page normalizes it through the shared entry and renders the resulting `IMessageItem`

#### Scenario: Local insert uses the same message rules
- **WHEN** a submit action or local helper inserts a structured message into the conversation
- **THEN** it uses the same shared message creation rules as the page parser
