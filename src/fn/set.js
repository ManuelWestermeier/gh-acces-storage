// filepath: src/fn/set.js
import { decrypt } from "../crypto";
import GitHubData from "../github";

export default async function set({
  width,
  height,
  plainPath,
  pathHash,
  encryptedData,
  password,
}) {
  document.body.className = "frame-body";

  // Decrypt the encryptedData so the user sees exactly what they typed
  const decryptedData = await decrypt(encryptedData, password);

  const message = document.createElement("p");
  message.textContent = `Do you want to write to "${plainPath}" with this data:\n\n${decryptedData}`;
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
      // Write the encrypted data to GitHub under pathHash
      await GitHubData.set(pathHash, encryptedData);
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
