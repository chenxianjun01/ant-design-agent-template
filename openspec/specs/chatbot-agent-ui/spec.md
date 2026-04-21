# Spec

## Purpose

定义 `src/pages/chatbot` 智能体界面的长期稳定行为约束，覆盖结构化消息渲染、表单提交动作和远端联调边界。
## Requirements

### Requirement 1: Message Rendering

The system MUST support rendering `text`, `table`, `chart`, and `form` message types through a central dispatcher.

The dispatcher MUST use a component mapping strategy rather than hard-coded branching as the primary extension mechanism.

The system MUST render an explicit fallback component when an unknown message type is received.

#### Scenario: Dispatcher renders known and unknown message types
- **WHEN** a conversation contains supported structured message types and an unknown type
- **THEN** the central dispatcher renders supported types via mapped components
- **AND** unknown types render through the fallback component

### Requirement 2: Structured Message Compatibility

The system MUST continue to support plain assistant text responses, `<think>` responses, and structured JSON responses in the same conversation flow.

Structured messages MUST be normalized into a stable `IMessageItem` shape before rendering.

#### Scenario: Mixed response payloads share one rendering flow
- **WHEN** the chatbot returns plain text, `<think>`, and structured JSON in one session
- **THEN** the UI keeps them in the same timeline without breaking compatibility
- **AND** structured payloads are normalized to `IMessageItem` before rendering

### Requirement 3: Form Submit Actions

The system MUST support the following form submit actions:

1. `request`
2. `insertMessage`
3. `requestAndInsert`
4. `callApi`

`callApi` MUST support async execution and return a normalized execution result to the form UI.

#### Scenario: Form submit action executes with normalized async result
- **WHEN** a form uses any supported submit action and triggers `callApi`
- **THEN** the execution engine accepts `request`, `insertMessage`, `requestAndInsert`, and `callApi`
- **AND** `callApi` resolves to a normalized result consumed by the form UI

### Requirement 4: Form Submission UX

The form UI MUST show a loading state during async submission.

The form UI MUST prevent duplicate submission while a submission is in progress.

The form UI MUST display a user-visible error state when async submission fails.

The form UI SHOULD allow retry when the execution result is retryable.

#### Scenario: Form submission enforces loading, dedupe, and retry behavior
- **WHEN** a user submits a form that executes an async action
- **THEN** the form shows loading and blocks duplicate submissions until completion
- **AND** failures are visible and retry remains available when the result is retryable

### Requirement 5: Hook Execution

The system MUST support hook-based side effects around `callApi`.

Current supported hook actions MUST include:

1. `insertMessage`
2. `request`
3. `clearStructuredMessages`
4. `trackEvent`
5. `refreshConversation`

Hook execution SHOULD be implemented through a registry so that new actions can be added incrementally.

#### Scenario: Hook registry runs supported side effects around callApi
- **WHEN** `callApi` executes with before/after hooks
- **THEN** supported actions (`insertMessage`, `request`, `clearStructuredMessages`, `trackEvent`, `refreshConversation`) can be invoked
- **AND** the hook system uses a registry-based extension mechanism

### Requirement 6: Adapter Boundary

The schema execution layer MUST not directly depend on mock-specific implementations for API execution or event tracking.

The system MUST expose a `submitActionAdapter` boundary that provides:

1. `executeApiAction`
2. `trackEvent`

#### Scenario: Runtime uses adapter boundary instead of mock internals
- **WHEN** submit actions require API execution or tracking
- **THEN** schema runtime interacts only through `submitActionAdapter`
- **AND** adapter capabilities include `executeApiAction` and `trackEvent`

### Requirement 7: Remote Integration

Remote submit action execution MUST support:

1. a submit action endpoint
2. a track event endpoint
3. normalized error handling

The default remote endpoints SHOULD be:

1. `/api/chatbot/submit-action`
2. `/api/chatbot/track-event`

#### Scenario: Remote mode executes submit action and tracking with normalized errors
- **WHEN** the UI is configured for remote submit-action execution
- **THEN** submit and tracking requests call dedicated endpoints with normalized error handling
- **AND** defaults use `/api/chatbot/submit-action` and `/api/chatbot/track-event`

### Requirement 8: Local Development Parity

The project MUST provide local mock handlers for the default remote submit action endpoints so that remote-mode local development remains testable without a live backend.

#### Scenario: Local remote-mode development works without backend
- **WHEN** developers run chatbot UI in remote mode without a live service
- **THEN** default submit-action endpoints are handled by local mocks
- **AND** remote integration behavior remains testable during local development

### Requirement 9: Actionable Rich Media Coverage

The chatbot UI MUST allow rich media messages to trigger follow-up actions without leaving the conversation.

Rich media follow-up actions MUST route through the shared action engine for consistent behavior.

#### Scenario: Rich media actions trigger shared follow-up flow
- **WHEN** users interact with actionable controls in rich media messages
- **THEN** the UI triggers follow-up behavior in the same conversation context
- **AND** action execution routes through the shared action engine

### Requirement: Core chatbot type coverage
The chatbot UI MUST support text, file, image, audio, table, form, chart, and map message coverage for local development and integration.

#### Scenario: Core media coverage is available in development
- **WHEN** developers switch the mock type to one of the supported structured media types
- **THEN** the chatbot UI renders the corresponding message component in the conversation flow

### Requirement: Non-form submitAction compatibility
The chatbot UI MUST allow the shared `submitAction` engine to execute for structured messages beyond forms when the message content declares a compatible action.

#### Scenario: Approval message action uses shared engine
- **WHEN** an approval card injects a `submitAction` into its message content
- **THEN** the shared action executor processes it without requiring the message type to be `form`

### Requirement: Approval-style message coverage
The chatbot UI MUST support at least one approval-style structured message type for business summary scenarios.

#### Scenario: Approval message can run in local development
- **WHEN** developers select the approval mock type in local development
- **THEN** the chatbot UI renders an approval card in the conversation flow

### Requirement: Flow-style message coverage
The chatbot UI MUST support at least one flow-style structured message type beyond text, table, chart, and form.

#### Scenario: Timeline message can run in local development
- **WHEN** developers select the timeline mock type in local development
- **THEN** the chatbot UI renders a timeline message in the conversation flow

### Requirement: SchemaSlot field regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for the field types already declared as supported by the SchemaSlot default runtime.

#### Scenario: Field coverage tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** the supported field-type coverage for SchemaSlot is validated alongside other chatbot tests

### Requirement: Mock payload regression baseline
The chatbot UI MUST maintain an executable regression baseline for local mock payload compatibility with the shared message protocol.

#### Scenario: Mock contract tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** local mock payload compatibility is validated alongside other chatbot tests

### Requirement: Submit-action runtime regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for submit-action orchestration beyond the basic success and failure paths.

#### Scenario: Hook orchestration tests can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** submit-action hook combinations are validated alongside other chatbot tests

### Requirement: SchemaSlot runtime regression baseline
The chatbot UI MUST maintain an executable runtime regression baseline for SchemaSlot after the Formily integration.

#### Scenario: Runtime validation can run locally
- **WHEN** developers run the chatbot Jest suite
- **THEN** SchemaSlot runtime behavior is validated alongside other chatbot tests

### Requirement: Chatbot core module regression baseline
The chatbot UI module MUST maintain an executable regression baseline for its core non-visual logic before additional message types or orchestration features are added.

#### Scenario: Core tests can run in local development
- **WHEN** developers run the chatbot test suite in the local project
- **THEN** they can validate renderer dispatch, schema extraction, and submit-action behavior without launching the full application

### Requirement: SchemaSlot-backed form rendering
The chatbot UI MUST support rendering form messages through `SchemaSlot` when a supported dynamic schema is present.

#### Scenario: Form message with schema uses SchemaSlot
- **WHEN** a form message includes a supported schema payload
- **THEN** the UI renders the form through `SchemaSlot` instead of showing only a placeholder

#### Scenario: Unsupported schema falls back safely
- **WHEN** a form message includes an unsupported or incomplete schema payload
- **THEN** the UI keeps a safe fallback path instead of crashing the conversation view

### Requirement: Shared structured message normalization
The chatbot UI MUST normalize assistant structured JSON responses through a shared message normalization entry rather than implementing ad hoc parsing rules in the page container.

#### Scenario: Assistant returns valid structured JSON
- **WHEN** the assistant response contains a valid structured message payload
- **THEN** the page normalizes it through the shared entry and renders the resulting `IMessageItem`

#### Scenario: Local insert uses the same message rules
- **WHEN** a submit action or local helper inserts a structured message into the conversation
- **THEN** it uses the same shared message creation rules as the page parser

### Requirement: Preset conversation mock type consistency
The chatbot UI MUST keep preset conversation mock selectors aligned with the runtime mock type contract used by the local provider.

#### Scenario: Preset starter mock type remains assignable
- **WHEN** developers add or edit `starterMockType` on a preset conversation entry
- **THEN** TypeScript validates the value against the runtime mock selector type used by chatbot request dispatch

### Requirement: Agent execution message coverage
The chatbot UI MUST support at least one execution-state structured message type for agent runtime feedback scenarios.

The chatbot UI MUST allow supported `agent-execution` messages to expose message-level runtime controls without leaving the conversation flow.

The chatbot UI MUST keep execution controls scoped to the corresponding execution message so users can act on a running task without ambiguity.

The chatbot UI MUST restore locally persisted conversation and execution-state workspace context after a page reload when a valid local snapshot exists.

The chatbot UI MUST expose a developer-facing runtime debugging view for the current conversation during local development or integration debugging.

#### Scenario: Agent execution message can run in local development
- **WHEN** developers select the `agent-execution` mock type in local development
- **THEN** the chatbot UI renders an execution-state card in the conversation flow

#### Scenario: Remote execution message continues updating in one conversation card
- **WHEN** the assistant returns an `agent-execution` structured message in remote mode and subsequent runtime patches target the same message id
- **THEN** the UI keeps one execution-state card in the conversation flow and updates that card in place as runtime state changes

#### Scenario: Execution controls stay inside the conversation card
- **WHEN** an execution message supports runtime controls
- **THEN** the UI renders those controls inside the execution-state card and binds user actions to that message only

#### Scenario: Reload restores local execution workspace
- **WHEN** the chatbot page reloads after a conversation has accumulated local chat snapshots and structured execution-state messages
- **THEN** the UI restores that conversation workspace and can continue showing the same execution-state card instead of starting from an empty page

#### Scenario: Runtime debugging view stays outside the main conversation flow
- **WHEN** developers inspect runtime debugging information
- **THEN** the UI exposes that information through a dedicated debugging view without turning the main conversation timeline into a log console

### Requirement: Agent execution demo progression
The chatbot UI MUST provide a local development path for observing `agent-execution` message progression in one conversation.

#### Scenario: Developers can trigger execution progression locally
- **WHEN** developers use the execution-state demo in local development
- **THEN** they can observe one execution card transition through multiple step states without refreshing the page

## Constraints

1. Existing chatbot message flow in `src/pages/chatbot/index.tsx` must remain compatible.
2. Current message protocol in `src/pages/chatbot/data.ts` must remain the primary source of truth.
3. Remote responses should map cleanly to `success`, `code`, `retryable`, `message`, and `data`.

## Integration Notes

1. Protocol reference: [submit-action-contract.md](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/submit-action-contract.md:1)
2. Execution core: [formSubmitAction.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/components/schema/formSubmitAction.ts:1)
3. Adapter entry: [service.ts](/Users/chenxianjun/Desktop/items/agent/ant-design-pro/src/pages/chatbot/service.ts:1)
