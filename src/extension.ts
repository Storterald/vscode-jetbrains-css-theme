import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
        // Get all custom css files
        const cssDirectory = path.join(context.extensionPath, 'css')
        const cssFiles = fs
                .readdirSync(cssDirectory)
                .filter(file => path.extname(file) === '.css')
                .map(file => `file://${path.resolve(cssDirectory, file)}`);
        
        // Get all custom js files
        const jsDirectory = path.join(context.extensionPath, 'js')
        const jsFiles = fs
                .readdirSync(jsDirectory)
                .filter(file => path.extname(file) === '.js')
                .map(file => `file://${path.resolve(jsDirectory, file)}`);

        // Update custom css imports
        const configuration = vscode.workspace.getConfiguration();
        configuration.update('vscode_custom_css.imports', cssFiles.concat(jsFiles), vscode.ConfigurationTarget.Global);

        // Listen for theme changes
        vscode.window.onDidChangeActiveColorTheme(handleThemeChange);

        // Call the handler to set settings based on the current theme
        handleThemeChange(vscode.window.activeColorTheme);
}

function handleThemeChange(theme: vscode.ColorTheme) {
        const configuration = vscode.workspace.getConfiguration();

        switch (theme.kind) {
                case vscode.ColorThemeKind.Dark: {
                        configuration.update('workbench.iconTheme', 'vscode-jetbrains-icon-theme-2023-dark', vscode.ConfigurationTarget.Global);
                        configuration.update('better-comments.tags', getDarkCommentTags(), vscode.ConfigurationTarget.Global);
                        break;
                }
                case vscode.ColorThemeKind.Light: {
                        configuration.update('workbench.iconTheme', 'vscode-jetbrains-icon-theme-2023-light', vscode.ConfigurationTarget.Global);
                        configuration.update('better-comments.tags', getLightCommentTags(), vscode.ConfigurationTarget.Global);
                        break;
                }
        }
}

function getDarkCommentTags() {
        return [
                {
                        "tag": "TODO",
                        "color": "#8bb33d",
                        "strikethrough": false,
                        "underline": false,
                        "backgroundColor": "transparent",
                        "bold": false,
                        "italic": true
                }
        ];
}

function getLightCommentTags() {
        return [
                {
                        "tag": "TODO",
                        "color": "#008dde",
                        "strikethrough": false,
                        "underline": false,
                        "backgroundColor": "transparent",
                        "bold": false,
                        "italic": true
                }
        ];
}