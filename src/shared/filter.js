
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const Filter = {
 getActiveCategories(state) {
    if (!state.enabled) return [];
    return CATEGORIES.filter((category) => state.selectedCategories.includes(category.id));
  },

 compile(categories) {
    return categories.map((category) => ({
      category,
      regex: new RegExp("\\b(?:" + category.keywords.map(escapeRegex).join("|") + ")", "i"),
    }));
  },
  findByText(text, compiled) {
    const hit = compiled.find(({ regex }) => regex.test(text));
    return hit ? hit.category : null;
  },

 findByDomain(hostname, categories) {
    const host = hostname.replace(/^www\./, "");
    const match = categories.find((category) =>
      category.domains.some((domain) => host === domain || host.endsWith("." + domain))
    );
    return match || null;
  },
};