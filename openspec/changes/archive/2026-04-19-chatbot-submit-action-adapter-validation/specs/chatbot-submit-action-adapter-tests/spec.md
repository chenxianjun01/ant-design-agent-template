## ADDED Requirements

### Requirement: Submit-action adapter mode coverage
The system MUST provide automated tests that validate `submitActionAdapter` selects the correct runtime implementation for mock and remote provider modes.

#### Scenario: Mock mode uses local adapter capabilities
- **WHEN** the chatbot service is loaded with `CHAT_PROVIDER_MODE=mock`
- **THEN** `createSubmitActionAdapter` uses the local submit-action executor and local event tracker

#### Scenario: Remote mode uses remote adapter capabilities
- **WHEN** the chatbot service is loaded with `CHAT_PROVIDER_MODE=remote`
- **THEN** `createSubmitActionAdapter` uses the remote submit-action executor and remote event tracker

### Requirement: Submit-action adapter request coverage
The system MUST provide automated tests for remote submit-action adapter request and error handling behavior.

#### Scenario: Remote executeApiAction normalizes successful response
- **WHEN** the remote adapter submit request succeeds
- **THEN** the adapter sends the configured request payload and returns normalized `success`, `code`, `retryable`, `message`, and `data` fields

#### Scenario: Remote executeApiAction falls back on request failure
- **WHEN** the remote adapter submit request throws an error
- **THEN** the adapter returns a normalized `REMOTE_REQUEST_FAILED` result with the original payload attached

#### Scenario: Remote trackEvent ignores request failure
- **WHEN** the remote adapter event tracking request throws an error
- **THEN** the adapter completes without throwing so submit-action execution can continue
