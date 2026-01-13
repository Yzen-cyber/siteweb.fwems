// Système de permissions et rôles
window.permissionsData = {
    // Définition des permissions disponibles
    availablePermissions: [
        'view_medicaments',
        'edit_medicaments',
        'delete_medicaments',
        'view_patients',
        'create_patients',
        'edit_patients',
        'delete_patients',
        'view_staff',
        'edit_staff',
        'delete_staff',
        'view_reports',
        'create_reports',
        'edit_reports',
        'manage_users',
        'manage_permissions',
        'view_schedules',
        'edit_schedules',
        'view_training',
        'create_training',
        'view_psychology',
        'create_psychology',
        'view_night_shift',
        'manage_night_shift',
        'view_apprentices',
        'manage_apprentices',
        'view_pr',
        'manage_pr',
        'view_hr',
        'manage_hr'
    ],

    // Définition des rôles et leurs permissions
    roles: {
        // Direction - All Permissions
        'Direction': {
            name: 'Direction',
            icon: '👔',
            color: '#FF1493',
            permissions: [
                'view_medicaments', 'edit_medicaments', 'delete_medicaments',
                'view_patients', 'create_patients', 'edit_patients', 'delete_patients',
                'view_staff', 'edit_staff', 'delete_staff',
                'view_reports', 'create_reports', 'edit_reports',
                'manage_users', 'manage_permissions',
                'view_schedules', 'edit_schedules',
                'view_training', 'create_training',
                'view_psychology', 'create_psychology',
                'view_night_shift', 'manage_night_shift',
                'view_apprentices', 'manage_apprentices',
                'view_pr', 'manage_pr',
                'view_hr', 'manage_hr'
            ]
        },

        // Grade: Directeur Adjoint
        'Directeur Adjoint': {
            name: 'Directeur Adjoint',
            icon: '🛡️',
            color: '#FF1493',
            permissions: [
                'view_medicaments', 'edit_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_staff', 'edit_staff',
                'view_reports', 'create_reports', 'edit_reports',
                'manage_users',
                'view_schedules', 'edit_schedules'
            ]
        },

        // Grade: Commander
        'Commander': {
            name: 'Commander',
            icon: '⚔️',
            color: '#DC143C',
            permissions: [
                'view_medicaments', 'edit_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_staff',
                'view_reports', 'create_reports',
                'view_schedules', 'edit_schedules'
            ]
        },

        // Grade: Senior Paramedic
        'Senior Paramedic': {
            name: 'Senior Paramedic',
            icon: '🏥',
            color: '#4169E1',
            permissions: [
                'view_medicaments', 'edit_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_staff',
                'view_reports', 'create_reports',
                'view_schedules'
            ]
        },

        // Grade: Junior Paramedic
        'Junior Paramedic': {
            name: 'Junior Paramedic',
            icon: '🚑',
            color: '#32CD32',
            permissions: [
                'view_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_reports'
            ]
        },

        // Grade: Master EMT
        'Master EMT': {
            name: 'Master EMT',
            icon: '⭐',
            color: '#1E90FF',
            permissions: [
                'view_medicaments', 'edit_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_reports', 'create_reports'
            ]
        },

        // Grade: EMT Advanced
        'EMT Advanced': {
            name: 'EMT Advanced',
            icon: '🔧',
            color: '#32CD32',
            permissions: [
                'view_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_reports'
            ]
        },

        // Grade: EMT Intermédiaire
        'EMT Intermédiaire': {
            name: 'EMT Intermédiaire',
            icon: '💊',
            color: '#FFD700',
            permissions: [
                'view_medicaments',
                'view_patients', 'view_reports'
            ]
        },

        // Grade: EMT Basic
        'EMT Basic': {
            name: 'EMT Basic',
            icon: '📋',
            color: '#FF7F50',
            permissions: [
                'view_medicaments',
                'view_patients'
            ]
        },

        // Grade: EMR
        'EMR': {
            name: 'EMR',
            icon: '🚨',
            color: '#FF6347',
            permissions: [
                'view_patients'
            ]
        },

        // Pôle Supervision
        'Supervision': {
            name: 'Pôle Supervision',
            icon: '👁️',
            color: '#4169E1',
            permissions: [
                'view_medicaments',
                'view_patients', 'view_staff',
                'view_schedules',
                'view_reports'
            ]
        },

        // Pôle Formations
        'Formations': {
            name: 'Pôle Formations',
            icon: '📚',
            color: '#FF8C00',
            permissions: [
                'view_training', 'create_training',
                'view_medicaments',
                'view_staff'
            ]
        },

        // Pôle Advanced Médecine
        'AdvancedMedecine': {
            name: 'Pôle 💉 Advanced Médecine',
            icon: '💉',
            color: '#DC143C',
            permissions: [
                'view_medicaments', 'edit_medicaments',
                'view_patients', 'create_patients', 'edit_patients',
                'view_staff',
                'view_reports', 'create_reports'
            ]
        },

        // Pôle Psychologie
        'Psychologie': {
            name: 'Pôle 🧠 Psychologie',
            icon: '🧠',
            color: '#9370DB',
            permissions: [
                'view_psychology', 'create_psychology',
                'view_patients', 'create_patients', 'edit_patients',
                'view_reports', 'create_reports'
            ]
        },

        // Pôle Garde de Nuit
        'GardeNuit': {
            name: 'Pôle 🌙 Garde de Nuit',
            icon: '🌙',
            color: '#191970',
            permissions: [
                'view_medicaments',
                'view_patients',
                'view_night_shift', 'manage_night_shift',
                'view_schedules'
            ]
        },

        // Pôle Apprentissage
        'Apprentissage': {
            name: 'Pôle 👨‍🎓 Apprentissage',
            icon: '👨‍🎓',
            color: '#228B22',
            permissions: [
                'view_apprentices', 'manage_apprentices',
                'view_training',
                'view_medicaments',
                'view_patients'
            ]
        },

        // Pôle Public Relations
        'PublicRelation': {
            name: 'Pôle 🎥 Public Relation',
            icon: '🎥',
            color: '#FF6347',
            permissions: [
                'view_pr', 'manage_pr',
                'view_staff',
                'view_reports'
            ]
        },

        // Pôle Ressources Humaines
        'HumanRessource': {
            name: 'Pôle 👨‍🏫 Human Ressource',
            icon: '👨‍🏫',
            color: '#FFD700',
            permissions: [
                'view_hr', 'manage_hr',
                'view_staff', 'edit_staff',
                'manage_users',
                'view_training'
            ]
        }
    },

    // Fonction pour vérifier les permissions d'un utilisateur
    hasPermission: function(userRole, permission) {
        const role = this.roles[userRole];
        if (!role) return false;
        return role.permissions.includes(permission);
    },

    // Fonction pour obtenir toutes les permissions d'un rôle
    getPermissions: function(userRole) {
        const role = this.roles[userRole];
        return role ? role.permissions : [];
    },

    // Fonction pour obtenir les informations d'un rôle
    getRoleInfo: function(userRole) {
        return this.roles[userRole] || null;
    }
};
