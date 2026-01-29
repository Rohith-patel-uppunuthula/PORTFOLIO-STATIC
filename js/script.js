// ========================================
// GOD-TIER MINIMALIST PORTFOLIO - JAVASCRIPT
// ========================================

// ========================================
// 1. NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ========================================
// 2. MOBILE MENU TOGGLE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// 3. SMOOTH SCROLL FOR NAVIGATION LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 4. SCROLL ANIMATIONS (AOS)
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add staggered delay for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                const items = entry.target.parentElement.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('aos-animate');
                    }, index * 150);
                });
            } else {
                entry.target.classList.add('aos-animate');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with [data-aos] and timeline items
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// Also observe timeline containers for staggered animation
document.querySelectorAll('.timeline').forEach(timeline => {
    const firstItem = timeline.querySelector('.timeline-item');
    if (firstItem) {
        observer.observe(firstItem);
    }
});

// ========================================
// 5. TIMELINE ITEM ANIMATIONS
// ========================================

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Add animation styles for timeline items
const timelineStyle = document.createElement('style');
timelineStyle.textContent = `
    .timeline-item {
        opacity: 0;
        transform: translateX(-20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .timeline-item.aos-animate {
        opacity: 1;
        transform: translateX(0);
    }

    .timeline-item:nth-child(1) { transition-delay: 0s; }
    .timeline-item:nth-child(2) { transition-delay: 0.15s; }
    .timeline-item:nth-child(3) { transition-delay: 0.3s; }
    .timeline-item:nth-child(4) { transition-delay: 0.45s; }
`;
document.head.appendChild(timelineStyle);

// ========================================
// 6. CONTACT FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;
    formMessage.classList.add('hidden');

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });

        const result = await response.json();

        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;

        if (response.ok && result.success) {
            showFormMessage('success', 'Thank you! Your message has been sent. I\'ll get back to you soon.');
            contactForm.reset();
        } else {
            showFormMessage('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
        showFormMessage('error', 'Connection error. Please check your internet and try again.');
        console.error('Form submission error:', error);
    }
});

function showFormMessage(type, message) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');

    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

// ========================================
// 7. FORM VALIDATION
// ========================================

const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
        }
    });
});

function validateInput(input) {
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('error');
        return false;
    }

    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            input.classList.add('error');
            return false;
        }
    }

    input.classList.remove('error');
    return true;
}

const validationStyle = document.createElement('style');
validationStyle.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #f87171;
        background-color: #fef2f2;
    }

    .form-group input.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
    }
`;
document.head.appendChild(validationStyle);

// ========================================
// 8. SCROLL TO TOP ON LOGO CLICK
// ========================================

document.querySelector('.logo').addEventListener('click', (e) => {
    if (window.location.hash) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        history.pushState(null, null, window.location.pathname);
    }
});

// ========================================
// 9. PERFORMANCE: DEBOUNCE
// ========================================

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// 10. ACTIVE NAV LINK HIGHLIGHTING
// ========================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(highlightNavLink, 10));

// ========================================
// 11. KEYBOARD NAVIGATION
// ========================================

menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
    }
});

// ========================================
// 12. PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

const loadStyle = document.createElement('style');
loadStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadStyle);

// ========================================
// 13. SKILL CATEGORY HOVER EFFECT
// ========================================

document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });

    category.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// 14. CONSOLE MESSAGE
// ========================================

console.log('%cHey there!', 'font-size: 20px; font-weight: bold; color: #0D0D0D;');
console.log('%cInterested in the code? Check out the source!', 'font-size: 14px; color: #525252;');
console.log('%cBuilt with vanilla HTML, CSS, and JavaScript', 'font-size: 12px; color: #8A8A8A;');

// ========================================
// 15. LAZY LOADING IMAGES
// ========================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
}

// ========================================
// 16. SCROLL INDICATOR FADE
// ========================================

const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 10));
}

// ========================================
// END OF SCRIPT
// ========================================
