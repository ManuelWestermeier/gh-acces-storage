export default function getGHAuthToken() {
  const storedToken = localStorage.getItem("gh-auth-token");
  if (storedToken) {
    // If a token is already saved, return it immediately
    return Promise.resolve(storedToken);
  }

  return new Promise((resolve, reject) => {
    // Make the entire page a "frame" for the input form
    document.body.className = "frame-body";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.backgroundColor = "#f4f4f4";
    document.body.innerHTML = "";

    // Create form container
    const form = document.createElement("form");
    form.className = "token-form";
    form.style.background = "#fff";
    form.style.padding = "2rem";
    form.style.borderRadius = "0.5rem";
    form.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
    form.style.maxWidth = "400px";
    form.style.width = "100%";
    form.style.boxSizing = "border-box";

    // Instruction paragraph
    const instructions = document.createElement("p");
    instructions.innerHTML = `
      To create a GitHub Personal Access Token, visit:
      <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer">
        https://github.com/settings/tokens/new
      </a>
      <br><br>
      1. Sign in to GitHub.<br>
      2. Click “Generate new token”.<br>
      3. Choose a name and expiration (or “No expiration”).<br>
      4. Select the required scopes (e.g., <code>repo</code> for repository access).<br>
      5. Click “Generate token” and copy the token immediately.<br>
    `;
    instructions.style.fontSize = "0.9rem";
    instructions.style.lineHeight = "1.4";
    instructions.style.marginBottom = "1.5rem";

    // Label for the input
    const label = document.createElement("label");
    label.textContent = "Enter GitHub Auth Token:";
    label.className = "token-message";
    label.setAttribute("for", "gh-auth-token");
    label.style.display = "block";
    label.style.fontWeight = "600";
    label.style.marginBottom = "0.5rem";

    // Text input for the token
    const input = document.createElement("input");
    input.type = "text";
    input.name = "gh-auth-token";
    input.id = "gh-auth-token";
    input.className = "token-input";
    input.placeholder = "Paste your GitHub token here";
    input.autofocus = true;
    input.required = true;
    input.style.width = "100%";
    input.style.padding = "0.75rem";
    input.style.fontSize = "1rem";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "0.25rem";
    input.style.marginBottom = "1rem";
    input.style.boxSizing = "border-box";

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Save Token";
    submitBtn.className = "confirm-btn";
    submitBtn.style.padding = "0.75rem 1.5rem";
    submitBtn.style.fontSize = "1rem";
    submitBtn.style.backgroundColor = "#2c974b";
    submitBtn.style.color = "#fff";
    submitBtn.style.border = "none";
    submitBtn.style.borderRadius = "0.25rem";
    submitBtn.style.cursor = "pointer";
    submitBtn.style.width = "100%";
    submitBtn.style.boxSizing = "border-box";

    // Error message container
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.style.color = "red";
    errorMsg.style.height = "1.2em";
    errorMsg.style.margin = "0.5em 0 0 0";
    errorMsg.style.fontSize = "0.9rem";

    // Append elements to the form
    form.appendChild(instructions);

    form.appendChild(label);

    form.appendChild(input);

    form.appendChild(submitBtn);

    form.appendChild(errorMsg);

    // Append form to the body
    document.body.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorMsg.textContent = "";

      const token = input.value.trim();
      if (!token) {
        errorMsg.textContent = "Token cannot be empty";
        return;
      }

      // Store the token in localStorage
      localStorage.setItem("gh-auth-token", token);

      // Show a success message and resolve
      document.body.innerHTML =
        "<h1 class='status success'>Token saved successfully</h1>";
      resolve(token);
    });
  });
}
