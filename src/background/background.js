
importScripts("../shared/categories.js", "../shared/storage.js", "../shared/filter.js");

const SEARCH_PARAMS = ["q", "query", "search_query", "p", "text"];

async function checkNavigation(details) {
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  const state = await Store.getState();
  const categories = Filter.getActiveCategories(state);
  if (categories.length === 0) return;


  const siteMatch = Filter.findByDomain(url.hostname, categories);
  if (siteMatch) return showBlockedPage(details.tabId, siteMatch, "site", url.origin);


  const compiled = Filter.compile(categories);
  for (const param of SEARCH_PARAMS) {
    const searchText = url.searchParams.get(param);
    const searchMatch = searchText && Filter.findByText(searchText, compiled);
    if (searchMatch) return showBlockedPage(details.tabId, searchMatch, "search", url.origin);
  }
}


function showBlockedPage(tabId, category, reason, origin) {
  const page = chrome.runtime.getURL("src/blocked/blocked.html");
  const params = new URLSearchParams({ category: category.id, reason, from: origin });
  chrome.tabs.update(tabId, { url: `${page}?${params}` });
}

chrome.webNavigation.onBeforeNavigate.addListener(checkNavigation);
chrome.webNavigation.onHistoryStateUpdated.addListener(checkNavigation);

const EXTENSIONS_PAGE = /^(chrome|edge|brave):\/\/extensions/;

async function guardExtensionsPage(tabId, url) {
  if (!url || !EXTENSIONS_PAGE.test(url)) return;

  const { user } = await Store.getState();
  if (!user) return;
  if (await Store.hasTemporaryAccess()) return;

  const gatePage = chrome.runtime.getURL("src/gate/gate.html");
  chrome.tabs.update(tabId, { url: `${gatePage}?next=${encodeURIComponent(url)}` });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  guardExtensionsPage(tabId, changeInfo.url);
});