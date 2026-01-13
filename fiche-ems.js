// FICHES-EMPLOYE.JS - Gestion des fiches employée
// Affichage des heures travaillées et salaires (en attente d'API)

// ==============================
// DONNÉES GÉNÉRÉES DYNAMIQUEMENT
// ==============================
let fichesEmployeData = [];

function generateFichesEmploye() {
    if (!window.staffData || window.staffData.length === 0) {
        return [];
    }
    
    return window.staffData.map(employee => ({
        id: `FICHE-EMP-${employee.id}`,
        nom: employee.nom,
        email: employee.email,
        role: employee.role,
        grade: employee.grade,
        heuresThisWeek: '-- h',
        heuresThisMonth: '-- h',
        salaire: '-- $',
        salaireMensuel: '-- $',
        status: 'En attente de données',
        createdAt: new Date().toLocaleDateString('fr-FR')
    }));
}

let filteredFichesEmploye = [];

// ==============================
// INITIALISATION
// ==============================
function initFichesEmploye() {
    fichesEmployeData = generateFichesEmploye();
    filteredFichesEmploye = [...fichesEmployeData];
    displayFichesEmploye(filteredFichesEmploye);
}

// ==============================
// AFFICHAGE DES FICHES
// ==============================
function displayFichesEmploye(fiches) {
    const container = document.getElementById('fichesEmployeContainer');
    
    if (!fiches || fiches.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                <i class="fas fa-user" style="font-size: 3rem; margin-bottom: 20px; color: #FF69B4; opacity: 0.5;"></i>
                <h3>Aucun employé trouvé</h3>
                <p>Modifiez vos filtres ou rafraîchissez la page.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = fiches.map((fiche, index) => {
        const roleColor = getRoleColor(fiche.role);
        
        return `
            <div class="fiche-employe-card" style="animation-delay: ${index * 0.1}s; border-left-color: ${roleColor};">
                <div class="fiche-employe-header">
                    <div>
                        <div class="fiche-employe-name">${fiche.nom}</div>
                        <div class="fiche-employe-grade">${fiche.grade}</div>
                    </div>
                    <span class="fiche-employe-role" style="background: linear-gradient(135deg, ${roleColor}, ${roleColor}dd); color: white;">
                        ${fiche.role}
                    </span>
                </div>
                
                <div class="fiche-employe-content">
                    <div class="employe-section">
                        <div class="employe-label"><i class="fas fa-envelope"></i> Email</div>
                        <div class="employe-value">${fiche.email}</div>
                    </div>
                    
                    <div class="employe-section employe-section-highlighted">
                        <div class="employe-label"><i class="fas fa-clock"></i> Heures travaillées</div>
                        <div class="employe-stats">
                            <div class="stat-item">
                                <span class="stat-label">Cette semaine:</span>
                                <span class="stat-value">${fiche.heuresThisWeek}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Ce mois:</span>
                                <span class="stat-value">${fiche.heuresThisMonth}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="employe-section employe-section-salary">
                        <div class="employe-label"><i class="fas fa-dollar-sign"></i> Salaire</div>
                        <div class="employe-stats">
                            <div class="stat-item">
                                <span class="stat-label">Actuel:</span>
                                <span class="stat-value" style="color: #228B22; font-weight: 700;">${fiche.salaire}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Mensuel estimé:</span>
                                <span class="stat-value" style="color: #FF69B4; font-weight: 700;">${fiche.salaireMensuel}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="employe-status">
                        <i class="fas fa-hourglass-half"></i> ${fiche.status}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==============================
// FILTRAGE
// ==============================
function filterFichesEmploye() {
    const roleFilter = document.getElementById('ficheEmployeRoleFilter').value;
    const searchInput = document.getElementById('ficheEmployeSearch').value.toLowerCase();
    
    filteredFichesEmploye = fichesEmployeData.filter(fiche => {
        const matchRole = !roleFilter || fiche.role === roleFilter;
        const matchSearch = !searchInput || fiche.nom.toLowerCase().includes(searchInput);
        
        return matchRole && matchSearch;
    });
    
    displayFichesEmploye(filteredFichesEmploye);
}

// ==============================
// UTILITAIRES
// ==============================
function getRoleColor(role) {
    switch(role) {
        case 'Direction': return '#FF6B6B';
        case 'Supervision': return '#4169E1';
        case 'EMS': return '#FF69B4';
        default: return '#FF69B4';
    }
}

// ==============================
// ÉVÉNEMENTS DE CHARGEMENT
// ==============================
// Ne pas appeler initFichesEmploye au chargement
// Elle sera appelée via switchTab() quand l'utilisateur clique sur l'onglet
