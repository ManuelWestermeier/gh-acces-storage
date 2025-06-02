import GitHubData from "../github";

export default function set({ width, height, path, data }) {
  document.body.className = "frame-body";

  // Set dimensions
  document.body.style.width = width;
  document.body.style.height = height;

  // Create confirmation message
  const message = document.createElement("p");
  message.textContent = `Do you want to write to "${path}" with this data: "${data}"?`;
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
  confirmBtn.addEventListener("click", () => {
    GitHubData.set(path, data);
    document.body.innerHTML = "<h1 class='status success'>Worked</h1>";
    parent.postMessage("ok", "*");
  });

  cancelBtn.addEventListener("click", () => {
    document.body.innerHTML = "<h1 class='status cancelled'>Cancelled</h1>";
    parent.postMessage("false", "*");
  });
}
