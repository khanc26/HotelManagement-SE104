import { access_token_expired_time } from "../constants";

export function setAccessToken(token: string): boolean {
  try {
    const expiresAt = Date.now() + access_token_expired_time;
    const val = JSON.stringify({ value: token, expiresAt });

    localStorage.setItem("access_token", val);
    return true;
  } catch (error) {
    console.error("Error setting access_token in localStorage:", error);
    return false;
  }
}
