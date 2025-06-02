// filepath: src/fn/get.js
import { decrypt } from "../crypto";
import GitHubData from "../github";

export default async function get({
  width,
  height,
  plainPath,
  pathHash,
  password,
}) {
  document.body.className = "frame-body";

  const message = document.createElement("p");
  message.textContent = `Do you want to read from "${plainPath}"?`;
  message.className = "confirm-message";

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Yes";
  confirmBtn.className = "confirm-btn";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "No";
  cancelBtn.className = "cancel-btn";

  document.body.innerHTML = "";
  document.body.appendChild(message);
  document.body.appendChild(confirmBtn);
  document.body.appendChild(cancelBtn);

  confirmBtn.addEventListener("click", async () => {
    document.body.innerHTML =
      "<h1 class='status success'>Loading... (max 10s)</h1>";
    try {
      // Fetch the encrypted blob from GitHub under pathHash
      const encryptedBlob = await GitHubData.get(pathHash);
      // Decrypt it with the user’s password
      const plaintext = await decrypt(encryptedBlob, password);

      // Show the decrypted content in a <pre>
      const pre = document.createElement("pre");
      pre.textContent = plaintext;
      pre.className = "decrypted-content";

      document.body.innerHTML = "";
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
