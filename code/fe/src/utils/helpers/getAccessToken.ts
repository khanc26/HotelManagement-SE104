export function getAccessToken() {
  try {
    const item = localStorage.getItem("access_token");
    if (!item) return null;

    const parsed = JSON.parse(item);

    if (parsed?.value && parsed?.expiresAt) {
      // const now = Date.now();
      // if (now > parsed.expiresAt) {
      //   localStorage.removeItem("access_token");
      //   return null;
      // }
      return parsed.value;
    }

    return parsed ?? null;
  } catch {
    console.error("Error parsing access_token from localStorage");
    return null;
  }
}
