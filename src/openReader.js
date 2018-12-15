// Modules
const { BrowserWindow } = require('electron');

let readerWin;

module.exports = (url, title) => {
    readerWin = new BrowserWindow({
        minWidth: 600,
        minHeight: 400,
        title,
        nodeIntegration: false
    });

    // Load the page
    readerWin.loadURL(url);
    // Destroy window instance on close event
    readerWin.on('closed', () => {
        readerWin = null;
    });
    // Prevent changing title of reader's window.
    readerWin.on('page-title-updated', e => {
        e.preventDefault();
    });
}