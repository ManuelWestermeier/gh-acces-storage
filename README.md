# GITHUB ACCESS STORAGE

## usage

preview url https://gh-access.duckdns.org/test.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>test with user input</title>
    <script src="https://gh-access.duckdns.org/use.js"></script>
  </head>
  <body>
    <h1>Store text file with ghStorage</h1>

    <textarea
      id="userInput"
      rows="8"
      cols="50"
      placeholder="Type your text here..."
    ></textarea
    ><br />

    <button id="saveBtn">Save to GitHub Storage</button>
    <button id="loadBtn">Load from GitHub Storage</button>
    <button id="deleteBtn">Delete from GitHub Storage</button>

    <pre
      id="output"
      style="background: #f0f0f0; padding: 10px; margin-top: 20px"
    ></pre>

    <script>
      const filePath = "my/userInput.txt";

      const userInput = document.getElementById("userInput");
      const output = document.getElementById("output");

      document.getElementById("saveBtn").addEventListener("click", async () => {
        try {
          const text = userInput.value;

          // Optional: encode text to base64 (depends on your API requirements)
          // For example, if ghStorage expects base64 encoded strings, encode:
          // const encoded = btoa(unescape(encodeURIComponent(text)));
          // Here I just send plain text, assuming ghStorage accepts it.

          const success = await window.ghStorage.set(filePath, text);
          output.textContent = success
            ? "File saved successfully."
            : "Failed to save file.";
        } catch (e) {
          output.textContent = "Error saving file: " + e.message;
        }
      });

      document.getElementById("loadBtn").addEventListener("click", async () => {
        try {
          const content = await window.ghStorage.get(filePath);
          if (content === null) {
            output.textContent = "File not found.";
            userInput.value = "";
          } else {
            output.textContent = "File loaded.";
            userInput.value = content;
          }
        } catch (e) {
          output.textContent = "Error loading file: " + e.message;
        }
      });

      document
        .getElementById("deleteBtn")
        .addEventListener("click", async () => {
          try {
            const success = await window.ghStorage.delete(filePath);
            output.textContent = success
              ? "File deleted successfully."
              : "Failed to delete file.";
            if (success) userInput.value = "";
          } catch (e) {
            output.textContent = "Error deleting file: " + e.message;
          }
        });
    </script>
  </body>
</html>
```
