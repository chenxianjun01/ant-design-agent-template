# Spec

## Purpose

定义富媒体消息动作协议与地图标记回调行为，确保 `file`、`image`、`audio`、`map` 类型消息可以通过统一动作引擎执行后续交互。

## Requirements

### Requirement 1: Rich Message Action Protocol

The system MUST support declarative actions for `file`, `image`, `audio`, and `map` messages.

Rich media renderers MUST expose actionable controls and route declared actions through the shared action engine.

### Requirement 2: Map Marker Callback Support

The system MUST support click callbacks for map markers.

Map marker actions triggered from either map clicks or mirrored action entries MUST execute through the shared `submitAction` engine.
