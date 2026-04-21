## ADDED Requirements

### Requirement: Rich message action protocol
The system MUST support declarative actions for `file`, `image`, `audio`, and `map` messages.

#### Scenario: Rich message item declares actions
- **WHEN** a rich media message item declares actions
- **THEN** the corresponding renderer shows actionable controls and routes them through the shared action engine

### Requirement: Map marker callback support
The system MUST support click callbacks for map markers.

#### Scenario: Map marker click triggers shared action flow
- **WHEN** a user clicks a marker on the map or its mirrored action entry
- **THEN** the map message executes the marker's declared action through the shared `submitAction` engine
