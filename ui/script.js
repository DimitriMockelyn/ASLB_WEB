// Forcer le scroll en haut au chargement de la page
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll immédiat en haut
window.scrollTo(0, 0);

// S'assurer que le scroll reste en haut après le chargement complet
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});

// Menu hamburger toggle
const menuToggle = document.getElementById('menuToggle');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const hamburgerClose = document.getElementById('hamburgerClose');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
});

// Fermer le menu avec le bouton X
hamburgerClose.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    hamburgerMenu.classList.remove('active');
});

// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        hamburgerMenu.classList.remove('active');
    }
});

// Smooth scroll pour les liens de navigation
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

// Navigation du planning carrousel
const schedulePrev = document.getElementById('schedulePrev');
const scheduleNext = document.getElementById('scheduleNext');
const scheduleCarousel = document.getElementById('scheduleCarousel');
const currentWeek = document.querySelector('.current-week');

let weekOffset = 0;
let scrollPosition = 0;

function updateWeek() {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));

    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - baseDate.getDay() + 1); // Lundi

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5); // Samedi

    // Format JJ/MM
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    currentWeek.textContent = `${formatDate(startDate)} au ${formatDate(endDate)}`;
}

// Navigation du carrousel d'activités (gauche/droite)
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');

function updateCarouselButtons() {
    const containerWidth = scheduleCarousel.parentElement.offsetWidth;
    const totalWidth = scheduleCarousel.scrollWidth;
    const maxScroll = Math.max(0, totalWidth - containerWidth);

    // Désactiver le bouton gauche si on est au début
    carouselPrev.disabled = scrollPosition <= 0;

    // Désactiver le bouton droite si on est à la fin
    carouselNext.disabled = scrollPosition >= maxScroll;
}

carouselPrev.addEventListener('click', () => {
    const cardWidth = 180; // min-width des cartes
    const gap = 8; // gap entre les cartes
    const scrollAmount = (cardWidth + gap) * 2; // Scroll de 2 cartes à la fois
    scrollPosition = Math.max(0, scrollPosition - scrollAmount);
    scheduleCarousel.style.transform = `translateX(-${scrollPosition}px)`;
    updateCarouselButtons();
});

carouselNext.addEventListener('click', () => {
    const cardWidth = 180;
    const gap = 8;
    const scrollAmount = (cardWidth + gap) * 2;
    const containerWidth = scheduleCarousel.parentElement.offsetWidth;
    const totalWidth = scheduleCarousel.scrollWidth;
    const maxScroll = Math.max(0, totalWidth - containerWidth);

    scrollPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    scheduleCarousel.style.transform = `translateX(-${scrollPosition}px)`;
    updateCarouselButtons();
});

// Navigation de semaine
const prevWeekBtn = document.querySelector('.schedule-controls .carousel-btn.prev');
const nextWeekBtn = document.querySelector('.schedule-controls .carousel-btn.next');

if (prevWeekBtn && nextWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
        weekOffset--;
        updateWeek();
        animateScheduleCards();
    });

    nextWeekBtn.addEventListener('click', () => {
        weekOffset++;
        updateWeek();
        animateScheduleCards();
    });
}

function animateScheduleCards() {
    const scheduleCards = document.querySelectorAll('.schedule-card');
    scheduleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-15px)';

        setTimeout(() => {
            card.style.transition = 'all 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, index * 40);
    });
}

// Gestion du formulaire de discussion
const discussionInput = document.querySelector('.discussion-input textarea');
const btnPost = document.querySelector('.btn-post');
const discussionFeed = document.querySelector('.discussion-feed');

btnPost.addEventListener('click', () => {
    const message = discussionInput.value.trim();

    if (message) {
        addMessage(message);
        discussionInput.value = '';
    }
});

// Permettre d'envoyer avec Ctrl+Enter
discussionInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        btnPost.click();
    }
});

function addMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'discussion-message';
    messageDiv.style.opacity = '0';

    const initials = 'U'; // Utilisateur par défaut
    const now = new Date();
    const timeStr = 'À l\'instant';

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <div class="avatar-circle">${initials}</div>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">Vous</span>
                <span class="message-time">${timeStr}</span>
            </div>
            <p>${text}</p>
        </div>
    `;

    discussionFeed.insertBefore(messageDiv, discussionFeed.firstChild);

    // Animation d'apparition
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s ease';
        messageDiv.style.opacity = '1';
    }, 10);

    // Scroll vers le nouveau message
    discussionFeed.scrollTop = 0;
}

// Animation des likes sur les actualités
const newsActions = document.querySelectorAll('.news-action');
newsActions.forEach(action => {
    action.addEventListener('click', function () {
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Sidebar navigation active state
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Animation d'apparition progressive des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Initialisation
updateWeek();
updateCarouselButtons();

// ===== GESTION DU MODE SOMBRE/CLAIR =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Mettre à jour l'icône selon le thème
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

updateThemeIcon(savedTheme);

// Toggle du thème
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

console.log('🏋️ ASLB - Site chargé avec succès!');
