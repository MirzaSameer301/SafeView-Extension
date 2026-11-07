
const UNLOCK_MINUTES = 5;
const EXTENSIONS_PAGE = /^(chrome|edge|brave):\/\/extensions/;

const requested = new URLSearchParams(location.search).get("next");
const destination = EXTENSIONS_PAGE.test(requested || "") ? requested : "chrome://extensions";

const error = document.getElementById("gate-error");

document.getElementById("gate-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const isCorrect = await Store.verifyPassword(document.getElementById("gate-password").value);

  if (!isCorrect) {
    error.textContent = "Incorrect password.";
    return;
  }

  await Store.grantTemporaryAccess(UNLOCK_MINUTES);
  chrome.tabs.update({ url: destination });
});

document.getElementById("gate-cancel").addEventListener("click", () => {
  chrome.tabs.update({ url: "chrome://newtab" });
});