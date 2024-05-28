const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const schedule = require('node-schedule');
const fs = require('fs');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 150,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.on('user-input', function(v) {
    console.log(v);
    mainWindow.hide();
    });
}

app.on('ready', () => {
  // Hide the window initially
  createWindow();
  mainWindow.hide();
  mainWindow.show();
  mainWindow.focus();
  // Schedule a job to show the window every 15 minutes
  schedule.scheduleJob('*/15 * * * *', () => {
    if(mainWindow.isVisible()) {
     return;
    }
    mainWindow.show();
    mainWindow.focus();
  });
  ipcMain.on('user-input', (event, input) => {
    console.log('User input:', input);
    // date time and input
    const result='Date: '+new Date().toLocaleString()+' Task: '+input;
    fs.appendFileSync('user-inputs.txt', result+'\n');
    mainWindow.hide();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});