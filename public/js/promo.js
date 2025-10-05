document.addEventListener("DOMContentLoaded", function () {
    // Initialize Swiper for Product Showcase
    if (document.querySelector(".product-swiper")) {
        new Swiper(".product-swiper", {
            slidesPerView: 1,
            spaceBetween: 25, // Adjusted space
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                576: {
                    // Small devices
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    // Medium devices
                    slidesPerView: 3,
                    spaceBetween: 25
                },
                992: {
                    // Large devices
                    slidesPerView: 3, // Kept 3 for better visibility
                    spaceBetween: 30
                },
                1200: {
                    // Extra large devices
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    }

    // Initialize Swiper for Testimonials
    if (document.querySelector(".testimonial-slider")) {
        new Swiper(".testimonial-slider", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5500, // Slightly longer delay
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                992: {
                    slidesPerView: 2, // Keep 2 for testimonials for better readability
                    spaceBetween: 30
                },
                1200: {
                    slidesPerView: 3, // Show 3 on larger screens
                    spaceBetween: 30
                }
            }
        });
    }

    // Initialize Flatpickr for Date Picker
    if (document.getElementById("consultDate")) {
        flatpickr("#consultDate", {
            altInput: true,
            altFormat: "F j, Y", // More readable format
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: "true" // Use native date picker on mobile for better UX
        });
    }

    // Form Validations
    function handleFormSubmission(formId, feedbackElementId, successMessage) {
        const form = document.getElementById(formId);
        const feedbackElement = document.getElementById(feedbackElementId);

        if (form && feedbackElement) {
            // Ensure elements exist
            form.addEventListener("submit", function (event) {
                event.preventDefault(); // Always prevent default first
                event.stopPropagation(); // Stop propagation

                if (form.checkValidity()) {
                    feedbackElement.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${successMessage}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
                    form.reset();
                    form.classList.remove("was-validated"); // Reset validation state
                } else {
                    feedbackElement.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                Please fill out all required fields correctly.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`;
                    form.classList.add("was-validated"); // Show validation feedback
                }
            });
        }
    }

    handleFormSubmission(
        "consultationForm",
        "consultationFormFeedback",
        "Thank you! Your consultation request has been submitted. We will contact you shortly to confirm."
    );
    handleFormSubmission(
        "newsletterForm",
        "newsletterFeedback",
        "Success! You are now subscribed to the PharmaSleek newsletter."
    );
    handleFormSubmission(
        "contactForm",
        "contactFormFeedback",
        "Message sent! Thank you for reaching out. We will get back to you as soon as possible."
    );

    // Set current year in footer
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});