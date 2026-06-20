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

    initPtyMcpServer(context, vscodeFolderPath, outputChannel);

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


function readAsset(context: vscode.ExtensionContext, ...segments: string[]): string {
    const assetPath = path.join(context.extensionPath, 'assets', ...segments);
    return fs.readFileSync(assetPath, 'utf-8');
}

export function initPtyMcpServer(context: vscode.ExtensionContext, vscodeFolderPath: string, outputChannel: vscode.OutputChannel) {
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

    // .vscode/pty-mcp-server.yaml
    const configPath = path.join(vscodeFolderPath, 'pty-mcp-server.yaml');
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, readAsset(context, 'pty-mcp-server.yaml'));
        outputChannel.appendLine(`[INFO] Created file: ${configPath}`);
    }

    // .vscode/pty-mcp-server/{tools,prompts,resources}/ files
    const assetFiles: { dir: string; files: string[] }[] = [
      {
        dir: toolsDir,
        files: [
          'tools-list.json',
          'tools-list.json.simple',
          'tools-list.json.detail',
          'pms-cmd-tree.sh', 'pms-cmd-tree.bat',
          'pms-cmd-move.sh', 'pms-cmd-move.bat',
          'pms-cmd-copy.sh', 'pms-cmd-copy.bat',
        ],
      },
      {
        dir: promptsDir,
        files: [
          'prompts-list.json',
          'skill_agent_server.md',
          'skill_agent_client.md',
        ],
      },
      {
        dir: resourcesDir,
        files: [
          'resources-list.json',
          'resources-templates-list.json',
          'pms_readme.md',
        ],
      },
    ];

    for (const { dir, files } of assetFiles) {
      const subDir = path.basename(dir);
      for (const fileName of files) {
        const dest = path.join(dir, fileName);
        if (!fs.existsSync(dest)) {
          fs.writeFileSync(dest, readAsset(context, 'pty-mcp-server', subDir, fileName));
          outputChannel.appendLine(`[INFO] Created file: ${dest}`);
        }
      }
    }

}
