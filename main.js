const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('electron-progressbar');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static-electron');
const ffmpegProbe = require('ffprobe-static-electron')
ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffmpegProbe.path);



// console.log(ffmpeg);

const isMac = process.platform === 'darwin';

let firstWindow = null;
let filePath;

app.on('ready', () => {
    firstWindow = new BrowserWindow({
        width: 1000,
        height: 605,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: `${__dirname}/preload.js`
        }
    })

    firstWindow.loadURL(`file://${__dirname}/index.html`)
});

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Video",
                submenu: [
                    {
                        label: 'Load...',
                        click() {
                            dialog.showOpenDialog(firstWindow, {
                                properties: ['openFile'],
                                filters: [{
                                    name: 'Videos', extensions: ['mkv', 'avi', 'mp4']
                                }]
                            }).then(result => {
                                if (!result.canceled) {
                                    // console.log(result.canceled)
                                    // console.log(result)
                                    filePath = result.filePaths[0]
                                    firstWindow.webContents.send('filePath', filePath);

                                    menu.getMenuItemById('convertAVI').enabled = true;
                                    menu.getMenuItemById('convertMP4').enabled = true;
                                    menu.getMenuItemById('convertWEBM').enabled = true;
                                }

                            }).catch(err => {
                                console.error(err)
                            })

                        }
                    },
                    { type: 'separator' },

                    {
                        label: 'Convert to AVI...',
                        id: "convertAVI",
                        enabled: false,
                        click() {

                            dialog.showSaveDialog({
                                title: 'Select the File Path to save',
                                defaultPath: path.join(__dirname, './tmp/output.avi'),
                                buttonLabel: 'Save',
                                filters: [
                                    {
                                        name: 'AVI Files',
                                        extensions: ['avi']
                                    },],
                                properties: []
                            }).then(result => {
                                if (!result.canceled) {

                                    let progressBar = new ProgressBar({
                                        browserWindow: { parent: firstWindow },
                                        indeterminate: false,
                                        text: 'Preparing data...',
                                        detail: 'Wait...'
                                    })

                                    ffmpeg(filePath)
                                        .toFormat('avi')
                                        .on('end', function () {
                                            console.log('Finished processing');
                                        })
                                        .on('progress', (stdout, stderr) => {
                                            console.log(stdout);
                                            progressBar.value = Math.ceil(stdout.percent)
                                            progressBar
                                                .on('progress', (value) => {
                                                    progressBar.detail = `${value}% out of ${progressBar.getOptions().maxValue}%...`;
                                                })
                                        })
                                        .on('error', (err) => {
                                            console.log(err.message)
                                        })
                                        .save(result.filePath);
                                }
                            })
                                .catch(err => {
                                    console.error(err)
                                })
                        }
                    },
                    {
                        label: 'Convert to MP4...',
                        id: "convertMP4",
                        enabled: false,
                        click() {

                            dialog.showSaveDialog({
                                title: 'Select the File Path to save',
                                defaultPath: path.join(__dirname, './tmp/output.mp4'),
                                buttonLabel: 'Save',
                                filters: [
                                    {
                                        name: 'MP4 Files',
                                        extensions: ['mp4']
                                    },],
                                properties: []
                            }).then(result => {
                                if (!result.canceled) {

                                    let progressBar = new ProgressBar({
                                        browserWindow: { parent: firstWindow },
                                        indeterminate: false,
                                        text: 'Preparing data...',
                                        detail: 'Wait...'
                                    })

                                    ffmpeg(filePath)
                                        .toFormat('mp4')
                                        .on('end', function () {
                                            console.log('Finished processing');
                                        })
                                        .on('progress', (stdout, stderr) => {
                                            console.log(stdout);
                                            progressBar.value = Math.ceil(stdout.percent)
                                            progressBar
                                                .on('progress', (value) => {
                                                    progressBar.detail = `${value}% out of ${progressBar.getOptions().maxValue}%...`;
                                                })
                                        })
                                        .on('error', (err) => {
                                            console.log(err.message)
                                        })
                                        .save(result.filePath);
                                }
                            })
                                .catch(err => {
                                    console.error(err)
                                })
                        }

                    },
                    {
                        label: 'Convert to WEBM...', id: "convertWEBM", enabled: false,
                        click() {

                            dialog.showSaveDialog({
                                title: 'Select the File Path to save',
                                defaultPath: path.join(__dirname, './tmp/output.webm'),
                                buttonLabel: 'Save',
                                filters: [
                                    {
                                        name: 'WEBM Files',
                                        extensions: ['webm']
                                    },],
                                properties: []
                            }).then(result => {
                                if (!result.canceled) {

                                    let progressBar = new ProgressBar({
                                        browserWindow: { parent: firstWindow },
                                        indeterminate: false,
                                        text: 'Preparing data...',
                                        detail: 'Wait...'
                                    })

                                    ffmpeg(filePath)
                                        .toFormat('webm')
                                        .on('end', function () {
                                            console.log('Finished processing');
                                        })
                                        .on('progress', (stdout, stderr) => {
                                            console.log(stdout);
                                            progressBar.value = Math.ceil(stdout.percent)
                                            progressBar
                                                .on('progress', (value) => {
                                                    progressBar.detail = ` ${value}% out of ${progressBar.getOptions().maxValue}%...`;
                                                })
                                        })
                                        .on('error', (err) => {
                                            console.log(err.message)
                                        })
                                        .save(result.filePath);
                                }
                            })
                                .catch(err => {
                                    console.error(err)
                                })
                        }
                    }
                ],
            },
            { type: 'separator' },
            { label: "Full Screen", role: 'togglefullscreen' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },

    {
        label: 'Developer',
        submenu: [
            { role: 'toggleDevTools' }
        ]
    }

]

if (isMac) {
    menuTemplate.unshift({ label: "" })
}


const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)



