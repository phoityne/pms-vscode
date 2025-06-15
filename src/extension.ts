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

    const folders = vscode.workspace.workspaceFolders;
    let vscodeFolderPath = ''
	if (folders && folders.length > 0) {
		const workspaceUri = folders[0].uri;
		vscodeFolderPath = path.join(workspaceUri.fsPath, '.vscode');
	}


    let configPath = './pty-mcp-server.yaml'
    let pathTmp = path.join(vscodeFolderPath, 'pty-mcp-server.yaml');
    if (fs.existsSync(pathTmp)) {
      configPath = pathTmp;
    }
    if (!fs.existsSync(configPath)) {
      outputChannel.appendLine(`[ERROR] configPath not found.: ${configPath}, ${pathTmp}`);
      outputChannel.appendLine('[ERROR] Congratulations end.');
      return;
    }

    let args = ['-y', configPath];
    let commandToRun = 'pty-mcp-server';
    let scriptPath = './pty-mcp-server.sh'
    pathTmp = path.join(vscodeFolderPath, 'pty-mcp-server.sh');
    if (fs.existsSync(pathTmp)) {
      scriptPath = pathTmp;
    }
    if (fs.existsSync(scriptPath)) {
        commandToRun = scriptPath;
        args = []
    }

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
