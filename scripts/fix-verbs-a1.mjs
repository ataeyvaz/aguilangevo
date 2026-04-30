import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, '..', 'src', 'data', 'verbs-a1.json');
const outputFile = join(__dirname, '..', 'src', 'data', 'verbs-a1.json');
const reportFile = join(__dirname, '..', 'asama2-raporu.md');

const data = JSON.parse(readFileSync(inputFile, 'utf8'));

let trRemoved = 0;
let ptAdded = 0;
let esAdded = 0;
let totalWords = 0;

const wordMap = new Map();

Object.keys(data.translations).forEach(lang => {
  const section = data.translations[lang];
  if (!section.words) return;
  section.words.forEach(w => {
    const id = w.id;
    if (!wordMap.has(id)) {
      wordMap.set(id, {
        id: w.id,
        emoji: w.emoji,
        level: w.level,
        en: '',
        es: '',
        pt: ''
      });
      totalWords++;
    }
    const merged = wordMap.get(id);
    if (lang === 'en') {
      merged.en = w.word || '';
      if (w.pron) merged.pron = w.pron;
    } else if (lang === 'es') {
      merged.es = w.word || '';
    } else if (lang === 'pt') {
      merged.pt = w.word || '';
    }
    if ('tr' in w) {
      trRemoved++;
    }
  });
});

const words = Array.from(wordMap.values()).map(w => {
  if (!('en' in w)) { w.en = ''; }
  if (!('es' in w)) { w.es = ''; esAdded++; }
  if (!('pt' in w)) { w.pt = ''; ptAdded++; }
  if ('tr' in w) { delete w.tr; trRemoved++; }
  const allowed = ['id', 'emoji', 'level', 'en', 'es', 'pt', 'pron'];
  Object.keys(w).forEach(key => {
    if (key.match(/^[a-z]{2}$/) && !allowed.includes(key)) {
      delete w[key];
    }
  });
  return w;
});

const newData = {
  category: data.category,
  level: data.level,
  words: words
};

writeFileSync(outputFile, JSON.stringify(newData, null, 2), 'utf8');

const report = `# Aşama 2 Raporu

## İşlem Özeti

- **Dosya:** src/data/verbs-a1.json
- **İşlem Tarihi:** ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}

## İstatistikler

- **Toplam kelime sayısı:** ${totalWords}
- **"tr" alanı kaldırılan kelime sayısı:** ${trRemoved}
- **"pt" alanı eklenen kelime sayısı:** ${ptAdded}
- **"es" alanı eklenen kelime sayısı:** ${esAdded}

## Açıklamalar

1. "tr" alanı kaldırıldı (yoktu).
2. "de" bölümü kaldırıldı, kelimeler en ve es alanlarıyla birleştirildi.
3. Her kelime nesnesinde "en", "es", "pt" alanları var.
4. "pt" ve "es" alanları eksikse eklendi.
5. "en", "es", "pt" dışındaki dil kodları temizlendi.
`;

writeFileSync(reportFile, report, 'utf8');

console.log('Done');
console.log('Total words:', totalWords);
console.log('tr removed:', trRemoved);
console.log('pt added:', ptAdded);
console.log('es added:', esAdded);