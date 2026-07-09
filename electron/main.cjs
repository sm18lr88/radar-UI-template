const path = require('node:path')
const { URL, pathToFileURL } = require('node:url')
const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')
const packageMetadata = require('../package.json')

const appName = packageMetadata.productName
let mainWindow = null
let tray = null
let isQuitting = false

function iconPath() {
  return path.join(__dirname, '..', 'assets', 'icon.png')
}

function createIcon(size) {
  const image = nativeImage.createFromPath(iconPath())
  if (image.isEmpty()) throw new Error('Desktop icon could not be loaded')
  return size === undefined ? image : image.resize({ width: size, height: size })
}

function indexPath() {
  return path.join(__dirname, '..', 'dist', 'index.html')
}

function isAllowedAppUrl(targetUrl) {
  try {
    const expected = new URL(pathToFileURL(indexPath()))
    const actual = new URL(targetUrl)
    return actual.protocol === expected.protocol
      && actual.host === expected.host
      && actual.pathname === expected.pathname
      && actual.search === ''
  } catch {
    return false
  }
}

function showWindow() {
  if (mainWindow === null) {
    createMainWindow()
    return
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function createTray() {
  if (tray !== null) return
  tray = new Tray(createIcon(16))
  tray.setToolTip(appName)
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `Open ${appName}`, click: showWindow },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      },
    },
  ]))
  tray.on('click', showWindow)
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    minHeight: 560,
    show: false,
    title: appName,
    icon: createIcon(),
    backgroundColor: '#06111f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  })

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault())
  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (!isAllowedAppUrl(targetUrl)) event.preventDefault()
  })
  mainWindow.webContents.session.setPermissionCheckHandler(() => false)
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))
  mainWindow.once('ready-to-show', () => mainWindow?.show())
  mainWindow.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    mainWindow?.hide()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.loadFile(indexPath()).catch((error) => {
    console.error('Failed to load desktop app:', error)
    app.quit()
  })
}

app.setName(appName)

if (app.requestSingleInstanceLock()) {
  app.on('second-instance', showWindow)
  app.on('before-quit', () => {
    isQuitting = true
  })
  app.whenReady().then(() => {
    Menu.setApplicationMenu(null)
    createTray()
    createMainWindow()
    app.on('activate', showWindow)
  }).catch((error) => {
    console.error('Failed to start desktop app:', error)
    app.exit(1)
  })
} else {
  app.quit()
}
