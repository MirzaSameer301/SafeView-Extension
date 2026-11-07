(async () => {
  const state = await Store.getState();
  const categories = Filter.getActiveCategories(state);
  if (categories.length === 0) return;

  const compiled = Filter.compile(categories);

  const CONTENT_BLOCKS = "article, li, p, blockquote, figure, tr, h1, h2, h3, h4, h5, h6";
  const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "HTML", "BODY"]);
  const HIDDEN_MARK = "data-safeeyes-hidden";

  function hideMatchingContent(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const toHide = [];

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || IGNORED_TAGS.has(parent.tagName)) continue;
      if (parent.closest(`[${HIDDEN_MARK}]`)) continue; // already hidden

      if (Filter.findByText(node.nodeValue, compiled)) {
        const target = parent.closest(CONTENT_BLOCKS) || parent;
        if (!IGNORED_TAGS.has(target.tagName)) toHide.push(target);
      }
    }

    toHide.forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.setAttribute(HIDDEN_MARK, "true");
    });
  }

  hideMatchingContent(document.body);

  let timer;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => hideMatchingContent(document.body), 300);
  }).observe(document.body, { childList: true, subtree: true });
})();