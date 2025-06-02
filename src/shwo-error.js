export default function showErrror(msg) {
  document.body.style.color = "red";
  document.body.innerText = msg;
  console.error(msg);
  return false;
}
