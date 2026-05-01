# AguiLangEvo — Geliştirme Planı
**Son Güncelleme:** Mayıs 2026  
**Versiyon:** MVP → v1.0 → v2.0

---

## ✅ TAMAMLANANLAR

### Temel Altyapı
- [x] aguilang2 → aguilangevo fork
- [x] 210 MB temizlik
- [x] Tüm TR izleri temizlendi
- [x] SQLite şema (15 tablo)
- [x] Migration sistemi (005 migration)
- [x] better-sqlite3 bağlantısı

### Kelime Sistemi
- [x] 130 kelime (verbs-a1.json)
- [x] ES çevirileri → 130/130
- [x] PT çevirileri → 130/130
- [x] Örnek cümleler (EN/ES/PT)
- [x] Alt çeviriler (alt_translations)

### Ses Sistemi
- [x] edge-tts entegrasyonu
- [x] 1412 MP3 kelime sesleri (EN/ES/PT)
- [x] 1321 ES bot MP3
- [x] 279 PT bot MP3
- [x] Toplam bot ses: 1601 dosya
- [x] Audio player (Study.jsx)
- [x] Practice.jsx otomatik ses
- [x] 🔊 Listen again butonu
- [x] safeFilename() + MD5 hash uyumu

### Öğrenme Sistemi
- [x] PlacementTest (15 soru, A1/A2)
- [x] SM-2 SRS Engine
- [x] Flashcard UI (front/back)
- [x] Study session (10 kelime)
- [x] Oturum özeti

### Conversation (Practice)
- [x] 537 conversation pack
- [x] 1611 exchange
- [x] easy/medium/hard (179/179/179)
- [x] ES conversation packs (444)
- [x] PT conversation packs (93)
- [x] Practice UI (Intro→Exchange→Özet)
- [x] Study'den Practice'e bağlantı
- [x] Bot otomatik ses çalma
- [x] 🔊 Listen again butonu

### Dil Sistemi
- [x] 4 dil çifti: EN↔ES, EN↔PT, ES→EN, PT→EN
- [x] i18n sistemi (202 anahtar)
- [x] Otomatik arayüz dili
- [x] ProfileSetup mantık düzeltmesi
- [x] 🇺🇸 US bayrağı fix
- [x] 🌐 Dil değiştirme butonu

### Profil & Akış
- [x] Tek profil "Aguila"
- [x] Adult/Child modu
- [x] App akışı: /setup→/test→/dashboard→/study
- [x] AppContext (uiLanguage, currentPair)
- [x] Returning user desteği

### Altyapı
- [x] GitHub repo (aguilangevo)
- [x] .gitignore (audio, db, node_modules)
- [x] Build sistemi (Vite)
- [x] ROADMAP.md

---

## 🔄 DEVAM EDEN

### Küçük Eksikler
- [ ] 1 hata veren ES bot MP3 tekrar üret
- [ ] "talk" kelimesi words tablosuna ekle
- [ ] word_id NULL olan 63 kelime eşleştir

---

## 📋 SIRALANMIŞ GÖREVLER

### HAFTA 2 — Yazma Modu
**Araç:** Cline + Llama 3.3  
**Görev:**
- [ ] Fuse.js kur (npm install fuse.js)
- [ ] Practice'e "Type" seçeneği ekle
- [ ] Input field + fuzzy match
- [ ] Puan: Speak=15, Type=12, Pick=10
- [ ] "runing" → "run" eşleştirme

### HAFTA 3 — Konuşma Modu (STT)
**Araç:** Web Speech API + Cline  
**Görev:**
- [ ] Web Speech API entegre et
- [ ] Chrome/Edge desteği
- [ ] Desteklenmiyorsa → Pick moduna düş
- [ ] Mikrofon izin yönetimi
- [ ] Hata toleransı (aksanlı konuşma)

### HAFTA 4 — Telaffuz Skoru
**Araç:** Cline + Fuse.js  
**Görev:**
- [ ] Söylenen kelime → transcript al
- [ ] Beklenenle karakter bazlı karşılaştır
- [ ] %80+ → ✅ geçer
- [ ] %60-80 → ⚠️ "Almost! Try again"
- [ ] %60- → ❌ tekrar dene
- [ ] Çocuk modu: daha toleranslı eşik

### HAFTA 5 — Konuşma Geçmişi
**Araç:** SQLite + Cline  
**Görev:**
- [ ] conversation_sessions tablosu ekle
- [ ] Her session kayıt
- [ ] "Geçen hafta 'run'da zorlandın" bildirimi
- [ ] Progress sayfasına istatistik ekle

### HAFTA 6 — Polish & Test
**Araç:** Manuel test + Cline  
**Görev:**
- [ ] Çocuk modu TTS yavaşlatma
- [ ] Emoji/animasyon feedback (child)
- [ ] Tüm 4 dil çifti test
- [ ] Türkçe kalıntı son tarama
- [ ] UI/UX iyileştirmeleri

---

## 📱 MOBİL (Capacitor)

### Android Build
**Araç:** Claude Code  
**Görev:**
- [ ] Capacitor config güncelle
- [ ] Android klasörü oluştur
- [ ] npx cap add android
- [ ] npx cap sync
- [ ] Android Studio'da build
- [ ] APK test (fiziksel cihaz)

### iOS Build (İleride)
- [ ] Mac gerekli
- [ ] Apple Developer hesabı
- [ ] TestFlight test

---

## 🛒 SATIŞ & DAĞITIM

### Platformlar (Öncelik Sırası)
- [ ] Gumroad → APK direkt satış
- [ ] Hotmart → Latam pazarı (ES/PT)
- [ ] Kendi domain (aguilangevo.com)
- [ ] Google Play Store
- [ ] Lemonsqueezy (alternatif)

### Hazırlık
- [ ] App ikonu (tüm boyutlar)
- [ ] Screenshot (EN/ES/PT)
- [ ] Açıklama metni (EN/ES/PT)
- [ ] Fiyatlandırma stratejisi
- [ ] Privacy Policy sayfası

---

## 🤖 AI ARAÇ STRATEJİSİ

### Araç Dağılımı
| Araç | Görev | Maliyet | Kullanım |
|------|-------|---------|----------|
| Claude (bu sohbet) | Strateji + mimari | Pro plan | Az, odaklı |
| Claude Code | Kritik geliştirme | Pro plan | Haftada 2-3 |
| Cline + Llama 3.3 | Rutin kod | Ücretsiz | Sık |
| Tencent HY3 | İçerik + çeviri | Ücretsiz | Sık |
| edge-tts | TTS/ses üretimi | Ücretsiz | Gerektiğinde |
| Web Speech API | STT (v2) | Ücretsiz | Hafta 3'te |
| Fuse.js | Fuzzy match | Ücretsiz | Hafta 2'de |

### Kota Tasarrufu Kuralları
- Claude → Kısa ve odaklı sorular
- Claude Code → Max 3 adımlık görevler
- Cline → Rutin değişiklikler
- Tencent → Tüm içerik üretimi
- Git push → Her zaman manuel (terminal)

---

## 📊 PROJE METRİKLERİ

### Mevcut Durum (Mayıs 2026)
Kelimeler           : 130 (EN/ES/PT tam)
Conversation Pack   : 537
Exchange            : 1611
Kelime Sesi MP3     : 1412
Bot Sesi MP3        : 1601
i18n Anahtar        : 202
Dil Çifti           : 4 (EN↔ES, EN↔PT)
Migration           : 005

### Hedef (v1.0)
Conversation Pack   : 537+
Bot Ses MP3         : 1601+
STT                 : Web Speech API
Yazma Modu          : Fuse.js
Platformlar         : Gumroad + Hotmart

---

## 🔧 TEKNİK STACK
Frontend  : React + Vite + Tailwind
Mobile    : Capacitor
Backend   : Python (scripts)
DB        : SQLite (better-sqlite3)
TTS       : edge-tts (offline)
STT       : Web Speech API (v2)
Fuzzy     : Fuse.js (v2)
i18n      : Custom hook (translations.js)
Audio     : HTML5 Audio API

---

## 📁 ÖNEMLİ DOSYALAR
src/
db/
schema.sql
db.js
seed.js
srsEngine.js
conversationQueries.js
seedConversations.js
i18n/
translations.js
pages/
ProfileSetup.jsx
PlacementTest.jsx
Study.jsx
Practice.jsx
Dashboard.jsx
context/
AppContext.jsx
utils/
audioUtils.js
public/
audio/
en/  → 583 kelime MP3
es/  → 706 kelime MP3
pt/  → 123 kelime MP3
bot/
es/ → 1321 bot MP3
pt/ → 279 bot MP3
data/
aguilangevo.db (gitignore)
generate_audio.py
generate_bot_audio.py
ROADMAP.md

---

*Sorumluluk: Ata + Claude (Anthropic)*  
*Repo: https://github.com/ataeyvaz/aguilangevo*