// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel("PMS-VSCode");
    // outputChannel.show();
    outputChannel.appendLine('Start of Congratulations.');

    const folders = vscode.workspace.workspaceFolders;
    let configPath = './pty-mcp-server.yaml';
    let scriptPath = './pty-mcp-server.sh';
    let vscodeFolderPath = ''
	if (folders && folders.length > 0) {
		const workspaceUri = folders[0].uri;
		vscodeFolderPath = path.join(workspaceUri.fsPath, '.vscode');
        // process.chdir(vscodeFolderPath);
		let configPathTmp = path.join(vscodeFolderPath, 'pty-mcp-server.yaml');
        if (fs.existsSync(configPathTmp)) {
          configPath = configPathTmp;
        }
		let scriptPathTmp = path.join(vscodeFolderPath, 'pty-mcp-server.sh');
        if (fs.existsSync(scriptPathTmp)) {
          scriptPath = scriptPathTmp;
        }
	}
	
    let commandToRun = 'pty-mcp-server';
    let args = ['-y', configPath];
    if (fs.existsSync(scriptPath)) {
        commandToRun = scriptPath;
        args = []
    }

    outputChannel.appendLine(`cwd is: ${process.cwd()}`);
    outputChannel.appendLine(`vscodeFolderPath is: ${vscodeFolderPath}`);
	outputChannel.appendLine(`configPath is: ${configPath}`);
	outputChannel.appendLine(`scriptPath is: ${scriptPath}`);
	outputChannel.appendLine(`commandToRun is: ${commandToRun}`);

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

	console.log('End of Congratulations.');

}

// This method is called when your extension is deactivated
export function deactivate() {}
