// simple client-side auth for learning only
async function hashPassword(pass) {
  const enc = new TextEncoder();
  const data = enc.encode(pass);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : {};
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("btn-register").addEventListener("click", async () => {
  const u = document.getElementById("reg-username").value.trim();
  const p = document.getElementById("reg-password").value;
  const msg = document.getElementById("reg-msg");
  if (!u || !p) {
    msg.innerText = "Enter username and password";
    return;
  }

  const users = getUsers();
  if (users[u]) {
    msg.innerText = "Username taken";
    return;
  }

  const h = await hashPassword(p);
  users[u] = { passwordHash: h, created: Date.now() };
  saveUsers(users);
  msg.innerText = "Registered. Now login.";
});

document.getElementById("btn-login").addEventListener("click", async () => {
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value;
  const msg = document.getElementById("login-msg");
  if (!u || !p) {
    msg.innerText = "Enter username and password";
    return;
  }

  const users = getUsers();
  if (!users[u]) {
    msg.innerText = "No such user";
    return;
  }

  const h = await hashPassword(p);
  if (users[u].passwordHash !== h) {
    msg.innerText = "Wrong password";
    return;
  }

  // login success -> set auth token (simple)
  localStorage.setItem(
    "authUser",
    JSON.stringify({ username: u, t: Date.now() })
  );
  msg.innerText = "Login success. Go to protected page.";
});
