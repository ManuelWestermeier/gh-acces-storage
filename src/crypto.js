// aes256lib.js

// Helper to convert strings and buffers
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Double-hashes the password using SHA-256 twice
 * @param {string} password
 * @returns {Promise<CryptoKey>} AES-CBC Key
 */
async function deriveKey(password) {
  const firstHash = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(password)
  );
  const secondHash = await crypto.subtle.digest("SHA-256", firstHash);

  return crypto.subtle.importKey(
    "raw",
    secondHash,
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a string with AES-256-CBC
 * @param {string} data - Plaintext
 * @param {string} password - Password
 * @returns {Promise<string>} Base64 encoded IV + ciphertext
 */
export async function encrypt(data, password) {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password);
  const encodedData = textEncoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encodedData
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a base64 string encrypted by this library
 * @param {string} encryptedBase64 - Base64 string (IV + ciphertext)
 * @param {string} password - Password
 * @returns {Promise<string>} Decrypted plaintext
 */
export async function decrypt(encryptedBase64, password) {
  const combinedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0)
  );
  const iv = combinedBytes.slice(0, 16);
  const ciphertext = combinedBytes.slice(16);

  const key = await deriveKey(password);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    ciphertext
  );

  return textDecoder.decode(decrypted);
}
