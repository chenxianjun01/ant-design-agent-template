# chatbot-agent-execution-message Specification

## Purpose
TBD - created by archiving change chatbot-agent-execution-message. Update Purpose after archive.
## Requirements
### Requirement: Agent execution message protocol
The system MUST support a structured `agent-execution` message type for chatbot conversations.

#### Scenario: Agent execution payload normalizes successfully
- **WHEN** a valid `agent-execution` structured payload is received
- **THEN** it is normalized into a valid structured message and can enter the shared rendering flow

### Requirement: Agent execution message rendering
The system MUST render `agent-execution` messages through the central message dispatcher.

#### Scenario: Agent execution message uses dedicated renderer
- **WHEN** an `agent-execution` message is passed to the dispatcher
- **THEN** the dispatcher renders the dedicated execution-state component instead of the fallback component

#### Scenario: Agent execution message shows step statuses
- **WHEN** an `agent-execution` message contains steps with `running`, `success`, or `error` states
- **THEN** the UI renders the overall state and each step state in a user-visible way

### Requirement: Agent execution mock coverage
The system MUST provide a local mock payload for the `agent-execution` message type.

#### Scenario: Agent execution mock payload is contract-safe
- **WHEN** the mock provider generates an `agent-execution` payload
- **THEN** the payload can be parsed and normalized through the shared message protocol

### Requirement: Agent execution runtime updates
The system MUST allow a rendered `agent-execution` message to be updated in place as the same execution progresses.

#### Scenario: One execution message progresses without duplication
- **WHEN** a local or remote runtime update targets an existing `agent-execution` message by id
- **THEN** the UI updates that message in place instead of appending a duplicate execution card

