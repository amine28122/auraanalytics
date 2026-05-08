const fs = require('fs');
const path = require('path');
const dir = 'src/app/blog';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(dir);

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    const target = "import { EzoicAd } from '@/components/EzoicAd';";
    if (content.includes(target)) {
        content = content.replace(target, "import dynamic from 'next/dynamic';\nconst EzoicAd = dynamic(() => import('@/components/EzoicAd').then(mod => mod.EzoicAd), { ssr: false });");
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
}
