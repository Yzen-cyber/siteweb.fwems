// APP.JS - Système de Gestion du Personnel EMS STFH
// Logique applicative avec authentification et logging

// ==============================
// VARIABLES GLOBALES
// ==============================
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let logsData = JSON.parse(localStorage.getItem('emsLogs')) || [];

// ==============================
// SYSTÈME DE LOGGING
// ==============================
class Logger {
    static log(actionType, details = '') {
        if (!currentUser) return;

        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            userEmail: currentUser.email,
            userName: currentUser.nom,
            userRole: currentUser.role,
            actionType: actionType,
            details: details,
            ipAddress: 'local'
        };

        logsData.unshift(logEntry);
        
        // Garder les logs des 48 dernières heures
        const fortyEightHoursAgo = Date.now() - (48 * 60 * 60 * 1000);
        logsData = logsData.filter(log => new Date(log.timestamp).getTime() > fortyEightHoursAgo);
        
        localStorage.setItem('emsLogs', JSON.stringify(logsData));
    }

    static getLogs() {
        return logsData;
    }

    static clear() {
        logsData = [];
        localStorage.setItem('emsLogs', JSON.stringify([]));
    }
}

// ==============================
// AUTHENTIFICATION
// ==============================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Utiliser le système de login avec credentials temporaires
    const result = verifyLogin(email, password);
    
    if (result.valid) {
        currentUser = result.user;
        currentUser.password = currentUser.password || password; // Garder le MDP utilisé
        currentUser.lastLogin = new Date().toLocaleString('fr-FR');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        Logger.log('LOGIN', `Connexion réussie - ${currentUser.role}`);
        
        // Si c'est la première connexion, forcer le changement de MDP
        if (result.mustChangePassword) {
            showNotification('Vous devez changer votre mot de passe à la première connexion', 'warning');
            setTimeout(() => {
                showApp();
                initializeApp();
                openProfileModal();
                setTimeout(() => switchProfileTab('password'), 300);
            }, 500);
        } else {
            showApp();
            initializeApp();
        }
    } else {
        Logger.log('LOGIN_FAIL', `Tentative échouée - ${email}`);
        showNotification(result.message || 'Email ou mot de passe incorrect', 'error');
    }
}

function handleLogout() {
    Logger.log('LOGOUT', `Déconnexion - ${currentUser.role}`);
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

// ==============================
// UI MANAGEMENT
// ==============================
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    
    // Afficher le nom et le rôle
    document.getElementById('userDisplayName').textContent = currentUser.nom;
    document.getElementById('userRole').textContent = currentUser.role;
    
    // Enregistrer la dernière connexion
    localStorage.setItem(`lastLogin_${currentUser.email}`, new Date().toISOString());
    
    // Afficher l'avatar
    updateUserAvatar();
    
    // Afficher le bouton Logs seulement pour Direction/Supervision
    const logsBtn = document.getElementById('logsBtn');
    if (currentUser.role === 'Direction' || currentUser.role === 'Supervision') {
        logsBtn.style.display = 'inline-flex';
    }
}

function switchTab(tabName) {
    Logger.log('NAV_TAB', `Accès à l'onglet ${tabName}`);
    
    // Cacher tous les onglets
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Montrer l'onglet sélectionné
    const tabPane = document.getElementById(`tab-${tabName}`);
    if (tabPane) {
        tabPane.classList.add('active');
    }
    
    // Mettre à jour les boutons de navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        // Mark as active if this is the clicked button or matches tabName
        if ((btn.onclick && btn.onclick.toString().includes(`'${tabName}'`)) || 
            (btn.getAttribute('data-tab') === tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Try to mark the clicked button as active
    if (event && event.target) {
        const btn = event.target.closest('.nav-btn');
        if (btn) btn.classList.add('active');
    }
    
    // Charger le contenu
    switch(tabName) {
        case 'accueil':
            loadDashboard();
            break;
        case 'effectif':
            loadStaff();
            break;
        case 'dispatch':
            initDispatch();
            break;
        case 'fiche-ems':
            initFicheEMS();
            break;
        case 'salaires':
            loadSalaries();
            break;
        case 'hierarchie':
            loadHierarchy();
            break;
        case 'medicaments':
            initMedicaments();
            break;
        case 'logs':
            loadLogs();
            break;
    }
}

// ==============================
// TABLEAU DE BORD
// ==============================
function loadDashboard() {
    if (!window.staffData) return;

    // Compter les personnels par rôle
    const direction = window.staffData.filter(s => s.role === 'Direction').length;
    const supervision = window.staffData.filter(s => s.role === 'Supervision').length;
    const ems = window.staffData.filter(s => s.role === 'EMS').length;

    document.getElementById('directionCount').textContent = direction;
    document.getElementById('supervisionCount').textContent = supervision;
    document.getElementById('emsCount').textContent = ems;

    // Calculer le salaire moyen mensuel
    if (window.staffData && window.salaryData) {
        let totalSalary = 0;
        let count = 0;
        
        window.staffData.forEach(staff => {
            const salaryInfo = window.salaryData.calculateSalary(staff);
            if (salaryInfo && salaryInfo.totalSalary) {
                totalSalary += salaryInfo.totalSalary;
                count++;
            }
        });

        const average = count > 0 ? Math.round(totalSalary / count) : 0;
        document.getElementById('totalSalary').textContent = average.toLocaleString('fr-FR') + '$';
    }
}

// ==============================
// EFFECTIF DU PERSONNEL
// ==============================
function loadStaff() {
    if (!window.staffData) return;

    const staffContainer = document.getElementById('staffContainer');
    let html = '';

    // Grouper par rôle
    const grouped = {
        'Direction': window.staffData.filter(s => s.role === 'Direction'),
        'Supervision': window.staffData.filter(s => s.role === 'Supervision'),
        'EMS': window.staffData.filter(s => s.role === 'EMS')
    };

    for (const [role, staff] of Object.entries(grouped)) {
        if (staff.length === 0) continue;
        
        html += `<div class="staff-group" data-role="${role}">`;
        html += `<h3 class="group-title">${role} (${staff.length})</h3>`;
        html += `<div class="staff-cards">`;

        staff.forEach(member => {
            html += `
                <div class="staff-card">
                    <div class="card-header ${role.toLowerCase()}">
                        <div class="card-icon"><i class="fas fa-user"></i></div>
                        <div class="card-info">
                            <h4>${member.nom}</h4>
                            <p class="grade">${member.grade}</p>
                        </div>
                    </div>
                    <div class="card-details">
                        <div class="detail-row">
                            <span class="label">ID Unique :</span>
                            <span class="value">${member.idUnique}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Matricule :</span>
                            <span class="value">${member.matricule}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email :</span>
                            <span class="value">${member.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Taux horaire :</span>
                            <span class="value">${member.hourlyRate.toLocaleString('fr-FR')}$/h</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Heures/semaine :</span>
                            <span class="value">${member.hoursPerWeek}h</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    staffContainer.innerHTML = html;
}

function filterStaff() {
    const roleFilter = document.getElementById('roleFilter').value;
    const searchTerm = document.getElementById('searchStaff').value.toLowerCase();

    document.querySelectorAll('.staff-group').forEach(group => {
        const role = group.getAttribute('data-role');
        const matchesRole = !roleFilter || role === roleFilter;

        let hasVisible = false;
        group.querySelectorAll('.staff-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            const matchesSearch = !searchTerm || text.includes(searchTerm);
            const visible = matchesRole && matchesSearch;
            
            card.style.display = visible ? 'block' : 'none';
            if (visible) hasVisible = true;
        });

        group.style.display = hasVisible ? 'block' : 'none';
    });
}

// ==============================
// SALAIRES
// ==============================
function loadSalaries() {
    displaySalaryGrids();
}

function displaySalaryGrids() {
    if (!window.salaryData) return;

    // Grille Supervision
    const supervisionGrid = document.getElementById('supervisionGrid');
    if (supervisionGrid && window.salaryData.supervision) {
        let html = '<div class="salary-roles">';
        window.salaryData.supervision.roles.forEach(role => {
            html += `
                <div class="salary-role">
                    <div class="role-title">${role.grade || role.description}</div>
                    <div class="role-rates">
                        <div class="rate-item">
                            <span class="rate-label">Taux horaire:</span>
                            <span class="rate-value">${role.hourlyRate.toLocaleString('fr-FR')}$/h</span>
                        </div>
                        <div class="rate-item">
                            <span class="rate-label">Par 15 min:</span>
                            <span class="rate-value">${role.perQuarter}$</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        supervisionGrid.innerHTML = html;
    }

    // Grille EMS
    const emsGrid = document.getElementById('emsGrid');
    if (emsGrid && window.salaryData.ems) {
        let html = '<div class="salary-roles">';
        window.salaryData.ems.roles.forEach(role => {
            html += `
                <div class="salary-role">
                    <div class="role-title">${role.grade || role.description}</div>
                    <div class="role-rates">
                        <div class="rate-item">
                            <span class="rate-label">Taux horaire:</span>
                            <span class="rate-value">${role.hourlyRate.toLocaleString('fr-FR')}$/h</span>
                        </div>
                        <div class="rate-item">
                            <span class="rate-label">Par 15 min:</span>
                            <span class="rate-value">${role.perQuarter}$</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        emsGrid.innerHTML = html;
    }
}

// ==============================
// HIÉRARCHIE
// ==============================
function loadHierarchy() {
    if (!window.staffData) return;

    const roles = {
        'Direction': 'directionList',
        'Supervision': 'supervisionList',
        'EMS': 'emsList'
    };

    for (const [role, elementId] of Object.entries(roles)) {
        const staff = window.staffData.filter(s => s.role === role);
        const container = document.getElementById(elementId);
        
        if (container) {
            let html = '';
            staff.forEach(member => {
                html += `
                    <div class="hierarchy-card">
                        <div class="h-avatar"><i class="fas fa-user-md"></i></div>
                        <h4>${member.nom}</h4>
                        <p class="h-grade">${member.grade}</p>
                        <p class="h-email">${member.email}</p>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    }
}

// ==============================
// LOGS (Admin/Supervision uniquement)
// ==============================
function loadLogs() {
    if (currentUser.role !== 'Direction' && currentUser.role !== 'Supervision') {
        document.getElementById('logsContainer').innerHTML = '<p class="no-access">Accès réservé à l\'administration</p>';
        return;
    }

    const logsContainer = document.getElementById('logsContainer');
    const logs = Logger.getLogs();

    if (logs.length === 0) {
        logsContainer.innerHTML = '<p class="no-logs">Aucun enregistrement de connexion pour le moment</p>';
        return;
    }

    let html = '<table class="logs-table"><thead><tr><th>Heure</th><th>Utilisateur</th><th>Rôle</th><th>Action</th><th>Détails</th></tr></thead><tbody>';

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const timeStr = date.toLocaleString('fr-FR');
        const actionLabel = {
            'LOGIN': '<span class="log-login">Connexion</span>',
            'LOGIN_FAIL': '<span class="log-fail">Tentative échouée</span>',
            'LOGOUT': '<span class="log-logout">Déconnexion</span>',
            'NAV_TAB': '<span class="log-nav">Navigation</span>'
        }[log.actionType] || log.actionType;

        html += `
            <tr>
                <td>${timeStr}</td>
                <td>${log.userName}</td>
                <td><span class="badge role-${log.userRole.toLowerCase()}">${log.userRole}</span></td>
                <td>${actionLabel}</td>
                <td>${log.details}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    logsContainer.innerHTML = html;
}

function clearOldLogs() {
    if (currentUser.role !== 'Direction' && currentUser.role !== 'Supervision') {
        showNotification('Accès non autorisé', 'error');
        return;
    }

    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const olderCount = logsData.filter(log => new Date(log.timestamp).getTime() < twentyFourHoursAgo).length;
    
    logsData = logsData.filter(log => new Date(log.timestamp).getTime() >= twentyFourHoursAgo);
    localStorage.setItem('emsLogs', JSON.stringify(logsData));
    
    showNotification(`${olderCount} enregistrement(s) supprimé(s)`, 'success');
    loadLogs();
}

// ==============================
// NOTIFICATIONS
// ==============================
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==============================
// GESTION PROFIL UTILISATEUR
// ==============================
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'flex';
    loadProfileInfo();
    Logger.log('PROFILE_OPEN', 'Accès au profil utilisateur');
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

function switchProfileTab(tabName) {
    // Cacher tous les onglets
    document.querySelectorAll('.profile-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Montrer l'onglet sélectionné
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Charger les données spécifiques à l'onglet
    if (tabName === 'info') {
        loadProfileInfo();
    } else if (tabName === 'settings') {
        loadSettingsModal();
    }
    
    // Mettre à jour les boutons
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.profile-tab-btn')?.classList.add('active');
}

function loadProfileInfo() {
    if (!currentUser) return;
    
    document.getElementById('profileNom').textContent = currentUser.nom || '--';
    document.getElementById('profileEmail').textContent = currentUser.email || '--';
    document.getElementById('profileRole').textContent = currentUser.role || '--';
    document.getElementById('profileGrade').textContent = currentUser.grade || '--';
    document.getElementById('profileLastLogin').textContent = currentUser.lastLogin || 'Première connexion';
    
    // Avatar
    const userAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
    const avatarImg = document.getElementById('avatarPreview');
    if (userAvatar && avatarImg) {
        avatarImg.src = userAvatar;
    }
}

function changePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (currentPassword !== currentUser.password) {
        showNotification('Mot de passe actuel incorrect', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Le nouveau mot de passe doit avoir au moins 6 caractères', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    // Mettre à jour le mot de passe
    currentUser.password = newPassword;
    
    // Mettre à jour dans users.js (localStorage temporaire)
    const allUsers = JSON.parse(localStorage.getItem('usersData')) || window.usersData;
    const userIndex = allUsers.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        allUsers[userIndex].password = newPassword;
        localStorage.setItem('usersData', JSON.stringify(allUsers));
    }
    
    // Mettre à jour la session actuelle
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Réinitialiser le formulaire
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    
    Logger.log('PASSWORD_CHANGE', 'Mot de passe modifié');
    showNotification('Mot de passe changé avec succès!', 'success');
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 1024 * 1024) {
            showNotification('Fichier trop volumineux (max 1MB)', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('avatarPreview');
            if (preview) {
                preview.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function generateColorAvatar(color) {
    const initials = currentUser.nom.split(' ').map(n => n[0]).join('').toUpperCase();
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d');
    
    // Gradient
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustColor(color, -30));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Texte initiales
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 100, 100);
    
    const dataUrl = canvas.toDataURL('image/png');
    const preview = document.getElementById('avatarPreview');
    if (preview) {
        preview.src = dataUrl;
    }
    
    // Sauvegarder
    localStorage.setItem(`avatar_${currentUser.email}`, dataUrl);
    
    // Mettre à jour navbar
    updateUserAvatar();
}

function adjustColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

function changeAvatar(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('avatarInput');
    const preview = document.getElementById('avatarPreview');
    
    if (!preview.src || preview.src === 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect fill=\'%23FF69B4\' width=\'100\' height=\'100\'/%3E%3C/svg%3E') {
        showNotification('Sélectionnez une image ou une couleur', 'error');
        return;
    }
    
    // Sauvegarder l'avatar
    localStorage.setItem(`avatar_${currentUser.email}`, preview.src);
    updateUserAvatar();
    
    Logger.log('AVATAR_CHANGE', 'Photo de profil modifiée');
    showNotification('Photo de profil mise à jour!', 'success');
    
    // Réinitialiser le formulaire
    fileInput.value = '';
}

function updateUserAvatar() {
    const userAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
    const avatarImg = document.getElementById('userAvatar');
    
    if (userAvatar) {
        avatarImg.src = userAvatar;
        avatarImg.style.borderRadius = '50%';
    }
}

// ==============================
// INITIALISATION
// ==============================
function initializeApp() {
    loadDashboard();
    Logger.log('APP_INIT', 'Application initialisée');
}

// ==============================
// PARAMÈTRES UTILISATEUR
// ==============================

function loadSettingsModal() {
    const settings = JSON.parse(localStorage.getItem(`settings_${currentUser.email}`)) || {
        language: 'fr',
        theme: 'light',
        twoFactorAuth: false,
        emailNotifications: true,
        systemAlerts: true,
        loginNotifications: false,
        visibleProfile: true,
        loginHistory: true
    };

    document.getElementById('languageSetting').value = settings.language;
    document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;
    document.getElementById('twoFactorAuth').checked = settings.twoFactorAuth;
    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('systemAlerts').checked = settings.systemAlerts;
    document.getElementById('loginNotifications').checked = settings.loginNotifications;
    document.getElementById('visibleProfile').checked = settings.visibleProfile;
    document.getElementById('loginHistory').checked = settings.loginHistory;
}

function saveSettings() {
    const settings = {
        language: document.getElementById('languageSetting').value,
        theme: document.querySelector('input[name="theme"]:checked').value,
        twoFactorAuth: document.getElementById('twoFactorAuth').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        systemAlerts: document.getElementById('systemAlerts').checked,
        loginNotifications: document.getElementById('loginNotifications').checked,
        visibleProfile: document.getElementById('visibleProfile').checked,
        loginHistory: document.getElementById('loginHistory').checked
    };

    localStorage.setItem(`settings_${currentUser.email}`, JSON.stringify(settings));
    Logger.log('SETTINGS_CHANGE', JSON.stringify(settings));
    showNotification('Paramètres enregistrés avec succès!', 'success');
}

function viewActiveSessions() {
    showNotification('Session actuelle:\n' + currentUser.nom + '\nDernière connexion: ' + (currentUser.lastLogin || 'N/A'), 'info');
}

function downloadDataExport() {
    const userData = {
        user: currentUser,
        exportDate: new Date().toLocaleString('fr-FR'),
        settings: JSON.parse(localStorage.getItem(`settings_${currentUser.email}`))
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${currentUser.email}_${new Date().getTime()}.json`;
    link.click();
    
    Logger.log('DATA_EXPORT', `Export des données pour ${currentUser.email}`);
    showNotification('Données exportées avec succès!', 'success');
}

function confirmDeleteAccount() {
    if (confirm('⚠️ ATTENTION: Voulez-vous vraiment supprimer votre compte? Cette action est irréversible!')) {
        if (confirm('Confirmez la suppression de votre compte?')) {
            Logger.log('ACCOUNT_DELETE', `Compte supprimé: ${currentUser.email}`);
            localStorage.removeItem('currentUser');
            localStorage.removeItem(`settings_${currentUser.email}`);
            localStorage.removeItem(`avatar_${currentUser.email}`);
            currentUser = null;
            showNotification('Compte supprimé. Redirection...', 'success');
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

// ==============================
// CYCLE DE VIE
// ==============================
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        currentUser = user;
        showApp();
        initializeApp();
    } else {
        showLogin();
    }
});

// Logout lors de la fermeture de la fenêtre (optionnel)
window.addEventListener('beforeunload', function() {
    if (currentUser) {
        Logger.log('WINDOW_CLOSE', 'Fermeture de la fenêtre');
    }
});