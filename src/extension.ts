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
  - '> '
  - ']#'
  - ']$'
  - ')?'
  - 'password:'
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