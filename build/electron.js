const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("https://test.falgun-garmenting.com"); // Replace with your React app's URL or file
}

// Handle saving email to a folder
ipcMain.on("save-email-to-folder", (event, { folderName, email }) => {
  try {
    // Base save path
    const baseSavePath = "C:\\Mails";

    // Folder-specific path
    const folderPath = path.join(baseSavePath, folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save email
    const filePath = path.join(folderPath, `${email.id}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(email, null, 2));
      console.log(`Saved email to ${filePath}`);
      event.reply("save-email-success", `Saved email to ${filePath}`);
    } else {
      console.log(`Email already exists at ${filePath}`);
      event.reply("save-email-success", `Email already exists at ${filePath}`);
    }
  } catch (err) {
    console.error("Failed to save email:", err);
    event.reply("save-email-failure", `Failed to save email: ${err.message}`);
  }
});

ipcMain.handle("get-folders", async (event, basePath) => {
  try {
    console.log(`Checking folders in path: ${basePath}`);
    const files = fs.readdirSync(basePath);
    console.log(`Found files/directories: ${files}`);

    const folders = files.filter((file) => {
      const fullPath = path.join(basePath, file);
      console.log(`Checking if ${fullPath} is a directory...`);
      return fs.statSync(fullPath).isDirectory();
    });

    console.log(`Folders found: ${folders}`);
    return folders;
  } catch (err) {
    console.error("Error fetching folders:", err);
    throw err;
  }
});

ipcMain.handle("get-emails-from-folder", async (event, folderName) => {
  try {
    const folderPath = path.join("C:\\Mails", folderName);
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".json"));
    return files.map((file) =>
      JSON.parse(fs.readFileSync(path.join(folderPath, file), "utf-8"))
    );
  } catch (err) {
    console.error("Error fetching emails:", err);
    throw err;
  }
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
