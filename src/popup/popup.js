const $ = (id) => document.getElementById(id);

const views = {
  register: $("view-register"),
};

function showView(name) {
  Object.entries(views).forEach(([key, element]) => {
    element.hidden = key !== name;
  });
  const firstInput = views[name].querySelector("input");
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
  console.log("Account created. The next step adds the screen that follows.");
});


async function init() {
  showView("register");
}

init();