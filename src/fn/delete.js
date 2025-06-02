import { decrypt } from "../crypto";
import GitHubData from "../github";

export default async function deleteFile({ width, height, path, password }) {
  // Decrypt the encrypted path so we can show the real filename
  const decryptedPath = await decrypt(path, password);

  document.body.className = "frame-body";

  // Set dimensions
  document.body.style.width = width;
  document.body.style.height = height;

  // Create confirmation message
  const message = document.createElement("p");
  message.textContent = `Do you want to delete "${decryptedPath}"?`;
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
      "<h1 class='status success'>Deleting... (max 10s)</h1>";
    try {
      // Use the encrypted `path` when calling GitHubData.delete
      await GitHubData.delete(path);
      document.body.innerHTML = "<h1 class='status success'>Deleted</h1>";
      parent.postMessage("ok", "*");
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
