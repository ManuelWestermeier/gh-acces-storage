export default function getPassword() {
  return new Promise((resolve, reject) => {
    document.body.className = "frame-body";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // Clear body
    document.body.innerHTML = "";

    // Create form
    const form = document.createElement("form");
    form.className = "password-form";

    // Label
    const label = document.createElement("label");
    label.textContent = "Enter password:";
    label.className = "confirm-message";
    label.setAttribute("for", "encryption-password");

    // Password input
    const input = document.createElement("input");
    input.type = "password";
    input.name = "encryption-password";
    input.id = "encryption-password";
    input.className = "password-input";
    input.placeholder = "Password";
    input.autofocus = true;
    input.required = true;

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "OK";
    submitBtn.className = "confirm-btn";

    // Error message container
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.style.color = "red";
    errorMsg.style.height = "1.2em";
    errorMsg.style.margin = "0.5em 0 0 0";

    // Append elements to form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submitBtn);
    form.appendChild(errorMsg);

    // Append form to body
    document.body.appendChild(form);

    // SHA-512 hashing function
    async function sha512(text) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-512", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorMsg.textContent = "";

      const password = input.value;
      if (!password) {
        errorMsg.textContent = "Password cannot be empty";
        return;
      }

      const hashed = await sha512(password);
      const storedHash = localStorage.getItem("encryption-password-hash");

      if (!storedHash) {
        // First time: store hash
        localStorage.setItem("encryption-password-hash", hashed);
        document.body.innerHTML = "<h1 class='status success'>Password stored</h1>";
        parent.postMessage("ok", "*");
        resolve(password);
      } else {
        // Compare hash
        if (storedHash === hashed) {
          document.body.innerHTML = "<h1 class='status success'>Password verified</h1>";
          parent.postMessage("ok", "*");
          resolve(password);
        } else {
          errorMsg.textContent = "Password incorrect, please try again.";
          input.value = "";
          input.focus();
          parent.postMessage("false", "*");
        }
      }
    });
  });
}
