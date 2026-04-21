## MODIFIED Requirements

### Requirement: Agent execution control request handling
The system MUST send execution control requests through a dedicated runtime control boundary and keep the conversation usable when a control request fails.

Execution control responses MUST support an immediate patch payload that can update the same execution message before later runtime stream patches arrive.

#### Scenario: Execution control request succeeds
- **WHEN** a user triggers a supported control on an execution message
- **THEN** the UI sends the corresponding runtime control request and shows user-visible pending or success feedback on the same execution message

#### Scenario: Execution control request fails
- **WHEN** a runtime control request fails
- **THEN** the UI keeps the conversation usable and shows a user-visible failure state on the same execution message

#### Scenario: Control response patch is intermediate feedback
- **WHEN** a control response includes a patch payload
- **THEN** the contract treats that patch as immediate local feedback rather than the final execution result
