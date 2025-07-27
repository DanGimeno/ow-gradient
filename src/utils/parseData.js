import fs from 'fs';
import path from 'path';

export default function loadIconData() {
  const dataPath = path.join(process.cwd(), 'src', 'data.txt');
  const text = fs.readFileSync(dataPath, 'utf8');
  const lines = text.split(/\r?\n/);
  const categories = {};
  let current = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!trimmed.startsWith('<')) {
      current = trimmed;
      categories[current] = [];
    } else {
      const match = trimmed.match(/^(<[^>]+>)\s*(.*)$/);
      if (current && match) {
        categories[current].push({ code: match[1], label: match[2] });
      }
    }
  }
  const wanted = ['2D ART', '3D ART', 'GAMES', 'RANDOM'];
  const result = {};
  for (const cat of wanted) {
    if (categories[cat]) {
      result[cat] = categories[cat].sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  return result;
}
