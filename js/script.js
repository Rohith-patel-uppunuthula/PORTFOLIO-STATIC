// ========================================
// MINIMALIST PORTFOLIO - JAVASCRIPT
// ========================================

// ========================================
// 1. NAVBAR SCROLL EFFECT
// ========================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for navbar style
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
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
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
// 4. SCROLL ANIMATIONS (AOS - Animate On Scroll)
// ========================================

// Simple Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Optional: Stop observing after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with [data-aos] attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ========================================
// 5. CONTACT FORM HANDLING WITH WEB3FORMS
// ========================================

const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('.submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;
    formMessage.classList.add('hidden');
    
    try {
        // Send to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });
        
        const result = await response.json();
        
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
        
        if (response.ok && result.success) {
            // Success
            showFormMessage('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
            contactForm.reset();
        } else {
            // Error from Web3Forms
            showFormMessage('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        // Network or other error
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
        showFormMessage('error', 'Connection error. Please check your internet and try again.');
        console.error('Form submission error:', error);
    }
});

// Helper function to display form messages
function showFormMessage(type, message) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

// ========================================
// 6. FORM VALIDATION
// ========================================

const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    // Real-time validation feedback
    input.addEventListener('blur', () => {
        validateInput(input);
    });
    
    // Remove error state when user starts typing
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
    
    // Email validation
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

// Add error styling to CSS
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #f5a3a3;
        background-color: #fef9f9;
    }
`;
document.head.appendChild(style);

// ========================================
// 7. SCROLL TO TOP ON LOGO CLICK
// ========================================

document.querySelector('.logo').addEventListener('click', (e) => {
    if (window.location.hash) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Update URL without scrolling
        history.pushState(null, null, window.location.pathname);
    }
});

// ========================================
// 8. LAZY LOADING IMAGES (when you add them)
// ========================================

// This will work when you add actual images
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// 9. PERFORMANCE: DEBOUNCE SCROLL EVENTS
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

// Apply debounce to scroll handler if needed for performance
const debouncedScroll = debounce(() => {
    // Any additional scroll-based functionality
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// 10. ACCESSIBILITY: KEYBOARD NAVIGATION
// ========================================

// Trap focus in mobile menu when open
const focusableElements = 'a[href], button:not([disabled]), input:not([disabled])';

menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
    }
});

// ========================================
// 11. PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for page load
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    body {
        opacity: 0;
        animation: fadeIn 0.5s ease-in forwards;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(loadStyle);

// ========================================
// 12. CONSOLE MESSAGE (Easter Egg)
// ========================================

console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold;');
console.log('%cInterested in how this was built? Check out the code!', 'font-size: 14px; color: #666;');
console.log('%cBuilt with vanilla HTML, CSS, and JavaScript', 'font-size: 12px; color: #999;');

// ========================================
// 13. ACTIVE NAV LINK HIGHLIGHTING
// ========================================

// Highlight current section in navigation
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

// Add active link styling
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--color-hover);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navStyle);

// ========================================
// END OF SCRIPT
// ========================================