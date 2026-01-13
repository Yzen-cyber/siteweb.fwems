// Grille des salaires et tarifications EMS STFH
window.salaryData = {
    // Grille Supervision (15h/semaine minimum)
    supervision: {
        name: "Grille Supervision",
        minHoursPerWeek: 15,
        minHoursPerDay: "2h10m",
        roles: [
            {
                grade: "Directeur",
                hourlyRate: 7000,
                perQuarter: 500,
                description: "Directeur"
            },
            {
                grade: "Directeur Adjoint",
                hourlyRate: 7000,
                perQuarter: 500,
                description: "Directeur Adjoint"
            },
            {
                grade: "Deputy Chief",
                hourlyRate: 6000,
                perQuarter: 500,
                description: "Deputy Chief"
            },
            {
                grade: "Commander",
                hourlyRate: 5500,
                perQuarter: 475,
                description: "Commander"
            },
            {
                grade: "Lead Paramedic",
                hourlyRate: 5000,
                perQuarter: 425,
                description: "Lead Paramedic"
            },
            {
                grade: "Senior Paramedic",
                hourlyRate: 4500,
                perQuarter: 400,
                description: "Senior Paramedic"
            },
            {
                grade: "Junior Paramedic",
                hourlyRate: 4000,
                perQuarter: 375,
                description: "Junior Paramedic"
            }
        ],
        minHours: 15,
        bonuses: {
            over20Hours: 15000,
            over30Hours: 25000
        }
    },

    // Grille EMS (15h/semaine minimum)
    ems: {
        name: "Grille EMS",
        minHoursPerWeek: 15,
        minHoursPerDay: "2h10m",
        roles: [
            {
                grade: "Master EMT",
                hourlyRate: 3750,
                perQuarter: 350,
                description: "Master EMT"
            },
            {
                grade: "EMT Advanced",
                hourlyRate: 3500,
                perQuarter: 325,
                description: "EMT Advanced"
            },
            {
                grade: "EMT Intermédiaire",
                hourlyRate: 3000,
                perQuarter: 250,
                description: "EMT Intermédiaire"
            },
            {
                grade: "EMT Basic",
                hourlyRate: 2750,
                perQuarter: 225,
                description: "EMT Basic"
            },
            {
                grade: "EMR",
                hourlyRate: 2500,
                perQuarter: 175,
                description: "EMR"
            },
            {
                grade: "Infirmaire",
                hourlyRate: 2000,
                perQuarter: 100,
                description: "Infirmaire"
            }
        ],
        minHours: 15,
        bonuses: {
            over20Hours: 15000,
            over30Hours: 25000,
            perOperation: 500
        }
    },

    // Bonus supplémentaires
    additionalBonuses: {
        operationBonus: {
            amount: 500,
            description: "Bonus par opération effectuée"
        },
        poleBonus: {
            amount: 10000,
            maxPoles: 2,
            maxAmount: 30000,
            description: "Bonus par pôle (max 2 = 30 000$)"
        },
        performanceBonus: {
            amount: 40000,
            description: "Bonus de rendement"
        },
        hoursBonus: {
            over20: 15000,
            over30: 25000,
            description: "Prime pour heures supplémentaires"
        }
    },

    // Obtenir le taux horaire par grade
    getHourlyRate: function(grade) {
        const supervisorRole = this.supervision.roles.find(r => r.grade === grade);
        if (supervisorRole) return supervisorRole.hourlyRate;
        
        const emsRole = this.ems.roles.find(r => r.grade === grade);
        if (emsRole) return emsRole.hourlyRate;
        
        return 0;
    },

    // Obtenir les détails d'un grade
    getGradeDetails: function(grade) {
        const supervisorRole = this.supervision.roles.find(r => r.grade === grade);
        if (supervisorRole) return supervisorRole;
        
        const emsRole = this.ems.roles.find(r => r.grade === grade);
        if (emsRole) return emsRole;
        
        return null;
    },

    // Calculer le salaire
    calculateSalary: function(staffMember) {
        if (!staffMember || !staffMember.grade) return null;

        const hourlyRate = this.getHourlyRate(staffMember.grade);
        if (!hourlyRate) return null;

        const hoursPerWeek = staffMember.hoursPerWeek || 15;
        let baseSalary = hourlyRate * hoursPerWeek;
        let bonuses = 0;

        // Bonus d'heures supplémentaires
        if (hoursPerWeek >= 20 && hoursPerWeek < 30) {
            bonuses += this.additionalBonuses.hoursBonus.over20;
        }
        if (hoursPerWeek >= 30) {
            bonuses += this.additionalBonuses.hoursBonus.over30;
        }

        // Bonus pour opérations
        if (staffMember.operationsPerMonth) {
            bonuses += staffMember.operationsPerMonth * this.additionalBonuses.operationBonus.amount;
        }

        // Bonus pour pôles - RETIRÉ
        // Les pôles ne sont pas utilisés

        // Bonus de rendement
        if (staffMember.performance) {
            bonuses += this.additionalBonuses.performanceBonus.amount;
        }

        return {
            baseSalary: baseSalary,
            bonuses: bonuses,
            total: baseSalary + bonuses,
            hourlyRate: hourlyRate,
            hoursPerWeek: hoursPerWeek
        };
    },

    // Obtenir la grille de salaire complète
    getSalaryGrid: function(type) {
        return type === 'supervision' ? this.supervision : this.ems;
    },

    // Obtenir toutes les grilles
    getAllGrades: function() {
        return {
            supervision: this.supervision.roles,
            ems: this.ems.roles
        };
    }
};
