// ===== SYSTÈME D'AUTHENTIFICATION =====

// Base de données utilisateurs (simulée)
const USERS_DB = [
    {
        id: 1,
        email: "stephane.martin@tokheimservices.com",
        password: "user1234",
        firstName: "Stéphane",
        lastName: "Martin",
        role: "Président",
        isAdmin: true,
        tokens: [
            { id: 1, used: false, courseId: null, courseName: null },
            { id: 2, used: false, courseId: null, courseName: null },
            { id: 3, used: false, courseId: null, courseName: null }
        ]
    },
    {
        id: 2,
        email: "marie.dupont@example.com",
        password: "user1234",
        firstName: "Marie",
        lastName: "Dupont",
        role: "Adhérent",
        isAdmin: false,
        tokens: [
            { id: 1, used: true, courseId: "yoga-lundi", courseName: "Yoga Lundi 18h30" },
            { id: 2, used: false, courseId: null, courseName: null },
            { id: 3, used: false, courseId: null, courseName: null }
        ]
    }
];

// ===== GESTION DE SESSION =====

function login(email, password) {
    const user = USERS_DB.find(u => u.email === email && u.password === password);

    if (user) {
        // Sauvegarder la session
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
    }

    return { success: false, message: "Email ou mot de passe incorrect" };
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function updateCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// ===== GESTION DES JETONS =====

function getAvailableTokens(user) {
    return user.tokens.filter(t => !t.used);
}

function canEnrollInCourse(user) {
    return getAvailableTokens(user).length > 0;
}

function enrollInCourse(courseId, courseName) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: "Non connecté" };

    const availableToken = user.tokens.find(t => !t.used);

    if (!availableToken) {
        return { success: false, message: "Aucun jeton disponible" };
    }

    availableToken.used = true;
    availableToken.courseId = courseId;
    availableToken.courseName = courseName;

    updateCurrentUser(user);
    updateTokensDisplay();

    return { success: true, message: "Inscription réussie !" };
}

function unenrollFromCourse(courseId) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: "Non connecté" };

    const token = user.tokens.find(t => t.courseId === courseId);

    if (!token) {
        return { success: false, message: "Cours non trouvé" };
    }

    token.used = false;
    token.courseId = null;
    token.courseName = null;

    updateCurrentUser(user);
    updateTokensDisplay();

    return { success: true, message: "Désinscription réussie !" };
}

// ===== AFFICHAGE DU PROFIL =====

function updateUserProfile() {
    const user = getCurrentUser();
    const userProfileContainer = document.querySelector('.user-profile-header');
    const loginButton = document.querySelector('.btn-connexion');
    const signupButton = document.querySelector('.btn-inscription');

    if (user) {
        // Masquer les boutons de connexion/inscription
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';

        // Afficher le profil
        if (userProfileContainer) {
            userProfileContainer.style.display = 'flex';

            // Mettre à jour les informations
            const avatar = userProfileContainer.querySelector('.user-avatar');
            const userName = userProfileContainer.querySelector('.user-name');
            const userRole = userProfileContainer.querySelector('.user-role');

            if (avatar) avatar.textContent = `${user.firstName[0]}${user.lastName[0]}`;
            if (userName) userName.textContent = `${user.firstName} ${user.lastName}`;
            if (userRole) userRole.textContent = user.role;

            updateTokensDisplay();
        }

        // Afficher/masquer le menu admin
        updateAdminMenu(user.isAdmin);
    } else {
        // Afficher les boutons de connexion/inscription
        if (loginButton) loginButton.style.display = 'block';
        if (signupButton) signupButton.style.display = 'block';

        // Masquer le profil
        if (userProfileContainer) userProfileContainer.style.display = 'none';

        // Masquer le menu admin
        updateAdminMenu(false);
    }
}

function updateTokensDisplay() {
    const user = getCurrentUser();
    if (!user) return;

    const tokenElements = document.querySelectorAll('.user-tokens .token');

    user.tokens.forEach((token, index) => {
        if (tokenElements[index]) {
            if (token.used) {
                tokenElements[index].classList.add('used');
                tokenElements[index].classList.remove('available');
                tokenElements[index].title = `Utilisé pour: ${token.courseName}`;
            } else {
                tokenElements[index].classList.add('available');
                tokenElements[index].classList.remove('used');
                tokenElements[index].title = 'Jeton disponible';
            }
        }
    });
}

function updateAdminMenu(isAdmin) {
    const adminMenu = document.querySelector('.sidebar-link.admin-menu');
    if (adminMenu) {
        adminMenu.style.display = isAdmin ? 'flex' : 'none';
    }
}

// ===== MODAL DE CONNEXION =====

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');

    const result = login(email, password);

    if (result.success) {
        closeLoginModal();
        updateUserProfile();

        // Afficher un message de bienvenue
        showNotification(`Bienvenue ${result.user.firstName} !`, 'success');
    } else {
        if (errorMsg) {
            errorMsg.textContent = result.message;
            errorMsg.style.display = 'block';
        }
    }
}

// ===== NOTIFICATIONS =====

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animation d'apparition
    setTimeout(() => notification.classList.add('show'), 10);

    // Suppression après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== INITIALISATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier la session au chargement
    updateUserProfile();

    // Gestionnaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Bouton de connexion
    const loginBtn = document.querySelector('.btn-connexion');
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }

    // Fermeture du modal
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLoginModal);
    }

    // Fermeture en cliquant en dehors
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeLoginModal();
        });
    }

    // Bouton de déconnexion dans le menu hamburger
    const logoutBtn = document.querySelector('.hamburger-link.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
