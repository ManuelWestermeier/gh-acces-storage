// GitHub API frontend library
// Usage: await GitHubData.init(token)

const GitHubData = (() => {
  const repo = "data-data";
  const branch = "main";
  const baseUrl = "https://api.github.com";
  let token = "";
  let username = "";

  function sha256(str) {
    return crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(str))
      .then((buf) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );
  }

  async function request(method, url, body = null) {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function getFile(pathHash) {
    try {
      return await request(
        "GET",
        `${baseUrl}/repos/${username}/${repo}/contents/${pathHash}?ref=${branch}`
      );
    } catch {
      return null;
    }
  }

  async function putFile(pathHash, content) {
    const existing = await getFile(pathHash);
    const body = {
      message: new Date(),
      content: btoa(content),
      branch,
    };
    if (existing) body.sha = existing.sha;
    return request(
      "PUT",
      `${baseUrl}/repos/${username}/${repo}/contents/${pathHash}`,
      body
    );
  }

  async function deleteFile(pathHash, message) {
    const existing = await getFile(pathHash);
    if (!existing) return;
    const body = {
      message,
      sha: existing.sha,
      branch,
    };
    return request(
      "DELETE",
      `${baseUrl}/repos/${username}/${repo}/contents/${pathHash}`,
      body
    );
  }

  async function chunkData(data) {
    const chunks = [];
    for (let i = 0; i < data.length; i += 100000) {
      chunks.push(data.slice(i, i + 100000));
    }
    return chunks;
  }

  async function get(path) {
    const lengthHash = await sha256(`${path}/length.dat`);
    const lengthFile = await getFile(lengthHash);
    if (!lengthFile) return null;
    const length = parseInt(atob(lengthFile.content));
    let data = "";
    for (let i = 0; i < length; i++) {
      const chunkHash = await sha256(`${path}/${i}.dat`);
      const chunkFile = await getFile(chunkHash);
      if (!chunkFile) break;
      data += atob(chunkFile.content);
    }
    return data;
  }

  async function set(path, value) {
    const chunks = await chunkData(value);
    for (let i = 0; i < chunks.length; i++) {
      const chunkHash = await sha256(`${path}/${i}.dat`);
      await putFile(chunkHash, chunks[i], `Set chunk ${i} for ${path}`);
    }
    const lengthHash = await sha256(`${path}/length.dat`);
    await putFile(lengthHash, String(chunks.length), `Set length for ${path}`);
  }

  async function del(path) {
    const lengthHash = await sha256(`${path}/length.dat`);
    const lengthFile = await getFile(lengthHash);
    if (!lengthFile) return;
    const length = parseInt(atob(lengthFile.content));
    for (let i = 0; i < length; i++) {
      const chunkHash = await sha256(`${path}/${i}.dat`);
      await deleteFile(chunkHash, `Delete chunk ${i} of ${path}`);
    }
    await deleteFile(lengthHash, `Delete length of ${path}`);
  }

  async function ensureRepoExists() {
    try {
      await request("GET", `${baseUrl}/repos/${username}/${repo}`);
    } catch {
      await request("POST", `${baseUrl}/user/repos`, {
        name: repo,
        private: true,
        auto_init: true,
        default_branch: branch,
      });
    }
  }

  return {
    async init(authToken) {
      try {
        token = authToken;
        const res = await request("GET", `${baseUrl}/user`);
        username = res.login;
        await ensureRepoExists();
        localStorage.setItem("gh-auth-token", authToken);
        return true;
      } catch (error) {
        return false;
      }
    },
    get,
    set,
    delete: del,
  };
})();

export default GitHubData;
