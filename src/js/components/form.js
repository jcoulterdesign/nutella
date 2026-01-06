const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("proof");
const fileName = document.getElementById("file-name");

// Prevent browser from opening file
["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
  dropzone.addEventListener(event, (e) => e.preventDefault());
});

// Visual feedback
["dragenter", "dragover"].forEach((event) => {
  dropzone.addEventListener(event, () => {
    dropzone.classList.add("border-white", "bg-white/10");
  });
});

["dragleave", "drop"].forEach((event) => {
  dropzone.addEventListener(event, () => {
    dropzone.classList.remove("border-white", "bg-white/10");
  });
});

// Handle drop
dropzone.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    showFileName(files[0]);
  }
});

// Handle normal browse
fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    showFileName(fileInput.files[0]);
  }
});

function showFileName(file) {
  fileName.textContent = `Selected file: ${file.name}`;
  fileName.classList.remove("hidden");
}
