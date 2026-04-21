## ADDED Requirements

### Requirement: Rich media message protocol
The system MUST support structured `file`, `image`, `audio`, and `map` message types for chatbot conversations.

#### Scenario: Rich media messages normalize successfully
- **WHEN** a valid `file`, `image`, `audio`, or `map` structured payload is received
- **THEN** it is normalized into a valid structured message and can enter the shared rendering flow

### Requirement: Rich media message rendering
The system MUST render `file`, `image`, `audio`, and `map` messages through the central message dispatcher.

#### Scenario: Rich media messages use mapped renderers
- **WHEN** one of the supported rich media message types is passed to the dispatcher
- **THEN** the dispatcher renders the dedicated component instead of the fallback component

### Requirement: Rich media mock coverage
The system MUST provide local mock payloads for `file`, `image`, `audio`, and `map`.

#### Scenario: Rich media mock payloads are contract-safe
- **WHEN** the mock provider generates a rich media payload
- **THEN** the payload can be parsed and normalized through the shared message protocol
