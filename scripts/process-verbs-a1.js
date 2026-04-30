import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, '..', 'src', 'data', 'verbs-a1.json');
const outputFile = join(__dirname, '..', 'src', 'data', 'verbs-a1.json');
const reportFile = join(__dirname, '..', 'asama2-raporu.md');

// Read the JSON file
const data = JSON.parse(readFileSync(inputFile, 'utf8'));

// Statistics
let trRemovedCount = 0;
let ptAddedCount = 0;
let esAddedCount = 0;
let totalWords = 0;

// Allowed language codes in word objects
const allowedLangCodes = ['en', 'es', 'pt'];

// Fields that should always be preserved (non-language fields)
const preservedFields = ['id', 'emoji', 'word', 'pron', 'level'];

// Process each language section
Object.keys(data.translations).forEach(langCode => {
  const section = data.translations[langCode];
  
  if (section.words && Array.isArray(section.words)) {
    section.words.forEach(word => {
      totalWords++;
      
      // Remove "tr" field if present
      if ('tr' in word) {
        delete word.tr;
        trRemovedCount++;
      }
      
      // Remove language codes other than "en", "es", "pt" from word objects
      Object.keys(word).forEach(key => {
        // If the key is a 2-letter code and not in allowed list and not in preserved fields, remove it
        if (key.match(/^[a-z]{2}$/) && !allowedLangCodes.includes(key) && !preservedFields.includes(key)) {
          delete word[key];
        }
      });
      
      // Add missing "pt" field with empty string
      if (!('pt' in word)) {
        word.pt = '';
        ptAddedCount++;
      }
      
      // Add missing "es" field with empty string
      if (!('es' in word)) {
        word.es = '';
        esAddedCount++;
      }
    });
  }
});

// Write the modified JSON back
writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');

// Generate report
const report = `# Aşama 2 Raporu

## İşlem Özeti

- **Dosya:** src/data/verbs-a1.json
- **İşlem Tarihi:** ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}

## İstatistikler

- **Toplam kelime sayısı:** ${totalWords}
- **"tr" alanı kaldırılan kelime sayısı:** ${trRemovedCount}
- **"pt" alanı eklenen kelime sayısı:** ${ptAddedCount}
- **"es" alanı eklenen kelime sayısı:** ${esAddedCount}

## Açıklamalar

1. Her kelime nesnesindeki "tr" alanı kaldırıldı (yoksa zaten kaldırılmış sayıldı).
2. "en", "es", "pt" dışındaki dil kodları kelime nesnelerinden kaldırıldı.
3. "pt" alanı olmayan kelimelere "pt": "" eklendi.
4. "es" alanı olmayan kelimelere "es": "" eklendi.
5. "en", "es", "pt" dışındaki dil kodları (de, fr, it vb.) kelime nesnelerinden temizlendi.
`;

writeFileSync(reportFile, report, 'utf8');

console.log('İşlem tamamlandı!');
console.log(`Toplam kelime: ${totalWords}`);
console.log(`"tr" alanı kaldırılan: ${trRemovedCount}`);
console.log(`"pt" alanı eklenen: ${ptAddedCount}`);
console.log(`"es" alanı eklenen: ${esAddedCount}`);
console.log(`Rapor kaydedildi: ${reportFile}`);