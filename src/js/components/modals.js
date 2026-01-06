const overlay = document.getElementById("modal-overlay");
const termsModal = document.getElementById("terms-modal");
const privacyModal = document.getElementById("privacy-modal");

export function init() {
  function openModal(modal) {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closeModals() {
    overlay.classList.add("hidden");
    termsModal.classList.add("hidden");
    privacyModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  document.querySelectorAll(".js-terms-modal").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  });

  document.querySelectorAll(".js-privacy-modal").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  overlay.addEventListener("click", closeModals);

  document.querySelectorAll(".js-close-modal").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });
}

init();
