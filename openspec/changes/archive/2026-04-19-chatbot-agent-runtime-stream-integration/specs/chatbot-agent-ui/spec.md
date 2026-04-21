## MODIFIED Requirements

### Requirement: Agent execution message coverage
The chatbot UI MUST support at least one execution-state structured message type for agent runtime feedback scenarios.

The chatbot UI MUST synchronize remote `agent-execution` assistant messages into the local structured message update chain before applying runtime patches.

#### Scenario: Agent execution message can run in local development
- **WHEN** developers select the `agent-execution` mock type in local development
- **THEN** the chatbot UI renders an execution-state card in the conversation flow

#### Scenario: Remote execution message continues updating in one conversation card
- **WHEN** the assistant returns an `agent-execution` structured message in remote mode and subsequent runtime patches target the same message id
- **THEN** the UI keeps one execution-state card in the conversation flow and updates that card in place as runtime state changes
