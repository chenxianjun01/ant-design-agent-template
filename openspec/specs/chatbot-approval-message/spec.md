# chatbot-approval-message Specification

## Purpose
TBD - created by archiving change chatbot-approval-message. Update Purpose after archive.
## Requirements
### Requirement: Approval message protocol
The system MUST support a structured `approval` message type for chatbot conversations.

#### Scenario: Approval message normalizes successfully
- **WHEN** a valid `approval` structured payload is received
- **THEN** it is normalized into a valid structured message and can enter the shared rendering flow

### Requirement: Approval message rendering
The system MUST render `approval` messages through the central message dispatcher.

#### Scenario: Approval message uses mapped renderer
- **WHEN** an `approval` message is passed to the dispatcher
- **THEN** the dispatcher renders the dedicated approval component instead of the fallback component

### Requirement: Approval mock coverage
The system MUST provide a local mock payload for the `approval` message type.

#### Scenario: Approval mock payload is contract-safe
- **WHEN** the mock provider generates an `approval` payload
- **THEN** the payload can be parsed and normalized through the shared message protocol

