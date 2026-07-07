/**
 * DevRise Agency - Landing Page Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Theme Toggle Logic
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme'); // default
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // ----------------------------------------------------
    // Mobile Hamburger Menu Toggle
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scroll when menu is active
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // ----------------------------------------------------
    // Header Scroll Styling Change
    // ----------------------------------------------------
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // Active Link Highlighting on Scroll
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // trigger when 60% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ----------------------------------------------------
    // Testimonial Auto Slider
    // ----------------------------------------------------
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    const dots = Array.from(dotsContainer.children);
    
    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 seconds

    const updateSlider = (index) => {
        // Handle boundaries
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Slide transform
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;

        // Update Dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    };

    // Next Slide handler
    const nextSlide = () => {
        updateSlider(currentIndex + 1);
    };

    // Previous Slide handler
    const prevSlide = () => {
        updateSlider(currentIndex - 1);
    };

    // Button event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    // Dot navigation listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
            resetTimer();
        });
    });

    // Auto sliding timer setup
    const startTimer = () => {
        slideInterval = setInterval(nextSlide, slideDuration);
    };

    const resetTimer = () => {
        clearInterval(slideInterval);
        startTimer();
    };

    // Pause on hover
    const sliderContainer = document.querySelector('.testimonial-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        startTimer();
    });

    // Start Slider
    startTimer();

    // ----------------------------------------------------
    // Contact Form Validation and Submission
    // ----------------------------------------------------
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper to display error message
    const setError = (input, show = true) => {
        const group = input.parentElement;
        if (show) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    };

    // Live validation check on input event / text typing
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            setError(nameInput, false);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailRegex.test(emailInput.value.trim())) {
            setError(emailInput, false);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            setError(messageInput, false);
        }
    });

    // Submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn') || form.querySelector('button[type="submit"]') || form.querySelector('button');
        const formStatus = document.getElementById('form-status') || document.querySelector('.form-status');
        
        let isValid = true;

        try {
            // Name validate
            if (nameInput && nameInput.value.trim() === '') {
                setError(nameInput, true);
                isValid = false;
            } else if (nameInput) {
                setError(nameInput, false);
            }

            // Email validate
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                setError(emailInput, true);
                isValid = false;
            } else if (emailInput) {
                setError(emailInput, false);
            }

            // Message validate
            if (messageInput && messageInput.value.trim() === '') {
                setError(messageInput, true);
                isValid = false;
            } else if (messageInput) {
                setError(messageInput, false);
            }

            // If validation fails, show error message and stop
            if (!isValid) {
                if (formStatus) {
                    formStatus.textContent = 'Please fill out all fields correctly.';
                    formStatus.style.display = 'block';
                    formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
                    formStatus.style.color = '#ef4444';
                    formStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }
                return;
            }

            // If everything is valid, simulate submission
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
            
            // Set loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            // Simulate server network delay (1 second)
            setTimeout(() => {
                // Success handling
                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully! We will get back to you shortly.';
                    formStatus.style.display = 'block';
                    formStatus.style.background = 'rgba(34, 197, 94, 0.1)';
                    formStatus.style.color = '#22c55e';
                    formStatus.style.border = '1px solid rgba(34, 197, 94, 0.2)';
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset form fields
                form.reset();
                
                // Reset labels to normal state
                document.querySelectorAll('.form-input').forEach(input => {
                    input.blur();
                });

                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }

                // Hide message after 5 seconds
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.style.display = 'none';
                    }
                }, 5000);

            }, 1000);

        } catch (err) {
            console.error('Submit handler error:', err);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
    });
});
