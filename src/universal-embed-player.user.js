// ==UserScript==
// @name         Universal Embed Player
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Dynamically embed video players based on allowed domains with external JSON configuration support.
// @author       DeadShot472
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
    'use strict';

    const EMBED_URL_BASE = 'https://terabox-watch.netlify.app/api2.html?url=';
    const CONFIG_URL = 'https://raw.githubusercontent.com/DeadShot472/Universal-Embed-Player/main/config/allowed-domains.json';

    let allowedDomains = [];

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

        if (videoUrl && isAllowedDomain(videoUrl)) {
            event.preventDefault();

            const parentContainer = link.parentElement;
            const { width, height } = computePlayerSize(parentContainer);

            const embedDiv = document.createElement('div');
            embedDiv.innerHTML = generateEmbedCode(videoUrl, width, height);

            parentContainer.insertBefore(embedDiv, link.nextSibling);

            log(`Embedded player for URL: ${videoUrl}, size: ${width}x${height}`);
        }
    };

    const initialize = async () => {
        try {
            await fetchAllowedDomains();
            document.addEventListener('click', handleClick, true);
            log('Universal Embed Player script loaded.');
        } catch (error) {
            log(error);
        }
    };

    initialize();
})();
