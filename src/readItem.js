// Modules
const { BrowserWindow } = require('electron');

// BrowserWIndow instance
let bgItemWin;

// New read item method
module.exports = (url, callback) => {
    // Create new off-screen browser window
    bgItemWin = new BrowserWindow({
        width: 1000,
        height: 1000,
        show: false,
        webPreferences: {
            offscreen: true
        },
        nodeIntegration: false
    });

    // Load read item
    bgItemWin.loadURL(url);

    // Listen for finish loading
    bgItemWin.webContents.on('did-finish-load', () => {
        // Get screenshot
        bgItemWin.webContents.capturePage(image => {
            // Get image as dataURL
            let screenshot = image.toDataURL();
            // Get page title
            let title = bgItemWin.getTitle();

            // Return new item via callback
            callback({ title, screenshot, url });

            // Clean up
            bgItemWin.close();
            bgItemWin = null;
        });
    });
}