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
                // Look for the main bot script - it might have a different hash in the filename
                const botScripts = document.querySelectorAll('script[src^="/bot/js/bot.bot-web-ui-app"]');
                if (botScripts.length === 0) {
                    // No bot script found, try to load it
                    const script = document.createElement('script');
                    script.src = '/bot/js/bot.bot-web-ui-app.js';
                    script.onerror = () => {
                        console.error('Failed to load bot script');
                        // Show error message
                        const appDiv = document.getElementById('app');
                        if (appDiv) {
                            appDiv.innerHTML = '<h1 style="color:red; text-align:center">Failed to load Deriv Bot. Please try refreshing the page.</h1>';
                        }
                    };
                    document.body.appendChild(script);
                }
            };
            
            // Wait a moment before trying to load the bot UI
            setTimeout(loadBotUI, 1000);
        }
    }
}); 