const params = new URLSearchParams(location.search);
const category = CATEGORIES.find((item) => item.id === params.get("category"));
const reason = params.get("reason");
const from = params.get("from") || "";

// Only accept a plain web origin such as https://www.youtube.com (no path, no other protocols).
const isSafeOrigin = /^https?:\/\/[^\s/]+$/.test(from);
const canReturnToSite = reason === "search" && isSafeOrigin;

document.getElementById("category-name").textContent = category
  ? `${category.icon} ${category.label}`
  : "Restricted content";

document.getElementById("reason-text").textContent =
  reason === "search"
    ? "Your search includes a topic that is blocked."
    : "This website is blocked.";

const backButton = document.getElementById("back-button");
backButton.textContent = canReturnToSite ? `Back to ${new URL(from).hostname}` : "Open a new tab";

backButton.addEventListener("click", () => {
  if (canReturnToSite) {
    location.href = from;
  } else {
    chrome.tabs.update({ url: "chrome://newtab" });
  }
});