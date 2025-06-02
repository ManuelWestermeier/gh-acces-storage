import deleteFile from "./fn/delete";
import get from "./fn/get";
import set from "./fn/set";
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

  const path = url.searchParams.get("p");
  const data = url.searchParams.get("data");
  const fn = url.searchParams.get("fn");

  if (!fn)
    return showErrror(
      "url search param fn (function set/get/delete) have to be setted"
    );

  if (!path) return showErrror("url search param p (path) have to be setted");

  while (
    !(await GitHubData.init(
      localStorage.getItem("gh-auth-token") ||
        prompt("Input github auth token: https://github.com/settings/tokens/new")
    ))
  );

  if (fn == "delete") {
    deleteFile({ width, height, path });
  } else if (fn == "get") {
    get({ width, height, path });
  } else if (fn == "set") {
    if (!data) return showErrror("url search param data have to be setted");

    set({ width, height, path, data });
  }

  return true;
}
