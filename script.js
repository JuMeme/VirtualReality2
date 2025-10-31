// Gestione del tema dark/light
class ThemeManager {
    constructor() {
        this.themeSwitch = document.getElementById('theme-switch');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeSwitch) {
            this.themeSwitch.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Il pulsante ora usa CSS per l'icona, non più emoji
        try {
            document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
        } catch (_) {}
    }
}

// Gestione dell'animazione iniziale
class IntroAnimation {
    constructor() {
        this.introElement = document.getElementById('intro-animation');
        this.sessionKey = 'vr-intro-shown';
        this.init();
    }
    
    init() {
        // Check if animation already shown in this session
        if (sessionStorage.getItem(this.sessionKey)) {
            // Already shown - hide immediately
            if (this.introElement) {
                this.introElement.style.display = 'none';
                this.introElement.remove();
            }
            return;
        }
        
        // Show animation and mark as shown in sessionStorage
        if (this.introElement) {
            // Nasconde l'animazione dopo 3 secondi
            setTimeout(() => {
                this.introElement.classList.add('hidden');
                // Rimuove completamente l'elemento dal DOM dopo l'animazione
                setTimeout(() => {
                    this.introElement.remove();
                    // Mark as shown for this session
                    sessionStorage.setItem(this.sessionKey, 'true');
                }, 500);
            }, 3000);
        }
    }
}

// Gestione dell'header con scroll intelligente
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 50;
        this.isScrollingUp = false;
        this.isScrollingDown = false;
        
        this.init();
        this.initMobileMenu();
    }
    
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navList.classList.toggle('mobile-menu');
                navList.classList.toggle('active');
                document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking a link
            navList.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navList.classList.remove('mobile-menu', 'active');
                    document.body.style.overflow = '';
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navList.classList.contains('active') && 
                    !navList.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navList.classList.remove('mobile-menu', 'active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    init() {
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - this.lastScrollY;
        
        // Determina la direzione dello scroll
        if (scrollDifference > 0) {
            // Scrolling down
            this.isScrollingDown = true;
            this.isScrollingUp = false;
        } else if (scrollDifference < 0) {
            // Scrolling up
            this.isScrollingUp = true;
            this.isScrollingDown = false;
        }
        
        // Gestisce la visibilità dell'header
        if (currentScrollY > this.scrollThreshold) {
            if (this.isScrollingDown && !this.header.classList.contains('hidden')) {
                this.header.classList.add('hidden');
            } else if (this.isScrollingUp && this.header.classList.contains('hidden')) {
                this.header.classList.remove('hidden');
            }
        } else {
            // Near top - always show header
            this.header.classList.remove('hidden');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Gestione delle animazioni hover
class HoverAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupNavHover();
        this.setupTitleHover();
        this.setupCardHover();
    }
    
    setupNavHover() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateTextColor(link);
            });
        });
    }
    
    setupTitleHover() {
        const titleText = document.querySelector('.title-text');
        
        if (titleText) {
            titleText.addEventListener('mouseenter', () => {
                this.animateTitleGradient(titleText);
            });
        }
    }
    
    setupCardHover() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCard(card);
            });
        });
    }
    
    animateTextColor(element) {
        element.style.transition = 'color 0.3s ease';
        element.style.color = 'var(--primary-color)';
        
        setTimeout(() => {
            element.style.color = '';
        }, 300);
    }
    
    animateTitleGradient(element) {
        element.style.background = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color), var(--accent-color))';
        element.style.backgroundSize = '200% 200%';
        element.style.webkitBackgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
        element.style.backgroundClip = 'text';
        element.style.animation = 'gradientShift 2s ease-in-out infinite';
    }
    
    animateCard(card) {
        const image = card.querySelector('.card-img');
        const overlay = card.querySelector('.image-overlay');
        
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
        
        if (overlay) {
            overlay.style.opacity = '1';
        }
    }
    
    resetCard(card) {
        const image = card.querySelector('.card-img');
        const overlay = card.querySelector('.image-overlay');
        
        if (image) {
            image.style.transform = 'scale(1)';
        }
        
        if (overlay) {
            overlay.style.opacity = '0';
        }
    }
}

// Gestione dello smooth scroll
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scroll per i link interni
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Gestione delle orbs animate
class OrbAnimations {
    constructor() {
        this.orbs = document.querySelectorAll('.orb');
        this.init();
    }
    
    init() {
        this.orbs.forEach((orb, index) => {
            // Aggiunge variazioni casuali alle animazioni
            const randomDelay = Math.random() * 10;
            const randomDuration = 20 + Math.random() * 15;
            
            orb.style.animationDelay = `-${randomDelay}s`;
            orb.style.animationDuration = `${randomDuration}s`;
            
            // Aggiunge movimento mouse parallax
            document.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, orb, index);
            });
        });
    }
    
    handleMouseMove(e, orb, index) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 20 * (index + 1);
        const moveY = (mouseY - 0.5) * 20 * (index + 1);
        
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}

// Gestione delle performance
class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Throttle per scroll events
        this.throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };
        
        // Ottimizza le animazioni per dispositivi con poche risorse
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
    }
}

// Inizializzazione dell'applicazione
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Aspetta che il DOM sia caricato
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        // Inizializza tutti i componenti
        new ThemeManager();
        new IntroAnimation();
        new HeaderManager();
        new HoverAnimations();
        new SmoothScroll();
        new OrbAnimations();
        new PerformanceManager();
        new BackgroundDots();
        new WelcomePopup();
        new HelpFAB();
        
        // Aggiunge classe per animazioni CSS
        document.body.classList.add('loaded');
        
        console.log('VR Website initialized successfully!');
    }
}

// Avvia l'applicazione
new App();

// Animated dots background generator
class BackgroundDots {
    constructor() {
        this.count = 80; // increased density
        this.init();
        // react to theme toggles
        document.addEventListener('themechange', (e) => this.regenerate(e.detail));
    }
    init() {
        // Populate CSS variables consumed by pseudo-elements
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        document.documentElement.style.setProperty('--dots1', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots2', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots3', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots4', this.generateShadows(this.count, theme));
    }
    regenerate(theme) {
        document.documentElement.style.setProperty('--dots1', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots2', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots3', this.generateShadows(this.count, theme));
        document.documentElement.style.setProperty('--dots4', this.generateShadows(this.count, theme));
    }
    generateShadows(n, theme) {
        const shadows = [];
        const isDark = (theme || (document.documentElement.getAttribute('data-theme') || 'light')) === 'dark';
        const alpha = isDark ? 0.75 : 0.95; // dark mode slightly less opacity
        for (let i = 0; i < n; i++) {
            const x = (-0.5 + Math.random()) * 3; // em
            const y = (-0.5 + Math.random()) * 3; // em
            const hue = Math.floor(Math.random() * 360);
            const blur = 7;
            shadows.push(`${x}em ${y}em ${blur}px hsla(${hue}, 100%, 50%, ${alpha})`);
        }
        return shadows.join(',');
    }
}

// First-visit welcome popup (only when clicking Quiz or Hardware)
class WelcomePopup {
    constructor() {
        this.key = 'welcomeShown';
        this.pendingHref = null;
        this.bindTriggers();
    }
    bindTriggers() {
        const targets = Array.from(document.querySelectorAll('a.nav-link'))
            .filter(a => /(?:quiz\.html|headset\.html)$/i.test(a.getAttribute('href') || ''));
        targets.forEach(a => {
            a.addEventListener('click', (e) => {
                if (localStorage.getItem(this.key)) return; // already shown
                e.preventDefault();
                this.pendingHref = a.getAttribute('href');
                this.render();
            });
        });
    }
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'welcome-popup';
        wrapper.innerHTML = `
            <div class="popup-content">
                <h3>Prima volta qui?</h3>
                <p>Conosci la differenza tra i visori standalone e PCVR?</p>
                <div class="video-preview">
                    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="VR Headsets" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <button class="popup-btn" id="popup-continue">Capito, continua</button>
            </div>
        `;
        document.body.appendChild(wrapper);
        // Force reflow then show
        requestAnimationFrame(() => wrapper.classList.add('show'));
        const close = () => {
            wrapper.classList.remove('show');
            setTimeout(() => wrapper.remove(), 300);
            localStorage.setItem(this.key, '1');
            if (this.pendingHref) {
                window.location.href = this.pendingHref;
                this.pendingHref = null;
            }
        };
        wrapper.addEventListener('click', (e) => {
            if (e.target === wrapper) close();
        });
        const btn = wrapper.querySelector('#popup-continue');
        if (btn) btn.addEventListener('click', close);
    }
}

// Floating Help FAB for quiz and hardware pages
class HelpFAB {
    constructor() {
        this.videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        this.init();
    }
    isTargetPage() {
        const path = (location.pathname || '').toLowerCase();
        return path.endsWith('/quiz.html') || path.endsWith('/headset.html') || path.endsWith('quiz.html') || path.endsWith('headset.html');
    }
    init() {
        if (!this.isTargetPage()) return;
        const btn = document.createElement('button');
        btn.className = 'help-fab';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Aiuto');
        btn.textContent = '?';
        btn.addEventListener('click', () => this.open());
        document.body.appendChild(btn);
    }
    open() {
        const wrapper = document.createElement('div');
        wrapper.className = 'welcome-popup';
        wrapper.innerHTML = `
            <div class="popup-content">
                <h3>Differenze tra visori standalone e PCVR</h3>
                <p>Guarda questo breve video che spiega le differenze principali.</p>
                <div class="video-preview">
                    <iframe src="${this.videoUrl}" title="Differenze tra visori" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <button class="popup-btn" id="popup-close">Chiudi</button>
            </div>
        `;
        document.body.appendChild(wrapper);
        requestAnimationFrame(() => wrapper.classList.add('show'));
        const close = () => {
            wrapper.classList.remove('show');
            setTimeout(() => wrapper.remove(), 300);
        };
        wrapper.addEventListener('click', (e) => { if (e.target === wrapper) close(); });
        const btn = wrapper.querySelector('#popup-close');
        if (btn) btn.addEventListener('click', close);
    }
}
