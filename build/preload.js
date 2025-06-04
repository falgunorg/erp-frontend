const { contextBridge, ipcRenderer } = require("electron");

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  loadDownloadedEmailIds: () => {
    const savePath = path.join("C:\\Mails", "emails");
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    const files = fs.readdirSync(savePath);
    return files.map((file) => file.replace(".json", "")); // Extract email IDs
  },

  saveEmailToFolder: (folderName, email) =>
    ipcRenderer.send("save-email-to-folder", { folderName, email }),
  getFolders: (basePath) => ipcRenderer.invoke("get-folders", basePath),
  
  getEmailsFromFolder: (folderName) =>
    ipcRenderer.invoke("get-emails-from-folder", folderName),
});
