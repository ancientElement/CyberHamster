import { getBrowser, getCurrentTabInfo, getBrowserMetadata } from './browser.js';
import { ApiService } from '../src/api.js';

const browser = getBrowser();

const api = new ApiService();

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

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
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
  const { description } = await getBrowserMetadata();
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

    if (res.success) {
      const saveStatus = document.getElementById('saveStatus');
      saveStatus.textContent = '收藏成功';
      saveStatus.classList.add('show');
    } else {
      saveStatus.textContent = '收藏失败';
      saveStatus.classList.add('error');
      console.error('Failed to save bookmark:',res);
    }
  } catch (error) {
    console.error('Failed to save bookmark:', error);
  }
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

  // 自动保存书签
  await saveBookmark(metadata);
});