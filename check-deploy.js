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
  '.env.example',
  'client/package.json',
  'client/vite.config.js',
  'client/.env.example',
  'render.yaml'
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
const requiredIgnores = ['.env', 'node_modules', 'data.sqlite', 'dist'];
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
const requiredScripts = ['start', 'server', 'client', 'dev', 'build'];

requiredScripts.forEach(script => {
  if (pkg.scripts && pkg.scripts[script]) {
    console.log(`  ✅ Script "${script}" défini`);
  } else {
    console.log(`  ❌ Script "${script}" manquant`);
    errors++;
  }
});

// Vérifier les variables d'environnement requises
console.log('\n🌍 Variables d\'environnement requises:');
const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(envVar => {
  if (envExample.includes(envVar)) {
    console.log(`  ✅ ${envVar} est documenté`);
  } else {
    console.log(`  ❌ ${envVar} manquant dans .env.example`);
    errors++;
  }
});

// Vérifier la configuration CORS
console.log('\n🔄 Vérification de la configuration CORS:');
try {
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  if (serverContent.includes('cors(') && serverContent.includes('allowedOrigins')) {
    console.log('  ✅ Configuration CORS détectée');
  } else {
    console.log('  ❌ Configuration CORS manquante ou incomplète');
    errors++;
  }
} catch (err) {
  console.log('  ❌ Impossible de vérifier la configuration CORS');
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
