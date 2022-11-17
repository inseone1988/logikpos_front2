const APIHandler = require("./APIHandler");
const { app, BrowserWindow,ipcMain } = require("electron");
const path = require("path");
const sequelize = require("./config/sequelize");

const createWindows = ()=>{
    (async()=>{
        await sequelize.recreateDB();
    })()
    const win = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    });
    ipcMain.handle("api", APIHandler);
    win.loadURL("http://localhost:3000");
};

app.whenReady().then(createWindows);
