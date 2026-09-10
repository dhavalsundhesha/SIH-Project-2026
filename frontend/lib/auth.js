// Tiny localStorage-backed auth helper — no context/provider ceremony needed
// for a project this size, but centralized so every page reads/writes the
// same keys consistently.

export function saveSession(token, user) {
  localStorage.setItem("dharohar_token", token);
  localStorage.setItem("dharohar_user", JSON.stringify(user));
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("dharohar_user");
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dharohar_token");
}

export function clearSession() {
  localStorage.removeItem("dharohar_token");
  localStorage.removeItem("dharohar_user");
}
