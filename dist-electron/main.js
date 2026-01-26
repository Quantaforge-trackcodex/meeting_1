// electron/main.ts
import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn } from "child_process";
import net from "net";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var isDev = !app.isPackaged;
var mainWindow = null;
var backendProcess = null;
var getFreePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(getFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};
async function startBackend() {
  if (isDev) {
    console.log(
      '\u{1F527} Dev Mode: Assuming Backend running via "npm run server" on port 4000'
    );
    return 4e3;
  }
  const port = await getFreePort(4e3);
  const backendPath = path.join(process.resourcesPath, "dist-backend/index.js");
  const localDistPath = path.join(__dirname, "../dist-backend/index.js");
  const finalBackendPath = app.isPackaged ? backendPath : localDistPath;
  console.log(`\u{1F680} Spawning Backend on port ${port}...`);
  console.log(`\u{1F4C2} Path: ${finalBackendPath}`);
  backendProcess = spawn("node", [finalBackendPath], {
    env: {
      ...process.env,
      PORT: port.toString(),
      NODE_ENV: "production"
    },
    stdio: "inherit"
  });
  backendProcess.on("error", (err) => {
    console.error("\u274C Failed to start backend:", err);
  });
  return port;
}
async function createWindow() {
  const port = await startBackend();
  process.env.ELECTRON_API_URL = `http://localhost:${port}`;
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TrackCodex Desktop",
    backgroundColor: "#09090b",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: true
    }
  });
  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`;
  console.log(`\u{1F30D} Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);
  mainWindow.on("closed", () => mainWindow = null);
}
app.on("ready", createWindow);
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
app.on("before-quit", () => {
  if (backendProcess) {
    console.log("\u{1F6D1} Killing Backend Process...");
    backendProcess.kill();
  }
});
