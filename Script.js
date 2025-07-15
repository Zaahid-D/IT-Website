/**
 * ==============================================
 * CROSS-BROWSER COMPATIBILITY POLYFILLS SECTION
 * ==============================================
 * This section provides fallbacks for modern features
 * in older browsers to ensure consistent behavior.
 */

// Polyfill for scrollIntoView with smooth scrolling behavior
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function() {
        // Basic fallback implementation using requestAnimationFrame
        const targetPosition = this.getBoundingClientRect().top;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - 100; // 100px offset from top
        const duration = 500; // Animation duration in milliseconds
        let startTime = null;
        
        // Animation function that runs each frame
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }
        
        // Start the animation
        requestAnimationFrame(animation);
    };
}

// IntersectionObserver polyfill for older browsers
if (!('IntersectionObserver' in window)) {
    // Load polyfill from CDN if not available
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
    
    // Basic fallback for fade-in elements
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('fade-in-visible');
            });
        }, 500);
    });
}

/**
 * ==============================================
 * DYNAMIC NAVIGATION BAR FUNCTIONALITY
 * ==============================================
 * Highlights the current page in the navigation menu
 * and improves accessibility with ARIA attributes.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentUrl = window.location.href;
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navigationLink');
    
    // Loop through each navigation link
    navLinks.forEach(link => {
        // Clean comparison for relative/absolute paths using URL API
        const linkUrl = new URL(link.href);
        const currentPageUrl = new URL(currentUrl);
        
        // Compare pathnames (case-insensitive for server compatibility)
        if (linkUrl.pathname.toLowerCase() === currentPageUrl.pathname.toLowerCase()) {
            // Add active class for visual indication
            link.classList.add('active');
            
            // Add aria-current attribute for screen readers
            link.setAttribute('aria-current', 'page');
        }
    });
});

/**
 * ==============================================
 * FORM VALIDATION SYSTEM
 * ==============================================
 * Provides client-side validation for the contact form
 * with real-time feedback and success messaging.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('contactForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    
    // Insert success message after the form
    form.parentNode.insertBefore(successMessage, form.nextSibling);

    // Email validation regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear any previous errors

        // Validate form fields
        let isValid = validateForm();

        // If form is valid, process submission
        if (isValid) {
            // Visual feedback during submission
            form.style.opacity = '0.7';
            document.querySelector('.submit-button').disabled = true;
            
            // Simulate form processing 
            setTimeout(() => {
                handleFormSuccess(); // Show success message
                form.style.opacity = '1';
                document.querySelector('.submit-button').disabled = false;
            }, 1500);
        }
    });

    /**
     * Validates all form fields
     * @returns {boolean} True if all fields are valid, false otherwise
     */
    function validateForm() {
        let isValid = true;
        
        // Field configuration with validation rules
        const fields = [
            { id: 'name', error: 'Please enter your full name' },
            { id: 'email', error: 'Please enter your email', validation: validateEmail },
            { id: 'course', error: 'Please select a course' },
            { id: 'message', error: 'Please enter your message' }
        ];

        // Validate each field
        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const value = field.id === 'course' ? element.value : element.value.trim();
            
            // Check for empty required fields
            if (!value) {
                showError(field.id, field.error);
                isValid = false;
            } 
            // Run custom validation if provided
            else if (field.validation && !field.validation(value)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validates email format using regex
     * @param {string} email - The email to validate
     * @returns {boolean} True if email is valid
     */
    function validateEmail(email) {
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email (e.g., example@domain.com)');
            return false;
        }
        return true;
    }

    /**
     * Displays an error message for a form field
     * @param {string} fieldId - ID of the field with error
     * @param {string} message - Error message to display
     */
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
       
        // Create error element if it doesn't exist
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        // Add error styling and message
        field.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
       
        // Focus the first invalid field
        if (!document.querySelector('.input-error:focus')) {
            field.focus();
        }
    }

    /**
     * Clears all error messages and styling
     */
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
    }

    /**
     * Handles successful form submission
     */
    function handleFormSuccess() {
        // Display success message
        successMessage.textContent = 'Message sent successfully!';
        successMessage.style.display = 'block';
        
        // Reset form
        form.reset();
       
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

/**
 * ==============================================
 * INTERACTIVE COURSE DETAILS MODAL
 * ==============================================
 * Provides a modal popup with detailed course information
 * when users click on course titles.
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const courseTitles = document.querySelectorAll('.course-title');
    const modal = document.querySelector('.course-modal');
    const closeBtn = document.querySelector('.close-modal');
    let currentCourse = null; // Tracks currently open course

    // Add click handlers to all course titles
    courseTitles.forEach(title => {
        title.style.cursor = 'pointer'; // Visual cue that it's clickable
        
        title.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            const isSameCourse = currentCourse === courseCard;

            // Toggle modal if clicking same course
            if (isSameCourse) {
                closeModal();
                currentCourse = null;
            } else {
                // Open modal with new course data
                currentCourse = courseCard;
                const outline = courseCard.dataset.outline.split('|');
                const prerequisites = courseCard.dataset.prerequisites.split('|');
                const iconClass = courseCard.dataset.icon;
                
                populateModal(outline, prerequisites, title.textContent, iconClass);
                openModal();
            }
        });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Close when clicking backdrop
    });

    /**
     * Opens the course details modal
     */
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent page scrolling
    }

    /**
     * Closes the course details modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable page scrolling
        currentCourse = null;
    }

    /**
     * Populates the modal with course information
     * @param {Array} outline - Course outline items
     * @param {Array} prerequisites - Course prerequisites
     * @param {string} title - Course title
     * @param {string} iconClass - Font Awesome icon class
     */
    function populateModal(outline, prerequisites, title, iconClass) {
        const modalTitle = modal.querySelector('.modal-title');
        const outlineList = modal.querySelector('.outline-list');
        const prereqList = modal.querySelector('.prerequisites-list');

        // Set modal title with icon
        modalTitle.innerHTML = `
            <i class="fas ${iconClass}"></i>
            ${title}
        `;
        
        // Populate course outline
        outlineList.innerHTML = outline.map(item => `
            <li>${item}</li>
        `).join('');
        
        // Populate prerequisites
        prereqList.innerHTML = prerequisites.map(item => `
            <li>${item}</li>
        `).join('');
    }

    // Close modal when pressing ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

/**
 * ==============================================
 * TESTIMONIALS CAROUSEL COMPONENT
 * ==============================================
 * Creates an auto-scrolling carousel of testimonials
 * with hover effects and touch support.
 */
function initTestimonials() {
    // Testimonial data array
    const testimonials = [
        {
            content: "SkillSphere transformed my career! The web development course gave me real-world skills that helped me land my dream job at a top tech company.",
            author: {
                name: "Amara Ndlovu",
                role: "Frontend Developer",
                image: "Images/Testimonial1.png",
                achievement: "fa-trophy"
            }
        },
        {
            content: "The AI & ML course was incredible. I went from basic Python to building neural networks in just 3 months. Highly recommended!",
            author: {
                name: "Tariq Hassan",
                role: "AI Engineer",
                image: "Images/Testimonial2.png",
                achievement: "fa-rocket"
            }
        },
        {
            content: "The flexible learning options allowed me to upskill while working full-time. The cloud computing course directly helped me get a promotion!",
            author: {
                name: "Aaliyah Rahimi",
                role: "Cloud Architect",
                image: "Images/Testimonial3.png",
                achievement: "fa-medal"
            }
        },
        {
            content: "The cybersecurity course gave me practical skills that I applied immediately in my job. Best investment in my education ever!",
            author: {
                name: "Luca Romano",
                role: "Security Analyst",
                image: "Images/Testimonial4.png",
                achievement: "fa-shield-alt"
            }
        },
        {
            content: "I transitioned from marketing to tech thanks to SkillSphere's data science program. The career support was invaluable!",
            author: {
                name: "Sofia Fernández",
                role: "Data Scientist",
                image: "Images/Testimonial5.png",
                achievement: "fa-chart-line"
            }
        },
        {
            content: "The mobile development course had perfect balance between theory and practice. I published my first app within 3 months!",
            author: {
                name: "Kenji Yamamoto",
                role: "Mobile Developer",
                image: "Images/Testimonial6.png",
                achievement: "fa-mobile-alt"
            }
        }
    ];

    // DOM setup
    const carousel = document.getElementById('testimonialsCarousel');
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    carousel.appendChild(wrapper);

    // Duplicate testimonials for seamless looping
    const duplicatedTestimonials = [...testimonials, ...testimonials];
    
    // Create testimonial cards
    duplicatedTestimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-content">
                ${testimonial.content}
            </div>
            <div class="testimonial-author">
                <div class="author-image">
                    <img src="${testimonial.author.image}" alt="${testimonial.author.name}">
                    <div class="achievement-badge">
                        <i class="fas ${testimonial.author.achievement}"></i>
                    </div>
                </div>
                <div class="author-details">
                    <div class="author-name">${testimonial.author.name}</div>
                    <div class="author-role">${testimonial.author.role}</div>
                </div>
            </div>
        `;
        wrapper.appendChild(card);
    });

    // Animation variables
    let scrollPos = 0;
    let animationFrame;
    let isHovering = false;
    const speed = 0.7; // Scroll speed adjustment

    /**
     * Animation loop for continuous scrolling
     */
    function animate() {
        if(!isHovering) {
            scrollPos += speed;
            
            // Reset position when reaching halfway for seamless loop
            if(scrollPos >= wrapper.scrollWidth / 2) {
                scrollPos = 0;
            }
            
            wrapper.style.transform = `translateX(-${scrollPos}px)`;
        }
        animationFrame = requestAnimationFrame(animate);
    }

    // Pause animation on hover
    carousel.addEventListener('mouseenter', () => {
        isHovering = true;
        wrapper.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    // Resume animation when mouse leaves
    carousel.addEventListener('mouseleave', () => {
        isHovering = false;
        wrapper.style.transition = 'none';
    });

    // Card hover effects
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.08) translateZ(30px)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateZ(0)';
            card.style.zIndex = '1';
        });
    });

    // Touch/swipe support for mobile devices
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        isHovering = true;
    });

    carousel.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if(Math.abs(diff) > 50) {
            scrollPos += diff > 0 ? 100 : -100;
        }
        isHovering = false;
    });

    // Start the animation
    animate();

    // Cleanup function
    return () => cancelAnimationFrame(animationFrame);
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', initTestimonials);

/**
 * ==============================================
 * SMOOTH SCROLLING AND ANIMATION SYSTEM
 * ==============================================
 * Handles smooth scrolling for anchor links and
 * intersection-based animations with performance optimizations.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use native smooth scrolling when available
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in effects
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjusts the viewport area
    });

    // Observe all fade-in elements
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // Scroll event throttling for performance
    let lastScrollTime = 0;
    window.addEventListener('scroll', function() {
        const now = new Date().getTime();
        if (now - lastScrollTime > 100) { // Throttle to 100ms
            lastScrollTime = now;
            // Any scroll-dependent logic would go here
        }
    }, { passive: true }); // Optimize scrolling performance
});

/**
 * ==============================================
 * STATISTICS COUNTER ANIMATION
 * ==============================================
 * Animates number counters when they come into view.
 */
const counters = document.querySelectorAll('.stat-value');
let hasAnimated = false;

// Intersection Observer for counter animation
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !hasAnimated) {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const count = +counter.innerText.replace(/[^0-9]/g, '');
                const increment = Math.ceil(target / 100); // Smooth increment

                if (count < target) {
                    counter.innerText = `${count + increment}${suffix}`;
                    setTimeout(updateCount, 30); // Continue animation
                } else {
                    // Final formatted value
                    counter.innerText = `${target.toLocaleString()}${suffix}`;
                }
            };
            updateCount();
        });
        hasAnimated = true; // Prevent re-animation
    }
}, { threshold: 0.5 }); // Trigger when 50% visible

// Start observing if counters exist
if (counters.length > 0) {
    observer.observe(counters[0].parentElement);
}