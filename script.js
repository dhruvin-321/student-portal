const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function(question) {
    question.addEventListener("click", function() {
        const answer = question.nextElementSibling;

        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
}); 
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const studentModal = document.getElementById("studentModal");

if (openModal && closeModal && studentModal) {
    openModal.addEventListener("click", function() {
        studentModal.style.display = "flex";
    });

    closeModal.addEventListener("click", function() {
        studentModal.style.display = "none";
    });

    studentModal.addEventListener("click", function(event) {
        if (event.target === studentModal) {
            studentModal.style.display = "none";
        }
    });
}
const slides = document.querySelectorAll(".slide");
const previousSlide = document.getElementById("previousSlide");
const nextSlide = document.getElementById("nextSlide");

let currentSlide = 0;

function showSlide(index) {
    slides.forEach(function(slide) {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

if (slides.length > 0 && previousSlide && nextSlide) {
    nextSlide.addEventListener("click", function() {
        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    });

    previousSlide.addEventListener("click", function() {
        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    });
}
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function() {
        navMenu.classList.toggle("show-menu");

        const isOpen = navMenu.classList.contains("show-menu");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
}
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("studentHubTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "Light Mode";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    }

    themeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-theme");

        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("studentHubTheme", "dark");
            themeToggle.textContent = "Light Mode";
            themeToggle.setAttribute("aria-label", "Switch to light mode");
        } else {
            localStorage.setItem("studentHubTheme", "light");
            themeToggle.textContent = "Dark Mode";
            themeToggle.setAttribute("aria-label", "Switch to dark mode");
        }
    });
} 

const closeBanner = document.getElementById("closeBanner");
const notificationBanner = document.getElementById("notificationBanner");

if (closeBanner && notificationBanner) {
    closeBanner.addEventListener("click", function() {
        notificationBanner.classList.add("hidden");
    });
}