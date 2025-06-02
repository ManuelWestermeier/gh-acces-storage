(() => {
  const urlBase = "https://gh-access.duckdns.org";

  // Einfache Hilfsfunktion: iframe mit URL öffnen und auf Antwort warten
  function openIframe(fn, path, data = null) {
    return new Promise((resolve, reject) => {
      // URL mit Parametern zusammenbauen
      const url = new URL(urlBase);
      url.searchParams.set("fn", fn);
      url.searchParams.set("p", path);

      if (fn === "set" && data !== null) {
        url.searchParams.set("data", data);
      }

      // iframe erzeugen
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.border = "none";
      iframe.style.zIndex = "999999";
      iframe.src = urlBase + "/#" + url.toString().split(urlBase)[1];

      // Event-Listener für postMessage
      function onMessage(event) {
        // Sicherheits-Check: nur Nachrichten von iframe-URL akzeptieren
        if (event.source !== iframe.contentWindow) return;
        if (!event.origin.includes(new URL(urlBase).origin)) return;

        const data = event.data;

        if (data === "ok") {
          cleanup();
          resolve(true);
        } else if (data === "false") {
          cleanup();
          resolve(false);
        } else if (data && typeof data === "object" && data.status) {
          cleanup();
          if (data.status === "ok") {
            resolve(data.data ?? true);
          } else if (data.status === "error") {
            reject(new Error(data.error || "Unknown error"));
          } else {
            resolve(false);
          }
        } else {
          // Unbekannte Nachricht, ignorieren
        }
      }

      // Cleanup Funktion: remove iframe und EventListener
      function cleanup() {
        window.removeEventListener("message", onMessage);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }

      window.addEventListener("message", onMessage);
      document.body.appendChild(iframe);
    });
  }

  window.ghStorage = {
    async get(path) {
      return openIframe("get", path);
    },
    async set(path, val) {
      return openIframe("set", path, val);
    },
    async delete(path) {
      return openIframe("delete", path);
    },
  };
})();
