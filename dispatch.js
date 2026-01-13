// DISPATCH.JS - Centre de Dispatch
// En attente de données API/Serveur

// ==============================
// DONNÉES EN ATTENTE
// ==============================
let dispatchData = {
    calls: [],
    units: [],
    interventions: []
};

// ==============================
// INITIALISATION
// ==============================
function initDispatch() {
    displayDispatchCalls();
    displayDispatchUnits();
    displayDispatchInterventions();
}

// ==============================
// AFFICHAGE DES APPELS
// ==============================
function displayDispatchCalls() {
    const container = document.getElementById('dispatchCallsList');
    
    if (!dispatchData.calls || dispatchData.calls.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <i class="fas fa-hourglass-half" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h4 style="margin: 0; color: #666;">En attente de données</h4>
                <p style="font-size: 0.85rem; margin: 5px 0 0 0;">Aucun appel actuellement</p>
                <p style="font-size: 0.75rem; color: #AAA; margin-top: 10px;">Connectez une source de données API/Serveur</p>
            </div>
        `;
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
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <i class="fas fa-hourglass-half" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h4 style="margin: 0; color: #666;">En attente de données</h4>
                <p style="font-size: 0.85rem; margin: 5px 0 0 0;">Aucune unité disponible</p>
                <p style="font-size: 0.75rem; color: #AAA; margin-top: 10px;">Connectez une source de données API/Serveur</p>
            </div>
        `;
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
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px 20px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <i class="fas fa-hourglass-half" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h4 style="margin: 0; color: #666;">En attente de données</h4>
                <p style="font-size: 0.85rem; margin: 5px 0 0 0;">Aucune intervention active</p>
                <p style="font-size: 0.75rem; color: #AAA; margin-top: 10px;">Connectez une source de données API/Serveur</p>
            </div>
        `;
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
    alert(`[Système en attente] Unité assignée à l'appel ${callId}`);
    // Sera connecté à l'API une fois disponible
}

// ==============================
// ÉVÉNEMENTS DE CHARGEMENT
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dispatchCallsList')) {
        initDispatch();
    }
});
