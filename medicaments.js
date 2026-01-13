// MEDICAMENTS.JS - Gestion des médicaments
// Affichage, filtrage et recherche des médicaments

// ==============================
// VARIABLES GLOBALES
// ==============================
let medicamentsView = 'cards'; // 'cards' ou 'list'
let filteredMedicaments = [...window.drugsData];

// ==============================
// INITIALISATION
// ==============================
function initMedicaments() {
    displayMedicaments(filteredMedicaments);
}

// ==============================
// AFFICHAGE DES MÉDICAMENTS
// ==============================
function displayMedicaments(medicaments) {
    const container = document.getElementById('medicamentsContainer');
    
    if (!medicaments || medicaments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-pills empty-state-icon"></i>
                <h3>Aucun médicament trouvé</h3>
                <p>Modifiez vos filtres ou votre recherche pour trouver un médicament</p>
            </div>
        `;
        return;
    }

    container.innerHTML = medicaments.map((med, index) => {
        const categoryClass = `category-${med.category}`;
        
        if (medicamentsView === 'list') {
            return createMedicamentListView(med, categoryClass);
        } else {
            return createMedicamentCardView(med, categoryClass);
        }
    }).join('');

    // Ajouter les event listeners
    document.querySelectorAll('.medicament-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                toggleMedicamentDetails(card);
            }
        });
    });
}

// ==============================
// VUES DES MÉDICAMENTS
// ==============================
function createMedicamentCardView(med, categoryClass) {
    const categoryIcon = getCategoryIcon(med.category);
    
    return `
        <div class="medicament-card" data-id="${med.id}" data-category="${med.category}">
            <div class="medicament-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">${categoryIcon}</span>
                    <h3 class="medicament-title">${med.name}</h3>
                </div>
            </div>
            <span class="medicament-category ${categoryClass}">${formatCategory(med.category)}</span>
            <p class="medicament-function"><i class="fas fa-info-circle"></i> ${med.function}</p>
            <p class="medicament-description">${med.description}</p>
            
            <div class="medicament-details">
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-vial"></i> Dosage</div>
                    <div class="medicament-value">${med.dosage}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-exclamation-circle"></i> Effets Secondaires</div>
                    <div class="medicament-value">${med.sideEffects}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-shield-alt"></i> Précautions</div>
                    <div class="medicament-value">${med.precautions}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-ban"></i> Contre-indications</div>
                    <div class="medicament-value">${med.contraindications}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-syringe"></i> Administration</div>
                    <div class="medicament-value"><strong>${med.administration}</strong></div>
                </div>
            </div>
        </div>
    `;
}

function createMedicamentListView(med, categoryClass) {
    const categoryIcon = getCategoryIcon(med.category);
    
    return `
        <div class="medicament-card list-item" data-id="${med.id}" data-category="${med.category}">
            <div class="medicament-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">${categoryIcon}</span>
                    <div>
                        <h3 class="medicament-title">${med.name}</h3>
                        <span class="medicament-category ${categoryClass}">${formatCategory(med.category)}</span>
                    </div>
                </div>
                <p class="medicament-function"><i class="fas fa-info-circle"></i> ${med.function}</p>
                <p class="medicament-description">${med.description}</p>
            </div>
            
            <div class="medicament-details">
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-vial"></i> Dosage</div>
                    <div class="medicament-value">${med.dosage}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-exclamation-circle"></i> Effets Secondaires</div>
                    <div class="medicament-value">${med.sideEffects}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-shield-alt"></i> Précautions</div>
                    <div class="medicament-value">${med.precautions}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-ban"></i> Contre-indications</div>
                    <div class="medicament-value">${med.contraindications}</div>
                </div>
                
                <div class="medicament-section">
                    <div class="medicament-label"><i class="fas fa-syringe"></i> Administration</div>
                    <div class="medicament-value"><strong>${med.administration}</strong></div>
                </div>
            </div>
        </div>
    `;
}

// ==============================
// FILTRAGE ET RECHERCHE
// ==============================
function filterMedicaments() {
    const categoryFilter = document.getElementById('medicamentsCategoryFilter').value;
    const searchInput = document.getElementById('medicamentsSearchInput').value.toLowerCase();
    
    filteredMedicaments = window.drugsData.filter(med => {
        const matchCategory = !categoryFilter || med.category === categoryFilter;
        const matchSearch = !searchInput || 
                           med.name.toLowerCase().includes(searchInput) ||
                           med.function.toLowerCase().includes(searchInput) ||
                           med.description.toLowerCase().includes(searchInput);
        
        return matchCategory && matchSearch;
    });
    
    displayMedicaments(filteredMedicaments);
}

// ==============================
// CHANGEMENT DE VUE
// ==============================
function setMedicamentsView(viewType) {
    medicamentsView = viewType;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
    
    // Mettre à jour la classe du conteneur
    const container = document.getElementById('medicamentsContainer');
    container.classList.remove('cards-view', 'list-view');
    container.classList.add(viewType === 'list' ? 'list-view' : 'cards-view');
    
    // Afficher les médicaments avec la nouvelle vue
    displayMedicaments(filteredMedicaments);
}

// ==============================
// UTILITAIRES
// ==============================
function formatCategory(category) {
    const categoryNames = {
        'antibiotique': 'Antibiotique',
        'anesthesique': 'Anesthésique',
        'analgesique': 'Analgésique',
        'cardiovasculaire': 'Cardiovasculaire',
        'antiinflammatoire': 'Anti-inflammatoire',
        'antiviral': 'Antiviral',
        'neurologique': 'Neurologique',
        'digestif': 'Digestif',
        'urgence': 'Urgence'
    };
    
    return categoryNames[category] || category;
}

function getCategoryIcon(category) {
    const icons = {
        'antibiotique': '🧬',
        'anesthesique': '💉',
        'analgesique': '💊',
        'cardiovasculaire': '❤️',
        'antiinflammatoire': '🔥',
        'antiviral': '🦠',
        'neurologique': '🧠',
        'digestif': '🫀',
        'urgence': '⚠️'
    };
    
    return icons[category] || '💊';
}

function toggleMedicamentDetails(card) {
    // Fermer les autres cartes
    document.querySelectorAll('.medicament-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });
    
    card.classList.toggle('expanded');
}

// ==============================
// ÉVÉNEMENTS DE CHARGEMENT
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les médicaments si la page est chargée
    if (document.getElementById('medicamentsContainer')) {
        initMedicaments();
    }
});
