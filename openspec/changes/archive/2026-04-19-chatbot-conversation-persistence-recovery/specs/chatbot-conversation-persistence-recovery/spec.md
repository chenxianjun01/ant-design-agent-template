## ADDED Requirements

### Requirement: Chatbot local workspace snapshot
The system MUST persist the chatbot workspace state locally so that users can return to the previous working context after a page reload.

#### Scenario: Workspace snapshot saves key conversation state
- **WHEN** the chatbot workspace state changes
- **THEN** the system saves the conversation list, active conversation key, chat message snapshots, structured messages, and execution-related local state to a local snapshot

### Requirement: Chatbot workspace recovery
The system MUST recover the locally persisted chatbot workspace on initialization without breaking the current conversation flow.

#### Scenario: Page reload restores previous workspace
- **WHEN** the chatbot page reloads and a valid local workspace snapshot exists
- **THEN** the page restores the previous conversation list, active conversation, chat message snapshots, and structured messages before the user continues interacting

#### Scenario: Invalid snapshot falls back safely
- **WHEN** the chatbot page initializes and the local snapshot is missing or invalid
- **THEN** the page falls back to the default conversation setup without crashing
