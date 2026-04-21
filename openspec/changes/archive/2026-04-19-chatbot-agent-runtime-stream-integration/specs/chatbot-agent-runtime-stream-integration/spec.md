## ADDED Requirements

### Requirement: Agent runtime stream patch consumption
The system MUST consume remote runtime patch batches for an existing `agent-execution` message and apply them in order to the local structured message store.

#### Scenario: Runtime patch batch updates one execution message
- **WHEN** the chatbot page receives a running `agent-execution` message in remote mode and the runtime stream returns ordered patch batches for the same message
- **THEN** the page applies those patches in order to the existing local structured message

### Requirement: Local runtime stream mock parity
The system MUST provide a local mock endpoint for the default agent runtime stream integration so that remote-mode local development remains executable without a live backend.

#### Scenario: Local remote-mode development consumes runtime patches
- **WHEN** developers run the chatbot page in remote mode without a live runtime backend
- **THEN** the default runtime stream endpoint returns contract-safe patch batches that the page can consume locally
