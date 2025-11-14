// Hash password so we don't store plain password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// -------------------- REGISTER --------------------

document.getElementById("btn-register").addEventListener("click", async () => {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;

  const msg = document.getElementById("reg-msg");

  if (!username || !password) {
    msg.textContent = "Please enter both username and password.";
    return;
  }

  const users = getUsers();
  if (users[username]) {
    msg.textContent = "Username already exists.";
    return;
  }

  const hashed = await hashPassword(password);
  users[username] = { passwordHash: hashed };
  saveUsers(users);

  msg.textContent = "Registered successfully! Now login.";
});

// -------------------- LOGIN --------------------

document.getElementById("btn-login").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const msg = document.getElementById("login-msg");

  if (!username || !password) {
    msg.textContent = "Please enter both username and password.";
    return;
  }

  const users = getUsers();
  if (!users[username]) {
    msg.textContent = "User not found.";
    return;
  }

  const hashed = await hashPassword(password);

  if (hashed !== users[username].passwordHash) {
    msg.textContent = "Incorrect password.";
    return;
  }

  // Login success
  localStorage.setItem("authUser", JSON.stringify({ username }));
  msg.textContent = "Login successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "protected.html";
  }, 800);
});
