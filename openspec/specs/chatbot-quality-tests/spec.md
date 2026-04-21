# chatbot-quality-tests Specification

## Purpose
TBD - created by archiving change chatbot-quality-test-coverage. Update Purpose after archive.
## Requirements
### Requirement: Core renderer test coverage
The system MUST provide automated tests for the chatbot message dispatcher so that supported message types and fallback behavior remain regression-safe.

#### Scenario: Known message type resolves to mapped component
- **WHEN** a supported message type is rendered through `MessageRenderer`
- **THEN** the mapped component is used instead of the fallback component

#### Scenario: Unknown message type falls back safely
- **WHEN** an unsupported message type is rendered through `MessageRenderer`
- **THEN** the fallback component is rendered without throwing

### Requirement: Schema adapter test coverage
The system MUST provide automated tests for chatbot schema extraction helpers.

#### Scenario: Table schema columns are extracted
- **WHEN** table columns are declared in schema component props
- **THEN** the adapter returns normalized column definitions

#### Scenario: Form schema properties are extracted with required state
- **WHEN** a form schema contains `properties` and `required`
- **THEN** the adapter returns field definitions with required flags applied

### Requirement: Submit-action test coverage
The system MUST provide automated tests for key submit-action execution paths.

#### Scenario: CallApi success inserts success message and triggers follow-up request
- **WHEN** a `callApi` action succeeds
- **THEN** the execution result, inserted messages, and follow-up request behavior match the configured action

#### Scenario: CallApi failure returns normalized error result
- **WHEN** a `callApi` action fails
- **THEN** the execution result exposes an error status, message, and retryable state

