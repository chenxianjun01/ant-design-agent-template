## ADDED Requirements

### Requirement: Submit-action hook combination coverage
The system MUST provide automated tests for important submit-action hook combinations so that side-effect orchestration remains regression-safe.

#### Scenario: RequestAndInsert inserts message and sends follow-up request
- **WHEN** a `requestAndInsert` action executes
- **THEN** the configured structured message is inserted and a follow-up request is issued

#### Scenario: CallApi afterSuccess hooks trigger configured side effects
- **WHEN** a `callApi` action succeeds with `afterSuccess` hooks
- **THEN** the configured side effects are executed with resolved template values

### Requirement: Submit-action fallback coverage
The system MUST provide automated tests for default submit-action fallback behavior.

#### Scenario: Missing prompt template falls back to generated summary prompt
- **WHEN** a request-style submit action does not define a prompt template
- **THEN** the executor sends the generated fallback summary prompt
