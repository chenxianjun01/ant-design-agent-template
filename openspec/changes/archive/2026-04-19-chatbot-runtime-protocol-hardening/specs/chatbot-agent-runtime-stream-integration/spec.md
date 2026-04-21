## MODIFIED Requirements

### Requirement: Agent runtime stream patch consumption
The system MUST consume remote runtime patch batches for an existing `agent-execution` message and apply them in order to the local structured message store.

Runtime stream batches MUST expose a stable message identifier, ordered patch array, completion flag, and cursor boundary for subsequent fetches.

#### Scenario: Runtime patch batch updates one execution message
- **WHEN** the chatbot page receives a running `agent-execution` message in remote mode and the runtime stream returns ordered patch batches for the same message
- **THEN** the page applies those patches in order to the existing local structured message

#### Scenario: Runtime stream batch defines next fetch boundary
- **WHEN** a runtime stream response is not yet complete
- **THEN** the response includes the current message id and the next cursor boundary used for the following batch request
