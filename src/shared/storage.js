/**
 * Everything the extension saves lives in chrome.storage.local.
 * This file is the ONLY place that reads or writes it, so the rest of the
 * code never touches chrome.storage directly.
 */
const DEFAULT_STATE = {
  user: null,
  selectedCategories: [],
  enabled: true,
  temporaryAccessUntil: 0,
};

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const Store = {
  getState() {
    return chrome.storage.local.get(DEFAULT_STATE);
  },

  async register(name, password) {
    const salt = crypto.randomUUID(); 
    const passwordHash = await hashPassword(password, salt);
    await chrome.storage.local.set({
      user: { name, salt, passwordHash },
      enabled: true,
      selectedCategories: [],
    });
  },

  async verifyPassword(password) {
    const { user } = await Store.getState();
    if (!user) return false;
    return (await hashPassword(password, user.salt)) === user.passwordHash;
  },

  setEnabled(enabled) {
    return chrome.storage.local.set({ enabled });
  },

  setSelectedCategories(ids) {
    return chrome.storage.local.set({ selectedCategories: ids });
  },

 
  grantTemporaryAccess(minutes) {
    return chrome.storage.session.set({ unlockedUntil: Date.now() + minutes * 60 * 1000 });
  },

  async hasTemporaryAccess() {
    const { unlockedUntil } = await chrome.storage.session.get({ unlockedUntil: 0 });
    return unlockedUntil > Date.now();
  },
};