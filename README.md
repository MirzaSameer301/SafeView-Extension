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
4. The registration form validates that:
   - the name is at least 2 characters long
   - the password is at least 5 characters long
5. Choose the content categories to block.
6. Use the extension to limit unsafe content while browsing.

## Current popup flow

The popup currently includes a registration view where users create an account before accessing the rest of the protection settings. The code stores the hashed password and the enabled state in browser local storage so the extension can persist user configuration safely.

## Notes

SafeEyes is designed to make protection deliberate rather than easy to bypass, supporting safer browsing habits for families and individuals.
