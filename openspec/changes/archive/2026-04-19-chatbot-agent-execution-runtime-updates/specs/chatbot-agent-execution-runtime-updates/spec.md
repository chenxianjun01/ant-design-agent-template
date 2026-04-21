## ADDED Requirements

### Requirement: Agent execution patch protocol
The system MUST support a minimal patch protocol for updating an existing `agent-execution` message in place.

#### Scenario: Agent execution patch updates overall status and summary
- **WHEN** a valid execution patch targets an existing `agent-execution` message
- **THEN** the message can update its overall `status`, `summary`, and timestamp fields without inserting a new card

#### Scenario: Agent execution patch updates or appends steps
- **WHEN** a valid execution patch includes step updates or appended steps
- **THEN** the targeted execution message updates matching steps and can append new steps in the same message

### Requirement: Local execution runtime demo
The system MUST provide a local runtime demo that shows a single `agent-execution` message progressing through multiple states.

#### Scenario: Local demo patches one execution card over time
- **WHEN** developers trigger the local execution-state demo
- **THEN** one `agent-execution` message is inserted and subsequently updated in place as execution progresses
