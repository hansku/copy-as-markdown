// Add context menus for specific actions
const contexts: chrome.contextMenus.ContextType[] = ['image', 'link', 'selection'];
for (const context of contexts) {
	chrome.contextMenus.create({
		id: `cpy-as-md:${context}`,
		title: `Copy ${context} as Markdown`,
		contexts: [context]
	});
}

// @ts-ignore
import converterUrl from './converter.ts?script';

async function injectAndConvert(tabId: number, actionType: string, htmlContent: string) {
	try {
		const tab = await chrome.tabs.get(tabId);
		if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:') || tab.url.startsWith('data:')) {
			// Cannot inject content scripts into these pages
			return;
		}

		if (!converterUrl) throw new Error("Converter script URL not found");

		await chrome.scripting.executeScript({
			target: { tabId },
			files: [converterUrl]
		});

		// After injection, send message
		await chrome.tabs.sendMessage(tabId, {
			actionType,
			htmlContent
		});
	} catch (error) {
		console.error("Injection failed:", error);
	}
}

// Listener for events from context menus
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (!tab?.id) return;

	const text = info.selectionText;
	const assetUrl = encodeURI(info.srcUrl || '');
	const linkUrl = encodeURI(info.linkUrl || '');

	let actionType = 'selection';
	let htmlContent = '';

	if (info.menuItemId.toString().endsWith('image')) {
		actionType = 'image';
		htmlContent = `<img alt="${text || assetUrl}" src="${assetUrl}" />`;
	} else if (info.menuItemId.toString().endsWith('link')) {
		actionType = 'link';
		htmlContent = `<a href="${linkUrl}">${text || linkUrl}</a>`;
	}

	await injectAndConvert(tab.id, actionType, htmlContent);
});

// Listener for events from keyboard shortcuts
chrome.commands.onCommand.addListener(async command => {
	if (command === 'copy-selection-as-md') {
		try {
			const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
			// currentWindow: true is better than just active: true which returns active tab of ALL windows
			if (tabs.length === 0 || !tabs[0].id) {
				return;
			}

			await injectAndConvert(tabs[0].id, 'selection', '');
		} catch (error) {
			console.error(error);
		}
	}
});
