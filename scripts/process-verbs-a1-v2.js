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

// Create a map to merge words by id
const wordsById = new Map();

// Process each language section
Object.keys(data.translations).forEach(langCode => {
  const section = data.translations[langCode];
  
  if (section.words && Array.isArray(section.words)) {
    section.words.forEach(word => {
      const wordId = word.id;
      
      if (!wordsById.has(wordId)) {
        // First time seeing this word
        wordsById.set(wordId, {
          id: word.id,
          emoji: word.emoji,
          level: word.level,
          en: '',
          es: '',
          pt: ''
        });
        totalWords++;
      }
      
      const mergedWord = wordsById.get(wordId);
      
      // Set the word for this language
      if (langCode === 'en') {
        mergedWord.en = word.word || '';
        if ('pron' in word) mergedWord.pron = word.pron;
      } else if (langCode === 'es') {
        mergedWord.es = word.word || '';
      } else if (langCode === 'pt') {
        mergedWord.pt = word.word || '';
      }
      
      // Check if "tr" field exists (for reporting)
      if ('tr' in word) {
        trRemovedCount++;
      }
    });
  }
});

// Convert map to array and ensure all fields exist
const mergedWords = Array.from(wordsById.values()).map(word => {
  // Add missing fields
  if (!('en' in word)) { word.en = ''; }
  if (!('es' in word)) { word.es = ''; esAddedCount++; }
  if (!('pt' in word)) { word.pt = ''; ptAddedCount++; }
  
  // Remove "tr" if present
  if ('tr' in word) {
    delete word.tr;
    trRemovedCount++;
  }
  
  // Remove any other 2-letter language codes that are not en, es, pt
  Object.keys(word).forEach(key => {
    if (key.match(/^[a-z]{2}$/) && !['en', 'es', 'pt', 'id', 'emoji', 'level', 'pron'].includes(key)) {
      delete word[key];
    }
  });
  
  return word;
});

// Create new structure
const newData = {
  category: data.category,
  level: data.level,
  words: mergedWords
};

// Write the modified JSON back
writeFileSync(outputFile, JSON.stringify(newData, null, 2), 'utf8');

// Generate report
const report = `# Asama 2 Raporu

## Islem Ozeti

- **Dosya:** src/data/verbs-a1.json
- **Islem Tarihi:** ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}

## Istatistikler:

- **Toplam kelime sayisi:** ${totalWords}
- **"tr" alani kaldirilan kelime sayisi:** ${trRemovedCount}
- **"pt" alani eklenen kelime sayisi:** ${ptAddedCount}
- **"es" alani eklenen kelime sayisi:** ${esAddedCount}

## Aciklamalar:

1. Her kelime nesnesindeki "tr" alani kaldirildi (bu dosyada "tr" alani yoktu).
2. "en", "es", "pt" disindaki dil kodlari (bu durumda "de" bolumu) kaldirildi.
3. Veri yapisi duzlestirildi: Ayri dil bolumleri yerine tum kelimeler tek bir "words" dizisinde toplandi.
4. Her kelime nesnesinde "en", "es", "pt" alanlari bulunuyor.
5. "pt" alani olmayan kelimelere "pt": "" eklendi (gerekiyorsa).
6. "es" alani olmayan kelimelere "es": "" eklendi (gerekiyorsa).
`;

writeFileSync(reportFile, report, 'utf8');

console.log('Islem tamamlandi!');
console.log(`Toplam kelime: ${totalWords}`);
console.log(`"tr" alani kaldirilan: ${trRemovedCount}`);
console.log(`"pt" alani eklenen: ${ptAddedCount}`);
console.log(`"es" alani eklenen: ${esAddedCount}`);
console.log(`Rapor kaydedildi: ${reportFile}`);