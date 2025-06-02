import { decrypt } from "../crypto";
import GitHubData from "../github";

export default function get({ width, height, path, password }) {
  document.body.className = "frame-body";

  // Set dimensions
  document.body.style.width = width;
  document.body.style.height = height;

  // Create message element
  const message = document.createElement("p");
  message.textContent = `Do you want to read from "${path}"?`;
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
      const result = await decrypt(await GitHubData.get(path), password);
      document.body.innerHTML = "<h1 class='status success'>Loaded</h1>";
      parent.postMessage({ status: "ok", data: result }, "*");
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
