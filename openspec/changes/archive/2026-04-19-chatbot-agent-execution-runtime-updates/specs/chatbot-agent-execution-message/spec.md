## ADDED Requirements

### Requirement: Agent execution runtime updates
The system MUST allow a rendered `agent-execution` message to be updated in place as the same execution progresses.

#### Scenario: One execution message progresses without duplication
- **WHEN** a local or remote runtime update targets an existing `agent-execution` message by id
- **THEN** the UI updates that message in place instead of appending a duplicate execution card
