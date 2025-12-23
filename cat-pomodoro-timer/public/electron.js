//importing the app and browser window 
const { app, BrowserWindow } = require('electron'); 
const { ipcMain } = require('electron'); 
const url = require('url'); 
const path = require('path'); 

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Cat Pomodoro Timer', 
        width: 400, 
        height: 400, 
        frame: false, 
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, 'icon.ico'), 
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), //path to preload script 
            contextIsolation: true, //context is isolated for security 
            nodeIntegration: false, //disables node.js in the renderer 
        }
    }); 

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'), 
        protocol: 'file:', 
        slashes: true, 
    }); 
    mainWindow.setMenuBarVisibility(false); 
    mainWindow.loadURL(startUrl); //load app in electron window 

    ipcMain.on('close-app', () => {
        app.quit(); 
    });

    ipcMain.on("minimize-app", () => {
        BrowserWindow.getFocusedWindow()?.minimize();
    });


}

app.whenReady().then(createMainWindow)