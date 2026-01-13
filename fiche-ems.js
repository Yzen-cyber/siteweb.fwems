// FICHE-EMS.JS - Gestion des fiches EMS (Direction et Supervision uniquement)
// Création, consultation et gestion des fiches d'intervention liées aux employés

// ==============================
// DONNÉES DYNAMIQUES - Liées aux employés
// ==============================
let fichesEMSData = [];

// Fonction pour générer les fiches basées sur les employés
function generateFichesFromEmployees() {
    if (!window.staffData || window.staffData.length === 0) {
        return [];
    }
    
    // Créer des fiches pour les employés EMS uniquement
    const emsStaff = window.staffData.filter(staff => staff.role === 'EMS');
    
    return emsStaff.slice(0, 5).map((employee, index) => ({
        id: `FICHE-2026-${String(index + 1).padStart(3, '0')}`,
        date: new Date().toLocaleDateString('fr-FR'),
        patient: `Patient ${index + 1}`,
        age: 45 + index,
        address: `${Math.floor(Math.random() * 100)} Rue de la Ville`,
        phone: `+33 6 ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        personnel: employee.nom,
        personnelId: employee.id,
        grade: employee.grade,
        diagnostic: 'En attente d\'informations',
        treatment: 'En attente d\'informations',
        status: 'en-cours',
        createdBy: employee.nom,
        createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }));
}

let filteredFichesEMS = [];

// ==============================
// INITIALISATION
// ==============================
function initFicheEMS() {
    // Vérifier les permissions (Direction et Supervision uniquement)
    if (!currentUser || (currentUser.role !== 'Direction' && currentUser.role !== 'Supervision')) {
        document.getElementById('tab-fiche-ems').innerHTML = `
            <div class="page-header"><h1><i class="fas fa-file-alt"></i> Fiches EMS</h1></div>
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <i class="fas fa-lock" style="font-size: 3rem; margin-bottom: 20px; color: #FF6B6B;"></i>
                <h3>Accès Refusé</h3>
                <p>Seule la Direction et la Supervision peuvent accéder aux fiches EMS.</p>
            </div>
        `;
        return;
    }
    
    // Générer les fiches à partir des employés
    fichesEMSData = generateFichesFromEmployees();
    filteredFichesEMS = [...fichesEMSData];
    
    displayFichesEMS(filteredFichesEMS);
}

// ==============================
// AFFICHAGE DES FICHES
// ==============================
function displayFichesEMS(fiches) {
    const container = document.getElementById('fichesEMSContainer');
    
    if (!fiches || fiches.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                <i class="fas fa-file" style="font-size: 3rem; margin-bottom: 20px; color: #FF69B4; opacity: 0.5;"></i>
                <h3>Aucune fiche trouvée</h3>
                <p>Modifiez vos filtres ou créez une nouvelle fiche.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = fiches.map((fiche, index) => `
        <div class="fiche-card" style="animation-delay: ${index * 0.1}s; border-left-color: ${getStatusColor(fiche.status)};">
            <div class="fiche-header">
                <div>
                    <div class="fiche-number">${fiche.id}</div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 4px;">${fiche.date}</div>
                </div>
                <span class="fiche-status ${fiche.status}">
                    ${fiche.status === 'en-cours' ? 'En Cours' : fiche.status === 'complete' ? 'Complètée' : 'Archivée'}
                </span>
            </div>
            
            <div class="fiche-patient-info">
                <div class="fiche-label"><i class="fas fa-user"></i> Employé Responsable</div>
                <div class="fiche-value">${fiche.personnel} (${fiche.grade})</div>
                
                <div class="fiche-label" style="margin-top: 8px;"><i class="fas fa-user-injured"></i> Patient</div>
                <div class="fiche-value">${fiche.patient}, ${fiche.age} ans</div>
                
                <div class="fiche-label" style="margin-top: 8px;"><i class="fas fa-map-marker-alt"></i> Adresse</div>
                <div class="fiche-value">${fiche.address}</div>
                
                <div class="fiche-label" style="margin-top: 8px;"><i class="fas fa-phone"></i> Téléphone</div>
                <div class="fiche-value">${fiche.phone}</div>
                
                <div class="fiche-label" style="margin-top: 8px;"><i class="fas fa-stethoscope"></i> Diagnostic</div>
                <div class="fiche-value">${fiche.diagnostic}</div>
                
                <div class="fiche-label" style="margin-top: 8px;"><i class="fas fa-pills"></i> Traitement</div>
                <div class="fiche-value">${fiche.treatment}</div>
                
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0, 0, 0, 0.1); font-size: 0.85rem; color: #999;">
                    <div>Créé par: ${fiche.createdBy} à ${fiche.createdAt}</div>
                </div>
            </div>
            
            <div class="fiche-actions">
                <button class="fiche-btn" onclick="viewFicheDetails('${fiche.id}')" style="background: linear-gradient(135deg, #4169E1, #1E90FF);">
                    <i class="fas fa-eye"></i> Voir
                </button>
                <button class="fiche-btn" onclick="editFiche('${fiche.id}')" style="background: linear-gradient(135deg, #FFA500, #FFB347);">
                    <i class="fas fa-edit"></i> Éditer
                </button>
                <button class="fiche-btn" onclick="deleteFiche('${fiche.id}')" style="background: linear-gradient(135deg, #FF6B6B, #FF8787);">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// ==============================
// FILTRAGE
// ==============================
function filterFichesEMS() {
    const searchInput = document.getElementById('ficheSearch').value.toLowerCase();
    const statusFilter = document.getElementById('ficheStatusFilter').value;
    
    filteredFichesEMS = fichesEMSData.filter(fiche => {
        const matchSearch = !searchInput || 
                           fiche.id.toLowerCase().includes(searchInput) ||
                           fiche.patient.toLowerCase().includes(searchInput) ||
                           fiche.diagnostic.toLowerCase().includes(searchInput);
        
        const matchStatus = !statusFilter || fiche.status === statusFilter;
        
        return matchSearch && matchStatus;
    });
    
    displayFichesEMS(filteredFichesEMS);
}

// ==============================
// ACTIONS
// ==============================
function createNewFicheEMS() {
    if (!currentUser || (currentUser.role !== 'Direction' && currentUser.role !== 'Supervision')) {
        alert('Seule la Direction et la Supervision peuvent créer des fiches.');
        return;
    }
    
    alert('Créer une nouvelle fiche EMS');
    // Ici on pourrait ouvrir un formulaire de création
}

function viewFicheDetails(ficheId) {
    const fiche = fichesEMSData.find(f => f.id === ficheId);
    if (fiche) {
        alert(`Affichage des détails de la fiche ${ficheId}\n\nPatient: ${fiche.patient}\nDiagnostic: ${fiche.diagnostic}`);
    }
}

function editFiche(ficheId) {
    if (!currentUser || (currentUser.role !== 'Direction' && currentUser.role !== 'Supervision')) {
        alert('Seule la Direction et la Supervision peuvent éditer les fiches.');
        return;
    }
    
    const fiche = fichesEMSData.find(f => f.id === ficheId);
    if (fiche) {
        alert(`Édition de la fiche ${ficheId}\n\nPatient: ${fiche.patient}`);
    }
}

function deleteFiche(ficheId) {
    if (!currentUser || currentUser.role !== 'Direction') {
        alert('Seule la Direction peut supprimer les fiches.');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer la fiche ${ficheId} ?`)) {
        fichesEMSData = fichesEMSData.filter(f => f.id !== ficheId);
        filterFichesEMS();
        alert('Fiche supprimée avec succès');
    }
}

// ==============================
// UTILITAIRES
// ==============================
function getStatusColor(status) {
    switch(status) {
        case 'en-cours': return '#4169E1';
        case 'complete': return '#228B22';
        case 'archivee': return '#808080';
        default: return '#FF69B4';
    }
}

// ==============================
// ÉVÉNEMENTS DE CHARGEMENT
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fichesEMSContainer')) {
        initFicheEMS();
    }
});
