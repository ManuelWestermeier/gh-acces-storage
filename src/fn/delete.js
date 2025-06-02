// filepath: src/fn/delete.js
import GitHubData from "../github";

export default async function deleteFile({
  width,
  height,
  plainPath,
  pathHash,
  password,
}) {
  document.body.className = "frame-body";

  // Show the plaintext path to the user
  const message = document.createElement("p");
  message.textContent = `Do you want to delete "${plainPath}"?`;
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
      "<h1 class='status success'>Deleting... (max 10s)</h1>";
    try {
      await GitHubData.delete(pathHash);
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
