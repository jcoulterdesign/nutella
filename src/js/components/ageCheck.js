import { goToStep } from "./stepNavigation.js";

export function initAgeGate() {
  const input = document.getElementById("birth-year");
  const button = document.getElementById("age-submit");

  if (!input || !button) return;

  const INACTIVE_CLASS = "is-inactive";
  const ERROR_CLASS = "is-error";

  button.classList.add(INACTIVE_CLASS);

  const isValidYear = (value) => {
    return /^\d{4}$/.test(value);
  };

  const getAge = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  input.addEventListener("input", () => {
    input.classList.remove(ERROR_CLASS);

    if (isValidYear(input.value)) {
      button.classList.remove(INACTIVE_CLASS);
    } else {
      button.classList.add(INACTIVE_CLASS);
    }
  });

  button.addEventListener("click", () => {
    if (button.classList.contains(INACTIVE_CLASS)) return;

    const birthYear = parseInt(input.value, 10);
    const age = getAge(birthYear);

    if (age < 16) {
      input.classList.add(ERROR_CLASS);
      input.focus();
      return;
    }

    // CONFETTI
    if (typeof confetti === "function") {
      confetti({
        particleCount: 320,
        spread: 310,
        origin: { y: 0.5 },
      });
    }

    // transition to recipes after confetti pop
    setTimeout(() => {
      goToStep(1, 2);
    }, 300);
  });
}

initAgeGate();
