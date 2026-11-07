# SafeEyes

SafeEyes is a browser extension designed to help parents and individuals block harmful categories of content from social media and search results. It focuses on categories such as violence, adult material, and other content that may be unsuitable for younger users or sensitive browsing.

The extension is built with a deliberate safety-first approach: settings are protected by a password, and turning protection off requires a second confirmation step so it cannot be disabled on impulse.

## Core features

- Category-based filtering for harmful content
- Protection against unsafe browsing categories such as violence and adult material
- Password-protected settings
- “Think twice” confirmation before disabling protection
- Local browser storage for saved user preferences and enabled state

## Supported content categories

The project currently includes the following content categories:

- Kissing scenes
- Romance
- Adultery & affairs
- Violence & gore
- 18+ adult content
- Gambling & betting

## Project structure

- `manifest.json` — extension manifest
- `src/` — extension logic and interface files
- `src/shared/categories.js` — category definitions and keyword matching
- `src/shared/storage.js` — local storage handling for user settings and protection state
- `src/content/content.js` — page-content filtering logic
- `src/background/background.js` — background service worker for page navigation tracking
- `src/blocked/` — blocked-page UI shown when a page is filtered
- `icons/` — extension icons

## Storage and protection model

The extension stores its configuration in `chrome.storage.local` using a single shared storage layer. This includes:

- `user` data with the password hash and salt
- `enabled` state for the protection toggle
- `selectedCategories` for the active blocked categories

Passwords are hashed before being stored, and verification is performed against the saved hash so the extension keeps sensitive settings protected in local storage.

## Getting started

1. Open the project in a browser extension development environment.
2. Load the extension in Chrome or another compatible browser.
3. Open the popup and register a user with a name and password.
4. The registration form requires that:
   - the name is at least 2 characters long
   - the password is at least 5 characters long
   - the password includes an uppercase letter
   - the password includes a lowercase letter
   - the password includes a number
   - the password includes a special character
5. Choose the content categories to block.
6. Use the extension to limit unsafe content while browsing.

## Current popup flow

The popup currently follows a safety-first flow:

1. Register a user with a valid name and password.
2. Log back in with the saved password.
3. Open the dashboard view to select which categories to block.
4. Toggle the protection switch to enable or disable filtering.
5. If protection is turned off, the user must first confirm the choice and then enter the password again.
6. Toggle category checkboxes and click Apply changes to save the updated settings.
7. Lock the dashboard again when finished.

The dashboard displays each category with an icon, label, and description, and only enables the Apply button when the current selection differs from the saved state. The protection status card also shows whether blocking is active, and the state is saved in browser local storage so it persists across popup sessions.

## Content filtering workflow

The extension filters page content based on the selected categories and uses the background worker to monitor navigation and trigger the blocked-page experience when a matching page is detected.

- open the extension popup and choose the categories to block
- visit a page that contains content from those categories
- the background worker observes navigation and the content script evaluates the page
- matching content is hidden and replaced with the blocked-page experience
- access is deliberately protected so the user must re-enter settings intentionally before browsing resumes

## Notes

SafeEyes is designed to make protection deliberate rather than easy to bypass, supporting safer browsing habits for families and individuals.
