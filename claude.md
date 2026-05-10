# 🦅 AguiLangEvo — Claude Bağlam Dosyası
> Bu dosyayı her yeni sohbette Claude'a ver: "CLAUDE.md'yi oku, devam et."

---

## 🧭 PROJE ÖZETİ
- **Proje:** AguiLangEvo (AguiLang2'den fork, tamamen ayrı)
- **Konum:** `C:\Users\Ata\Desktop\aguilangevo`
- **GitHub:** https://github.com/ataeyvaz/aguilangevo
- **Satış:** https://ataeyvaz.gumroad.com/l/tsogik ($8.99)
- **Kullanıcı:** Ata — Windows + VS Code + PowerShell
- **Stack:** React + Vite + Tailwind + Capacitor + Python + SQLite

---

## 🎯 HEDEF KİTLE
- ABD'deki İspanyolca/Portekizce konuşanlar
- İngilizce öğrenmek isteyenler
- Dil çiftleri: EN↔ES, EN↔PT, ES→EN, PT→EN

---

## 📁 DOSYA YAPISI (Kritik Yollar)

```
aguilangevo/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages/              ← Tüm sayfalar burada
│   │   ├── Study.jsx       ← Flashcard öğrenme
│   │   ├── Practice.jsx    ← Konuşma pratiği
│   │   ├── ChatBot.jsx     ← Chatbot UI
│   │   ├── ScenariosPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── StatsPage.jsx
│   │   ├── ProfileSetup.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PlacementTest.jsx (components/)
│   │   ├── GrammarPage.jsx
│   │   ├── LearnHub.jsx
│   │   ├── FlashCards.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── DictionaryPage.jsx
│   │   └── TicTacToePage.jsx
│   ├── components/
│   │   ├── PlacementTest.jsx
│   │   ├── layout/         (AppLayout, BottomNav, Sidebar)
│   │   └── levels/LevelSystem.jsx
│   ├── context/
│   │   └── AppContext.jsx  ← Global state (currentPair, profile, SRS)
│   ├── router/
│   │   └── AppRouter.jsx   ← Tüm route tanımları
│   ├── data/
│   │   └── verbs-a1.json   ← A1 kelime verisi (Study.jsx bunu import eder)
│   ├── services/
│   │   └── conversationService.js
│   └── i18n/
│       └── translations.js ← 257+ i18n anahtarı
├── data/
│   └── aguilangevo.db      ← SQLite veritabanı
├── public/
│   └── audio/
│       ├── en/             ← {word}.mp3
│       ├── es/             ← {translation}.mp3
│       ├── pt/             ← {translation}.mp3
│       └── bot/            ← Bot ses dosyaları
├── scripts/                ← Python/Node scriptleri
└── ROADMAP.md
```

---

## 🗄️ VERİTABANI ŞEMASI (Kritik Tablolar)

### words tablosu
```sql
id INTEGER PRIMARY KEY
word TEXT NOT NULL          -- İngilizce kelime
language_id TEXT NOT NULL   -- 'en'
part_of_speech TEXT         -- 'verb', 'noun', 'adjective'
cefr_level TEXT             -- 'A1', 'A2', 'B1', 'B2'
ipa TEXT                    -- '/biː/'
audio_path TEXT             -- null (dosya adı word'den türetilir)
image_path TEXT
created_at TEXT
```

### word_translations tablosu
```sql
id INTEGER PRIMARY KEY
word_id INTEGER             -- words.id'ye foreign key
target_lang TEXT            -- 'es' veya 'pt'
translation TEXT            -- Çeviri
alt_translations TEXT       -- JSON string: '["estar"]'
example_source TEXT         -- EN örnek cümle
example_target TEXT         -- ES/PT örnek cümle
notes TEXT
created_at TEXT
```

### Diğer Tablolar
- `profiles` — Kullanıcı profilleri
- `placement_results` — Seviye testi sonuçları
- `user_progress` — SRS ilerleme (SM-2)
- `conversation_packs` — Konuşma paketleri (537 adet)
- `conversation_exchanges` — 1611+ exchange
- `session_logs` — Oturum geçmişi
- `placement_questions` — Test soruları

---

## 📊 İÇERİK METRİKLERİ

```
Kelimeler     : 243 toplam
  A1          : 66  (src/data/verbs-a1.json → DB)
  A2          : 64  (DB)
  B1          : 56  (data/words_b1.json → DB) ← YENİ
  B2          : 57  (data/words_b2.json → DB) ← YENİ

Kelime MP3    : ~1746 (EN+ES+PT)
Bot MP3       : 1601
Conv. Pack    : 505 (451 ES + 101 PT)
Exchange      : 1611+
i18n anahtar  : 257+
Senaryo       : 16 (8 ES + 8 PT)
```

---

## ⚙️ KRİTİK MİMARİ KARARLAR

### 1. Study.jsx — Şu Anki Sorun
```js
// MEVCUT — sadece A1 JSON'dan yükler
import verbsData from '../data/verbs-a1.json'
const sessionWords = getStudyWords(verbsData.words, targetLang, 10)

// HEDEF — seviye seçiciyle (B1/B2 dahil)
// DB'den export edilen JSON'lardan yükleyecek
```

### 2. Audio Dosya Adlandırma
```
EN: /audio/en/{word}.mp3           → word = İngilizce kelime
ES: /audio/es/{safeFilename}.mp3   → safeFilename: boşluk→_, noktalama kaldır
PT: /audio/pt/{safeFilename}.mp3
```

### 3. Dil Çifti Mantığı
```js
const PAIR_LANG = { 1: 'es', 2: 'pt', 3: 'es', 4: 'pt' }
// Pair 1: EN→ES | Pair 2: EN→PT | Pair 3: ES→EN | Pair 4: PT→EN
```

### 4. SRS Sistemi (SM-2)
- Status: `new → learning → review → mastered`
- `recordAnswer(wordId, isCorrect, quality)` → AppContext
- `getStudyWords(words, targetLang, limit)` → SRS'e göre sıralar

### 5. Veri Akışı
```
DB (aguilangevo.db) → JSON export → src/data/ → Study.jsx import
```
B1/B2 için DB'den JSON export gerekli (mevcut A1 pattern'i gibi)

---

## 🔗 ROUTER (AppRouter.jsx)
```
/setup          → ProfileSetup
/placement-test → PlacementTest
/study          → Study.jsx         ← Flashcard
/practice       → Practice.jsx
/chatbot        → ChatBot.jsx
/scenarios      → ScenariosPage
/dashboard      → Dashboard
/stats          → StatsPage
/profile        → ProfilePage
/learn-hub      → LearnHub
/grammar        → GrammarPage
/play           → TicTacToePage
/dictionary     → DictionaryPage
/language       → LanguageSelect
/quiz           → QuizScreen
/categories     → CategorySelect
```

---

## 🤖 AI ARAÇ STRATEJİSİ

| Araç | Görev |
|------|-------|
| **Claude (sohbet)** | Strateji, mimari, prompt yazma, CLAUDE.md güncel tutma |
| **MiniMax M2.7** | Script yazma, DB işlemleri, ses üretimi |
| **Cline** | Rutin JSX/UI dosyası ekleme/güncelleme |
| **Tencent** | JSON/metin/çeviri içerik üretimi |
| **edge-tts** | TTS/MP3 üretimi |
| **Git push** | Her zaman manuel terminal |

---

## 🔄 DEVAM EDEN GÖREVLER (v1.1)

### Adım 1 — Study.jsx B1/B2 Desteği
- [ ] DB'den B1/B2 JSON export (export_b1b2_words.mjs)
- [ ] src/data/words-b1.json + words-b2.json oluştur
- [ ] Study.jsx'e seviye seçici ekle (A1/A2/B1/B2)
- [ ] **Araç: MiniMax (export script) + Cline (UI)**

### Adım 2 — PlacementTest B1/B2
- [ ] placement_questions tablosuna B1/B2 soruları ekle
- [ ] Sonuç mantığı: A1/A2/B1/B2 tespiti
- [ ] **Araç: MiniMax**

### Adım 3 — APK v1.1
- [ ] `npm run build` → `npx cap sync` → Android Studio
- [ ] **Araç: Manuel**

### Adım 4 — Gumroad Güncelle
- [ ] "Now includes B1/B2 content!" açıklama güncelle
- [ ] **Araç: Manuel**

---

## 📦 BAĞIMLILIKLAR
```json
better-sqlite3  → DB işlemleri
react-router-dom → Routing
fuse.js          → Fuzzy match
edge-tts         → TTS (Python, .venv)
capacitor        → Android build
```

---

## 🚀 SIKÇA KULLANILAN KOMUTLAR
```powershell
# Geliştirme
npm run dev

# DB sorgu
node -e "const D=require('better-sqlite3'); const db=new D('./data/aguilangevo.db'); ..."

# Build
npm run build
npx cap sync

# Python script
cd C:\Users\Ata\Desktop\aguilangevo
python scripts/generate_audio.py

# Git
git add -A
git commit -m "feat: ..."
git push
```

---

*Güncelleme: Mayıs 2026 | Repo: https://github.com/ataeyvaz/aguilangevo*