#!/bin/bash
# Script de vérification du système EMS STFH

echo "================================"
echo "🔍 VÉRIFICATION EMS STFH"
echo "================================"
echo ""

# Vérifier les fichiers essentiels
echo "📁 Vérification des fichiers..."
files=(
    "index.html"
    "app.js"
    "staff.js"
    "login.js"
    "salary.js"
    "hierarchy.js"
    "permissions.js"
    "users.js"
    "styles.css"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file MANQUANT"
    fi
done

echo ""
echo "📝 Vérification des caractères spéciaux..."
if grep -q "Système" index.html; then
    echo "✅ 'Système' trouvé dans index.html"
else
    echo "❌ 'Système' MANQUANT dans index.html"
fi

if grep -q "Hiérarchie" index.html; then
    echo "✅ 'Hiérarchie' trouvé"
else
    echo "❌ 'Hiérarchie' MANQUANT"
fi

if grep -q "Sécurité" index.html; then
    echo "✅ 'Sécurité' trouvé"
else
    echo "❌ 'Sécurité' MANQUANT"
fi

echo ""
echo "🔐 Vérification des fonctionnalités..."
if grep -q "function changePassword" app.js; then
    echo "✅ Fonction changePassword() trouvée"
else
    echo "❌ Fonction changePassword() MANQUANTE"
fi

if grep -q "function generateColorAvatar" app.js; then
    echo "✅ Fonction generateColorAvatar() trouvée"
else
    echo "❌ Fonction generateColorAvatar() MANQUANTE"
fi

if grep -q "function previewAvatar" app.js; then
    echo "✅ Fonction previewAvatar() trouvée"
else
    echo "❌ Fonction previewAvatar() MANQUANTE"
fi

if grep -q "avatarPreview" index.html; then
    echo "✅ Element 'avatarPreview' trouvé dans HTML"
else
    echo "❌ Element 'avatarPreview' MANQUANT"
fi

if grep -q "userAvatar" index.html; then
    echo "✅ Element 'userAvatar' trouvé dans HTML"
else
    echo "❌ Element 'userAvatar' MANQUANT"
fi

echo ""
echo "📊 Statistiques fichiers..."
echo "- index.html: $(wc -l < index.html) lignes"
echo "- app.js: $(wc -l < app.js) lignes"
echo "- styles.css: $(wc -l < styles.css) lignes"
echo "- staff.js: $(wc -l < staff.js) lignes"
echo "- login.js: $(wc -l < login.js) lignes"

echo ""
echo "================================"
echo "✅ Vérification Complétée!"
echo "================================"
echo ""
echo "🚀 Pour démarrer l'application:"
echo "python -m http.server 8000"
echo ""
echo "Puis ouvrir: http://localhost:8000"
