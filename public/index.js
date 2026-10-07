document.addEventListener("DOMContentLoaded", () => {
    /* =========================================
       MOBILE MENU
       ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");

            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.textContent = isOpen ? "CLOSE" : "MENU";
        });

        /* Close menu after clicking a link */
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                document.body.classList.remove("menu-open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "MENU";
            });
        });
    }


    /* =========================================
       CUSTOM CURSOR
       ========================================= */

    const cursor = document.querySelector(".cursor-dot");

    if (
        cursor &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        document.addEventListener("mousemove", (event) => {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
        });

        /* Enlarge cursor over clickable elements */
        const clickableElements = document.querySelectorAll(
            "a, button, .service, .project, .skill-cloud span"
        );

        clickableElements.forEach((element) => {
            element.addEventListener("mouseenter", () => {
                cursor.style.width = "25px";
                cursor.style.height = "25px";
            });

            element.addEventListener("mouseleave", () => {
                cursor.style.width = "12px";
                cursor.style.height = "12px";
            });
        });
    }


    /* =========================================
       HEADER SCROLL EFFECT
       ========================================= */

    const header = document.querySelector(".site-header");

    if (header) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }


    /* =========================================
       REVEAL ANIMATION
       ========================================= */

    const revealElements = document.querySelectorAll(
        ".section, .service, .project, .process-grid > div"
    );

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            element.style.opacity = "0";
            element.style.transform = "translateY(30px)";
            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            observer.observe(element);
        });

        /* Add reveal state CSS */
        const revealStyle = document.createElement("style");

        revealStyle.textContent = `
            .section.visible,
            .service.visible,
            .project.visible,
            .process-grid > div.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;

        document.head.appendChild(revealStyle);
    }


    /* =========================================
       CONTACT FORM
       ========================================= */

    const contactForm = document.getElementById("contact-form");
    const contactSubmit = document.getElementById("contact-submit");
    const formStatus = document.getElementById("form-status");

    const messageInput = document.getElementById("message");
    const characterCount = document.getElementById("character-count");


    /* -----------------------------------------
       CHARACTER COUNTER
       ----------------------------------------- */

    if (messageInput && characterCount) {
        const updateCharacterCount = () => {
            const length = messageInput.value.length;

            characterCount.textContent = length;

            if (length > 1000) {
                messageInput.value = messageInput.value.substring(
                    0,
                    1000
                );

                characterCount.textContent = "1000";
            }
        };

        messageInput.addEventListener(
            "input",
            updateCharacterCount
        );

        updateCharacterCount();
    }


    /* -----------------------------------------
       FORM SUBMISSION
       ----------------------------------------- */

    if (
        contactForm &&
        contactSubmit &&
        formStatus
    ) {
        contactForm.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                /* Clear previous status */
                formStatus.textContent = "";
                formStatus.className = "form-status";

                /* Loading state */
                contactSubmit.classList.add("loading");
                contactSubmit.disabled = true;

                const formData = new FormData(contactForm);

                try {
                    const response = await fetch(
                        contactForm.action,
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept: "application/json"
                            }
                        }
                    );

                    const result = await response.json();

                    if (
                        response.ok &&
                        result.success
                    ) {
                        /* Success */
                        formStatus.textContent =
                            "MESSAGE SENT. THANK YOU — I'LL GET BACK TO YOU SOON.";

                        formStatus.classList.add(
                            "show",
                            "success"
                        );

                        /* Reset form */
                        contactForm.reset();

                        if (characterCount) {
                            characterCount.textContent = "0";
                        }
                    } else {
                        throw new Error(
                            result.message ||
                            "Something went wrong."
                        );
                    }
                } catch (error) {
                    /* Error */
                    formStatus.textContent =
                        "COULDN'T SEND YOUR MESSAGE. PLEASE TRY AGAIN.";

                    formStatus.classList.add(
                        "show",
                        "error"
                    );

                    console.error(
                        "Contact form error:",
                        error
                    );
                } finally {
                    /* Restore button */
                    contactSubmit.classList.remove("loading");
                    contactSubmit.disabled = false;
                }
            }
        );
    }
});