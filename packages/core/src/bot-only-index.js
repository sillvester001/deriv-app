// Bot-only standalone entry point
window.addEventListener('load', () => {
    // Only redirect if not already on the bot path
    if (window.location.pathname !== '/bot' && window.location.pathname !== '/bot/') {
        window.location.href = '/bot';
    } else {
        // We're already on the bot path, check if we need to load bot components
        const botApp = document.getElementById('deriv-bot');
        if (!botApp) {
            // Try to load bot scripts if they're not already loaded
            const loadBotUI = () => {
                // First create necessary containers
                const appRoot = document.getElementById('app');
                if (appRoot) {
                    appRoot.innerHTML = '<div id="deriv-bot" style="height: 100vh;"></div>';
                }
                
                // Look for the main bot script - it might have a different hash in the filename
                const botScripts = document.querySelectorAll('script[src*="bot-web-ui-app"]');
                if (botScripts.length === 0) {
                    // No bot script found, try to load it
                    console.log('Attempting to load bot scripts...');
                    
                    // Load the main script - use a dynamic approach without hardcoded hashes
                    const script = document.createElement('script');
                    script.src = '/bot/js/bot.bot-web-ui-app.js'; // Simplified path without hash
                    script.onerror = () => {
                        console.error('Failed to load bot script');
                        // Show error message
                        const appDiv = document.getElementById('app');
                        if (appDiv) {
                            appDiv.innerHTML = '<h1 style="color:red; text-align:center">Failed to load Deriv Bot. Please try refreshing the page.</h1>';
                        }
                    };
                    document.body.appendChild(script);
                    
                    // Load CSS - use a dynamic approach without hardcoded hashes
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/bot/css/bot.bot-web-ui-app.css'; // Simplified path without hash
                    document.head.appendChild(link);
                    
                    // Load vendor scripts - use a dynamic approach without hardcoded hashes
                    const vendorScript = document.createElement('script');
                    vendorScript.src = '/bot/js/bot.787.js'; // Simplified path without hash
                    document.body.appendChild(vendorScript);
                }
            };
            
            // Wait a moment before trying to load the bot UI
            setTimeout(loadBotUI, 1000);
        }
    }
}); 