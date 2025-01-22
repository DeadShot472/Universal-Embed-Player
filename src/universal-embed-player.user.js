// ==UserScript==
// @name         Universal Embed Player
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Dynamically embed video players with Force Embedding Mode and interactive settings panel.
// @author       DeadShot472
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// ==/UserScript==

                                                 // Discussion : https://chatgpt.com/share/678f64dd-f128-8007-88b4-16134e8c0d5c

(function () {
    'use strict';

    const EMBED_URL_BASE = 'https://terabox-watch.netlify.app/api2.html?url=';
    const CONFIG_URL = 'https://raw.githubusercontent.com/DeadShot472/Universal-Embed-Player/main/config/allowed-domains.json';

    let allowedDomains = [];
    let forceEmbeddingMode = JSON.parse(localStorage.getItem("forceEmbeddingMode")) || false;

    const log = (message) => console.log(`[Universal Embedder] ${message}`);

    const fetchAllowedDomains = () => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: CONFIG_URL,
                onload: (response) => {
                    try {
                        const json = JSON.parse(response.responseText);
                        allowedDomains = json.domains || [];
                        resolve();
                    } catch (error) {
                        reject(`Failed to parse allowed domains: ${error}`);
                    }
                },
                onerror: () => reject('Failed to fetch allowed domains.'),
            });
        });
    };

    const isAllowedDomain = (url) => {
        if (forceEmbeddingMode) return true; // Bypass domain check if Force Mode is ON

        try {
            const domain = new URL(url).hostname.replace(/^www\./, '');
            return allowedDomains.includes(domain);
        } catch (error) {
            return false;
        }
    };

    const generateEmbedCode = (url, width, height) => {
        return `
            <div class="resizable-container"
                style="
                    max-width: 100%;
                    position: relative;
                    display: inline-block;
                    border: 1px solid #ccc;
                    resize: both;
                    overflow: hidden;
                    width: ${width}px;
                    height: ${height}px;
                    box-shadow: 0px 0px 3px rgba(0,0,0,0.2);
                ">
                <iframe src="${EMBED_URL_BASE}${encodeURIComponent(url)}"
                    style="width: 100%; height: 100%;"
                    frameborder="0"
                    allowfullscreen
                    scrolling="no"></iframe>
            </div>
        `;
    };

    const computePlayerSize = (container) => {
        const defaultWidth = 700;
        const defaultHeight = 600;
        if (!container) {
            return { width: defaultWidth, height: defaultHeight };
        }

        const computedStyle = window.getComputedStyle(container);
        const width = Math.min(parseInt(computedStyle.width, 10) || defaultWidth, defaultWidth);
        const height = Math.round(width * 9 / 16);

        return { width, height };
    };

    const handleEmbeddingError = (url) => {
        alert(`Failed to embed the link: ${url}. It might not be supported.`);
    };

    const handleClick = (event) => {
        const link = event.target.closest('a[href]');
        if (!link) return;

        const href = link.href;
        let videoUrl;

        if (isAllowedDomain(href)) {
            videoUrl = href;
        } else {
            const urlMatch = href.match(/url=([^&]+)/);
            if (urlMatch) {
                videoUrl = decodeURIComponent(urlMatch[1]);
            }
        }

        if (videoUrl) {
            event.preventDefault();

            const parentContainer = link.parentElement;
            const { width, height } = computePlayerSize(parentContainer);

            try {
                const embedDiv = document.createElement('div');
                embedDiv.innerHTML = generateEmbedCode(videoUrl, width, height);
                parentContainer.insertBefore(embedDiv, link.nextSibling);

                log(`Embedded player for URL: ${videoUrl}, size: ${width}x${height}`);
            } catch (error) {
                handleEmbeddingError(videoUrl);
            }
        }
    };

    const createSettingsPanel = () => {
        const panel = document.createElement('div');
        panel.id = "settings-panel";
        panel.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 200px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;

        panel.innerHTML = `
            <h4 style="margin: 0; margin-bottom: 10px; text-align: center; font-size: 16px;">Embed Settings</h4>
            <label style="display: flex; justify-content: space-between; align-items: center;">
                Force Embedding Mode
                <input type="checkbox" id="force-embedding-toggle" ${forceEmbeddingMode ? 'checked' : ''}>
            </label>
            <p style="margin: 10px 0; font-size: 12px; color: #666;">
                Use this mode to embed any link, bypassing domain checks.
            </p>
        `;

        document.body.appendChild(panel);

        const toggle = panel.querySelector('#force-embedding-toggle');
        toggle.addEventListener('change', (event) => {
            forceEmbeddingMode = event.target.checked;
            localStorage.setItem("forceEmbeddingMode", JSON.stringify(forceEmbeddingMode));
            const status = forceEmbeddingMode ? "ON" : "OFF";
            log(`Force Embedding Mode is now ${status}`);
            alert(`Force Embedding Mode is now ${status}`);
        });
    };

    const initialize = async () => {
        try {
            await fetchAllowedDomains();
            document.addEventListener('click', handleClick, true);
            createSettingsPanel();
            log('Universal Embed Player script loaded.');
        } catch (error) {
            log(error);
        }
    };

    initialize();
})();
