// Structure hiérarchique organisationnelle avec permissions
window.hierarchyData = {
    grades: [
        { name: "EMR", level: 1, color: "#FF6347" },
        { name: "EMT Basic", level: 2, color: "#FF7F50" },
        { name: "EMT Intermédiaire", level: 3, color: "#FFD700" },
        { name: "EMT Advanced", level: 4, color: "#32CD32" },
        { name: "Master EMT", level: 5, color: "#1E90FF" },
        { name: "Junior Paramedic", level: 6, color: "#4169E1" },
        { name: "Senior Paramedic", level: 7, color: "#9370DB" },
        { name: "Commander", level: 8, color: "#DC143C" },
        { name: "Directeur Adjoint", level: 9, color: "#FF1493" },
        { name: "Directeur", level: 10, color: "#000000" }
    ],
    executive: [
        { name: "Karl Pierce", title: "Directeur", grade: "Directeur", department: "Direction" },
        { name: "Zak Carter", title: "Directeur Adjoint", grade: "Directeur Adjoint", department: "Direction" }
    ],
    departments: [
        {
            name: "Direction",
            icon: "👔",
            color: "#FF1493",
            head: "Karl Pierce",
            role: "Direction",
            staff: ["Karl Pierce", "Zak Carter"],
            description: "Gestion générale - Toutes les permissions"
        },
        {
            name: "Pôle Supervision",
            icon: "👁️",
            color: "#4169E1",
            head: "Kader Yamaha",
            role: "Supervision",
            staff: ["Kader Yamaha", "Superviseurs"],
            description: "Supervision et contrôle qualité"
        },
        {
            name: "Pôle Formations",
            icon: "📚",
            color: "#FF8C00",
            head: "Dr. Formation",
            role: "Formations",
            staff: ["Dr. Formation", "Formateurs"],
            description: "Formation continue du personnel"
        },
        {
            name: "Pôle 💉 Advanced Médecine",
            icon: "💉",
            color: "#DC143C",
            head: "Dr. Advanced",
            role: "AdvancedMedecine",
            staff: ["Dr. Advanced", "Médecins spécialistes"],
            description: "Médecine avancée et spécialisée"
        },
        {
            name: "Pôle 🧠 Psychologie",
            icon: "🧠",
            color: "#9370DB",
            head: "Psy Expert",
            role: "Psychologie",
            staff: ["Psy Expert", "Psychologues"],
            description: "Services de psychologie et bien-être"
        },
        {
            name: "Pôle 🌙 Garde de Nuit",
            icon: "🌙",
            color: "#191970",
            head: "Night Guard",
            role: "GardeNuit",
            staff: ["Night Guard", "Équipes de nuit"],
            description: "Gestion des équipes de nuit"
        },
        {
            name: "Pôle 👨‍🎓 Apprentissage",
            icon: "👨‍🎓",
            color: "#228B22",
            head: "Apprenti Master",
            role: "Apprentissage",
            staff: ["Apprenti Master", "Apprentis"],
            description: "Programme d'apprentissage et stage"
        },
        {
            name: "Pôle 🎥 Public Relation",
            icon: "🎥",
            color: "#FF6347",
            head: "Media Manager",
            role: "PublicRelation",
            staff: ["Media Manager", "Équipe PR"],
            description: "Relations publiques et communication"
        },
        {
            name: "Pôle 👨‍🏫 Human Ressource",
            icon: "👨‍🏫",
            color: "#FFD700",
            head: "HR Manager",
            role: "HumanRessource",
            staff: ["HR Manager", "Équipe RH"],
            description: "Gestion des ressources humaines"
        }
    ]
};
