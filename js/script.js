// ========================================
// GOD-TIER MINIMALIST PORTFOLIO
// Silicon Valley Level JavaScript
// ========================================

(function() {
    'use strict';

    // ========================================
    // 1. UTILITY FUNCTIONS
    // ========================================

    // Debounce for performance
    const debounce = (func, wait = 10, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    };

    // Throttle for scroll events
    const throttle = (func, limit = 16) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Linear interpolation for smooth animations
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // Clamp value between min and max
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    // Check for reduced motion preference
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Check if device supports hover (desktop)
    const supportsHover = () => {
        return window.matchMedia('(hover: hover)').matches;
    };

    // ========================================
    // 2. CUSTOM CURSOR
    // ========================================

    class CustomCursor {
        constructor() {
            if (!supportsHover() || prefersReducedMotion()) return;

            this.cursor = null;
            this.cursorDot = null;
            this.cursorOutline = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.cursorX = 0;
            this.cursorY = 0;
            this.outlineX = 0;
            this.outlineY = 0;
            this.isVisible = false;
            this.isHovering = false;
            this.isClicking = false;

            this.init();
        }

        init() {
            this.createCursor();
            this.bindEvents();
            this.render();
        }

        createCursor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'cursor';

            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'cursor-dot';

            this.cursorOutline = document.createElement('div');
            this.cursorOutline.className = 'cursor-outline';

            this.cursor.appendChild(this.cursorDot);
            this.cursor.appendChild(this.cursorOutline);
            document.body.appendChild(this.cursor);
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                if (!this.isVisible) {
                    this.isVisible = true;
                    this.cursor.classList.add('visible');
                }
            });

            document.addEventListener('mouseenter', () => {
                this.isVisible = true;
                this.cursor.classList.add('visible');
            });

            document.addEventListener('mouseleave', () => {
                this.isVisible = false;
                this.cursor.classList.remove('visible');
            });

            document.addEventListener('mousedown', () => {
                this.isClicking = true;
                this.cursor.classList.add('clicking');
            });

            document.addEventListener('mouseup', () => {
                this.isClicking = false;
                this.cursor.classList.remove('clicking');
            });

            // Hover effects for interactive elements
            const hoverElements = document.querySelectorAll(
                'a, button, .btn, .project-card, .skill-category, .social-icon, .timeline-tag, .tech-badge, input, textarea'
            );

            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.isHovering = true;
                    this.cursor.classList.add('hovering');
                });

                el.addEventListener('mouseleave', () => {
                    this.isHovering = false;
                    this.cursor.classList.remove('hovering');
                });
            });
        }

        render() {
            // Smooth interpolation for cursor movement
            const dotSpeed = 0.35;
            const outlineSpeed = 0.15;

            this.cursorX = lerp(this.cursorX, this.mouseX, dotSpeed);
            this.cursorY = lerp(this.cursorY, this.mouseY, dotSpeed);
            this.outlineX = lerp(this.outlineX, this.mouseX, outlineSpeed);
            this.outlineY = lerp(this.outlineY, this.mouseY, outlineSpeed);

            this.cursorDot.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`;
            this.cursorOutline.style.transform = `translate(${this.outlineX}px, ${this.outlineY}px) translate(-50%, -50%)`;

            requestAnimationFrame(() => this.render());
        }
    }

    // ========================================
    // 3. SCROLL PROGRESS INDICATOR
    // ========================================

    class ScrollProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }

        init() {
            this.createProgressBar();
            this.bindEvents();
        }

        createProgressBar() {
            const container = document.createElement('div');
            container.className = 'scroll-progress';

            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress-bar';

            container.appendChild(this.progressBar);
            document.body.appendChild(container);
        }

        bindEvents() {
            window.addEventListener('scroll', throttle(() => {
                this.updateProgress();
            }, 16));
        }

        updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    // ========================================
    // 4. MAGNETIC BUTTONS
    // ========================================

    class MagneticButton {
        constructor(element) {
            if (prefersReducedMotion() || !supportsHover()) return;

            this.element = element;
            this.boundingRect = null;
            this.strength = 0.3;
            this.init();
        }

        init() {
            this.element.addEventListener('mouseenter', () => {
                this.boundingRect = this.element.getBoundingClientRect();
            });

            this.element.addEventListener('mousemove', (e) => {
                this.moveMagnet(e);
            });

            this.element.addEventListener('mouseleave', () => {
                this.resetMagnet();
            });
        }

        moveMagnet(e) {
            if (!this.boundingRect) return;

            const centerX = this.boundingRect.left + this.boundingRect.width / 2;
            const centerY = this.boundingRect.top + this.boundingRect.height / 2;

            const deltaX = (e.clientX - centerX) * this.strength;
            const deltaY = (e.clientY - centerY) * this.strength;

            this.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }

        resetMagnet() {
            this.element.style.transform = 'translate(0, 0)';
        }
    }

    // ========================================
    // 5. SMOOTH REVEAL ANIMATIONS
    // ========================================

    class ScrollReveal {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            this.elements = document.querySelectorAll('[data-aos]');

            if (prefersReducedMotion()) {
                this.elements.forEach(el => el.classList.add('aos-animate'));
                return;
            }

            this.createObserver();
        }

        createObserver() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -80px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.aosDelay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('aos-animate');
                        }, parseInt(delay));
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // 6. TIMELINE ANIMATIONS
    // ========================================

    class TimelineAnimation {
        constructor() {
            this.init();
        }

        init() {
            const timelines = document.querySelectorAll('.timeline');

            if (prefersReducedMotion()) {
                document.querySelectorAll('.timeline-item').forEach(item => {
                    item.classList.add('aos-animate');
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const items = entry.target.querySelectorAll('.timeline-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('aos-animate');
                            }, index * 150);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            });

            timelines.forEach(timeline => observer.observe(timeline));
        }
    }

    // ========================================
    // 7. NAVBAR CONTROLLER
    // ========================================

    class NavbarController {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.menuToggle = document.getElementById('menuToggle');
            this.navMenu = document.getElementById('navMenu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');
            this.lastScroll = 0;

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Scroll effect
            window.addEventListener('scroll', throttle(() => {
                this.handleScroll();
                this.highlightActiveLink();
            }, 16));

            // Mobile menu toggle
            this.menuToggle.addEventListener('click', () => this.toggleMenu());

            // Close menu on link click
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container') && this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });

            // Keyboard accessibility
            this.menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMenu();
                }
            });
        }

        handleScroll() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }

        highlightActiveLink() {
            const scrollPosition = window.scrollY + this.navbar.offsetHeight + 100;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        }

        toggleMenu() {
            this.menuToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';

            const isExpanded = this.menuToggle.classList.contains('active');
            this.menuToggle.setAttribute('aria-expanded', isExpanded);
        }

        closeMenu() {
            this.menuToggle.classList.remove('active');
            this.navMenu.classList.remove('active');
            document.body.style.overflow = '';
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // ========================================
    // 8. SMOOTH SCROLL
    // ========================================

    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();

                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') {
                        this.scrollToTop();
                        return;
                    }

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        this.scrollToElement(targetElement);
                    }
                });
            });

            // Logo click scrolls to top
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollToTop();
                    history.pushState(null, null, window.location.pathname);
                });
            }
        }

        scrollToElement(element) {
            const navbar = document.getElementById('navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = element.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion() ? 'auto' : 'smooth'
            });
        }
    }

    // ========================================
    // 9. CONTACT FORM HANDLER
    // ========================================

    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            if (!this.form) return;

            this.submitBtn = this.form.querySelector('.submit-btn');
            this.btnText = this.submitBtn.querySelector('.btn-text');
            this.btnLoading = this.submitBtn.querySelector('.btn-loading');
            this.formMessage = document.getElementById('formMessage');
            this.inputs = this.form.querySelectorAll('input, textarea');

            this.init();
        }

        init() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateInput(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        input.classList.remove('error');
                    }
                });
            });
        }

        async handleSubmit(e) {
            e.preventDefault();

            // Validate all inputs
            let isValid = true;
            this.inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Show loading state
            this.setLoading(true);

            try {
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData);

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    this.showMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                    this.form.reset();
                } else {
                    this.showMessage('error', result.message || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showMessage('error', 'Connection error. Please check your internet and try again.');
            } finally {
                this.setLoading(false);
            }
        }

        validateInput(input) {
            const value = input.value.trim();

            if (input.hasAttribute('required') && !value) {
                input.classList.add('error');
                return false;
            }

            if (input.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    input.classList.add('error');
                    return false;
                }
            }

            input.classList.remove('error');
            return true;
        }

        setLoading(isLoading) {
            this.submitBtn.disabled = isLoading;
            this.btnText.classList.toggle('hidden', isLoading);
            this.btnLoading.classList.toggle('hidden', !isLoading);
        }

        showMessage(type, message) {
            this.formMessage.textContent = message;
            this.formMessage.className = `form-message ${type}`;
            this.formMessage.classList.remove('hidden');

            if (type === 'success') {
                setTimeout(() => {
                    this.formMessage.classList.add('hidden');
                }, 6000);
            }
        }
    }

    // ========================================
    // 10. SCROLL INDICATOR
    // ========================================

    class ScrollIndicator {
        constructor() {
            this.indicator = document.querySelector('.scroll-indicator');
            if (!this.indicator) return;

            this.init();
        }

        init() {
            window.addEventListener('scroll', debounce(() => {
                if (window.scrollY > 100) {
                    this.indicator.style.opacity = '0';
                    this.indicator.style.pointerEvents = 'none';
                } else {
                    this.indicator.style.opacity = '1';
                    this.indicator.style.pointerEvents = 'auto';
                }
            }, 10));
        }
    }

    // ========================================
    // 11. TEXT SPLIT ANIMATION
    // ========================================

    class TextSplitter {
        constructor() {
            if (prefersReducedMotion()) return;
            this.init();
        }

        init() {
            const elements = document.querySelectorAll('[data-split-text]');

            elements.forEach(el => {
                const text = el.textContent;
                el.innerHTML = '';
                el.classList.add('split-text');

                text.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.transitionDelay = `${i * 0.03}s`;
                    el.appendChild(span);
                });

                // Animate when in view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                el.classList.add('animate');
                            }, 100);
                            observer.unobserve(el);
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(el);
            });
        }
    }

    // ========================================
    // 12. HOVER EFFECTS ENHANCEMENT
    // ========================================

    class HoverEffects {
        constructor() {
            if (prefersReducedMotion()) return;
            this.init();
        }

        init() {
            // Project cards tilt effect
            document.querySelectorAll('.project-card:not(.project-card-placeholder)').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });

            // Skill categories
            document.querySelectorAll('.skill-category').forEach(category => {
                category.addEventListener('mousemove', (e) => {
                    const rect = category.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    category.style.setProperty('--mouse-x', `${x}px`);
                    category.style.setProperty('--mouse-y', `${y}px`);
                });
            });
        }
    }

    // ========================================
    // 13. PAGE LOAD ANIMATION
    // ========================================

    class PageLoader {
        constructor() {
            this.init();
        }

        init() {
            // Wait for all content to load
            if (document.readyState === 'complete') {
                this.onLoad();
            } else {
                window.addEventListener('load', () => this.onLoad());
            }
        }

        onLoad() {
            // Small delay for smoother perception
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        }
    }

    // ========================================
    // 14. CONSOLE BRANDING
    // ========================================

    class ConsoleBranding {
        constructor() {
            this.init();
        }

        init() {
            const styles = {
                title: 'font-size: 24px; font-weight: bold; color: #0A0A0A; font-family: Georgia, serif;',
                subtitle: 'font-size: 14px; color: #525252; font-family: -apple-system, sans-serif;',
                detail: 'font-size: 12px; color: #8A8A8A; font-family: -apple-system, sans-serif;'
            };

            console.log('%cROHITH.', styles.title);
            console.log('%cFull-Stack Developer', styles.subtitle);
            console.log('%c', '');
            console.log('%cBuilt with vanilla HTML, CSS & JavaScript', styles.detail);
            console.log('%cNo frameworks, just clean code.', styles.detail);
            console.log('%c', '');
            console.log('%cInterested in collaborating? Get in touch!', styles.subtitle);
        }
    }

    // ========================================
    // 15. LAZY LOADING
    // ========================================

    class LazyLoader {
        constructor() {
            this.init();
        }

        init() {
            if ('loading' in HTMLImageElement.prototype) {
                // Native lazy loading supported
                document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                });
            } else {
                // Fallback for older browsers
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }
    }

    // ========================================
    // 16. CURRENT YEAR UPDATE
    // ========================================

    class YearUpdater {
        constructor() {
            this.init();
        }

        init() {
            const yearElements = document.querySelectorAll('.current-year');
            const currentYear = new Date().getFullYear();

            yearElements.forEach(el => {
                el.textContent = currentYear;
            });
        }
    }

    // ========================================
    // 17. INITIALIZATION
    // ========================================

    class App {
        constructor() {
            this.init();
        }

        init() {
            // Core functionality
            new PageLoader();
            new NavbarController();
            new SmoothScroll();
            new ContactForm();
            new LazyLoader();
            new YearUpdater();

            // Visual enhancements
            new ScrollProgress();
            new ScrollReveal();
            new TimelineAnimation();
            new ScrollIndicator();
            new HoverEffects();
            new ConsoleBranding();

            // Premium features (desktop only)
            if (supportsHover()) {
                new CustomCursor();
                new TextSplitter();

                // Apply magnetic effect to primary buttons
                document.querySelectorAll('.btn-primary').forEach(btn => {
                    new MagneticButton(btn);
                });
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new App());
    } else {
        new App();
    }

})();

// ========================================
// END OF SCRIPT
// ========================================
