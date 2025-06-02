import showErrror from "./shwo-error";

export const url = new URL(
  `http://localhost:2189/${new URL(document.location).hash}`
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
