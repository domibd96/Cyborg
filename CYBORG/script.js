// CYBORG - Main JavaScript File
// This file contains all the interactive functionality for the CYBORG project

// Global variables
let isAnimating = false;
let currentSection = 0;
const sections = ['home', 'about', 'projects', 'contact'];

// DOM elements
let navLinks;
let sectionsElements;
let menuToggle;
let mobileMenu;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Force reload CSS to ensure latest styles are loaded
    const cssLink = document.querySelector('link[href*="style.css"]');
    if (cssLink) {
        cssLink.href = cssLink.href.split('?')[0] + '?v=' + Date.now();
    }
    
    initializeApp();
    setupEventListeners();
    startAnimations();
    startBlackMirrorIntro();
    setupContactForm();
});

// Initialize the application
function initializeApp() {
    console.log('CYBORG - Initializing application...');
    
    // Get DOM elements
    navLinks = document.querySelectorAll('.nav-link');
    sectionsElements = document.querySelectorAll('section');
    menuToggle = document.querySelector('.menu-toggle');
    mobileMenu = document.querySelector('.mobile-menu');
    
    // Set initial state
    setActiveSection(0);
    
    // Add loading animation
    document.body.classList.add('loaded');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            navigateToSection(targetSection);
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll animations
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

// Navigate to a specific section
function navigateToSection(sectionName) {
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active navigation
        setActiveSection(sections.indexOf(sectionName));
    }
}

// Set active section
function setActiveSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSection = index;
        
        // Update navigation links
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && mobileMenuToggle) {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    }
}

// Close mobile menu
function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && mobileMenuToggle) {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
}

// Handle scroll events
function handleScroll() {
    if (isAnimating) return;
    
    // Update active section based on scroll position
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sectionsElements.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(index);
        }
    });
    
    // Parallax effects
    applyParallaxEffects();
}

// Apply parallax effects
function applyParallaxEffects() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Handle keyboard navigation
function handleKeyboard(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
            e.preventDefault();
            navigateToPreviousSection();
            break;
        case 'ArrowDown':
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextSection();
            break;
        case 'Escape':
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            break;
    }
}

// Navigate to previous section
function navigateToPreviousSection() {
    const newIndex = Math.max(0, currentSection - 1);
    navigateToSection(sections[newIndex]);
}

// Navigate to next section
function navigateToNextSection() {
    const newIndex = Math.min(sections.length - 1, currentSection + 1);
    navigateToSection(sections[newIndex]);
}

// Start animations
function startAnimations() {
    // Animate elements on load
    const animatedElements = document.querySelectorAll('.animate-on-load');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, index * 200);
    });
    
    // Start particle animation if available
    if (typeof initParticles === 'function') {
        initParticles();
    }
}

// Black Mirror style intro animation
function startBlackMirrorIntro() {
    const letters = document.querySelectorAll('.letter');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const secretWords = ['FUTURE', 'SYSTEM'];
    const finalWord = 'CYBORG';
    
    // Global interval for character cycling
    let globalInterval;
    let currentCharIndex = 0;
    let wordShown = 0;
    
    // Start global character cycling
    globalInterval = setInterval(() => {
        // Show secret words briefly at specific times
        if (currentCharIndex === 15 && wordShown === 0) {
            letters.forEach((letter, index) => {
                letter.textContent = secretWords[0][index]; // FUTURE
            });
            setTimeout(() => {
                letters.forEach((letter, index) => {
                    letter.textContent = characters[currentCharIndex];
                });
            }, 150); // Show FUTURE for 150ms
            wordShown++;
        } else if (currentCharIndex === 35 && wordShown === 1) {
            letters.forEach((letter, index) => {
                letter.textContent = secretWords[1][index]; // SYSTEM
            });
            setTimeout(() => {
                letters.forEach((letter, index) => {
                    letter.textContent = characters[currentCharIndex];
                });
            }, 150); // Show SYSTEM for 150ms
            wordShown++;
        } else {
            letters.forEach((letter, index) => {
                letter.textContent = characters[currentCharIndex];
            });
        }
        
        currentCharIndex = (currentCharIndex + 1) % characters.length;
    }, 80);
    
    // Stop animation and show final word
    setTimeout(() => {
        if (globalInterval) {
            clearInterval(globalInterval);
        }
        
        // Set final word letter by letter with staggered delay
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.textContent = finalWord[index];
                letter.classList.add('final-letter');
            }, index * 200); // Staggered delay for each letter
        });
    }, 2500); // 2.5 seconds total animation time
}

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(handleScroll, 16);

// Reassign scroll handler
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScrollHandler);

// Contact form functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function selectPlan(plan) {
    const planSelect = document.getElementById('planSelect');
    if (planSelect) {
        planSelect.value = plan;
        // Scroll to contact form
        scrollToContact();
    }
}

// Form submission handling
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.querySelector('span').textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'SENDING...';
    submitButton.style.opacity = '0.7';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        plan: formData.get('plan'),
        message: formData.get('message')
    };
    
    // Submit to Python backend
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessMessage();
            form.reset();
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Entschuldigung, deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.');
    })
    .finally(() => {
        // Reset button state
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = originalText;
        submitButton.style.opacity = '1';
    });
}

function showSuccessMessage() {
    // Remove any existing popups
    const existingPopup = document.querySelector('.popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup using DOM methods instead of innerHTML
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay active';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    
    const popupIcon = document.createElement('div');
    popupIcon.className = 'popup-icon success';
    popupIcon.textContent = '✓';
    
    const popupTitle = document.createElement('h3');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = 'NACHRICHT GESENDET';
    
    const popupMessage = document.createElement('p');
    popupMessage.className = 'popup-message';
    popupMessage.textContent = 'Vielen Dank für deine Nachricht an CYBORG. Deine Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei dir.';
    
    const popupButton = document.createElement('button');
    popupButton.className = 'popup-button';
    popupButton.onclick = closePopup;
    
    const buttonSpan = document.createElement('span');
    buttonSpan.textContent = 'BESTÄTIGEN';
    
    const buttonGlow = document.createElement('div');
    buttonGlow.className = 'button-glow';
    
    popupButton.appendChild(buttonSpan);
    popupButton.appendChild(buttonGlow);
    
    popupContainer.appendChild(popupIcon);
    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(popupButton);
    
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closePopup();
    }, 5000);
}

function showErrorMessage(customMessage = null) {
    // Remove any existing popups
    const existingPopup = document.querySelector('.popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup using DOM methods instead of innerHTML
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay active';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    
    const popupIcon = document.createElement('div');
    popupIcon.className = 'popup-icon error';
    popupIcon.textContent = '✗';
    
    const popupTitle = document.createElement('h3');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = 'SENDEN FEHLGESCHLAGEN';
    
    const popupMessage = document.createElement('p');
    popupMessage.className = 'popup-message';
    popupMessage.textContent = customMessage || 'Entschuldigung, deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut oder kontaktiere uns direkt unter contact@cyborg-collective.com';
    
    const popupButton = document.createElement('button');
    popupButton.className = 'popup-button';
    popupButton.onclick = closePopup;
    
    const buttonSpan = document.createElement('span');
    buttonSpan.textContent = 'ERNEUT VERSUCHEN';
    
    const buttonGlow = document.createElement('div');
    buttonGlow.className = 'button-glow';
    
    popupButton.appendChild(buttonSpan);
    popupButton.appendChild(buttonGlow);
    
    popupContainer.appendChild(popupIcon);
    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(popupButton);
    
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closePopup();
    }, 5000);
}

function closePopup() {
    const popup = document.querySelector('.popup-overlay');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// Export functions for global access
window.CYBORG = {
    navigateToSection,
    setActiveSection,
    toggleMobileMenu,
    startAnimations,
    scrollToContact,
    selectPlan,
    closePopup
};

console.log('CYBORG - JavaScript loaded successfully!'); 