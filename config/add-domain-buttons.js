(function () {
    'use strict';

    // Function to handle adding the domain to the allowed list
    const handleAddDomain = (domain) => {
        alert(`Domain "${domain}" added to the allowed list.`);
        console.log(`Added domain: ${domain}`);
        // Simulate syncing to a remote server or local storage
        // This can be replaced with your actual logic
    };

    // Function to add inline buttons near each link
    const addInlineButtons = () => {
        const links = document.querySelectorAll('a[href]'); // Select all links with an href
        links.forEach(link => {
            // Ensure we don't add multiple buttons for the same link
            if (!link.dataset.hasAddButton) {
                const button = document.createElement('button');
                button.innerText = "Add Domain";
                button.style.marginLeft = '10px';
                button.style.padding = '2px 5px';
                button.style.fontSize = '12px';
                button.style.cursor = 'pointer';
                button.style.backgroundColor = '#007BFF';
                button.style.color = '#FFF';
                button.style.border = 'none';
                button.style.borderRadius = '3px';

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent the link from being followed
                    const domain = new URL(link.href).hostname.replace(/^www\./, '');
                    handleAddDomain(domain); // Call the handler with the domain
                });

                link.insertAdjacentElement('afterend', button); // Add the button next to the link
                link.dataset.hasAddButton = true; // Mark the link as having a button
            }
        });
    };

    // Add buttons after the DOM content is fully loaded
    window.addEventListener('DOMContentLoaded', () => {
        addInlineButtons();
    });

    // Observe DOM changes and add buttons dynamically
    const observer = new MutationObserver(() => {
        addInlineButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
