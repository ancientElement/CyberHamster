import { getBrowser } from "../popup/browser.js";

const browser = getBrowser();

async function updateIcon(tabId, url) {
  try {

  } catch (error) {
    console.error('Failed to check bookmark status:', error);
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIcon(tabId, tab.url);
  }
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {
    updateIcon(tab.id, tab.url);
  }
});