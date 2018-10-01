const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const { autoUpdater } = require('electron-updater')
const ipcMain = require('electron').ipcMain

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow

function createWindow () {
  // debugger
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    icon: path.join(__dirname, './resources/electron/icons/64x64.png')
  })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'www/index.html'),
    protocol: 'file:',
    slashes: true,
    nodeIntegration: false
  }))

  if (process.env.NODE_ENV === 'development') {
    const client = require('electron-connect').client
    client.create(mainWindow)
    mainWindow.toggleDevTools()
  }
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('ready', function () {
})

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('update', function (event, data) {
  autoUpdater.checkForUpdates()
})

ipcMain.on('quitAndInstall', function (event, data) {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('presentUpdateToast', 'Checking for updates...')
})

autoUpdater.on('error', (error) => {
  console.log(error)
  mainWindow.webContents.send('presentUpdateToast', 'Sorry! Something went wrong...')
})

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('presentUpdateToast', 'Update Available! Beginning Download...')
})

autoUpdater.on('update-not-available', (info) => {
  mainWindow.webContents.send('presentUpdateToast', 'You are running the latest version!')
})

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('openUpdateModal')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

