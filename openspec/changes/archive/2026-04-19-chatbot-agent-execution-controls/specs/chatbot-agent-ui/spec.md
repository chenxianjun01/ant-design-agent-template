## MODIFIED Requirements

### Requirement: Agent execution message coverage
The chatbot UI MUST support at least one execution-state structured message type for agent runtime feedback scenarios.

The chatbot UI MUST allow supported `agent-execution` messages to expose message-level runtime controls without leaving the conversation flow.

The chatbot UI MUST keep execution controls scoped to the corresponding execution message so users can act on a running task without ambiguity.

#### Scenario: Agent execution message can run in local development
- **WHEN** developers select the `agent-execution` mock type in local development
- **THEN** the chatbot UI renders an execution-state card in the conversation flow

#### Scenario: Remote execution message continues updating in one conversation card
- **WHEN** the assistant returns an `agent-execution` structured message in remote mode and subsequent runtime patches target the same message id
- **THEN** the UI keeps one execution-state card in the conversation flow and updates that card in place as runtime state changes

#### Scenario: Execution controls stay inside the conversation card
- **WHEN** an execution message supports runtime controls
- **THEN** the UI renders those controls inside the execution-state card and binds user actions to that message only
