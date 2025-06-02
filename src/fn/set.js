import { decrypt } from "../crypto";
import GitHubData from "../github";

export default async function set({ width, height, path, data, password }) {
  document.body.className = "frame-body";

  // Set dimensions
  document.body.style.width = width;
  document.body.style.height = height;

  // Decrypt both path and data so the user sees plaintext
  const decryptedPath = await decrypt(path, password);
  const decryptedData = await decrypt(data, password);

  // Create confirmation message
  const message = document.createElement("p");
  message.textContent = `Do you want to write to "${decryptedPath}" with this data:\n\n${decryptedData}`;
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
    document.body.innerHTML = "<h1 class='status success'>Loading... (max 10s)</h1>";
    try {
      // Write the encrypted data to GitHub
      await GitHubData.set(path, data);
      document.body.innerHTML = "<h1 class='status success'>Worked</h1>";
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
