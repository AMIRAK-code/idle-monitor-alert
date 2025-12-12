# Back to Work Auditor 🔔

A lightweight Chrome Extension that monitors your activity within a specific tab. If you remain idle (no mouse movement or typing) for a set period, it locks the screen with a "Come Back To Work" overlay and plays a notification chime.

## 🚀 Features

* **Idle Detection:** Monitors mouse movements, clicks, scrolling, and keystrokes.
* **Customizable Timer:** Set your own idle threshold (default: 5 minutes).
* **Audio Alert:** Optional "Ding" chime when the timer expires.
* **Shadow DOM:** The alert overlay is isolated, meaning it won't break the website's CSS, and the website's CSS won't break the alert.
* **Audio Unlock:** specialized logic to handle Chrome's Autoplay Policy by initializing audio on the first user interaction.

## 📂 File Structure

Ensure your project folder contains these 4 files:

1.  `manifest.json` (Configuration)
2.  `popup.html` (The extension menu interface)
3.  `popup.js` (Saves settings and communicates with the page)
4.  `content.js` (The logic running inside the web page)

## 🛠️ Installation

Since this is a custom developer extension, you install it manually:

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Toggle **Developer mode** in the top right corner.
3.  Click the **Load unpacked** button (top left).
4.  Select the folder containing your extension files.
5.  The extension is now installed!

## 📖 How to Use

1.  Navigate to the website you want to focus on (e.g., a Google Doc or Work Dashboard).
2.  Click the **Back to Work Auditor** icon in your browser toolbar.
3.  **Set the time** (in minutes) allowed for idleness.
4.  Toggle **Play Alert Chime** if desired.
5.  Click **Start Monitoring**.
6.  *Important:* Click anywhere on the webpage once to "arm" the audio system.

## ⚠️ Troubleshooting Audio

**Problem:** The alert shows up, but no sound plays.
**Reason:** Chrome blocks audio from playing automatically unless the user has interacted with the page.
**Solution:** After clicking "Start Monitoring", ensure you click or type somewhere on the page at least once. This "unlocks" the browser's audio engine for the extension.

## 📝 License

Free to use and modify for personal productivity.