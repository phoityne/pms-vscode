// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	  console.log('[INFO] Start of Congratulations.');
    const outputChannel = vscode.window.createOutputChannel("PMS-VSCode");
    // outputChannel.show();
    outputChannel.appendLine('[INFO] Start of Congratulations.');
    outputChannel.appendLine(`[INFO] cwd is: ${process.cwd()}`);

    const isWindows = process.platform === 'win32';
    const scriptExt = isWindows ? '.bat' : '.sh';
    const pathSep = isWindows ? '\\' : '/';
    const folders = vscode.workspace.workspaceFolders;

    let vscodeFolderPath = '.' + pathSep + '.vscode'
    if (folders && folders.length > 0) {
      const workspaceUri = folders[0].uri;
      vscodeFolderPath = path.join(workspaceUri.fsPath, '.vscode');
    }

    initPtyMcpServer(vscodeFolderPath, outputChannel);

    let configPath = '.' + pathSep + 'pty-mcp-server.yaml'
    let pathTmp = path.join(vscodeFolderPath, 'pty-mcp-server.yaml');
    if (fs.existsSync(pathTmp)) {
      configPath = pathTmp;
    }
    if (!fs.existsSync(configPath)) {
      outputChannel.appendLine(`[ERROR] configPath not found.: ${configPath}, ${pathTmp}`);
      outputChannel.appendLine('[ERROR] Congratulations end.');
      return;
    }
  
    const scriptBaseName = 'pty-mcp-server';
    const scriptFile = scriptBaseName + scriptExt;

    let args = ['-y', configPath];
    let commandToRun = 'pty-mcp-server';
    let scriptPath = '.' + pathSep + scriptFile
    pathTmp = path.join(vscodeFolderPath, scriptFile);
    if (fs.existsSync(pathTmp)) {
      scriptPath = pathTmp;
    }
    if (fs.existsSync(scriptPath)) {
        commandToRun = scriptPath;
        args = []
    }

    outputChannel.appendLine(`[INFO] isWindows is: ${isWindows}`);
    outputChannel.appendLine(`[INFO] scriptFile is: ${scriptFile}`);
    outputChannel.appendLine(`[INFO] vscodeFolderPath is: ${vscodeFolderPath}`);
    outputChannel.appendLine(`[INFO] configPath is: ${configPath}`);
    outputChannel.appendLine(`[INFO] scriptPath is: ${scriptPath}`);
    outputChannel.appendLine(`[INFO] commandToRun is: ${commandToRun}`);

    const didChangeEmitter = new vscode.EventEmitter<void>();
      context.subscriptions.push(vscode.lm.registerMcpServerDefinitionProvider('ptyMcpServerProvider', {
          onDidChangeMcpServerDefinitions: didChangeEmitter.event,
          provideMcpServerDefinitions: async () => {
              let servers: vscode.McpServerDefinition[] = [];
              servers.push(new vscode.McpStdioServerDefinition(
                  'pty-mcp-server',
                  commandToRun,
                  args,
                  {}   // env
              ));

              return servers;
          },
          resolveMcpServerDefinition: async (server: vscode.McpServerDefinition) => {
              return server;
          }
      }));

    outputChannel.appendLine('[INFO] End of Congratulations.');
    console.log('[INFO] End of Congratulations.');
}

// This method is called when your extension is deactivated
export function deactivate() {}


export function initPtyMcpServer(vscodeFolderPath: string, outputChannel: vscode.OutputChannel) {
    // .vscode/
    if (!fs.existsSync(vscodeFolderPath)) {
      fs.mkdirSync(vscodeFolderPath);
      outputChannel.appendLine(`[INFO] Created directory: ${vscodeFolderPath}`);
    }

    // .vscode/pty-mcp-server/
    const ptyRoot = path.join(vscodeFolderPath, 'pty-mcp-server');
    if (!fs.existsSync(ptyRoot)) {
      fs.mkdirSync(ptyRoot);
      outputChannel.appendLine(`[INFO] Created directory: ${ptyRoot}`);
    }

    // .vscode/pty-mcp-server/tools/
    const toolsDir = path.join(ptyRoot, 'tools');
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir);
      outputChannel.appendLine(`[INFO] Created directory: ${toolsDir}`);
    }

    // .vscode/pty-mcp-server/prompts/
    const promptsDir = path.join(ptyRoot, 'prompts');
    if (!fs.existsSync(promptsDir)) {
      fs.mkdirSync(promptsDir);
      outputChannel.appendLine(`[INFO] Created directory: ${promptsDir}`);
    }

    // .vscode/pty-mcp-server/resources/
    const resourcesDir = path.join(ptyRoot, 'resources');
    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir);
      outputChannel.appendLine(`[INFO] Created directory: ${resourcesDir}`);
    }

    // .vscode/pty-mcp-server/logs/
    const logsDir = path.join(ptyRoot, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
      outputChannel.appendLine(`[INFO] Created directory: ${logsDir}`);
    }

    // .vscode/pty-mcp-server/tools/tools-list.json
    const toolsListPath = path.join(toolsDir, 'tools-list.json');
    if (!fs.existsSync(toolsListPath)) {
      const isWindows = process.platform === 'win32';
      const content = isWindows ? winToolsListContent : defaultToolsListContent;
      fs.writeFileSync(toolsListPath, content);
      outputChannel.appendLine(`[INFO] Created file: ${toolsListPath}`);
    }

    // .vscode/pty-mcp-server.yaml
    const configPath = path.join(vscodeFolderPath, 'pty-mcp-server.yaml');
    if (!fs.existsSync(configPath)) {
        const content = genPtyMcpServerConfig(vscodeFolderPath);
        fs.writeFileSync(configPath, content);
        outputChannel.appendLine(`[INFO] Created file: ${configPath}`);
    }

    // .vscode/pty-mcp-server/prompts/prompts-list.json
    const promptsListPath = path.join(promptsDir, 'prompts-list.json');
    if (!fs.existsSync(promptsListPath)) {
      fs.writeFileSync(promptsListPath, promptsListContent);
      outputChannel.appendLine(`[INFO] Created file: ${promptsListPath}`);
    }

    // .vscode/pty-mcp-server/prompts/build_web_service.md
    const buildWebServicePromptPath = path.join(promptsDir, 'build_web_service.md');
    if (!fs.existsSync(buildWebServicePromptPath)) {
      fs.writeFileSync(buildWebServicePromptPath, webServicePromptContent);
      outputChannel.appendLine(`[INFO] Created file: ${buildWebServicePromptPath}`);
    }

    // .vscode/pty-mcp-server/resources/resources-list.json
    const resourcesListPath = path.join(resourcesDir, 'resources-list.json');
    if (!fs.existsSync(resourcesListPath)) {
      fs.writeFileSync(resourcesListPath, resourcesListContent);
      outputChannel.appendLine(`[INFO] Created file: ${resourcesListPath}`);
    }

    // .vscode/pty-mcp-server/resources/build_web_service.md
    const helloResourcePath = path.join(resourcesDir, 'build_web_service.md');
    if (!fs.existsSync(helloResourcePath)) {
      fs.writeFileSync(helloResourcePath, helloResourceContent);
      outputChannel.appendLine(`[INFO] Created file: ${helloResourcePath}`);
    }

}

function genPtyMcpServerConfig(vscodeFolderPath: string): string {
    const ptyRoot = path.join(vscodeFolderPath, 'pty-mcp-server');

    const logDir = path.join(ptyRoot, 'logs');
    const toolsDir = path.join(ptyRoot, 'tools');
    const promptsDir = path.join(ptyRoot, 'prompts');
    const resourcesDir = path.join(ptyRoot, 'resources');

    return `\
logDir : '${logDir}'
logLevel : 'Debug'
toolsDir: '${toolsDir}'
promptsDir: '${promptsDir}'
resourcesDir: '${resourcesDir}'
prompts:
  - '>>>'
  - ']#'
  - ']$'
  - ')?'
  - 'Password:'
  - 'password:'
  - 'ghci>'
`;

}

const defaultToolsListContent = `\
[
  {
    "name": "pty-connect",
    "description": "Runs a command via a pseudo-terminal (pty) to interact with external tools or services, with optional arguments.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "command": {
          "type": "string",
          "description": "Name of the command to run."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of arguments for the command."
        }
      },
      "required": [
        "command"
      ]
    }
  },
  {
    "name": "pty-terminate",
    "description": "Forcefully terminates an active pseudo-terminal (PTY) connection.",
    "inputSchema": {}
  },
  {
    "name": "pty-message",
    "description": "pms-messages is a tool for sending structured instructions or commands to a running PTY session. It abstracts direct terminal input, allowing the LLM (MCP client) to interact with the PTY process in a controlled and programmable way without needing to know what is running inside.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "string",
          "description": "df -k"
        }
      },
      "required": [
        "arguments"
      ]
    }
  },
  
  {
    "name": "pty-bash",
    "description": "pty-bash is a tool that launches a bash shell in a pseudo terminal (PTY). It allows the LLM (MCP client) to interact with a real Linux shell in an interactive terminal (PTY). This enables AI to run system commands, collect information, and handle prompts or TUI-based tools as if operated by a human, making it effective for dynamic Linux-based automation and diagnostics.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Arguments to pass to /bin/bash command, e.g.,  [\\"-i\\", \\"-l\\"]"
        }
      },
      "required": [
        "arguments"
      ]
    }
  },

  {
    "name": "pty-ssh",
    "description": "Establishes an SSH session in a pseudo-terminal with the specified arguments, allowing interaction with remote systems.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Arguments to be passed to the SSH command, such as user, host, and optional flags."
        }
      },
      "required": [
        "arguments"
      ]
    }
  },

  {
    "name": "pty-telnet",
    "description": "Launches the telnet command within a pseudo-terminal (PTY) session. This allows interactive communication with a remote Telnet server, enabling the AI to respond to prompts such as 'login:' or 'Password:' just like a human user. The PTY environment ensures that the terminal behaves like a real TTY device, which is required for many Telnet servers.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Arguments to be passed to the telnet command, such as user, host, and optional flags."
        }
      },
      "required": [
        "arguments"
      ]
    }
  },

  {
    "name": "pty-cabal",
    "description": "Launches a cabal repl session in a pseudo-terminal using the specified project directory, main source file, and arguments.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectDir": {
          "type": "string",
          "description": "The directory containing the Haskell project. cabal will use this as the working directory."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Command-line arguments to be passed directly to cabal repl on session start."
        }
      },
      "required": [
        "projectDir"
      ]
    }
  },

  {
    "name": "pty-stack",
    "description": "Launches a stack repl session in a pseudo-terminal using the specified project directory, main source file, and arguments.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectDir": {
          "type": "string",
          "description": "The directory containing the Haskell project. stack will use this as the working directory."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Command-line arguments to be passed directly to stack repl on session start."
        }
      },
      "required": [
        "projectDir"
      ]
    }
  },

  {
    "name": "pty-ghci",
    "description": "Launches a GHCi session in a pseudo-terminal using the specified project directory, main source file, and arguments.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectDir": {
          "type": "string",
          "description": "The directory containing the Haskell project. GHCi will use this as the working directory."
        },
        "startupFile": {
          "type": "string",
          "description": "The Haskell source file to load on startup, typically Main.hs or the entry point for the application. This should be provided as a full absolute path."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Command-line arguments to be passed directly to GHCi on session start."
        }
      },
      "required": [
        "projectDir"
      ]
    }
  },
  {
    "name": "proc-spawn",
    "description": "Spawns an external process using the specified arguments and enables interactive communication via standard input and output. Unlike PTY-based execution, this communicates directly with the process using the runProcess function without allocating a pseudo-terminal. Suitable for non-TUI, stdin/stdout-based interactive programs.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "command": {
          "type": "string",
          "description": "Name of the command to run."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of arguments for the command."
        }
      },
      "required": [
        "command"
      ]
    }
  },
  {
    "name": "proc-terminate",
    "description": "Forcefully terminates a running process created via runProcess.",
    "inputSchema": {}
  },
  {
    "name": "proc-message",
    "description": "Sends structured text-based instructions or commands to a subprocess started with runProcess. It provides a programmable interface for interacting with the process via standard input.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "string",
          "description": "df -k"
        }
      },
      "required": [
        "arguments"
      ]
    }
  },

  {
    "name": "socket-open",
    "description": "This tool initiates a socket connection to the specified host and port.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "description": "The hostname or IP address to connect to (e.g., '127.0.0.1' or 'localhost')."
        },
        "port": {
          "type": "string",
          "description": "The port number to connect to, provided as a string (e.g., '5000')."
        }
      },
      "required": [
        "host",
        "port"
      ]
    }
  },
  {
    "name": "socket-close",
    "description": "This tool close active socket connection that was previously established using the 'socket-opne' tool.",
    "inputSchema": {}
  },
  {
    "name": "socket-read",
    "description": "Reads the specified number of bytes from the socket. The 'size' parameter indicates how many bytes to read.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "size": {
          "type": "integer",
          "description": "The number of bytes to read from the socket"
        }
      },
      "required": [
        "size"
      ]
    }
  },
  {
    "name": "socket-write",
    "description": "Write a sequence of bytes to the socket",
    "inputSchema": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "description": "An array of byte values (integers between 0 and 255) to send"
        }
      },
      "required": [
        "data"
      ]
    }
  },
  {
    "name": "socket-message",
    "description": "This tool sends a message over the active socket connection.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "string",
          "description": "The message content to be sent over the socket connection."
        }
      },
      "required": [
        "arguments"
      ]
    }
  },
  {
    "name": "socket-telnet",
    "description": "A simple Telnet-like communication tool over raw TCP sockets. This tool connects to a specified host and port, sends and receives data, and removes any Telnet IAC (Interpret As Command) sequences from the communication stream. Note: This is a simplified Telnet implementation and does not support full Telnet protocol features.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "description": "The hostname or IP address to connect to (e.g., '127.0.0.1' or 'localhost')."
        },
        "port": {
          "type": "string",
          "description": "The port number to connect to, provided as a string (e.g., '5000')."
        }
      },
      "required": [
        "host",
        "port"
      ]
    }
  }
]

`;


const winToolsListContent = `\
[
  {
    "name": "proc-spawn",
    "description": "Spawns an external process using the specified arguments and enables interactive communication via standard input and output. Unlike PTY-based execution, this communicates directly with the process using the runProcess function without allocating a pseudo-terminal. Suitable for non-TUI, stdin/stdout-based interactive programs.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "command": {
          "type": "string",
          "description": "Name of the command to run."
        },
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of arguments for the command."
        }
      },
      "required": [
        "command"
      ]
    }
  },
  {
    "name": "proc-terminate",
    "description": "Forcefully terminates a running process created via runProcess.",
    "inputSchema": {}
  },
  {
    "name": "proc-message",
    "description": "Sends structured text-based instructions or commands to a subprocess started with runProcess. It provides a programmable interface for interacting with the process via standard input.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "string",
          "description": "df -k"
        }
      },
      "required": [
        "arguments"
      ]
    }
  },
  {
    "name": "proc-cmd",
    "description": "The proc-cmd tool launches the Windows Command Prompt (cmd.exe) as a subprocess. It allows the AI to interact with the standard Windows shell environment, enabling execution of batch commands, file operations, and system configuration tasks in a familiar terminal interface.",
    "inputSchema": {
      "type": "object",
      "properties": {
      },
      "required": [
      ]
    }
  },
  {
    "name": "proc-ps",
    "description": "proc-ps launches the Windows PowerShell (powershell.exe) as a subprocess. It provides an interactive command-line environment where the AI can execute PowerShell commands, scripts, and system administration tasks. The shell is started with default options to keep it open and ready for further input.",
    "inputSchema": {
      "type": "object",
      "properties": {
      },
      "required": [
      ]
    }
  },

  {
    "name": "proc-ssh",
    "description": "proc-ssh launches an SSH client (ssh) as a subprocess using runProcess. It enables the AI to initiate remote connections to other systems via the Secure Shell protocol. The tool can be used to execute remote commands, access remote shells, or tunnel services over SSH. The required arguments field allows specifying the target user, host, and any SSH options (e.g., -p, -i, -L).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Arguments to be passed to the SSH command, such as user, host, and optional flags."
        }
      },
      "required": [
        "arguments"
      ]
    }
  },

  {
    "name": "socket-open",
    "description": "This tool initiates a socket connection to the specified host and port.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "description": "The hostname or IP address to connect to (e.g., '127.0.0.1' or 'localhost')."
        },
        "port": {
          "type": "string",
          "description": "The port number to connect to, provided as a string (e.g., '5000')."
        }
      },
      "required": [
        "host",
        "port"
      ]
    }
  },
  {
    "name": "socket-close",
    "description": "This tool close active socket connection that was previously established using the 'socket-opne' tool.",
    "inputSchema": {}
  },
  {
    "name": "socket-read",
    "description": "Reads the specified number of bytes from the socket. The 'size' parameter indicates how many bytes to read.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "size": {
          "type": "integer",
          "description": "The number of bytes to read from the socket"
        }
      },
      "required": [
        "size"
      ]
    }
  },
  {
    "name": "socket-write",
    "description": "Write a sequence of bytes to the socket",
    "inputSchema": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "integer",
            "minimum": 0,
            "maximum": 255
          },
          "description": "An array of byte values (integers between 0 and 255) to send"
        }
      },
      "required": [
        "data"
      ]
    }
  },
  {
    "name": "socket-message",
    "description": "This tool sends a message over the active socket connection.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "arguments": {
          "type": "string",
          "description": "The message content to be sent over the socket connection."
        }
      },
      "required": [
        "arguments"
      ]
    }
  },
  {
    "name": "socket-telnet",
    "description": "A simple Telnet-like communication tool over raw TCP sockets. This tool connects to a specified host and port, sends and receives data, and removes any Telnet IAC (Interpret As Command) sequences from the communication stream. Note: This is a simplified Telnet implementation and does not support full Telnet protocol features.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "host": {
          "type": "string",
          "description": "The hostname or IP address to connect to (e.g., '127.0.0.1' or 'localhost')."
        },
        "port": {
          "type": "string",
          "description": "The port number to connect to, provided as a string (e.g., '5000')."
        }
      },
      "required": [
        "host",
        "port"
      ]
    }
  }

]

`;


const promptsListContent = `\
[
  {
    "name": "build_web_service",
    "description": "Build a web service in a Linux environment with root privileges, using pty-bash and the specified port.",
    "arguments": [
      {
        "name": "port",
        "description": "Port number on which the web service must listen.",
        "required": true
      },
      {
        "name": "language",
        "description": "Programming language to use for building the web service (e.g., Python, Node.js, Go).",
        "required": true
      }
    ]
  }
]
`;

const webServicePromptContent = `\
# AI Prompt: Build a Web Service on a Linux Server  
*(Language: {{language}} / root / dnf / pty-bash / Command-by-Command via pty-message)*

## Mission

You are an AI agent responsible for building a web service inside a Linux environment.  
You must follow user specifications using the **{{language}}** programming language.  
You have full root privileges and access to a bash shell via pty-bash.

---

## System Environment

- Shell: bash via pty-bash
- Interface: pty-message (used to send commands)
- Privilege: root
- Base directory: /root/webapp
- Package manager: dnf
- Web server must listen on port: **{{port}}**
- Network: available
- File creation and editing: via shell commands (e.g. echo, cat, printf, etc.)

`;

const resourcesListContent = `\
[
  {
    "name": "pms_hello",
    "uri": "pms_hello.md",
    "description": "hello world from pty-mcp-server.",
    "mimeType":"text/markdown"
  }
]

`;


const helloResourceContent = `\
# hello world from pty-mcp-server.

`;

