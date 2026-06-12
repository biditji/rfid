const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace RFIDHub with Virtualsphere
  content = content.replace(/RFIDHub/g, 'Virtualsphere');
  
  // Replace icon
  if (file.includes('header.tsx') || file.includes('footer.tsx') || file.includes('hero-section.tsx') || file.includes('sidebar.tsx')) {
    content = content.replace(/import {([^}]*)Radio([^}]*)} from "lucide-react"/, 'import {$1Globe$2} from "lucide-react"');
    content = content.replace(/<Radio/g, '<Globe');
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
