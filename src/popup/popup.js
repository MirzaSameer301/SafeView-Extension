const $ = (id) => document.getElementById(id);

const views = {
  register: $("view-register"),
  login: $("view-login"),
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
  $("login-name").textContent = name;
  showView("login");
});

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const isCorrect = await Store.verifyPassword($("login-password").value);

  if (!isCorrect)
    return setMessage("login-error", "Incorrect password. Please try again.");

  event.target.reset();
  setMessage("login-error", "");
  console.log("Unlocked. The next step adds the settings screen.");
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
