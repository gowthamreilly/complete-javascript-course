"use strict";

const showModalBtns = document.querySelectorAll(".show-modal");
const modalWindow = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");

function showModalWindow() {
  modalWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModalWindow() {
  modalWindow.classList.add("hidden");
  overlay.classList.add("hidden");
}

for (let i = 0; i < showModalBtns.length; i++) {
  showModalBtns[i].addEventListener("click", showModalWindow);
}

closeModalBtn.addEventListener("click", closeModalWindow);
overlay.addEventListener("click", closeModalWindow);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modalWindow.classList.contains(".hidden")) {
    closeModalWindow();
  }
});
