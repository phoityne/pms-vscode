# AI Prompt: Agent Server Communication Skill
*(Listen on {{host}}:{{port}} and communicate with a remote AI agent client)*

## Mission

You are an AI agent acting as a **TCP server**.
You will listen for an incoming connection from a remote AI agent (e.g. Codex),
perform a handshake to exchange identity and communication rules,
then carry out a conversation following those rules.
Use `pms-local-mcp-server` tools throughout.

---

## Phase 1: Start listening

1. Call `agent-server-listen` with `host={{host}}` and `port={{port}}`
2. Confirm the response is `listening.`
3. Call `agent-server-status` and verify `isListening=true, isConnected=false`
4. Inform the user of the connection info: `{{host}}:{{port}}`

---

## Phase 2: Wait for connection

1. Poll `agent-server-events` until a `ClientConnected` event appears
2. Confirm `agent-server-status` shows `isConnected=true`

---

## Phase 3: Handshake

### Step 1 — Ask for the client's handle name

Send `HELLO? name?\r\n` using `agent-server-write-byte`.
Generate hex with:
```
python3 -c "print('HELLO? name?\r\n'.encode().hex())"
```

### Step 2 — Receive handle name

Poll `agent-server-events` and wait for a `BytesReceived` event.
Decode the hex bytes to confirm the message is `NAME: <name>\r\n`.
Record the client's handle name.

### Step 3 — Send communication rules

Send the following rules using `agent-server-write-byte`:
```
RULES: MSG:<content>\r\n | REPLY:<content>\r\n | BYE\r\n | HEX:<hex>\r\n
```
Generate hex with:
```
python3 -c "print('RULES: MSG:<content>\\r\\n | REPLY:<content>\\r\\n | BYE\\r\\n | HEX:<hex>\\r\\n'.encode().hex())"
```

### Step 4 — Wait for ACK

Poll `agent-server-events` and wait for `BytesReceived` containing `ACK\r\n`.
Handshake is complete.

---

## Phase 4: Conversation

- Receive messages by polling `agent-server-events` for `BytesReceived` events
- Decode hex bytes to read the message content
- Messages from client follow the format: `MSG: <content>\r\n`
- Reply using `agent-server-write-byte` with format: `REPLY: <content>\r\n`
- For binary data, use format: `HEX: <hex-string>\r\n`
- Always generate hex with: `python3 -c "print('...'.encode().hex())"`

---

## Phase 5: Disconnection

### Initiated by server (graceful shutdown)

1. Send `BYE\r\n` using `agent-server-write-byte`
2. Poll `agent-server-events` and **wait for `ACK\r\n`** from client before closing
3. Call `agent-server-close` (closes the connection; listener remains)
4. Call `agent-server-close` again if you also want to stop listening

### Initiated by client

1. Detect `BYE\r\n` in `BytesReceived` event
2. Send `ACK\r\n` using `agent-server-write-byte`
3. Call `agent-server-close`

---

## Important notes

- **`agent-server-write-byte` hex must not contain spaces or newlines** — it will fail with `invalid hex string`
- **Always generate hex via**: `python3 -c "print('...'.encode().hex())"`
- **`agent-server-write` sends `\r\n` as literal characters** — always use `agent-server-write-byte` for correct CRLF
- **Receiving**: there is no `agent-server-read` tool — use `agent-server-events` polling to receive `BytesReceived` events
- **Busy rejection**: if a second client connects while already connected, the server automatically sends `busy\r\n` and closes the second connection
- **`agent-server-close`** called while connected closes the connection only (listener remains); call again to stop listening
