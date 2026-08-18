const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'navbar.html'), 'utf8').trim();
const payload = JSON.stringify(html);

fs.writeFileSync(
    path.join(root, 'js', 'navbar-embed.js'),
    `window.NAVBAR_EMBED_HTML = ${payload};\n`
);

console.log('navbar-embed.js updated');
