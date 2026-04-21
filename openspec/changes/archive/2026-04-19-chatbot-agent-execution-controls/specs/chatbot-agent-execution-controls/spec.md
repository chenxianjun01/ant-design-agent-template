## ADDED Requirements

### Requirement: Agent execution control protocol
The system MUST support declarative message-level controls on `agent-execution` messages.

#### Scenario: Execution message declares supported controls
- **WHEN** an `agent-execution` message includes control metadata
- **THEN** the control metadata can describe at least `stop`, `retry`, or `continue` actions for that execution message

### Requirement: Agent execution control request handling
The system MUST send execution control requests through a dedicated runtime control boundary and keep the conversation usable when a control request fails.

#### Scenario: Execution control request succeeds
- **WHEN** a user triggers a supported control on an execution message
- **THEN** the UI sends the corresponding runtime control request and shows user-visible pending or success feedback on the same execution message

#### Scenario: Execution control request fails
- **WHEN** a runtime control request fails
- **THEN** the UI keeps the conversation usable and shows a user-visible failure state on the same execution message
