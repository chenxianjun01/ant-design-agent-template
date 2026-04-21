## ADDED Requirements

### Requirement: Video message protocol
The system MUST support a structured `video` message type for chatbot conversations.

The `video` payload MUST support `url`, `poster`, `title`, `duration`, and `format` fields so that video resources can be described consistently across local mock and real responses.

#### Scenario: Video message normalizes with required media fields
- **WHEN** a valid structured `video` payload containing a playable `url` and optional `poster`, `title`, `duration`, and `format` is received
- **THEN** the message is normalized into a valid structured message and can enter the shared rendering flow

### Requirement: Inline video playback behavior
The system MUST render supported `video` messages as inline preview cards inside the message bubble rather than requiring a modal as the default entry point.

The inline preview MUST expose browser-native playback controls so users can play the video and enter fullscreen without leaving the conversation context.

#### Scenario: Video message plays inline in the conversation
- **WHEN** a supported `video` message is rendered in the conversation
- **THEN** the UI shows the video inside the message bubble with visible playback controls
- **AND** the user can use the native player to enter fullscreen

### Requirement: Video source scope
The system MUST support video messages backed by directly accessible local or remote media URLs.

The system MUST treat third-party sources as supported only when the provided URL can be used directly as the media source for the browser video element.

#### Scenario: Direct media URL is accepted as a video source
- **WHEN** a `video` message provides a local asset URL or a third-party direct media URL
- **THEN** the UI treats it as a supported video source for inline playback
