const fs = require('fs');
const path = require('path');

const blogDir = 'src/app/blog';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Add import if missing
    if (!content.includes("import { EzoicAd } from '@/components/EzoicAd';")) {
        content = content.replace(
            "import { cn } from '@/lib/utils';",
            "import { cn } from '@/lib/utils';\nimport { EzoicAd } from '@/components/EzoicAd';"
        );
    }
    
    // 2. Remove mounted check
    content = content.replace(
        /const \[mounted, setMounted\] = React\.useState\(false\);[\s\S]*?if \(!mounted\) return null;/g,
        "// Fixed for SSR"
    );
    
    // 3. Add ad placeholder if missing
    if (!content.includes('<EzoicAd id={110} />')) {
        // Find first <h2> and insert ad before it
        content = content.replace('<h2>', '<EzoicAd id={110} />\n                            <h2>');
    }
    
    fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file === 'ArticleContent.tsx') {
            console.log(`Processing ${fullPath}`);
            processFile(fullPath);
        }
    }
}

walkDir(blogDir);
console.log('Done!');
