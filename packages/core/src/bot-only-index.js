// Bot-only standalone entry point
window.addEventListener('load', () => {
    console.log('Bot initialization started');
    
    try {
        // Only redirect if not already on the bot path
        if (window.location.pathname !== '/bot' && window.location.pathname !== '/bot/') {
            console.log('Redirecting to /bot');
            window.location.href = '/bot';
        } else {
            // We're already on the bot path, check if we need to load bot components
            console.log('Already on bot path, checking for bot app');
            const botApp = document.getElementById('deriv-bot');
            if (!botApp) {
                console.log('No bot app found, attempting to load components');
                // Try to load bot scripts if they're not already loaded
                const loadBotUI = () => {
                    try {
                        // First create necessary containers
                        const appRoot = document.getElementById('app');
                        if (appRoot) {
                            console.log('Creating bot container in app root');
                            appRoot.innerHTML = '<div id="deriv-bot" style="height: 100vh;"></div>';
                        } else {
                            console.error('No app root element found!');
                        }
                        
                        // Look for the main bot script - it might have a different hash in the filename
                        const botScripts = document.querySelectorAll('script[src*="bot-web-ui-app"]');
                        if (botScripts.length === 0) {
                            // No bot script found, try to load it
                            console.log('Attempting to load bot scripts...');
                            
                            // Load the main script - use a dynamic approach without hardcoded hashes
                            const script = document.createElement('script');
                            script.src = '/bot/js/bot.bot-web-ui-app.js'; // Simplified path without hash
                            script.onerror = (err) => {
                                console.error('Failed to load bot script', err);
                                // Show error message
                                const appDiv = document.getElementById('app');
                                if (appDiv) {
                                    appDiv.innerHTML = '<h1 style="color:red; text-align:center">Failed to load Deriv Bot. Please try refreshing the page.</h1>';
                                }
                            };
                            document.body.appendChild(script);
                            console.log('Main script added:', script.src);
                            
                            // Load CSS - use a dynamic approach without hardcoded hashes
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = '/bot/css/bot.bot-web-ui-app.css'; // Simplified path without hash
                            document.head.appendChild(link);
                            console.log('CSS added:', link.href);
                            
                            // Load vendor scripts - use a dynamic approach without hardcoded hashes
                            const vendorScript = document.createElement('script');
                            vendorScript.src = '/bot/js/bot.787.js'; // Simplified path without hash
                            document.body.appendChild(vendorScript);
                            console.log('Vendor script added:', vendorScript.src);
                        } else {
                            console.log('Bot scripts already loaded');
                        }
                    } catch (error) {
                        console.error('Error in loadBotUI:', error);
                    }
                };
                
                // Wait a moment before trying to load the bot UI
                console.log('Setting timeout to load bot UI');
                setTimeout(loadBotUI, 1000);
            } else {
                console.log('Bot app already exists');
            }
        }
    } catch (error) {
        console.error('Uncaught error in bot initialization:', error);
    }
}); 