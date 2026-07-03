/**
 * Sync footer/contact text to neoxweb.pages.dev (skip navbar)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['navbar.html']);

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) {
            if (name === 'node_modules' || name === '.git') continue;
            walk(p, out);
        } else if (/\.(html|js)$/i.test(name) && !SKIP.has(name)) {
            out.push(p);
        }
    }
    return out;
}

const reps = [
    ['+92 308 4858836', '+92 314 066 6734'],
    ['923084858836', '923140666734'],
    ['+923084858836', '+923140666734'],
    ['supportneoxweb@gmail.com', 'supportneoxweb@gmail.com'],
    ['WhatsApp: 0308 4858836', 'WhatsApp: 0314 066 6734'],
];

let n = 0;
for (const file of walk(ROOT)) {
    if (file.includes(`${path.sep}navbar${path.sep}`)) continue;
    let s = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [a, b] of reps) {
        if (s.includes(a)) {
            s = s.split(a).join(b);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(file, s, 'utf8');
        n++;
        console.log('Updated:', path.relative(ROOT, file));
    }
}
console.log(`Done. ${n} files.`);
