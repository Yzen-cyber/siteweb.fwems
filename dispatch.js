// DISPATCH.JS - Gestion du centre de dispatch
// Simulation d'appels, unités et interventions

// ==============================
// DONNÉES SIMULÉES
// ==============================
let dispatchData = {
    calls: [
        {
            id: 'APP001',
            patient: 'Jean Martin',
            address: '45 Rue de la Paix, Centre-Ville',
            phone: '+33 6 12 34 56 78',
            description: 'Douleur thoracique',
            priority: 'Haute',
            time: '14:35',
            status: 'pending'
        },
        {
            id: 'APP002',
            patient: 'Marie Dubois',
            address: '12 Avenue des Champs, Quartier Nord',
            phone: '+33 6 98 76 54 32',
            description: 'Accident de la route',
            priority: 'Critique',
            time: '14:42',
            status: 'pending'
        },
        {
            id: 'APP003',
            patient: 'Pierre Lambert',
            address: '78 Boulevard Central, Zone Est',
            phone: '+33 6 45 67 89 01',
            description: 'Chute avec blessure',
            priority: 'Moyenne',
            time: '14:50',
            status: 'pending'
        }
    ],
    units: [
        {
            id: 'UNIT-01',
            name: 'Ambulance A01',
            crew: 'Sarah Johnson & David Martinez',
            location: 'Station Centre',
            status: 'available'
        },
        {
            id: 'UNIT-02',
            name: 'Ambulance A02',
            crew: 'Emily Rodriguez & James Wilson',
            location: 'Interventions - Rue de la Paix',
            status: 'active'
        },
        {
            id: 'UNIT-03',
            name: 'Ambulance A03',
            crew: 'Lisa Anderson & Michael Taylor',
            location: 'Station Nord',
            status: 'available'
        }
    ],
    interventions: [
        {
            id: 'INT001',
            patient: 'Sophie Renard',
            address: 'Rue de la Paix, Centre-Ville',
            unit: 'Ambulance A02',
            startTime: '14:15',
            status: 'active'
        },
        {
            id: 'INT002',
            patient: 'Luc Bernard',
            address: 'Avenue des Fleurs, Quartier Sud',
            unit: 'Ambulance A04',
            startTime: '13:45',
            status: 'active'
        },
        {
            id: 'INT003',
            patient: 'Anne Moreau',
            address: 'Place Centrale, Centre-Ville',
            unit: 'Ambulance A05',
            startTime: '13:30',
            status: 'active'
        }
    ]
};

// ==============================
// INITIALISATION
// ==============================
function initDispatch() {
    displayDispatchCalls();
    displayDispatchUnits();
    displayDispatchInterventions();
    
    // Simuler l'arrivée d'appels toutes les 30 secondes
    setInterval(simulateIncomingCall, 30000);
}

// ==============================
// AFFICHAGE DES APPELS
// ==============================
function displayDispatchCalls() {
    const container = document.getElementById('dispatchCallsList');
    
    if (!dispatchData.calls || dispatchData.calls.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;"><i class="fas fa-phone-slash"></i> Aucun appel en attente</div>';
        return;
    }
    
    container.innerHTML = dispatchData.calls.map((call, index) => `
        <div class="call-item" style="animation-delay: ${index * 0.1}s;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <strong>${call.id}</strong>
                <span class="call-status status-pending">En Attente</span>
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 6px;">
                <div style="color: #333;"><i class="fas fa-user"></i> ${call.patient}</div>
                <div style="color: #666; font-size: 0.85rem;"><i class="fas fa-map-marker-alt"></i> ${call.address}</div>
            </div>
            <div style="background: rgba(255, 0, 0, 0.1); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 0.9rem; color: #CC0000;">
                <strong>Priorité:</strong> ${call.priority}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #666;">
                <span>${call.description}</span>
                <span style="font-weight: 600;">${call.time}</span>
            </div>
            <button onclick="assignUnit('${call.id}')" style="width: 100%; margin-top: 8px; padding: 6px; background: linear-gradient(135deg, #4169E1, #1E90FF); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
                <i class="fas fa-paper-plane"></i> Assigner une unité
            </button>
        </div>
    `).join('');
}

// ==============================
// AFFICHAGE DES UNITÉS
// ==============================
function displayDispatchUnits() {
    const container = document.getElementById('dispatchUnitsList');
    
    if (!dispatchData.units || dispatchData.units.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;"><i class="fas fa-ban"></i> Aucune unité disponible</div>';
        return;
    }
    
    container.innerHTML = dispatchData.units.map((unit, index) => {
        const statusColor = unit.status === 'available' ? '#228B22' : '#4169E1';
        const statusText = unit.status === 'available' ? 'Disponible' : 'En intervention';
        
        return `
            <div class="unit-item" style="animation-delay: ${index * 0.1}s; border-left-color: ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong>${unit.name}</strong>
                    <span style="background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                        ${statusText}
                    </span>
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                    <div style="margin-bottom: 4px;"><i class="fas fa-users"></i> ${unit.crew}</div>
                    <div><i class="fas fa-location-dot"></i> ${unit.location}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ==============================
// AFFICHAGE DES INTERVENTIONS
// ==============================
function displayDispatchInterventions() {
    const container = document.getElementById('dispatchInterventionsList');
    
    if (!dispatchData.interventions || dispatchData.interventions.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;"><i class="fas fa-check-circle"></i> Aucune intervention active</div>';
        return;
    }
    
    container.innerHTML = dispatchData.interventions.map((intervention, index) => `
        <div class="intervention-item" style="animation-delay: ${index * 0.1}s; border-left-color: #FFA500;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <strong>${intervention.id}</strong>
                <span class="call-status status-active">En Cours</span>
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 6px;">
                <div style="color: #333;"><i class="fas fa-user"></i> ${intervention.patient}</div>
                <div style="color: #666; font-size: 0.85rem;"><i class="fas fa-map-marker-alt"></i> ${intervention.address}</div>
            </div>
            <div style="background: rgba(255, 165, 0, 0.1); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 0.9rem;">
                <strong>Unité:</strong> ${intervention.unit}
            </div>
            <div style="font-size: 0.85rem; color: #666;">
                <span>Commencée à ${intervention.startTime}</span>
            </div>
        </div>
    `).join('');
}

// ==============================
// ACTIONS
// ==============================
function assignUnit(callId) {
    alert(`Unité assignée à l'appel ${callId}`);
    // Ici on pourrait implémenter l'API pour assigner une unité
}

function simulateIncomingCall() {
    const names = ['Luc Renard', 'Sophie Martin', 'Pierre Dumont', 'Anne Lefevre', 'Jacques Bernard'];
    const addresses = ['15 Rue de la Paix', '42 Avenue Central', '78 Boulevard Nord', '23 Place Est', '56 Rue Ouest'];
    const descriptions = ['Malaise général', 'Douleur abdominale', 'Trauma léger', 'Difficultés respiratoires', 'Brûlure'];
    
    const newCall = {
        id: 'APP' + String(Math.random()).slice(2, 5).padStart(3, '0'),
        patient: names[Math.floor(Math.random() * names.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        phone: '+33 6 ' + Math.floor(Math.random() * 100) + ' ' + Math.floor(Math.random() * 100) + ' ' + Math.floor(Math.random() * 100),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        priority: ['Basse', 'Moyenne', 'Haute', 'Critique'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending'
    };
    
    dispatchData.calls.push(newCall);
    displayDispatchCalls();
}

// ==============================
// ÉVÉNEMENTS DE CHARGEMENT
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dispatchCallsList')) {
        initDispatch();
    }
});
