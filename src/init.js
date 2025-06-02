import showErrror from "./shwo-error";

export const url = new URL(
  `https://gh-acces.duckdns.org/${new URL(document.location).hash.replace(
    "#",
    ""
  )}`
);

export default function init() {
  const width = url.searchParams.get("w");
  const height = url.searchParams.get("h");

  if (!width || !height) {
    return showErrror(
      "url search params w (width) & h (height) have to be setted\n" + "bsp: "
    );
  }
}
