export function goToStep(fromStep, toStep) {
  const from = document.querySelector(`[data-step="${fromStep}"]`);
  const to = document.querySelector(`[data-step="${toStep}"]`);

  if (!from || !to) return;

  // Fade out current
  from.classList.add("opacity-0");
  to.classList.remove("hidden");

  // After fade-out, fade in next
  setTimeout(() => {
    from.style.display = "none";
    window.scrollTo(0, 0); // scroll to top
    to.style.display = "";
    to.classList.add("is-visible");
  }, 400);
}
