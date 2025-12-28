
// Default options
const defaultOptions = {
    headingStyle: 'atx',
    bulletListMarker: '-'
};

function saveOptions(e: Event) {
    e.preventDefault();
    const headingStyle = (document.getElementById('headingStyle') as HTMLSelectElement).value;
    const bulletListMarker = (document.getElementById('bulletListMarker') as HTMLSelectElement).value;

    chrome.storage.sync.set({
        headingStyle,
        bulletListMarker
    }, () => {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 1500);
        }
    });
}

function restoreOptions() {
    chrome.storage.sync.get(defaultOptions, (items) => {
        (document.getElementById('headingStyle') as HTMLSelectElement).value = items.headingStyle;
        (document.getElementById('bulletListMarker') as HTMLSelectElement).value = items.bulletListMarker;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form')?.addEventListener('submit', saveOptions);
