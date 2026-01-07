// Static imports
import.meta.glob(["../images/**", "../fonts/**"]);

// Register components for glob import (so Vite includes them in the build)
const modules = import.meta.glob("./components/**/*.js");

// Component config array
const components = [
  { selector: ".js-intro_form", path: "./components/ageCheck.js" },
  { selector: "#recipes", path: "./components/recipes.js" },
  { selector: ".js-modals", path: "./components/modals.js" },
  { selector: ".js-form_validation", path: "./components/form.js" },
];

// Loop through and conditionally load
document.addEventListener("DOMContentLoaded", () => {
  components.forEach(({ selector, path }) => {
    if (document.querySelector(selector)) {
      const loader = modules[path];
      if (loader) {
        loader()
          .then(({ init }) => {
            if (typeof init === "function") init();
          })
          .catch((err) => console.error(`Failed to load ${path}`, err));
      } else {
        console.warn(`Component not found in modules: ${path}`);
      }
    }
  });
});
