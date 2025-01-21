# Universal-Embed-Player
A flexible and customizable user script for embedding video players dynamically.

# Universal Embed Player

A flexible and customizable user script that dynamically embeds video players based on URL links on supported domains.

## Features

- Automatically embeds video players from allowed domains.
- Resizable iframe containers with user-friendly resizing options.
- Fully customizable using a JSON-based configuration file.
- Lightweight and efficient.

## Installation

### 1. Install a UserScript Manager

To use the **Universal Embed Player** script, you will need a UserScript Manager. We recommend the following:

- [Tampermonkey](https://www.tampermonkey.net/) for Chrome, Edge, Safari, Opera, and more.
- [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox.

### 2. Install the Script

Once you have installed your UserScript manager, you can install the **Universal Embed Player** script:

- Go to the **[Universal Embed Player Script](https://github.com/DeadShot472/Universal-Embed-Player/blob/main/src/universal-embed-player.user.js)** on GitHub.
- Click the "Raw" button to open the raw script.
- If you are using **Tampermonkey** or **Greasemonkey**, the script will automatically be detected, and a prompt will appear to install it.

### 3. (Optional) Edit Configuration for Allowed Domains

The script uses a JSON file (`allowed-domains.json`) to determine which domains are supported for embedding. You can add, remove, or modify allowed domains by following the steps below.

---

## Usage

Once installed, the script will:

- Detect allowed domain links on any webpage.
- Automatically embed a video player below the detected link.
- Resizeable iframe players with user-friendly resizing options.

**Supported Link Format**:
- The script can detect direct links to supported video domains.
- It also supports URLs with `url=` parameters, provided the domain is allowed.

### Example:
```html
<a href="https://teraboxapp.com/s/1**********************">Click here to view video</a>
