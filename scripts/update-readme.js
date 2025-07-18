const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { dir: 'instructions', label: 'Custom Instructions' },
  { dir: 'prompts', label: 'Reusable Prompts' },
  { dir: 'chatmodes', label: 'Custom Chat Modes' },
];

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(dir, f));
}

function extractMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let name = path.basename(filePath);
  let desc = '';
  // Parse YAML frontmatter if present
  if (lines[0].trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i].trim() !== '---') {
      const line = lines[i];
      const match = line.match(/^description:\s*['"]?(.+?)['"]?$/);
      if (match) {
        desc = match[1].trim();
      }
      i++;
    }
    // Move i past the closing ---
    while (i < lines.length && lines[i].trim() !== '' && lines[i].trim() === '---') i++;
  }
  // Fallback: use first heading and first non-heading, non-image line
  for (let line of lines) {
    if (line.startsWith('#')) {
      name = line.replace(/^#+\s*/, '').trim();
      continue;
    }
    if (desc === '' && line.trim() && !line.startsWith('![')) {
      desc = line.replace(/\*/g, '').replace(/<[^>]+>/g, '').trim();
      break;
    }
  }
  return { name, desc, file: filePath.replace(/\\/g, '/') };
}

function makeTable(entries) {
  let out = '| Name | Description | File Path |\n|------|-------------|-----------|\n';
  for (const e of entries) {
    out += `| ${e.name} | ${e.desc} | ${e.file} |\n`;
  }
  return out;
}

function main() {
  let out = '<!--\nThis README is auto-generated. Do not edit manually. To update, run scripts/update-readme.js.\n-->';
  out += '\n# Awesome Prompts Toolkit Glossary | modified to be digestible by Cursor in a single file\n';
  for (const section of SECTIONS) {
    out += `\n## ${section.label}\n\n`;
    const files = getMarkdownFiles(section.dir);
    const entries = files.map(extractMeta).sort((a, b) => a.name.localeCompare(b.name));
    out += makeTable(entries);
  }
  fs.writeFileSync('README.md', out);
}

if (require.main === module) main();
