export function clearAuthLocalStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
}
