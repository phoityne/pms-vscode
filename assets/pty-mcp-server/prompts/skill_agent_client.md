# AI Prompt: Agent Client Communication Skill
*(Connect to {{host}}:{{port}} and communicate with a remote AI agent server)*

## Mission

You are an AI agent acting as a **TCP client**.
You will connect to a remote AI agent server (e.g. Claude),
perform a handshake to receive the server's communication rules,
then carry out a conversation following those rules.
Use `pms-local-mcp-server` tools throughout.

---

## Phase 1: Connect to server

1. Call `agent-socket-open` with `host={{host}}` and `port={{port}}`
2. Confirm the connection is established

---

## Phase 2: Handshake

### Step 1 — Receive greeting

Call `agent-socket-read` and wait for `HELLO? name?\r\n` from the server.

### Step 2 — Send your handle name

Send your handle name using `agent-socket-write-byte`:
```
NAME: <your-name>\r\n
```
Generate hex with:
```
python3 -c "print('NAME: <your-name>\r\n'.encode().hex())"
```

### Step 3 — Receive communication rules

Call `agent-socket-read` and wait for `RULES: ...\r\n` from the server.
Read and remember the rules carefully.

### Step 4 — Send ACK

Acknowledge the rules using `agent-socket-write-byte`:
```
ACK\r\n
```
Generate hex with:
```
python3 -c "print('ACK\r\n'.encode().hex())"
```
Handshake is complete.

---

## Phase 3: Conversation

- Send messages using `agent-socket-write-byte` with format: `MSG: <content>\r\n`
- Receive replies by calling `agent-socket-read`
- Server replies follow the format: `REPLY: <content>\r\n`
- For binary data, use format: `HEX: <hex-string>\r\n`
- Always generate hex with: `python3 -c "print('...'.encode().hex())"`

---

## Phase 4: Disconnection

### Initiated by server

1. Detect `BYE\r\n` from server via `agent-socket-read`
2. Send `ACK\r\n` using `agent-socket-write-byte` **before closing**
   (server waits for this ACK before closing the port)
3. Call `agent-socket-close`

### Initiated by client (graceful shutdown)

1. Send `BYE\r\n` using `agent-socket-write-byte`
2. Wait for `ACK\r\n` from server via `agent-socket-read`
3. Call `agent-socket-close`

---

## Important notes

- **`agent-socket-write-byte` hex must not contain spaces or newlines** — it will fail with `invalid hex string`
- **Always generate hex via**: `python3 -c "print('...'.encode().hex())"`
- **`agent-socket-write` sends `\r\n` as literal characters** — always use `agent-socket-write-byte` for correct CRLF
- **Send `ACK\r\n` before calling `agent-socket-close`** when server sends `BYE` — closing first causes the server to fail reading the ACK
