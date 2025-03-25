document.addEventListener('DOMContentLoaded', () => {
  const apiUrlInput = document.getElementById('apiUrl');
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');

  // 加载已保存的设置
  chrome.storage.sync.get(['apiUrl'], (result) => {
    if (result.apiUrl) {
      apiUrlInput.value = result.apiUrl;
    }
  });

  // 保存设置
  saveButton.addEventListener('click', () => {
    const apiUrl = apiUrlInput.value.trim();

    if (!apiUrl) {
      showStatus('Please enter API server URL', false);
      return;
    }

    try {
      new URL(apiUrl);
    } catch (e) {
      showStatus('Please enter a valid URL', false);
      return;
    }

    chrome.storage.sync.set({ apiUrl }, () => {
      showStatus('Settings saved successfully!', true);
    });
  });

  function showStatus(message, isSuccess) {
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    statusDiv.className = 'status ' + (isSuccess ? 'success' : 'error');

    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});