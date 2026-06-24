// ===== PRELOADER =====
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.style.display = 'none';
        }
    }, 2500);
});

function showPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.animation = 'fadeOut 1.5s ease-in-out forwards';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1500);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00D4FF' : type === 'error' ? '#FF6B6B' : '#0A3A4A'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function handleLogout(e) {
    if (e) e.preventDefault();
    
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        let emailName = email.split('@')[0];
        emailName = emailName.replace(/[._-]/g, ' ');
        const userName = emailName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        
        showNotification('Login successful! Welcome ' + userName + '!', 'success');
        
        setTimeout(() => {
            updateUserProfile();
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showNotification('Please enter email and password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (firstName && lastName && email && phone && password) {
        const fullName = firstName + ' ' + lastName;
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('isLoggedIn', 'true');
        
        showNotification('Account created successfully! Welcome ' + firstName + '!', 'success');
        
        setTimeout(() => {
            updateUserProfile();
            window.location.href = 'index.html';
        }, 1500);
    }
}

function updateUserProfile() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    const authLi = document.getElementById('authLi');
    const signupLi = document.getElementById('signupLi');
    const logoutLi = document.getElementById('logoutLi');
    const userDashboard = document.getElementById('userDashboard');
    const dashboardUserName = document.getElementById('dashboardUserName');
    
    if (isLoggedIn === 'true' && (userName || userEmail)) {
        // Show dashboard
        if (userDashboard) userDashboard.style.display = 'block';
        
        // Set user name
        const displayName = userName || userEmail.split('@')[0];
        if (dashboardUserName) dashboardUserName.textContent = displayName;
        
        // Hide login, show logout
        if (authLi) authLi.style.display = 'none';
        if (signupLi) signupLi.style.display = 'none';
        if (logoutLi) logoutLi.style.display = 'block';
    } else {
        // Hide dashboard
        if (userDashboard) userDashboard.style.display = 'none';
        
        // Show login, hide logout
        if (authLi) authLi.style.display = 'block';
        if (signupLi) signupLi.style.display = 'block';
        if (logoutLi) logoutLi.style.display = 'none';
    }
}

// ===== ENHANCED SCROLL ANIMATIONS =====
const revealElements = () => {
    const elements = document.querySelectorAll('.product-card, .stat-card, .testimonial-card, .innovation-card, .news-card, .sustainability-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.pointerEvents = 'auto';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
};

// ===== STAT COUNTER ANIMATION =====
const animateCounters = () => {
    const statCards = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;
                const match = text.match(/(\d+)/);
                
                if (match) {
                    const finalNumber = parseInt(match[1]);
                    let currentNumber = 0;
                    const increment = Math.ceil(finalNumber / 50);
                    const suffix = text.replace(/\d+/g, '').trim();
                    
                    const counter = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= finalNumber) {
                            currentNumber = finalNumber;
                            clearInterval(counter);
                        }
                        statNumber.textContent = currentNumber.toLocaleString() + suffix;
                    }, 30);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => observer.observe(card));
};

// ===== PARALLAX SCROLL EFFECT =====
const parallaxEffect = () => {
    const parallaxElements = document.querySelectorAll('.hero-background, .redefining-image, .sustainability-image');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = el.getBoundingClientRect().top + scrollPosition;
            const distance = scrollPosition - (elementPosition - window.innerHeight);
            
            if (distance > -window.innerHeight && distance < window.innerHeight) {
                el.style.transform = `translateY(${distance * 0.3}px)`;
            }
        });
    });
};

// ===== HOVER LIFT EFFECT =====
const hoverLiftEffect = () => {
    const cards = document.querySelectorAll('.product-card, .testimonial-card, .innovation-card, .news-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            card.style.transform = `perspective(1000px) rotateX(${y * 0.05}deg) rotateY(${x * 0.05}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

// ===== TEXT ANIMATION ON SCROLL =====
const animateTextOnScroll = () => {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    textElements.forEach(el => observer.observe(el));
};

// ===== GRADIENT TEXT ANIMATION =====
const animateGradientText = () => {
    const headings = document.querySelectorAll('.hero-title, .section-title');
    
    headings.forEach(heading => {
        const text = heading.textContent;
        heading.innerHTML = '';
        
        const chars = text.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = `fadeInDown 0.6s ease-out ${index * 0.05}s both`;
            heading.appendChild(span);
        });
    });
};

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #00D4FF, #0A3A4A);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    z-index: 999;
    display: none;
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
        scrollTopBtn.style.animation = 'fadeInUp 0.4s ease-out';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollTopBtn.addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.15) rotate(15deg)';
    this.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.5)';
});

scrollTopBtn.addEventListener('mouseout', function() {
    this.style.transform = 'scale(1) rotate(0)';
    this.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
});

// ===== MAIN DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && href !== 'javascript:void(0)') {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    showPreloader();
                }
            });
        });
    }
    
    updateUserProfile();
    
    // Initialize all animations
    revealElements();
    animateCounters();
    parallaxEffect();
    hoverLiftEffect();
    animateTextOnScroll();
    animateGradientText();
});


function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{10,}$/.test(phone.replace(/\D/g, ''));
}

document.addEventListener('DOMContentLoaded', function() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#FF6B6B';
            } else if (this.value) {
                this.style.borderColor = '#00D4FF';
            }
        });
    });
});

// ===== NEWSLETTER =====
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (email) {
        localStorage.setItem('newsletterEmail', email);
        showNotification('Thank you for subscribing!', 'success');
        event.target.reset();
    }
}

// ===== SMOOTH SCROLL =====
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

console.log('✅ Stackly Script Ready!');
