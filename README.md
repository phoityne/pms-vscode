# pms-vscode

`pms-vscode` is a VS Code extension acting as a frontend for [`pty-mcp-server`](https://github.com/phoityne/pty-mcp-server), a Haskell-based PTY-hosted MCP server.

## Quick Start

> **Prerequisite**  
> Before following the steps below, make sure `pty-mcp-server` is installed according to the instructions here:
>  - [podman/docker-installation](https://github.com/phoityne/pms-vscode/tree/main?tab=readme-ov-file#running-with-podman-or-docker)
>  - [binary-installation](https://github.com/phoityne/pms-vscode/tree/main?tab=readme-ov-file#binary-installation)


### 1. Install the VSCode Extension and Open the Project

1. When you install this VSCode extension and open your project, the necessary directories and files will be automatically created under the `.vscode` folder, as shown in the image below:   
![tree](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/01_tree.png)

### 2. Start the `pty-mcp-server`

1. Press `Ctrl+Shift+P` to open the Command Palette.
2. Type `MCP` and select **MCP: List Servers**.  
![ctrl_shift_p](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/11_ctrl_shift_p.png)
3. Choose `pty-mcp-server` from the list.  
![ctrl_shift_p](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/12_ctrl_shift_p.png)
4. Click **Start Server**.  
![ctrl_shift_p](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/13_ctrl_shift_p.png)

### 3. Add a Tool

1. Edit the `pty-mcp-server/tools/tools-list.json` file and add your custom tool. The file will automatically be reloaded and the tool will become available.  
![tools-list](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/21_tools-list.png)
2. Create a shell script file with the same name as the tool inside the `pty-mcp-server/tools/` directory.  
   Implement your logic using shell commands, and make sure to give the script executable permission.  
![tool](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/22_tool.png)
3. In the AI chat, you can trigger tool completion by typing `#`, then selecting your tool from the list.
![tool_exec](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/23_tool_exec.png)

### 4. Add a Prompt

1. Edit the `pty-mcp-server/prompts/prompt-list.json` file and add your custom prompt. The file will be automatically reloaded and the new prompt will become available.  
![prompts-list](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/31_prompts-list.png)
2. Create a Markdown file with the same name as the prompt. Write your prompt using natural language and embed parameters using Mustache-style placeholders (`{{param}}`).  
![prompts-md](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/32_prompts-md.png)
3. In the AI chat, you can trigger prompt completion by typing `/mcp`, then selecting your prompt from the list.
![prompts-exec](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/33_prompts-exec.png)

### 5. Customize the pty-mcp-server Execution
If you need to change how `pty-mcp-server` is executed (e.g. wrapper scripts or custom paths), create a `pty-mcp-server.sh` script in the .vscode folder and define the desired execution behavior.  
![pms_sh](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/41_pms_sh.png)


### 6. View Logs
Setup information is displayed in the **Output** view of VSCode, as shown below.  
![console_output](https://raw.githubusercontent.com/phoityne/pms-vscode/main/docs/console_output.png)

Additionally, the server activity logs are written to files under the `logDir` specified in the configuration file.

## `mcp.json` Configuration
By default, the `pms-vscode` extension registers a single `pty-mcp-server` instance.  
However, you can define and register additional MCP servers independently by creating a `.vscode/mcp.json` file.

This allows you to run as many MCP servers as needed—each tailored for a specific purpose such as local Bash workflows or remote SSH connections.


```json
{
  "servers": [
    "bash-mcp-server": {
      "type": "stdio",
      "command": "pty-mcp-server",
      "args": ["-y", "/path/to/bash-config.yaml"]
    },
    "ssh-mcp-server": {
      "type": "stdio",
      "command": "pty-mcp-server",
      "args": ["-y", "/path/to/ssh-config.yaml"]
    }
  ]
}
```
Each MCP server publishes its available tools based on a tools-list.json file located in the toolsDir specified in its individual yaml configuration file.

----

# pty-mcp-server

----
## ⚠️ Caution

**Do not grant unrestricted control to AI.**  
Unsupervised use or misuse may lead to unintended consequences.  
All AI systems must remain strictly under human oversight and control.  
Use responsibly, with full awareness and at your own risk.  

----
## 📘 Overview

**`pty-mcp-server`** is a Haskell implementation of an **MCP (Model Context Protocol) server** that enables AI agents to dynamically acquire and control **PTY (pseudo-terminal) sessions**, allowing interaction with real system environments through terminal-based interfaces.

The server communicates exclusively via **standard input/output (stdio)**, ensuring simple and secure integration with MCP clients. Through this interface, AI agents can execute commands, retrieve system states, and apply configurations—just as a human operator would through a terminal.

---

### 🎯 Purpose

- Provide AI agents with **TTY-based control capabilities**  
- Enable **automated configuration, inspection, and operation** using CLI tools  
- Facilitate **AI-driven workflows for system development, diagnostics, and remote interaction**  
- Allow AI agents to access and operate on **systems beyond the reach of static scripts or APIs**  
- Support **Infrastructure as Code (IaC)** scenarios requiring **interactive or stateful terminal workflows**  
- Assist in **system integration** across heterogeneous environments and legacy systems  
- Empower **AI agents to support DevOps, IaC, and integration pipelines** by operating tools that require human-like terminal interaction  

---

### 🔧 Example Use Cases

- **Dynamic execution of CLI tools** that require a PTY environment  
  (e.g., embedded systems over serial or SSH-based terminals)  
- **REPL automation**: driving GHCi or other CLI-based interactive interpreters  
- **Interactive debugging** of Haskell applications or shell-based workflows  
- **System diagnostics** through scripted or interactive bash sessions  
- **Remote server management** using SSH  
- **Hands-on system operation** where CLI behavior cannot be emulated via non-interactive scripting  
- **Network device interaction**: configuring routers, switches, or appliances via console  
- **AI-assisted IaC workflows**: executing Terraform, Ansible, or shell-based deploy scripts that involve prompts, state reconciliation, or real-time input  
- **AI-driven system integration testing** across multiple environments and CLI tools  
- **Legacy system automation** where GUI/API is unavailable and only terminal interaction is supported  


---

## User Guide (Usage and Setup)

### Features

`pty-mcp-server` provides the following built-in tools for powerful and flexible automation:

#### Available Tools
- **`pty-connect`**  
  Launches any command through a PTY interface with optional arguments.  
  Great for general-purpose terminal automation.

- **`pty-terminate`**  
  Forcefully terminates an active pseudo-terminal (PTY) connection.

- **`pty-message`**  
  Sends input to an existing PTY session (e.g., `df -k`) without needing full context of the current terminal state.  
  Abstracts interaction in a programmable way.

- **`pty-bash`**  
  Starts an interactive Bash shell (`/bin/bash -i -l`) in a pseudo-terminal.  
  Empowers AI to execute shell commands like a real user.

- **`pty-ssh`**  
  Opens a remote SSH session via PTY, enabling access to remote systems.  
  Accepts user/host and SSH flags as arguments.

- **`pty-cabal`**  
  Launches a cabal repl session within a specified project directory, loading a target Haskell file.  
  Supports argument passing and live code interaction.

- **`pty-stack`**  
  Launches a stack repl session within a specified project directory, loading a target Haskell file.  
  Supports argument passing and live code interaction.

- **`pty-ghci`**  
  Launches a GHCi session within a specified project directory, loading a target Haskell file.  
  Supports argument passing and live code interaction.

- **`proc-spawn`**  
  Spawns an external process using the specified arguments and enables interactive communication via standard input and output. Unlike PTY-based execution, this communicates directly with the process using the runProcess function without allocating a pseudo-terminal. Suitable for non-TUI, stdin/stdout-based interactive programs.

- **`proc-terminate`**  
  Forcefully terminates a running process created via runProcess.

- **`proc-message`**  
  Sends structured text-based instructions or commands to a subprocess started with runProcess. It provides a programmable interface for interacting with the process via standard input.

- **`Scriptable CLI Integration`**  
  The `pty-mcp-server` supports execution of shell scripts associated with registered tools defined in `tools-list.json`. Each tool must be registered by name, and a corresponding shell script (`.sh`) should exist in the configured `tools/` directory.

  This design supports AI-driven workflows by exposing tool interfaces through a predictable scripting mechanism. The AI can issue tool invocations by name, and the server transparently manages execution and interaction.  
  To add a new tool:
    1. Create a shell script named `your-tool.sh` in the `tools/` directory.
    2. Add an entry in `tools-list.json` with the name `"your-tool"` and appropriate metadata.
    3. No need to recompile or modify the server — tools are dynamically resolved by name.

  This separation of tool definitions (`tools-list.json`) and implementation (`tools/your-tool.sh`) ensures clean decoupling and simplifies extensibility.

> **Note:**  
> Commands starting with `pty-` are not supported on Windows. These tools rely on POSIX-style pseudo terminals (PTY), which are not natively available in the Windows environment.


### Running with Podman or Docker

You can build and run `pty-mcp-server` using either **Podman** or **Docker**.

**Note:** When running pty-mcp-server inside a Docker container, after establishing a pty connection, you will be operating within the container environment. This should be taken into account when interacting with the server.

#### 1. Build the image

Clone the repository and navigate to the `docker` directory:

```bash
$ git clone https://github.com/phoityne/pty-mcp-server.git
$ cd pty-mcp-server/docker
$ podman build . -t pty-mcp-server-image
$
```
Ref : [build.sh](https://github.com/phoityne/pty-mcp-server/blob/main/docker/build.sh)

#### 2. Run the container
Run the server inside a container:

```bash
$ podman run --rm -i \
--name pty-mcp-server-container \
-v /path/to/dir:/path/to/dir \
--hostname pms-docker-container \
pty-mcp-server-image \
-y /path/to/dir/config.yaml
$
```
Ref : [run.sh](https://github.com/phoityne/pty-mcp-server/blob/main/docker/run.sh)

Below is an example of how to configure `mcp.json` to run the MCP server within VSCode:
```json
{
  "servers": {
    "pty-mcp-server": {
      "type": "stdio",
      "command": "/path/to/run.sh",
      "args": []
      /*
      "command": "podman",
      "args": [
        "run", "--rm", "-i",
        "--name", "pty-mcp-server-container",
        "-v", "/path/to/dir:/path/to/dir",
        "--hostname", "pms-docker-container",
        "pty-mcp-server-image",
        "-y", "/path/to/dir/config.yaml"
      ]
      */
    }
  }
}
```

### Binary Installation

If you prefer to build it yourself, make sure the following requirements are met: 
- GHC >= 9.12  

You can install `pty-mcp-server` using `cabal`:

```bash
$ cabal install pty-mcp-server
```

### Binary Execution

The `pty-mcp-server` application is executed from the command line.

#### Usage

```sh
$ pty-mcp-server -y config.yaml
```
While the server can be launched directly from the command line, it is typically started and managed by development tools that integrate an MCP client—such as Visual Studio Code. These tools utilize the server to enable interactive and automated command execution via PTY sessions.

#### VSCode Integration: `.vscode/mcp.json`

To streamline development and server invocation from within Visual Studio Code, the project supports a `.vscode/mcp.json` configuration file.

This file defines how the `pty-mcp-server` should be launched in a development environment. Example configuration:

```json
{
  "servers": {
    "pty-mcp-server": {
      "type": "stdio",
      "command": "pty-mcp-server",
      "args": ["-y", "/path/to/your/config.yaml"]
    }
  }
}
```

### config.yaml Configuration ([ref](https://github.com/phoityne/pty-mcp-server/blob/main/configs/pty-mcp-server.yaml))
- `logDir`:  
  The directory path where log files will be saved. This includes standard output/error logs and logs from script executions.

- `logLevel`:  
  Sets the logging level. Examples include `"Debug"`, `"Info"`, and `"Error"`.

- `toolsDir`:  
  Directory containing script files (shell scripts named after tool names, e.g., `ping.sh`). If a script matching the tool name exists here, it will be executed when the tool is called.  
  This directory must also contain the `tools-list.json` file, which defines the available public tools and their metadata.

- `prompts`:  
  A list of prompt strings used to detect interactive command prompts. This allows the AI to identify when a command is awaiting input. Examples include `"ghci>"`, `"]$"`, `"password:"`, etc.

  
---

## Demonstrations

### Demo: Watch AI Create and Launch a Web App from Scratch
![Demo web service construct](https://raw.githubusercontent.com/phoityne/pty-mcp-server/main/docs/demo_web.gif)  
Ref : [Web Service Construction Agent Prompt](https://github.com/phoityne/pty-mcp-server/blob/main/assets/prompts/web-service-prompt.md)


1. 📌 [Scene 1: Overview & MCP Configuration]  
In this demo, we’ll show how an AI agent builds and runs a web service inside a Docker container using the `pty-mcp-server`.  
First, we configure `mcp.json` to launch the MCP server using a shell script.  
This script starts the Docker container where our PTY-based interaction will take place.
2. 🐳 [Scene 2: Docker Launch Configuration]  
The `run.sh` script includes volume mounts, hostname settings, and opens **port 8080**.  
This allows the container to expose a web service to the host system.

3. 🚀 [Scene 3: Starting the MCP Server]  
Now, the container is launched, and the `pty-mcp-server` is running inside it,  
ready to handle AI-driven requests through a pseudo-terminal.

4. 🤖 [Scene 4: Connecting the AI Agent]  
We open the chat interface and send a prompt designed for a web service builder agent.  
The AI connects to the container’s Bash session via PTY and begins its preparation.

5. 🛠️ [Scene 5: Initial Setup Commands]  
Following the prompt, the AI starts by:  
    - Creating a project folder  
    - Moving into the working directory

6. 📥 [Scene 6: AI Ready to Receive Instructions]  
Once the environment is ready, we instruct the AI to build a “Hello, world” web service.  
From here, the AI begins its autonomous construction process.

7. ⚙️ [Scene 7: AI Executes Web Setup Commands]  
The AI proposes a series of terminal commands.  
As the user, we review and approve them one by one.  
Steps include:
    - Checking for Python
    - Installing Flask
    - Writing the source code (`app.py`) to serve “Hello, world”
    - Running the Flask server
    - Testing via `curl http://localhost:8080` inside the container

8. 🌐 [Scene 8: Verifying from Outside the Container]  
To confirm external accessibility, we access the service from the host via **port 8080**.  
✅ As expected, the response is: **“Hello, world”**

9. 🧾 [Scene 9: Reviewing the Execution History]  
Finally, we review the AI's actions step by step:
    - Initialized the Bash session and created the working directory  
    - Set up the Python environment  
    - Generated the Flask-based `app.py`  
    - Launched the web server and validated its operation

10. 🏁 [Scene 10: Conclusion]  
This demonstrates how AI, combined with the **PTY-MCP-Server** and **Docker**,  
can automate real development tasks — **interactively**, **intelligently**, and **reproducibly**.


### Demo: Docker Execution and Host SSH Access
![Demo Docker](https://raw.githubusercontent.com/phoityne/pty-mcp-server/main/docs/demo_docker.gif)

1. MCP Configuration with Docke  
This is the mcp.json file. It defines the MCP server startup configuration. In this case, the pty-mcp-server will be launched using a shell script: run.sh. This script uses Podman to start the container.
2. Starting the MCP Server  
Here is the run.sh script. It launches the Docker container using podman run, with the correct volume mount, hostname, and image tag. Once executed, the MCP server starts inside the container.
3. Tool List  
Next, the list of tools exposed to the client is defined in tools-list.json.
It includes three tools: pty-message, pty-ssh, a shell script named hostname.sh
4. Tool Script Directory  
In config.yaml, the path to the script directory is defined.
This is where tool scripts like hostname.sh should be placed
5. Hostname Script  
The hostname.sh script simply runs the hostname command.
It is executed as a tool within the container.
6. Executing hostname from Chat  
Now, let’s run the hostname tool in the chat.
This shows the name of the current host, which is the container.  
As expected, the output is: pms-docker-container
This confirms that the command is executed inside the Docker container.
7. Using pty-ssh to Access the Host  
Next, we use pty-ssh to establish a pty session with the host OS.
SSH connection is attempted using host.docker.internal, which resolves to the Docker host.  
After confirming the host identity and entering the password, the login succeeds.
8. Confirming Host Environment  
Now that we are connected to the host, we run: cat /etc/redhat-release  
This confirms that we are now in the host OS, which is CentOS 9.  
In contrast, the Docker container is running AlmaLinux 9.



### Demo: Interactive Bash via PTY
![Demo bash](https://raw.githubusercontent.com/phoityne/pty-mcp-server/main/docs/demo_bash.gif)
1. Configure bash-mcp-server in mcp.json  
In this file, register bash-mcp-server as an MCP server.  
Specify the command as pty-mcp-server and pass the configuration file config.yaml as an argument.
2. Settings in config.yaml  
The config.yaml file defines the log directory, the directory for tools, and prompt detection patterns.  
These settings establish the environment for the AI to interact with bash through the PTY.
3. Place tools-list.json in the toolsDir  
You need to place tools-list.json in the directory specified by toolsDir.  
This file declares the tools available to the AI, including pty-bash and pty-message.  
4. AI Connects to Bash and Selects Commands Autonomously  
The AI connects to bash through the pseudo terminal and 
decides which commands to execute based on the context.  
5. Confirming the Command Execution Results  
The output of the getenforce command shows whether SELinux is in Enforcing mode.  
This result appears on the terminal or in logs, allowing the user to verify the system status.


### Demo: Shell Script Execution
![Demo shellscript](https://raw.githubusercontent.com/phoityne/pty-mcp-server/main/docs/demo_script.gif)

1. mcp.json Configuration  
Starts the pty-mcp-server in stdio mode, passing config.yaml as an argument.
2. Overview of config.yaml  
Specifies log directory, tools directory, and prompt strings.  
The tools-list.json in toolsDir defines which tools are exposed.
3. Role of tools-list.json  
Lists available script tools, with only the script_add tool registered here.
4. Role and Naming Convention of the tools Folder  
Stores executable shell scripts called via the mcp server.  
The tool names in tools-list.json match the shell script filenames in this folder.
5. Execution from VSCode GitHub Copilot  
Runs script_add.sh with the command `#script_add 2 3`, executing the addition.
6. Confirming the Result  
Returns "5", indicating the operation was successful.


### Demo: Haskell Debugging with `cabal repl`
![Demo haskell cabal repl](https://raw.githubusercontent.com/phoityne/pty-mcp-server/main/docs/demo_cabal.gif)  
Ref : [haskell cabal debug prompt](https://github.com/phoityne/pty-mcp-server/blob/main/assets/prompts/haskell-cabal-debug-prompt.md)

1. Target Code Overview  
A function in MyLib.hs is selected to inspect its runtime state using cabal repl and an AI-driven debug interface.
2. MCP Server Initialization  
The MCP server is launched to allow structured interaction between the AI and the debugging commands.
3. Debugger Prompt and Environment Setup  
The AI receives a prompt, starts cabal repl, and loads the module to prepare for runtime inspection.
4. Debugging Execution Begins  
The target function is executed and paused at a predefined point for runtime observation.
5. State Inspection and Output  
Runtime values and control flow are displayed to help verify logic and observe internal behavior.
6. Summary  
Integration with pty-msp-server enables automated runtime inspection for Haskell applications.

---
