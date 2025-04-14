export function getAccessToken() {
  try {
    const item = localStorage.getItem("access_token");
    if (!item) return null;

    const parsed = JSON.parse(item);

    // Handle expiring token format ({ value, expiresAt })
    if (parsed?.value && parsed?.expiresAt) {
      const now = Date.now();
      if (now > parsed.expiresAt) {
        localStorage.removeItem("access_token");
        return null;
      }
      return parsed.value;
    }

    // Handle non-expiring token (direct value)
    return parsed ?? null;
  } catch {
    console.error("Error parsing access_token from localStorage");
    return null;
  }
}
