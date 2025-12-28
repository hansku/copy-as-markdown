/// <reference types="chrome" />
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { MathMLToLaTeX } from 'mathml-to-latex';

// Instantiate Turndown instance
const turndownService = new TurndownService({
	hr: '---',
	headingStyle: 'atx',
	bulletListMarker: '-',
	codeBlockStyle: 'fenced'
});
turndownService.keep(['kbd', 'sup', 'sub']); // HTML content to retain in Markdown
turndownService.remove(['script']);
turndownService.use(gfm);

// Workaround to fix #7 until https://github.com/domchristie/turndown/issues/291 gets fixed
turndownService.addRule('listItem', {
	filter: 'li',
	replacement: (content, node, options) => {
		content = content
			.replace(/^\n+/, '') // Remove leading newlines
			.replace(/\n+$/, '\n') // Replace trailing newlines with just a single one
			.replace(/\n/gm, '\n    '); // Indent

		let prefix = options.bulletListMarker + ' ';
		const parent = node.parentNode;
		if (parent && parent.nodeName === 'OL') {
			const start = (parent as HTMLElement).getAttribute('start');
			const index = Array.prototype.indexOf.call(parent.children, node);
			prefix = (start ? Number(start) + index : index + 1) + '. ';
		}

		return (prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : ''));
	}
});

turndownService.addRule('mathml', {
	filter: ['math'] as any,
	replacement: (_, node, __) => {
		const latex = MathMLToLaTeX.convert((node as HTMLElement).outerHTML);
		if (!latex) {
			return '';
		}

		const delim = (node as HTMLElement).getAttribute('display') === 'block' ? '$$' : '$';
		return delim + latex + delim;
	}
});

function getSelectionAsHTML(): string {
	const selection = window.getSelection();
	if (!selection) return '';

	let containerTagName = '';

	if (selection.rangeCount === 0) {
		return '';
	}

	const selectionRange = selection.getRangeAt(0); // Only consider the first range
	const container = selectionRange.commonAncestorContainer;

	// All of text in container element is selected, then use parents tag
	if (selectionRange.toString().trim() === container.textContent?.trim()) {
		// Handle plain text selections where parent is sometimes 'Node' or 'DocumentFragment'
		// Ideally, this should not happen, but text selection in browsers is unpredictable
		if (container instanceof Element) {
			containerTagName = container.tagName.toLowerCase();
		} else {
			containerTagName = 'p';
		}
	}

	const fragment = selectionRange.cloneContents();
	const wrapper = document.createElement('div');
	wrapper.append(fragment);

	// Converts relative links to absolute links (#6)
	wrapper.querySelectorAll('a').forEach(link => link.setAttribute('href', link.href));

	// For tables, remove all immediate child nodes that are not required
	const tables = wrapper.querySelectorAll('table');
	for (const table of tables) {
		const floaters = Array.from(table.children).filter(node => !['THEAD', 'TBODY', 'TR', 'TFOOT'].includes(node.tagName));
		for (const floater of floaters) {
			floater.remove();
		}
	}

	if (containerTagName === '') {
		return wrapper.innerHTML;
	}

	// For preformatted tags, content needs to be wrapped inside `<code>`
	// or it would not be considered as fenced code block
	if (containerTagName === 'pre') {
		// Classes of parent or container node can be used by GFM plugin to detect language
		const classes = (container.parentNode || container) instanceof Element ? ((container.parentNode || container) as Element).classList.toString() : '';

		return `
			<div class="${classes}">
				<pre><code>${wrapper.innerHTML}</code></pre>
			</div>
		`;
	}

	return '<' + containerTagName + '>' + wrapper.innerHTML + '</' + containerTagName + '>';
}

// Function that performs the conversion, can be called directly or via message
async function convertToMarkdown(actionType: string = 'selection', htmlContent: string = '') {
	let contentToConvert = htmlContent;
	if (actionType === 'selection') {
		contentToConvert = getSelectionAsHTML();
	}

	try {
		if (!contentToConvert) return; // Nothing to convert

		// Fetch options and configure turndown
		// Check if chrome.storage is available (might not be in some contexts, strictly speaking)
		if (chrome && chrome.storage && chrome.storage.sync) {
			const options = await chrome.storage.sync.get({
				headingStyle: 'atx',
				bulletListMarker: '-'
			});

			if (options.headingStyle) turndownService.options.headingStyle = options.headingStyle as any;
			if (options.bulletListMarker) turndownService.options.bulletListMarker = options.bulletListMarker as any;
		}

		const markdownContent = turndownService.turndown(contentToConvert);
		navigator.clipboard.writeText(markdownContent).catch(err => console.error('Failed to copy', err));
	} catch (error) {
		console.error(error);
	}
}

// Listen for messages
if (!(window as any).copyAsMarkdownInjected) {
	(window as any).copyAsMarkdownInjected = true;
	chrome.runtime.onMessage.addListener((message) => {
		if (message.actionType) {
			convertToMarkdown(message.actionType, message.htmlContent);
		}
	});
}
