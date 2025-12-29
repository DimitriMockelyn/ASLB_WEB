// ===== SYSTÈME DE MODAL POUR LES ACTIVITÉS =====

// Charger les activités depuis localStorage (ou données par défaut)
function loadActivitiesData() {
    const stored = localStorage.getItem('aslb_activities');
    if (stored) {
        return JSON.parse(stored);
    }

    // Données par défaut si localStorage est vide
    return {
        fitgood: {
            name: 'FitGood',
            description: 'Séance de HIIT (High Intensity Interval Training) où l\'on travaille toutes les parties du corps de manière intensive et efficace.',
            instructor: 'Stéphane M.',
            duration: '30-35 minutes',
            color: '#1B5E20',
            icon: '⚡'
        },
        ppg: {
            name: 'PPG',
            description: 'Préparation Physique Générale : renforcement musculaire avec circuits training, body force, body bar et exercices variés.',
            instructor: 'Guillaume M.',
            duration: '45 minutes',
            color: '#4FC3F7',
            icon: '💪'
        },
        yoga: {
            name: 'Yoga',
            description: 'Pratique du yoga pour améliorer la souplesse, la force et l\'équilibre tout en favorisant la relaxation et la concentration.',
            instructor: 'Marilyn B.',
            duration: '60 minutes',
            color: '#FFB300',
            icon: '🧘'
        },
        pilates: {
            name: 'Pilates',
            description: 'Méthode Pilates pour renforcer les muscles profonds, améliorer la posture et développer la conscience corporelle.',
            instructor: 'Marilyn B.',
            duration: '45 minutes',
            color: '#9C27B0',
            icon: '🤸'
        },
        boxe: {
            name: 'Boxe',
            description: 'Cours de boxe française et anglaise : apprentissage des techniques, travail cardio et défouloir garanti !',
            instructor: 'Sébastien C. / Philippe D.',
            duration: '60 minutes',
            color: '#1565C0',
            icon: '🥊'
        },
        marche: {
            name: 'Marche Nordique',
            description: 'Marche nordique en groupe : activité complète en plein air alliant cardio et renforcement musculaire.',
            instructor: 'Sylvie C.',
            duration: '90 minutes',
            color: '#81C784',
            icon: '🚶'
        },
        fitdance: {
            name: 'Fit Dance',
            description: 'Danse fitness dynamique et fun, inspirée de la Zumba. Bougez sur des rythmes entraînants tout en vous dépensant !',
            instructor: 'Cristina B.',
            duration: '45 minutes',
            color: '#EC407A',
            icon: '💃'
        },
        danseafro: {
            name: 'Danse Afro',
            description: 'Découvrez les danses africaines traditionnelles et modernes dans une ambiance chaleureuse et rythmée.',
            instructor: 'Samira M.',
            duration: '60 minutes',
            color: '#FF6F00',
            icon: '🌍'
        },
        beachvolley: {
            name: 'Beach Volley',
            description: 'Séances de beach volley en équipe : sport collectif, convivialité et plaisir de jouer sur le sable.',
            instructor: 'Olivier S. / Laurent J.',
            duration: '90 minutes',
            color: '#D32F2F',
            icon: '🏐'
        },
        seanceindiv: {
            name: 'Séances Individualisées',
            description: 'Coaching personnalisé adapté à vos besoins spécifiques et vos objectifs personnels.',
            instructor: 'Stéphan F.',
            duration: 'Variable',
            color: '#B71C1C',
            icon: '👤'
        },
        relaxation: {
            name: 'Relaxation',
            description: 'Séance de relaxation profonde pour évacuer le stress, détendre le corps et apaiser l\'esprit.',
            instructor: 'Cristina B.',
            duration: '45 minutes',
            color: '#A5D6A7',
            icon: '🌿'
        },
        step: {
            name: 'Step',
            description: 'Cours de step dynamique : cardio training sur plateforme avec chorégraphies variées et motivantes.',
            instructor: 'Cristina B.',
            duration: '45 minutes',
            color: '#7E57C2',
            icon: '📶'
        },
        hiit: {
            name: 'HIIT',
            description: 'High Intensity Interval Training : entraînement fractionné à haute intensité pour brûler un maximum de calories.',
            instructor: 'Jeanne C.',
            duration: '30 minutes',
            color: '#F8BBD0',
            icon: '🔥'
        }
    };
}

// Charger les données au démarrage
const activitiesData = loadActivitiesData();

// Gestion du modal d'activités
const activityModal = document.getElementById('activityModal');
const activityModalClose = document.getElementById('activityModalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalInstructor = document.getElementById('modalInstructor');
const modalDuration = document.getElementById('modalDuration');
const modalIcon = document.getElementById('modalIcon');

// Fonction pour ouvrir le modal
function openActivityModal(activityKey) {
    const activity = activitiesData[activityKey];
    if (!activity) return;

    modalTitle.textContent = activity.name;
    modalDescription.textContent = activity.description;
    modalInstructor.textContent = activity.instructor;
    modalDuration.textContent = activity.duration;
    modalIcon.textContent = activity.icon;
    modalIcon.className = 'activity-modal-icon ' + activityKey;

    activityModal.classList.add('active');
}

// Fonction pour fermer le modal
function closeActivityModal() {
    activityModal.classList.remove('active');
}

// Événements pour les cartes d'activités (section "Nos Activités")
const activityCards = document.querySelectorAll('.activity-card');
activityCards.forEach(card => {
    card.addEventListener('click', function () {
        const activityKey = this.getAttribute('data-activity');
        openActivityModal(activityKey);
    });

    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Événements pour les cartes du planning
const scheduleCards = document.querySelectorAll('.schedule-card');
scheduleCards.forEach(card => {
    card.addEventListener('click', function () {
        const activityKey = this.getAttribute('data-activity');
        if (activityKey) {
            openActivityModal(activityKey);
        }
    });
});

// Fermer le modal avec le bouton X
activityModalClose.addEventListener('click', closeActivityModal);

// Fermer en cliquant en dehors du modal
activityModal.addEventListener('click', (e) => {
    if (e.target === activityModal) {
        closeActivityModal();
    }
});

// Fermer avec la touche Échap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activityModal.classList.contains('active')) {
        closeActivityModal();
    }
});
