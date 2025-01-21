(function () {
    'use strict';

    const addButtonToLinks = () => {
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            if (link.dataset.hasAddDomainButton) return; // Prevent duplicate buttons

            const domain = new URL(link.href).hostname.replace(/^www\./, '');

            // Create the "Add Domain" button
            const button = document.createElement('button');
            button.textContent = 'Add Domain';
            button.style.cssText = `
                margin-left: 10px;
                padding: 5px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;

            button.addEventListener('click', () => {
                alert(`Domain "${domain}" added successfully.`);
                // Trigger custom event to communicate with the main script
                const event = new CustomEvent('add-domain', { detail: domain });
                window.dispatchEvent(event);
            });

            link.parentElement.insertBefore(button, link.nextSibling);
            link.dataset.hasAddDomainButton = 'true'; // Mark link as processed
        });
    };

    // Run initially and on DOM changes
    const observer = new MutationObserver(addButtonToLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial button rendering
    addButtonToLinks();
})();
