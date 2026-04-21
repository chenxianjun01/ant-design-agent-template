## ADDED Requirements

### Requirement: Agent execution message coverage
The chatbot UI MUST support at least one execution-state structured message type for agent runtime feedback scenarios.

#### Scenario: Agent execution message can run in local development
- **WHEN** developers select the `agent-execution` mock type in local development
- **THEN** the chatbot UI renders an execution-state card in the conversation flow
