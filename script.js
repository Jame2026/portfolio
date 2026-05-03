// DOM Elements
const cursorGlow = document.querySelector('.cursor-glow');
const typingText = document.querySelector('.typing-text');
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const projectGrid = document.querySelector('.project-grid');
const preloader = document.getElementById('preloader');

// 0. Preloader
window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';

        // Trigger initial animations after load
        document.querySelectorAll('.fade-in').forEach(el => {
            // el.classList.add('visible'); // Let intersection observer handle it
        });
    }, 500);
});

// 1. Cursor Glow
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// 2. Typing Effect
const roles = ["Full Stack Developer", "Systems Engineer", "Cloud Architect", "Pioneer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);

// 3. Canvas Particles
let particles = [];
function resizeCanvas() {
    canvas.width = 500; // Fixed size based on CSS
    canvas.height = 500;
}
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.2})`; // Primary color themed
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) { // Increased count
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 4. Project Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// 5. 3D Tilt Effect
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    // 6. Modal Open
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('p').innerText;
        // In a real app complexity, fetch specialized description.
        // For now, re-use the short description or generate a longer dummy one.
        const tags = card.querySelector('.project-tags').innerHTML;
        const bgImage = window.getComputedStyle(card.querySelector('.project-img')).backgroundImage;
        // Strip 'url("...")'
        const imgUrl = bgImage.slice(5, -2);
        
        const demoUrl = card.getAttribute('data-demo') || '#';
        const sourceUrl = card.getAttribute('data-source') || '#';

        modal.querySelector('.modal-title').innerText = title;
        modal.querySelector('.modal-desc').innerText = desc + " This project demonstrates advanced skill in full-stack development, utilizing modern frameworks and best practices.";
        modal.querySelector('.modal-tags').innerHTML = tags;
        modal.querySelector('.modal-img').src = imgUrl;
        
        const demoBtn = modal.querySelector('.modal-links .btn-primary');
        demoBtn.href = demoUrl;
        demoBtn.target = demoUrl !== '#' ? '_blank' : '_self';
        demoBtn.style.display = demoUrl !== '#' ? 'inline-block' : 'none';

        const sourceBtn = modal.querySelector('.modal-links .btn-secondary');
        sourceBtn.href = sourceUrl;
        sourceBtn.target = sourceUrl !== '#' ? '_blank' : '_self';
        sourceBtn.style.display = sourceUrl !== '#' ? 'inline-block' : 'none';

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Modal Close
closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// 7. Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
});

// Navbar scroll logic
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.background = 'rgba(3, 7, 18, 0.95)';
    } else {
        navbar.style.padding = '0';
        navbar.style.background = 'rgba(3, 7, 18, 0.8)';
    }
});

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
    // Simple toggle for mobile View
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-color)';
        navLinks.style.width = '100%';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--glass-border)';
    }
});

// Testimonials Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    testimonialCards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('active');
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].style.display = 'block';
    setTimeout(() => testimonialCards[index].classList.add('active'), 10);
    dots[index].classList.add('active');
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        showSlide(currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}
