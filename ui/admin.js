// ===== ADMIN PANEL - GESTION DES ACTIVITÉS =====

// ===== NAVIGATION ENTRE SECTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');

            // Retirer la classe active de tous les items et sections
            menuItems.forEach(mi => mi.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Ajouter la classe active à l'item cliqué et à la section correspondante
            item.classList.add('active');
            document.getElementById('section-' + sectionId).classList.add('active');
        });
    });
});

// ===== DONNÉES PAR DÉFAUT =====
const defaultActivities = {
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

// ===== GESTION DU LOCALSTORAGE =====

function loadActivities() {
    const stored = localStorage.getItem('aslb_activities');
    if (stored) {
        return JSON.parse(stored);
    }
    // Si pas de données, charger les données par défaut
    saveActivities(defaultActivities);
    return defaultActivities;
}

function saveActivities(activities) {
    localStorage.setItem('aslb_activities', JSON.stringify(activities));
}

function resetToDefault() {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les activités aux valeurs par défaut ?')) {
        saveActivities(defaultActivities);
        loadTable();
        showToast('Activités réinitialisées', 'success');
    }
}

// ===== AFFICHAGE DU TABLEAU =====

function loadTable() {
    const activities = loadActivities();
    const tbody = document.getElementById('activitiesTableBody');
    tbody.innerHTML = '';

    Object.keys(activities).forEach(key => {
        const activity = activities[key];
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="activity-icon-cell">${activity.icon}</td>
            <td><strong>${activity.name}</strong></td>
            <td>${activity.instructor}</td>
            <td>${activity.duration}</td>
            <td class="activity-color-cell">
                <div class="color-preview" style="background: ${activity.color}"></div>
            </td>
            <td class="activity-actions">
                <button class="btn-icon" onclick="editActivity('${key}')" title="Modifier">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-icon btn-delete" onclick="confirmDelete('${key}')" title="Supprimer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// ===== GESTION DU FORMULAIRE =====

const formModal = document.getElementById('activityFormModal');
const modalFormTitle = document.getElementById('modalFormTitle');
const activityForm = document.getElementById('activityForm');
const btnAddActivity = document.getElementById('btnAddActivity');
const btnCancelForm = document.getElementById('btnCancelForm');
const modalFormClose = document.getElementById('modalFormClose');

let editingKey = null;

// Ouvrir le formulaire pour ajouter
btnAddActivity.addEventListener('click', () => {
    editingKey = null;
    modalFormTitle.textContent = 'Ajouter une activité';
    activityForm.reset();
    document.getElementById('activityKey').value = '';
    updatePreview();
    formModal.classList.add('active');
});

// Ouvrir le formulaire pour modifier
function editActivity(key) {
    const activities = loadActivities();
    const activity = activities[key];

    editingKey = key;
    modalFormTitle.textContent = 'Modifier l\'activité';

    document.getElementById('activityKey').value = key;
    document.getElementById('activityName').value = activity.name;
    document.getElementById('activityDescription').value = activity.description;
    document.getElementById('activityInstructor').value = activity.instructor;
    document.getElementById('activityDuration').value = activity.duration;
    document.getElementById('activityColor').value = activity.color;
    document.getElementById('activityColorHex').value = activity.color;
    document.getElementById('activityIcon').value = activity.icon;

    updatePreview();
    formModal.classList.add('active');
}

// Fermer le formulaire
function closeFormModal() {
    formModal.classList.remove('active');
    editingKey = null;
}

btnCancelForm.addEventListener('click', closeFormModal);
modalFormClose.addEventListener('click', closeFormModal);

// Soumettre le formulaire
activityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const activities = loadActivities();

    const name = document.getElementById('activityName').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const instructor = document.getElementById('activityInstructor').value.trim();
    const duration = document.getElementById('activityDuration').value.trim();
    const color = document.getElementById('activityColor').value;
    const icon = document.getElementById('activityIcon').value.trim();

    // Générer une clé si nouvelle activité
    let key = editingKey;
    if (!key) {
        key = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        // Vérifier que la clé n'existe pas déjà
        let counter = 1;
        let originalKey = key;
        while (activities[key]) {
            key = originalKey + counter;
            counter++;
        }
    }

    // Sauvegarder
    activities[key] = {
        name,
        description,
        instructor,
        duration,
        color,
        icon
    };

    saveActivities(activities);
    loadTable();
    closeFormModal();

    showToast(editingKey ? 'Activité modifiée avec succès' : 'Activité ajoutée avec succès', 'success');
});

// ===== APERÇU EN TEMPS RÉEL =====

function updatePreview() {
    const name = document.getElementById('activityName').value || 'Nom de l\'activité';
    const instructor = document.getElementById('activityInstructor').value || 'Animateur';
    const color = document.getElementById('activityColor').value || '#2EA365';
    const icon = document.getElementById('activityIcon').value || '⚡';

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewInstructor').textContent = instructor;
    document.getElementById('previewIcon').textContent = icon;
    document.getElementById('previewIcon').style.background = `linear-gradient(135deg, ${color}, ${adjustColor(color, -20)})`;
    document.getElementById('previewBadge').textContent = name;
    document.getElementById('previewBadge').style.background = color;
}

// Synchroniser color picker et input texte
document.getElementById('activityColor').addEventListener('input', (e) => {
    document.getElementById('activityColorHex').value = e.target.value;
    updatePreview();
});

document.getElementById('activityColorHex').addEventListener('input', (e) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        document.getElementById('activityColor').value = value;
        updatePreview();
    }
});

// Mettre à jour l'aperçu en temps réel
['activityName', 'activityInstructor', 'activityIcon'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
});

// Fonction utilitaire pour assombrir une couleur
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// ===== SUPPRESSION =====

const deleteModal = document.getElementById('deleteConfirmModal');
const deleteConfirmClose = document.getElementById('deleteConfirmClose');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');
const deleteActivityName = document.getElementById('deleteActivityName');

let deleteKey = null;

function confirmDelete(key) {
    const activities = loadActivities();
    deleteKey = key;
    deleteActivityName.textContent = activities[key].name;
    deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deleteKey = null;
}

deleteConfirmClose.addEventListener('click', closeDeleteModal);
btnCancelDelete.addEventListener('click', closeDeleteModal);

btnConfirmDelete.addEventListener('click', () => {
    if (deleteKey) {
        const activities = loadActivities();
        delete activities[deleteKey];
        saveActivities(activities);
        loadTable();
        closeDeleteModal();
        showToast('Activité supprimée', 'success');
    }
});

// ===== TOAST NOTIFICATIONS =====

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', () => {
    loadTable();
});

// Fermer les modals en cliquant en dehors
formModal.addEventListener('click', (e) => {
    if (e.target === formModal) closeFormModal();
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});

// ===== EXPORT POUR UTILISATION GLOBALE =====
window.editActivity = editActivity;
window.confirmDelete = confirmDelete;
window.resetToDefault = resetToDefault;
