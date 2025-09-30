// Script de vérification avant déploiement
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration pour le déploiement...\n');

let errors = 0;
let warnings = 0;

// Vérifier les fichiers essentiels
const essentialFiles = [
  'server.js',
  'package.json',
  '.gitignore',
  '.env',
  'client/package.json',
  'client/vite.config.js',
  'client/src/utils/api.js'
];

console.log('📁 Fichiers essentiels:');
essentialFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    errors++;
  }
});

// Vérifier .gitignore
console.log('\n📝 Vérification .gitignore:');
const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
const requiredIgnores = ['.env', 'node_modules', 'data.sqlite'];
requiredIgnores.forEach(pattern => {
  if (gitignore.includes(pattern)) {
    console.log(`  ✅ ${pattern} est ignoré`);
  } else {
    console.log(`  ⚠️  ${pattern} devrait être dans .gitignore`);
    warnings++;
  }
});

// Vérifier package.json scripts
console.log('\n⚙️  Scripts package.json:');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
if (pkg.scripts && pkg.scripts.server) {
  console.log('  ✅ Script "server" défini');
} else {
  console.log('  ❌ Script "server" manquant');
  errors++;
}

// Vérifier les dépendances
console.log('\n📦 Dépendances critiques:');
const criticalDeps = ['express', 'cors', 'sqlite3', 'jsonwebtoken', 'bcrypt', 'dotenv'];
criticalDeps.forEach(dep => {
  if (pkg.dependencies && pkg.dependencies[dep]) {
    console.log(`  ✅ ${dep}`);
  } else {
    console.log(`  ❌ ${dep} - MANQUANT`);
    errors++;
  }
});

// Vérifier client/package.json
console.log('\n🎨 Frontend:');
const clientPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'client/package.json'), 'utf8'));
if (clientPkg.scripts && clientPkg.scripts.build) {
  console.log('  ✅ Script build défini');
} else {
  console.log('  ❌ Script build manquant');
  errors++;
}

const clientDeps = ['react', 'react-dom', 'react-router-dom'];
clientDeps.forEach(dep => {
  if (clientPkg.dependencies && clientPkg.dependencies[dep]) {
    console.log(`  ✅ ${dep}`);
  } else {
    console.log(`  ❌ ${dep} - MANQUANT`);
    errors++;
  }
});

// Vérifier api.js
console.log('\n🔗 Configuration API:');
const apiFile = fs.readFileSync(path.join(__dirname, 'client/src/utils/api.js'), 'utf8');
if (apiFile.includes('VITE_API_URL')) {
  console.log('  ✅ Variable VITE_API_URL configurée');
} else {
  console.log('  ⚠️  VITE_API_URL non trouvée dans api.js');
  warnings++;
}

// Résumé
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('✅ TOUT EST PRÊT POUR LE DÉPLOIEMENT !');
  console.log('\n📚 Suivez le guide: DEPLOY_RAPIDE.md');
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} erreur(s) trouvée(s) - À corriger avant déploiement`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} avertissement(s)`);
  }
}
console.log('='.repeat(50) + '\n');
