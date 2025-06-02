import { decrypt } from "../crypto";
import GitHubData from "../github";

export default async function get({ width, height, path, password }) {
  document.body.className = "frame-body";

  // Set dimensions
  document.body.style.width = width;
  document.body.style.height = height;

  // First decrypt the path so the user sees the real filename
  const decryptedPath = await decrypt(path, password);

  // Create message element
  const message = document.createElement("p");
  message.textContent = `Do you want to read from "${decryptedPath}"?`;
  message.className = "confirm-message";

  // Create buttons
  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Yes";
  confirmBtn.className = "confirm-btn";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "No";
  cancelBtn.className = "cancel-btn";

  // Append elements
  document.body.innerHTML = "";
  document.body.appendChild(message);
  document.body.appendChild(confirmBtn);
  document.body.appendChild(cancelBtn);

  // Event listeners
  confirmBtn.addEventListener("click", async () => {
    document.body.innerHTML =
      "<h1 class='status success'>Loading... (max 10s)</h1>";
    try {
      // Fetch the encrypted blob from GitHub, then decrypt it
      const encryptedBlob = await GitHubData.get(path);
      const plaintext = await decrypt(encryptedBlob, password);

      // Replace the entire body with the decrypted contents
      const pre = document.createElement("pre");
      pre.textContent = plaintext;
      pre.className = "decrypted-content";

      document.body.innerHTML = ""; // clear “Loading…”
      document.body.appendChild(pre);

      parent.postMessage({ status: "ok", data: plaintext }, "*");
    } catch (err) {
      document.body.innerHTML = "<h1 class='status cancelled'>Failed</h1>";
      parent.postMessage({ status: "error", error: err.message }, "*");
    }
  });

  cancelBtn.addEventListener("click", () => {
    document.body.innerHTML = "<h1 class='status cancelled'>Cancelled</h1>";
    parent.postMessage("false", "*");
  });
}
