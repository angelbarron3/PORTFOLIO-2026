console.log("DEBUG: main.js loaded");
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG ---
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    // --- 1. LANGUAGE SWITCHER ---
    const btnEn = document.getElementById('btn-en');
    const btnEs = document.getElementById('btn-es');
    let currentLang = localStorage.getItem('portfolio_lang') || 'en';
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        document.documentElement.lang = lang;
        // Update Active State
        if (btnEn && btnEs) {
            btnEn.classList.toggle('active', lang === 'en');
            btnEs.classList.toggle('active', lang === 'es');
        }
        // Toggle content visibility
        document.querySelectorAll('[lang="en"]').forEach(el => {
            el.style.display = (lang === 'en' ? '' : 'none');
        });
        document.querySelectorAll('[lang="es"]').forEach(el => {
            el.style.display = (lang === 'es' ? '' : 'none');
        });
    }
    // Init Language
    setLanguage(currentLang);
    if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
    if (btnEs) btnEs.addEventListener('click', () => setLanguage('es'));
    // --- 2. LOADER LOGIC (REMOVED) ---
    // Loader removed by user request.

    // --- 3. CUSTOM CURSOR ---
    const cursor = document.getElementById('cursor-dot');
    if (cursor && window.matchMedia("(hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        // Add active state on hoverables
        const interactive = document.querySelectorAll('a, button, input, textarea, .lang-btn, .project-card, .skill-card');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }
    // --- 4. MOBILE MENU ---
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => navList.classList.toggle('active'));
        // Close on link click
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navList.classList.remove('active'));
        });
    }
    // --- 5. SCROLL ANIMATIONS ---
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // We keep observing to allow re-animation
            } else {
                // Remove class when out of view to reset animation
                entry.target.classList.remove('visible');
            }
        });
    }, animationObserverOptions);
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up');
    if (animatedElements.length > 0) {
        animatedElements.forEach(el => observer.observe(el));
    } else {
        console.warn("No elements found to animate");
    }
    // Safety Fallback (3s)
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .fade-up').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.classList.add('visible');
            }
        });
    }, 3000);
    // --- 6. NAVBAR SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            } else {
                navbar.style.backgroundColor = 'rgba(17, 17, 17, 0.9)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
    // --- 7. CONTACT FORM (AJAX) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error sending message.');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});
