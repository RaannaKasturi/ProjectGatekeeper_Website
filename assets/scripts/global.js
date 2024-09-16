// Dark-Light mode switcher
document.addEventListener("DOMContentLoaded", (event) => {
  const htmlElement = document.documentElement;
  const switchElements = document.querySelectorAll(".theme-switcher-btn"); // Select all theme switcher buttons
  const sunIcon = "bi-sun";
  const moonIcon = "bi-moon";
  const currentTheme = localStorage.getItem("bsTheme") || "dark";
  htmlElement.setAttribute("data-bs-theme", currentTheme);
  switchElements.forEach((switchElement) => {
    switchElement.querySelector("i").className =
      currentTheme === "dark" ? sunIcon : moonIcon;
    switchElement.addEventListener("click", function () {
      const newTheme =
        htmlElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      htmlElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("bsTheme", newTheme);
      switchElements.forEach((switchElement) => {
        switchElement.querySelector("i").className =
          newTheme === "dark" ? sunIcon : moonIcon;
      });
    });
  });
});

// back to top button
let mybutton = document.getElementById("btn-back-to-top");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
mybutton.addEventListener("click", backToTop);
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Copy function using Clipboard API
function copyText(copyId) {
  const textArea = document.getElementById(copyId);
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textArea.value)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  } else {
    // Fallback for older browsers
    textArea.select();
    document.execCommand("copy");
  }
}

// Download function
function downloadText(filename) {
  const textArea = document.getElementById("csrdata").value;
  const blob = new Blob([textArea], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
