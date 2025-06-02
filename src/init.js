import { encrypt, decrypt } from "./crypto";
import deleteFile from "./fn/delete";
import get from "./fn/get";
import set from "./fn/set";
import getPassword from "./get-password";
import GitHubData from "./github";
import showError from "./shwo-error";

export const url = new URL(
  `https://gh-acces.duckdns.org/${new URL(document.location).hash.replace(
    "#",
    ""
  )}`
);

// A helper to SHA-256 hash any string → hex digest
async function sha256Hex(str) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async function init() {
  const width = url.searchParams.get("w") || innerWidth;
  const height = url.searchParams.get("h") || innerHeight;

  const originalPath = url.searchParams.get("p");
  const originalData = url.searchParams.get("data");
  const fn = url.searchParams.get("fn");

  if (!fn)
    return showError(
      "url search param fn (function set/get/delete) has to be set"
    );
  if (!originalPath)
    return showError("url search param p (path) has to be set");

  const password = await getPassword();

  // Compute a deterministic hash of the plaintext path
  const pathHash = await sha256Hex(originalPath);

  // Encrypt the data if present
  const encryptedData = originalData
    ? await encrypt(originalData, password)
    : null;

  // Keep initializing GitHubData until the token is valid
  while (
    !(await GitHubData.init(
      localStorage.getItem("gh-auth-token") ||
        prompt(
          "Input GitHub auth token: https://github.com/settings/tokens/new"
        )
    ))
  ) {
    // keep asking if invalid token
  }

  if (fn === "delete") {
    await deleteFile({
      width,
      height,
      plainPath: originalPath,
      pathHash,
      password,
    });
  } else if (fn === "get") {
    await get({
      width,
      height,
      plainPath: originalPath,
      pathHash,
      password,
    });
  } else if (fn === "set") {
    if (!encryptedData)
      return showError("url search param data has to be set for set()");
    await set({
      width,
      height,
      plainPath: originalPath,
      pathHash,
      encryptedData,
      password,
    });
  }

  return true;
}
