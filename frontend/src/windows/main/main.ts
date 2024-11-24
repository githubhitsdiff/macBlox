// Init imports
import './app.css';
import './ts/debugging';
import './ts/roblox';
import './ts/window';

// Imports
import { events, init, app as neuApp, window as neuWindow } from '@neutralinojs/lib';
import { loadTheme } from './components/theme-input/theme';
import App from './App.svelte';
import { RPCController } from './ts/tools/rpc';
import { shell } from './ts/tools/shell';
import { focusWindow } from './ts/window';
import { getMode } from './ts/utils';
import { logDebugInfo } from './ts/utils/debug';

// Initialize NeutralinoJS
init();

async function quit() {
    try {
        console.info('[Main] Exiting app');
        await RPCController.stop();
        await shell('pkill', ['-f', '_ablox'], { skipStderrCheck: true });

        if (window.NL_ARGS.includes('--mode=browser')) {
            neuApp.writeProcessOutput('quit');
        }

        await neuApp.exit();
    } catch (error) {
        console.error('[Main] Error during quit:', error);
    }
}

const handleAppReady = async () => {
    await loadTheme();
    neuWindow.show();
    if (getMode() === 'prod') focusWindow();

    setTimeout(async () => {
        try {
            const appPort = process.env.APP_PORT || window.NL_PORT;
            console.info(`[App] Running at http://localhost:${appPort}`);
            logDebugInfo();
        } catch (error) {
            console.error('[App] Error during startup:', error);
        }
    }, 500);
};

const handleWindowClose = () => quit();
const handleExitApp = () => quit();

// When NeutralinoJS is ready:
events.on('ready', handleAppReady);

// Cleanup when the application is closing
events.on('windowClose', handleWindowClose);
events.on('exitApp', handleExitApp);

// Check if app is in browser mode and add tab close event
if (window.NL_ARGS.includes("--mode=browser")) {
    window.addEventListener("beforeunload", async () => {
        await quit();
    });
}

const app = new App({
    // @ts-expect-error
    target: document.getElementById('app'),
});

export default app;
