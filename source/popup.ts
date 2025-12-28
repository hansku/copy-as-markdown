
document.getElementById('copy-tabs')?.addEventListener('click', async () => {
    try {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const markdownList = tabs
            .map(tab => `- [${tab.title || tab.url}](${tab.url})`)
            .join('\n');

        await navigator.clipboard.writeText(markdownList);

        const status = document.getElementById('status');
        if (status) {
            status.textContent = 'Copied to clipboard!';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy', err);
    }
});

document.getElementById('open-options')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
