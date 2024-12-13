import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useEffect, useState } from "react";
// Tray Icon Management :(
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Menu } from '@tauri-apps/api/menu';

let trayRef = null;
async function initializeApp() {

  // Title bar buttons
  const appWindow = getCurrentWindow();
  document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => appWindow.minimize());
  document
    .getElementById('titlebar-maximize')
    ?.addEventListener('click', () => appWindow.toggleMaximize());
  document
    .getElementById('titlebar-close')
    ?.addEventListener('click', async () => {
      await appWindow.hide();
      await appWindow.setSkipTaskbar(true);
    });

  // Tray Icon Management :(
  const menu = await Menu.new({
    items: [
      {
        id: 'open',
        text: 'Open',
        action: async () => {
          await appWindow.show();
          await appWindow.setSkipTaskbar(false);
          console.log('open clicked');
        },
      },
      {
        id: 'quit',
        text: 'Quit',
        action: () => {
          appWindow.close();
        },
      }
    ],
  });

  const options = {
    tooltip: 'Your AllNighter Companion!', menu,
    menuOnLeftClick: false,
    action(event) {
      switch (event.type) {
        case 'Click':
          if (event.button === "Left") {
            appWindow.show();
            appWindow.setSkipTaskbar(false);
          }
          break;
      }
    },
    icon: await defaultWindowIcon(),
  };
  trayRef = await TrayIcon.new(options);
}

window.addEventListener('beforeunload', () => {
  if (trayRef) {
    trayRef.close();
  }
});
initializeApp().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});