# chatbot-approval-action-protocol Specification

## Purpose
TBD - created by archiving change chatbot-approval-action-protocol. Update Purpose after archive.
## Requirements
### Requirement: Approval action protocol
The system MUST support declarative action buttons on `approval` structured messages.

#### Scenario: Approval card declares actions
- **WHEN** an `approval` message payload contains action definitions
- **THEN** the approval card renders corresponding buttons and associates each button with its declared `submitAction`

### Requirement: Shared action execution for approval messages
The system MUST allow approval actions to execute through the existing shared `submitAction` engine.

#### Scenario: Approval action triggers shared submitAction flow
- **WHEN** a user clicks an approval action button
- **THEN** the message action is executed through the same request / insert / callApi pipeline used by form submit actions

### Requirement: Approval action mock coverage
The system MUST provide a local approval mock payload that includes actionable buttons.

#### Scenario: Approval mock demonstrates button actions
- **WHEN** developers select the approval mock type in local development
- **THEN** the approval card renders with at least one clickable action button wired to the shared action engine

