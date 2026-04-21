# chatbot-timeline-message Specification

## Purpose
TBD - created by archiving change chatbot-timeline-message. Update Purpose after archive.
## Requirements
### Requirement: Timeline message protocol
The system MUST support a structured `timeline` message type for chatbot conversations.

#### Scenario: Timeline message normalizes successfully
- **WHEN** a valid `timeline` structured payload is received
- **THEN** it is normalized into a valid structured message and can enter the shared rendering flow

### Requirement: Timeline message rendering
The system MUST render `timeline` messages through the central message dispatcher.

#### Scenario: Timeline message uses mapped renderer
- **WHEN** a `timeline` message is passed to the dispatcher
- **THEN** the dispatcher renders the dedicated timeline component instead of the fallback component

### Requirement: Timeline mock coverage
The system MUST provide a local mock payload for the `timeline` message type.

#### Scenario: Timeline mock payload is contract-safe
- **WHEN** the mock provider generates a `timeline` payload
- **THEN** the payload can be parsed and normalized through the shared message protocol

