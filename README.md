# GitHub Access Storage

This repository provides a simple way to store, retrieve, and delete text files in a GitHub repository using a JavaScript client (ghStorage). It leverages GitHub's API to handle files programmatically, making it easy to persist user-generated content in a GitHub-backed storage.

## Preview

You can preview the example by visiting: [https://gh-access.duckdns.org/test.html](https://gh-access.duckdns.org/test.html)

## Prerequisites

- A GitHub repository where you want to store files.
- A JavaScript file (`use.js`) that provides the `ghStorage` API. This file should be hosted and accessible at `https://gh-access.duckdns.org/use.js` (or your own domain).
- A valid GitHub personal access token (PAT) with appropriate scopes (e.g., `repo`) configured within `use.js` to authenticate API requests.
- Basic knowledge of HTML and JavaScript.

## How It Works

- **`ghStorage.set(path, content)`**: Saves a file with the specified `path` and `content` to GitHub Storage. Returns `true` if successful.
- **`ghStorage.get(path)`**: Retrieves the content of the file at `path`. Returns the file content as a string, or `null` if the file does not exist.
- **`ghStorage.delete(path)`**: Deletes the file at `path`. Returns `true` if the file was deleted successfully.

> The `path` parameter should be the relative path within the repository, such as `folder/filename.txt`.

## Usage

Below is an example HTML file demonstrating how to:

```html
<!-- Include the ghStorage client script -->
<script src="https://gh-access.duckdns.org/use.js"></script>
```

```js
const success = await window.ghStorage.set(filePath, text);
const content = await window.ghStorage.get(filePath);
const success = await window.ghStorage.delete(filePath);
```

1. Save user input to a GitHub Storage file.
2. Load the file content back into the textarea.
3. Delete the file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GitHub Storage Example</title>
    <!-- Include the ghStorage client script -->
    <script src="https://gh-access.duckdns.org/use.js"></script>
  </head>
  <body>
    <h1>Store Text File with ghStorage</h1>

    <textarea
      id="userInput"
      rows="8"
      cols="50"
      placeholder="Type your text here..."
    ></textarea>
    <br />

    <button id="saveBtn">Save to GitHub Storage</button>
    <button id="loadBtn">Load from GitHub Storage</button>
    <button id="deleteBtn">Delete from GitHub Storage</button>

    <pre
      id="output"
      style="background: #f0f0f0; padding: 10px; margin-top: 20px"
    ></pre>

    <script>
      // Specify the file path within your GitHub repository
      const filePath = "my/userInput.txt";

      const userInput = document.getElementById("userInput");
      const output = document.getElementById("output");

      document.getElementById("saveBtn").addEventListener("click", async () => {
        try {
          const text = userInput.value;
          // If ghStorage expects base64 encoding, uncomment below:
          // const encoded = btoa(unescape(encodeURIComponent(text)));

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
