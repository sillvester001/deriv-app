// Bot-only standalone entry point
window.addEventListener('load', () => {
    console.log('Bot initialization started');
    
    // Create a visible UI element immediately
    const fallbackUI = document.createElement('div');
    fallbackUI.id = 'fallback-container';
    fallbackUI.style.position = 'fixed';
    fallbackUI.style.top = '0';
    fallbackUI.style.left = '0';
    fallbackUI.style.width = '100%';
    fallbackUI.style.height = '100%';
    fallbackUI.style.backgroundColor = '#f5f5f5';
    fallbackUI.style.zIndex = '1000';
    fallbackUI.style.display = 'flex';
    fallbackUI.style.flexDirection = 'column';
    fallbackUI.style.alignItems = 'center';
    fallbackUI.style.justifyContent = 'center';
    fallbackUI.style.padding = '20px';
    fallbackUI.style.textAlign = 'center';
    fallbackUI.innerHTML = `
        <img src="https://deriv.com/static/logo-deriv-v2.c145c543.svg" alt="Deriv Logo" style="width: 200px; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 20px;">Trader Mathews Bot Loading...</h1>
        <div id="loading-status" style="margin-bottom: 20px;">Initializing bot components...</div>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #ff444f; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Reload Page
        </button>
        <div id="debug-log" style="margin-top: 30px; text-align: left; font-family: monospace; font-size: 12px; background: #fff; padding: 10px; border: 1px solid #ddd; width: 80%; max-width: 800px; height: 200px; overflow-y: auto;"></div>

        <div style="margin-top: 30px; width: 80%; max-width: 800px;">
            <button id="force-init-button" style="padding: 10px 20px; background: #0077cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                Force Initialize Bot
            </button>
            <button id="skip-to-app-button" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Skip to App
            </button>
        </div>
    `;
    document.body.appendChild(fallbackUI);
    
    // Function to update loading status
    const updateStatus = (message) => {
        console.log(message);
        const statusEl = document.getElementById('loading-status');
        if (statusEl) statusEl.textContent = message;
        
        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            const entry = document.createElement('div');
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            debugLog.appendChild(entry);
            debugLog.scrollTop = debugLog.scrollHeight;
        }
    };
    
    // Global configuration for the Trader Mathews Bot
    window.store_root_store = window.store_root_store || {};
    window.BinaryBotOptions = {
        apiUrl: 'wss://ws.binaryws.com/websockets/v3',
        language: 'en',
        debug: true,
    };
    
    // Add force init button handler
    document.getElementById('force-init-button').addEventListener('click', () => {
        updateStatus('Attempting forced initialization...');
        try {
            if (window.BinaryBot && typeof window.BinaryBot.init === 'function') {
                window.BinaryBot.init();
                updateStatus('Forced initialization called successfully');
            } else if (window.Bot && typeof window.Bot.init === 'function') {
                window.Bot.init();
                updateStatus('Forced initialization called successfully (Bot.init)');
            } else if (window.WebtraderBotApp && typeof window.WebtraderBotApp.init === 'function') {
                window.WebtraderBotApp.init();
                updateStatus('Forced initialization called successfully (WebtraderBotApp)');
            } else if (window.DBotStore) {
                updateStatus('Found DBotStore, trying to render');
                try {
                    // Try to manually trigger React rendering
                    const botContainer = document.getElementById('deriv-bot');
                    if (botContainer && window.React && window.ReactDOM) {
                        updateStatus('Attempting to render with React...');
                        if (window.botApp) {
                            window.ReactDOM.render(window.botApp, botContainer);
                            updateStatus('Manual rendering triggered');
                        }
                    }
                } catch (err) {
                    updateStatus(`Error during manual render: ${err.message}`);
                }
            } else {
                updateStatus('Could not find Bot initialization function');
            }
        } catch (err) {
            updateStatus(`Error during forced init: ${err.message}`);
        }
    });
    
    // Add skip to app button handler
    document.getElementById('skip-to-app-button').addEventListener('click', () => {
        document.getElementById('fallback-container').style.display = 'none';
        updateStatus('Skipped to app view');
    });
    
    try {
        // Only redirect if not already on the bot path
        if (window.location.pathname !== '/bot' && window.location.pathname !== '/bot/') {
            updateStatus('Redirecting to /bot');
            window.location.href = '/bot';
        } else {
            // We're already on the bot path, check if we need to load bot components
            updateStatus('Already on bot path, checking for bot app');
            const botApp = document.getElementById('deriv-bot');
            if (!botApp) {
                updateStatus('No bot app found, attempting to load components');
                // Try to load bot scripts if they're not already loaded
                const loadBotUI = () => {
                    try {
                        // First create necessary containers
                        const appRoot = document.getElementById('app');
                        if (appRoot) {
                            updateStatus('Creating bot container in app root');
                            appRoot.innerHTML = '<div id="deriv-bot" style="height: 100vh;"></div>';
                        } else {
                            updateStatus('ERROR: No app root element found! Creating one...');
                            const newAppRoot = document.createElement('div');
                            newAppRoot.id = 'app';
                            newAppRoot.innerHTML = '<div id="deriv-bot" style="height: 100vh;"></div>';
                            document.body.appendChild(newAppRoot);
                            updateStatus('Created app root element manually');
                        }
                        
                        // Look for the main bot script - it might have a different hash in the filename
                        const botScripts = document.querySelectorAll('script[src*="bot-web-ui-app"]');
                        if (botScripts.length === 0) {
                            // No bot script found, try to load it
                            updateStatus('Attempting to load bot scripts...');
                            
                            // Load the vendor scripts first
                            const vendorScript = document.createElement('script');
                            vendorScript.src = '/bot/js/bot.787.js';
                            vendorScript.onload = () => {
                                updateStatus('Vendor script loaded successfully');
                                
                                // Then load the main script
                                const mainScript = document.createElement('script');
                                mainScript.src = '/bot/js/bot.bot-web-ui-app.js';
                                mainScript.onload = () => {
                                    updateStatus('Main script loaded successfully. App should initialize shortly...');
                                    
                                    // Wait a bit longer for initialization
                                    setTimeout(() => {
                                        try {
                                            const botElement = document.getElementById('deriv-bot');
                                            if (botElement && botElement.children.length > 0) {
                                                updateStatus('Bot app has rendered!');
                                                // Optionally hide the fallback UI if content rendered successfully
                                                // document.getElementById('fallback-container').style.display = 'none';
                                            } else {
                                                updateStatus('WARNING: Bot app hasn\'t rendered content yet.');
                                                
                                                // Try to initialize manually after a delay
                                                setTimeout(() => {
                                                    updateStatus('Attempting manual initialization...');
                                                    
                                                    // Inspect available global objects
                                                    const globals = [];
                                                    for (const key in window) {
                                                        if (key.includes('Bot') || key.includes('Deriv') || key.includes('binary') || key.includes('Binary')) {
                                                            globals.push(key);
                                                        }
                                                    }
                                                    
                                                    updateStatus(`Found potentially related globals: ${globals.join(', ')}`);
                                                    
                                                    // Try to call initialization functions if they exist
                                                    if (window.BinaryBot && typeof window.BinaryBot.init === 'function') {
                                                        window.BinaryBot.init();
                                                        updateStatus('Called BinaryBot.init()');
                                                    }
                                                    
                                                    if (window.Bot && typeof window.Bot.init === 'function') {
                                                        window.Bot.init();
                                                        updateStatus('Called Bot.init()');
                                                    }
                                                    
                                                    if (window.DBotStore) {
                                                        updateStatus('Found DBotStore');
                                                    }
                                                    
                                                    updateStatus('Manual initialization complete. Check if content appears.');
                                                }, 3000);
                                            }
                                        } catch (err) {
                                            updateStatus(`Error checking render status: ${err.message}`);
                                        }
                                    }, 5000);
                                };
                                mainScript.onerror = (err) => {
                                    updateStatus(`ERROR: Failed to load main script: ${err.message || 'Unknown error'}`);
                                };
                                document.body.appendChild(mainScript);
                                updateStatus('Main script added: ' + mainScript.src);
                            };
                            vendorScript.onerror = (err) => {
                                updateStatus(`ERROR: Failed to load vendor script: ${err.message || 'Unknown error'}`);
                            };
                            document.body.appendChild(vendorScript);
                            updateStatus('Vendor script added: ' + vendorScript.src);
                            
                            // Load CSS
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = '/bot/css/bot.bot-web-ui-app.css';
                            link.onload = () => updateStatus('CSS loaded successfully');
                            link.onerror = () => updateStatus('ERROR: Failed to load CSS');
                            document.head.appendChild(link);
                            updateStatus('CSS added: ' + link.href);
                        } else {
                            updateStatus('Bot scripts already loaded');
                        }
                    } catch (error) {
                        updateStatus(`ERROR in loadBotUI: ${error.message}`);
                        console.error('Error in loadBotUI:', error);
                    }
                };
                
                // Wait a moment before trying to load the bot UI
                updateStatus('Setting timeout to load bot UI');
                setTimeout(loadBotUI, 1000);
            } else {
                updateStatus('Bot app already exists');
            }
        }
    } catch (error) {
        updateStatus(`CRITICAL ERROR: ${error.message}`);
        console.error('Uncaught error in bot initialization:', error);
    }
    
    // Add listener to global errors
    window.addEventListener('error', (event) => {
        updateStatus(`GLOBAL ERROR: ${event.message} at ${event.filename}:${event.lineno}`);
    });

    // Add listener for unhandled rejections
    window.addEventListener('unhandledrejection', (event) => {
        updateStatus(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
    });
}); 