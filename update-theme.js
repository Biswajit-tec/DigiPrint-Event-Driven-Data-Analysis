import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.match(/\.(jsx|tsx|js|ts|css)$/)) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

const replaceMap = [
    { regex: /bg-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'bg-primary' },
    { regex: /text-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'text-primary/80' },
    { regex: /border-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'border-primary' },
    { regex: /border-l-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'border-l-primary' },
    { regex: /from-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'from-primary/20' },
    { regex: /via-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'via-primary/10' },
    { regex: /to-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'to-primary/5' },
    { regex: /ring-cyber-[0-9]{3}(\/[0-9]+)?/g, replacement: 'ring-primary' },
    { regex: /glow-cyber/g, replacement: 'shadow-lg shadow-primary/20' },
    { regex: /shadow-glow-cyber/g, replacement: 'shadow-lg shadow-primary/20' },
    { regex: /shadow-glow/g, replacement: 'shadow-lg shadow-primary/20' },

    { regex: /bg-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'bg-secondary' },
    { regex: /text-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'text-secondary-foreground' },
    { regex: /border-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'border-secondary/30' },
    { regex: /from-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'from-secondary/20' },
    { regex: /via-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'via-secondary/10' },
    { regex: /to-purple-[0-9]{3}(\/[0-9]+)?/g, replacement: 'to-secondary/5' },
    { regex: /shadow-glow-purple/g, replacement: 'shadow-lg shadow-secondary/20' },

    { regex: /bg-dark-9[0-9]{2}(\/[0-9]+)?/g, replacement: 'bg-background' },
    { regex: /bg-dark-[7-8][0-9]{2}(\/[0-9]+)?/g, replacement: 'bg-muted' },
    { regex: /text-dark-9[0-9]{2}(\/[0-9]+)?/g, replacement: 'text-primary-foreground' },
    { regex: /text-dark-[0-8][0-9]{2}(\/[0-9]+)?/g, replacement: 'text-muted-foreground' },
    { regex: /border-dark-[0-9]{3}(\/[0-9]+)?/g, replacement: 'border-border' },
    { regex: /from-dark-[0-9]{3}(\/[0-9]+)?/g, replacement: 'from-background' },
    { regex: /via-dark-[0-9]{3}(\/[0-9]+)?/g, replacement: 'via-background' },
    { regex: /to-dark-[0-9]{3}(\/[0-9]+)?/g, replacement: 'to-background' },

    // Auth inputs specific fix: bg-white/5 -> bg-muted, border-white/10 -> border-border
    { regex: /bg-white\/5/g, replacement: 'bg-muted' },
    { regex: /border-white\/10/g, replacement: 'border-border' },
    { regex: /text-white/g, replacement: 'text-foreground' },
    { regex: /text-gray-300/g, replacement: 'text-muted-foreground' },
    { regex: /text-gray-400/g, replacement: 'text-muted-foreground' },
    { regex: /text-gray-500/g, replacement: 'text-muted-foreground' },
    { regex: /text-gray-100/g, replacement: 'text-foreground' }
];

let updatedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replaceMap.forEach(({regex, replacement}) => {
        content = content.replace(regex, replacement);
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        updatedCount++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Total files updated: ${updatedCount}`);
