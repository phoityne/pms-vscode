// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "pty-mcp-server" is now active!');

    const folders = vscode.workspace.workspaceFolders;
    let scriptPath = '';
	if (folders && folders.length > 0) {
		const workspaceUri = folders[0].uri;
		//process.chdir(workspaceUri.fsPath);
		const vscodeFolderPath = path.join(workspaceUri.fsPath, '.vscode');
		scriptPath = path.join(vscodeFolderPath, 'pty-mcp-server.sh');
	}
	
    let commandToRun = 'pty-mcp-server';
    if (fs.existsSync(scriptPath)) {
        commandToRun = scriptPath;
    }

	console.log(`scriptPath is: ${scriptPath}`);
	console.log(`commandToRun is: ${commandToRun}`);

	const didChangeEmitter = new vscode.EventEmitter<void>();
    context.subscriptions.push(vscode.lm.registerMcpServerDefinitionProvider('ptyMcpServerProvider', {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,
        provideMcpServerDefinitions: async () => {
            let servers: vscode.McpServerDefinition[] = [];
            servers.push(new vscode.McpStdioServerDefinition(
                'pty-mcp-server',
                commandToRun,
                [],  // args
                {}   // env
            ));

            return servers;
        },
        resolveMcpServerDefinition: async (server: vscode.McpServerDefinition) => {
            return server;
        }
    }));

	console.log('End of Congratulations');

}

// This method is called when your extension is deactivated
export function deactivate() {}
