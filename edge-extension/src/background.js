import { getBrowser } from './browser.js';
import { ApiService } from './api.js';

const browser = getBrowser();
let api = null;
let apiReady = false;

// 初始化API实例（从storage.sync读取apiUrl和apiToken）
async function initApi() {
  return new Promise((resolve) => {
    const DEFAULT_API_URL = 'http://localhost:3000';
    let apiUrl = DEFAULT_API_URL;
    let apiToken = '';
    browser.storage.sync.get(['apiUrl'], (result) => {
      if (result.apiUrl) apiUrl = result.apiUrl;
      browser.storage.sync.get(['apiToken'], (result1) => {
        if (result1.apiToken) apiToken = result1.apiToken;
        api = new ApiService(apiUrl, apiToken);
        apiReady = true;
        resolve();
      });
    });
  });
}

// 拉取所有memos并缓存到storage.local
async function fetchAndCacheMemos() {
  if (!apiReady) await initApi();
  try {
    const res = await api.getAllMemos();
    if (res.success && res.data) {
      await browser.storage.local.set({ memos: res.data });
    }
  } catch (e) {
    // 可以在此处上报错误
  }
}

// 判断某个url是否已被收藏
async function isUrlBookmarked(url) {
  const { memos } = await browser.storage.local.get('memos');
  if (!memos) return null;
  return memos.find(memo => memo.bookmarkUrl === url);
}

// 设置插件图标高亮（黄色）
function setIconHighlight(tabId, highlight) {
  const action = browser.action || browser.browserAction;
  if (highlight) {
    action.setBadgeText({ text: '★', tabId });
    action.setBadgeBackgroundColor({ color: '#FFE234', tabId });
  } else {
    action.setBadgeText({ text: '', tabId });
  }
}

// 监听页面切换/激活/更新
async function handleTabUpdate(tabId, changeInfo, tab) {
  if (!tab.url) return;
  await fetchAndCacheMemos();
  const memo = await isUrlBookmarked(tab.url);
  setIconHighlight(tabId, !!memo);
}

async function handleTabActivated(activeInfo) {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (!tab.url) return;
  await fetchAndCacheMemos();
  const memo = await isUrlBookmarked(tab.url);
  setIconHighlight(activeInfo.tabId, !!memo);
}

// 监听tab事件
browser.tabs.onUpdated.addListener(handleTabUpdate);
browser.tabs.onActivated.addListener(handleTabActivated);

// 监听popup的消息请求
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (!apiReady) await initApi();
  if (message.type === 'CHECK_BOOKMARKED') {
    const memo = await isUrlBookmarked(message.url);
    sendResponse({ bookmarked: !!memo, memo });
    return true;
  }
  if (message.type === 'REFRESH_MEMOS') {
    await fetchAndCacheMemos();
    sendResponse({ success: true });
    return true;
  }
  if (message.type === 'UPDATE_MEMO') {
    const { id, data } = message;
    const res = await api.updateMemo(id, data);
    await fetchAndCacheMemos();
    sendResponse(res);
    return true;
  }
  if (message.type === 'DELETE_MEMO') {
    const { id } = message;
    const res = await api.deleteMemo(id);
    await fetchAndCacheMemos();
    sendResponse(res);
    return true;
  }
  if (message.type === 'REFRESH_MEMOS_AND_ICON') {
    await fetchAndCacheMemos();
    // 重新判断并刷新图标
    const memo = await isUrlBookmarked(message.url);
    setIconHighlight(message.tabId, !!memo);
    sendResponse({ success: true });
    return true;
  }
  return false;
});
