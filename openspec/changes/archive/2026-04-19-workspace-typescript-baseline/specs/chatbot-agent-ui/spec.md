## ADDED Requirements

### Requirement: Preset conversation mock type consistency
The chatbot UI MUST keep preset conversation mock selectors aligned with the runtime mock type contract used by the local provider.

#### Scenario: Preset starter mock type remains assignable
- **WHEN** developers add or edit `starterMockType` on a preset conversation entry
- **THEN** TypeScript validates the value against the runtime mock selector type used by chatbot request dispatch
