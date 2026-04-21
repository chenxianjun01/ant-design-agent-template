# chatbot-message-builder Specification

## Purpose
TBD - created by archiving change chatbot-message-builder-unification. Update Purpose after archive.
## Requirements
### Requirement: Structured message factory
The system MUST provide a shared factory for creating structured chatbot messages from controlled inputs such as local inserts, mock payloads, and submit-action side effects.

#### Scenario: Create message from partial input
- **WHEN** a caller provides a structured message payload without an `id`
- **THEN** the factory returns a valid `IMessageItem` with a generated `id`

#### Scenario: Preserve explicit message identity
- **WHEN** a caller provides a structured message payload with an explicit `id`
- **THEN** the factory preserves that `id` instead of replacing it

### Requirement: Structured message template resolution
The system MUST provide a shared message template resolver that can apply form values or API result values to structured message payloads before insertion.

#### Scenario: Resolve nested placeholders in message payload
- **WHEN** a structured message contains `{{field}}` placeholders in nested content fields
- **THEN** the resolver replaces those placeholders with the provided context values before the message is inserted

#### Scenario: Return normalized message after template resolution
- **WHEN** a templated structured message is resolved successfully
- **THEN** the returned value remains a valid structured message payload that can be inserted without extra manual normalization

