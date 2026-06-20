# pty-mcp-server

pty-mcp-server is an MCP server that provides AI agents with access to
external processes, sockets, serial ports, and the local filesystem
through a set of MCP tools.

## Links

- **Homepage**: https://hackage.haskell.org/package/pty-mcp-server
- **GitHub**: https://github.com/phoityne/pty-mcp-server

## Key Tools

- `agent-proc-run` / `agent-proc-read` / `agent-proc-write` — Interact with external processes via stdin/stdout
- `agent-socket-open` / `agent-socket-read` / `agent-socket-write` — TCP/Unix socket communication
- `agent-serial-open` / `agent-serial-read` / `agent-serial-write` — Serial port communication
- `agent-server-listen` / `agent-server-read` / `agent-server-write` — TCP server (accept incoming connections)
- `pms-read-file` / `pms-write-file` / `pms-patch-file` — Local filesystem operations
- `pms-grep-file` / `pms-replace-file` / `pms-file-info` — File search and manipulation
