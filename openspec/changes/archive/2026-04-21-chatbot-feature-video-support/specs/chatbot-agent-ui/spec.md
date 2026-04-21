## MODIFIED Requirements

### Requirement: Core chatbot type coverage
The chatbot UI MUST support text, file, image, audio, video, table, form, chart, and map message coverage for local development and integration.

#### Scenario: Core media coverage is available in development
- **WHEN** developers switch the mock type to one of the supported structured media types
- **THEN** the chatbot UI renders the corresponding message component in the conversation flow
