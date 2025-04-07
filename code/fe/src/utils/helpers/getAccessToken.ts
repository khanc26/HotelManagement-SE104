export function getAccessToken() {
  const access_token = localStorage.getItem("access_token");

  return access_token?.replace(/^"|"$/g, "").trim() || null;
}
