const msg  = document.getElementById("msg");
const hint = document.getElementById("hint");

export function showLoseMessage() {
  msg.style.display = "flex";
  hint.textContent = "Refresh the page to try again.";
}

export function setHint(text) {
  hint.textContent = text;
}