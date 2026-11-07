const $ = (id) => document.getElementById(id);

const views = {
  register: $("view-register"),
  login: $("view-login"),
  dashboard: $("view-dashboard"),
};

function showView(name) {
  Object.entries(views).forEach(([key, element]) => {
    element.hidden = key !== name;
  });

  const target = views[name];
  const firstInput = target?.querySelector("input");
  if (firstInput) firstInput.focus();
}

function setMessage(elementId, message) {
  $(elementId).textContent = message;
}

function validateRegistration(name, password) {
  if (name.length < 2) return "Please enter your name (at least 2 characters).";
  if (password.length < 5) return "Your password needs at least 5 characters.";
  return "";
}

$("register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = $("register-name").value.trim();
  const password = $("register-password").value;

  const problem = validateRegistration(name, password);
  if (problem) return setMessage("register-error", problem);

  await Store.register(name, password);
  event.target.reset();
  setMessage("register-error", "");
  await openDashboard();
});

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const isCorrect = await Store.verifyPassword($("login-password").value);

  if (!isCorrect)
    return setMessage("login-error", "Incorrect password. Please try again.");

  event.target.reset();
  setMessage("login-error", "");
  await openDashboard();
});

$("logout-button").addEventListener("click", () => showView("login"));

async function openDashboard() {
  const state = await Store.getState();
  renderCategories(state.selectedCategories || []);
  showView("dashboard");
}

let appliedIds = [];

function renderCategories(selectedIds) {
  appliedIds = [...selectedIds];
  const list = $("category-list");
  const template = $("category-template");
  list.replaceChildren();

  CATEGORIES.forEach((category) => {
    const row = template.content.cloneNode(true);
    row.querySelector(".category-icon").textContent = category.icon;
    row.querySelector(".category-label").textContent = category.label;
    row.querySelector(".category-desc").textContent = category.description;

    const checkbox = row.querySelector(".category-checkbox");
    checkbox.value = category.id;
    checkbox.checked = selectedIds.includes(category.id);
    checkbox.addEventListener("change", onSelectionChange);

    list.appendChild(row);
  });

  updateApplyButton();
  setMessage("save-hint", "");
}

function getSelectedIds() {
  const checked = document.querySelectorAll(".category-checkbox:checked");
  return Array.from(checked, (checkbox) => checkbox.value);
}

function updateApplyButton() {
  const selected = getSelectedIds();
  const hasChanges =
    selected.length !== appliedIds.length || selected.some((id) => !appliedIds.includes(id));

  $("apply-button").disabled = !hasChanges;
}

function onSelectionChange() {
  updateApplyButton();
  setMessage("save-hint", "");
}

$("apply-button").addEventListener("click", async () => {
  const ids = getSelectedIds();
  await Store.setSelectedCategories(ids);

  appliedIds = ids;
  updateApplyButton();
  setMessage(
    "save-hint",
    ids.length > 0
      ? "Changes applied. Refresh open tabs to see them."
      : "Changes applied. No category is selected, so nothing will be blocked."
  );
});

async function init() {
  const { user } = await Store.getState();
  if (user) {
    $("login-name").textContent = user.name;
    showView("login");
  } else {
    showView("register");
  }
}

init();
