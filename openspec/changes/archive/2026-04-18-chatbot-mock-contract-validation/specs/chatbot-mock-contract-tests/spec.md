## ADDED Requirements

### Requirement: Structured mock payload contract coverage
The system MUST provide automated tests that validate structured chatbot mock payloads against the shared message protocol.

#### Scenario: Table mock payload normalizes successfully
- **WHEN** the mock provider generates a `table` payload
- **THEN** the payload can be parsed and normalized into a valid structured message

#### Scenario: Chart mock payload normalizes successfully
- **WHEN** the mock provider generates a `chart` payload
- **THEN** the payload can be parsed and normalized into a valid structured message

#### Scenario: Form mock payload normalizes successfully
- **WHEN** the mock provider generates a `form` payload
- **THEN** the payload can be parsed and normalized into a valid structured message

### Requirement: Text mock mode contract coverage
The system MUST provide automated tests that validate text mock mode remains non-structured streaming content.

#### Scenario: Text mock payload stays in stream mode
- **WHEN** the mock provider generates a `text` payload
- **THEN** the returned mode is `stream` and the payload is not treated as a structured message
