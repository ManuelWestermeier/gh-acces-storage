import { decrypt, encrypt } from "./crypto";
import deleteFile from "./fn/delete";
import get from "./fn/get";
import set from "./fn/set";

import getPassword from "./get-password";
import GitHubData from "./github";
import showErrror from "./shwo-error";

export const url = new URL(
  `https://gh-acces.duckdns.org/${new URL(document.location).hash.replace(
    "#",
    ""
  )}`
);

export default async function init() {
  const width = url.searchParams.get("w") || innerWidth;
  const height = url.searchParams.get("h") || innerHeight;

  const originalPath = url.searchParams.get("p");
  const originalData = url.searchParams.get("data");
  const fn = url.searchParams.get("fn");

  if (!fn)
    return showErrror(
      "url search param fn (function set/get/delete) have to be setted"
    );

  if (!originalPath) return showErrror("url search param p (path) have to be setted");

  const password = await getPassword();

  const path = await encrypt(originalPath, password);
  const data = originalData ? await encrypt(originalData, password) : "";

  while (
    !(await GitHubData.init(
      localStorage.getItem("gh-auth-token") ||
        prompt(
          "Input github auth token: https://github.com/settings/tokens/new"
        ),
      password
    ))
  );

  if (fn == "delete") {
    deleteFile({ width, height, path });
  } else if (fn == "get") {
    get({ width, height, path, password });
  } else if (fn == "set") {
    if (!data) return showErrror("url search param data have to be setted");
    set({ width, height, path, data });
  }

  return true;
}
