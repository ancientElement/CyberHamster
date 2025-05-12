import { getBrowser, getCurrentTabInfo, getBrowserMetadata } from '../src/browser.js';
import { ApiService } from '../src/api.js';
const browser = getBrowser();
let api;

async function getPageIcon() {
  try {
    // 尝试从当前页面执行脚本获取图标
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    // 使用 scripting API 替代 executeScript
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return [
          // 标准图标
          ...Array.from(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')).map(el => el.href),
          // Apple Touch 图标
          ...Array.from(document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]')).map(el => el.href),
          // Open Graph 图标
          document.querySelector('meta[property="og:image"]')?.content,
          // 默认 favicon 路径
          new URL('/favicon.ico', window.location.origin).href
        ].filter(Boolean);
      }
    });

    const iconUrls = results[0].result;

    // 尝试每个图标 URL 直到找到一个有效的
    for (const iconUrl of iconUrls) {
      try {
        const response = await fetch(iconUrl);
        if (!response.ok) continue;

        const blob = await response.blob();
        // 检查内容类型是否为图片
        if (!blob.type.startsWith('image/')) continue;

        // 创建一个临时的 canvas 元素用于压缩图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = () => {
            // 设置压缩后的尺寸，最大宽度为 128px
            const maxWidth = 32;
            const ratio = maxWidth / img.width;
            const width = maxWidth;
            const height = img.height * ratio;

            canvas.width = width;
            canvas.height = height;

            // 绘制并压缩图片
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为 base64，使用PNG格式以保持透明度
            const compressedDataUrl = canvas.toDataURL('image/png');
            resolve(compressedDataUrl);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });

        return canvas.toDataURL('image/png');
      } catch (error) {
        console.log(`尝试加载图标 ${iconUrl} 失败:`, error);
        // 继续尝试下一个 URL
      }
    }

    // 如果所有尝试都失败，返回 null
    return null;
  } catch (error) {
    console.error('获取页面图标失败:', error);
    return null;
  }
}

async function getPageMetadata() {
  const { url, title } = await getCurrentTabInfo();
  let { description } = await getBrowserMetadata();

  // 如果description为空，尝试从页面获取描述
  if (!description) {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 首先尝试获取meta描述
        const metaDescription = document.querySelector('meta[name="description"]')?.content
          || document.querySelector('meta[property="og:description"]')?.content;

        if (metaDescription) return metaDescription;

        // 如果没有meta描述，获取页面可见文本
        const textContent = document.body.innerText
          .replace(/[\r\n\s]+/g, ' ')  // 替换多个空白字符为单个空格
          .trim()
          .slice(0, 200);  // 只取前200个字符

        return textContent || '';
      }
    });

    description = results[0].result;
  }

  const icon = await getPageIcon();
  return {
    url,
    title,
    description,
    icon
  };
}

// 内容类型枚举，用于区分不同类型的备忘录
// export enum MemoType {
//   BOOKMARK = 1,         // 书签类型
//   NOTE = 2,            // 笔记类型
// }

async function saveBookmark(metadata) {
  const saveStatus = document.getElementById('saveStatus');
  const loadingSpinner = document.getElementById('loadingSpinner');

  // 显示加载指示器
  loadingSpinner.classList.add('show');
  saveStatus.textContent = '';
  saveStatus.classList.remove('show', 'error');

  try {
    const res = await api.createMemo({
      data: {
        type: 1,
        bookmarkTitle: metadata.title,
        bookmarkUrl: metadata.url,
        bookmarkDescription: metadata.description,
        bookmarkIcon: metadata.icon
      }
    });

    // 隐藏加载指示器
    loadingSpinner.classList.remove('show');

    if (res.success) {
      saveStatus.textContent = '收藏成功';
      saveStatus.classList.add('show');
      // 通知 background 刷新 memos 并刷新当前 tab 图标
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.runtime.sendMessage({
            type: 'REFRESH_MEMOS_AND_ICON',
            tabId: tabs[0].id,
            url: metadata.url
          });
        }
      });
    } else {
      saveStatus.textContent = `收藏失败${res}`;
      saveStatus.classList.add('error', 'show');
      console.error('Failed to save bookmark:', res);
    }
  } catch (error) {
    // 隐藏加载指示器
    loadingSpinner.classList.remove('show');

    saveStatus.textContent = `收藏失败${error}`;
    saveStatus.classList.add('error', 'show');
    console.error('Failed to save bookmark:', error);
  }
}

// 检查当前网址是否已被收藏
async function checkIfBookmarked(url) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'CHECK_BOOKMARKED', url },
      (response) => {
        resolve(response);
      }
    );
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const metadata = await getPageMetadata();
  console.log(metadata);
  document.getElementById('title').value = metadata.title;
  document.getElementById('url').value = metadata.url;
  document.getElementById('description').value = metadata.description;
  // 设置图标预览
  if (metadata.icon) {
    document.getElementById('icon-preview').src = metadata.icon;
  }

  const DEFAULT_API_URL = 'http://localhost:3000';
  // 默认API地址
  // 从storage中获取API地址
  let apiUrl = DEFAULT_API_URL;
  let apiToken;

  browser.storage.sync.get(['apiUrl'], (result) => {
    if (result.apiUrl) {
      apiUrl = result.apiUrl;
    }
    browser.storage.sync.get(['apiToken'], (result1) => {
      if (result1.apiToken) {
        apiToken = result1.apiToken;
      }
      api = new ApiService(apiUrl, apiToken);
      // 只有未收藏时才自动保存
      saveBookmark(metadata);
    });
  });
});