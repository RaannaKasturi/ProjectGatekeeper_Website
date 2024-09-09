// Dark-Light mode switcher
document.addEventListener('DOMContentLoaded', (event) => {
    const htmlElement = document.documentElement;
    const switchElements = document.querySelectorAll('.theme-switcher-btn'); // Select all theme switcher buttons
    const sunIcon = 'bi-sun';
    const moonIcon = 'bi-moon';
    // Set the default theme based on local storage or default to dark
    const currentTheme = localStorage.getItem('bsTheme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    // Update button icons based on the current theme
    switchElements.forEach(switchElement => {
        switchElement.querySelector('i').className = currentTheme === 'dark' ? sunIcon : moonIcon;
        switchElement.addEventListener('click', function () {
            const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('bsTheme', newTheme);
            // Update button icons after theme switch
            switchElements.forEach(switchElement => {
                switchElement.querySelector('i').className = newTheme === 'dark' ? sunIcon : moonIcon;
            });
        });
    });
});

// back to top button
let mybutton = document.getElementById("btn-back-to-top");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};
function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
