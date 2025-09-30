// Script pour générer un JWT secret sécurisé
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 JWT Secret généré:\n');
console.log(secret);
console.log('\n📋 Copiez cette valeur et utilisez-la comme JWT_SECRET dans vos variables d\'environnement sur Render\n');
