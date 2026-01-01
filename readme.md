# <img src="public/copy-as-markdown.png" width="45" align="left"> Copy as Markdown

> A fast, lean, and modern browser extension to copy hyperlinks, images, and selected text as Markdown.

<p align="center">
    <a href="https://chromewebstore.google.com/detail/ngffkknkolnfebepjfhnifbbggebmngh"><img src="https://img.shields.io/chrome-web-store/v/ngffkknkolnfebepjfhnifbbggebmngh.svg?label=Chrome%20Web%20Store&logo=google-chrome&logoColor=white&color=blue" alt="Chrome Web Store"></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/cpy-as-md"><img src="https://img.shields.io/amo/v/cpy-as-md.svg?label=Firefox%20Add-ons&logo=firefox-browser&logoColor=white&color=orange" alt="Firefox Add-ons"></a>
</p>

## ✨ New in v2.0 (Best-in-Class Edition)

We have completely rebuilt the extension to be the **most efficient and feature-rich** Markdown copier available.

*   ⚡️ **0% Idle Resource Usage**: Using "On-Demand Injection", the extension only loads code when you actually click "Copy". It uses **zero memory and CPU** in the background.
*   🛠 **Modern Tech Stack**: Rebuilt from scratch with **Vite** and **TypeScript** for rock-solid reliability.
*   📋 **Copy All Tabs**: New Popup UI lets you copy a list of all open tabs in one click.
*   ⚙️ **Customizable**: New Options page to configure your preferred bullet style (`-` vs `*`) and heading style.
*   🔒 **Secure**: Fully compliant with **Manifest V3**, requesting strictly necessary permissions only.

---

## Features

The extension allows you to copy selected text on a page as Markdown with support for features including the following:

- **Rich Content Support**:
    - Ability to copy links, images, and selected text as Markdown.
    - Linked images, will have options to individually select link or images.
    - Formatted text such as _italic_, **bold**, ~~strike-through~~, and `inline code`.
    - Unordered and ordered lists, with [task lists](https://github.github.com/gfm/#task-list-items-extension-) support.
    - Tables, with respect to [GFM](https://github.github.com/gfm/#tables-extension-).
    - Fenced code blocks, with language detection using [info strings](https://github.github.com/gfm/#example-112).
    - MathML to LaTeX conversion, using [mathml-to-latex](https://github.com/asnunes/mathml-to-latex) (delimited by `$` and `$$` for inline and block rendering respectively).

<table>
	<tr>
		<th width="50%">
            <p><img src="./media/screenshot-640x400.png" width="100%">
		<th width="50%">
			<p><img src="./media/screenshot-1280x800.png" width="100%">
</table>

## Development

This extension is built with **Vite** and **TypeScript**.

### Build

```bash
npm install
npm run build
```

This will generate a `distribution` folder.

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable Developer Mode
3. Click "Load Unpacked" and select the `distribution` folder.

## Permissions

The extension requires the following permission from you for working.

1. `contextMenus`: to show option when right-clicking.
2. `activeTab`: to be able to access content on page.
3. `scripting`: to inject the conversion logic only when requested.
4. `storage`: to save your preferences.

## Known Issues

### Security Considerations

Copying to clipboard might not work in some of the following scenarios:

- You are on an insecure page (URL starts with `http://` instead of `https://`).
- You have not interacted with the page yet.

These are a result of the software design decisions made to protect the user from bad actors. The MDN article section ["Security Considerations"][link-security-considerations] lists what these limitations are and why they exist.

More info can be found on MDN about [User Activation](link-transient-activation) and [Secure Contexts][link-secure-contexts].

### Copying Embedded Content

Web pages sometimes embed content from other page using an [`iframe`](http://mdn.io/iframe). Due to security considerations around accessing and modifying clipboard (see section above), this extension doesn't work if you try to copy text from inside these frames.

### Edge cases in Chromium Browsers

When copying links and images, Chrome doesn’t let you extract images alt text or anchors text content to be used in Markdown, instead the links themselves are used as link title. Firefox doesn’t have this limitation.

## Credits

- Idea from [this tweet](https://twitter.com/NicoloRibaudo/status/1143521181196345346) by [@nicolo-ribaudo](https://github.com/nicolo-ribaudo).
- Publishing made possible by [@yakov116](https://github.com/yakov116).

## Related

- [browser-extension-template](https://github.com/notlmn/browser-extension-template) - Barebones boilerplate with webpack, options handler and auto-publishing.

## License

[MIT](license)

[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/cpy-as-md
[link-chrome]: https://chromewebstore.google.com/detail/ngffkknkolnfebepjfhnifbbggebmngh
[link-security-considerations]: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations
[link-transient-activation]: https://developer.mozilla.org/en-US/docs/Web/Security/User_activation
[link-secure-contexts]: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
