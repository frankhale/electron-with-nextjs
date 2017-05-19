const electron = require("electron"),
  pkgJSON = require("./package.json"),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: pkgJSON.title,
    autoHideMenuBar: true,
    width: 640,
    height: 480,
    backgroundColor: "#303030",
    show: false
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.once("ready-to-show", () => {
    if (!pkgJSON.node.production) {
      BrowserWindow.addDevToolsExtension(`${__dirname}\\react-devtools`);
    }
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
