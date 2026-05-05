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
- [x] Migration sistemi (006 migration)
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
- [x] 497 conversation pack
- [x] 1611+ exchange
- [x] easy/medium/hard seviyeleri
- [x] ES conversation packs (451)
- [x] PT conversation packs (101)
- [x] Practice UI (Intro→Exchange→Özet)
- [x] Bot otomatik ses çalma
- [x] 🔊 Listen again butonu

### ChatBot Sistemi
- [x] ChatBot UI (baloncuk/mesajlaşma arayüzü)
- [x] Her turda mod seçimi: Sesli / Yazı / Seçmeli
- [x] 8 ES senaryo paketi (Shopping/Travel/Tourism/School/Daily/Emergency/Meeting/Cafe)
- [x] 8 PT senaryo paketi (aynı senaryolar, Portekizce)
- [x] Study sayfası → 🤖 Practice with ChatBot CTA butonu
- [x] /scenarios senaryo seçim ekranı (8 kart)
- [x] Study → Scenarios → ChatBot tam akışı
- [x] Bot sesi otomatik çalar (mevcut MP3 sistemi)

### Dil Sistemi
- [x] 4 dil çifti: EN↔ES, EN↔PT, ES→EN, PT→EN
- [x] i18n sistemi (222+ anahtar)
- [x] Otomatik arayüz dili
- [x] ProfileSetup mantık düzeltmesi

---

## ~~HAFTA 1 — Bot Sesleri~~ ✅ TAMAMLANDI
- [x] 1321 ES bot MP3 üretildi
- [x] 279 PT bot MP3 üretildi
- [x] Toplam: 1601 bot ses dosyası

## ~~HAFTA 2 — Yazma Modu~~ ✅ TAMAMLANDI
- [x] Fuse.js kuruldu
- [x] Practice'e "Type" seçeneği eklendi
- [x] Fuse.js fuzzy match (threshold: 0.5)
- [x] Puan: Speak=15, Type=12, Pick=10

## ~~HAFTA 3 — Konuşma Modu + Session Takip~~ ✅ TAMAMLANDI
- [x] Web Speech API entegrasyonu
- [x] Speak modu aktif
- [x] Telaffuz skoru (getPronunciationScore, 0-100)
- [x] Migration 006 → conversation_sessions tabloları
- [x] saveSession() → localStorage

## ~~HAFTA 4 — Progress İstatistikleri~~ ✅ TAMAMLANDI
- [x] StatsPage → son 5 session listesi
- [x] Dashboard → Today's Conversation widget
- [x] Dashboard → Streak düzeltmesi
- [x] ProfilePage → Conversation Stats + Most Practiced Words

## ~~HAFTA 5 — Polish & Test~~ ✅ TAMAMLANDI
- [x] Çocuk modu TTS (0.6 child / 0.9 adult)
- [x] Tüm 4 dil çifti test edildi
- [x] Türkçe kalıntı temizlendi
- [x] useWordStore singleton fix

## ~~HAFTA 6 — ChatBot + Senaryo Sistemi~~ ✅ TAMAMLANDI
- [x] ChatBot UI (baloncuk sistemi, /chatbot route)
- [x] 8 ES senaryo paketi üretildi ve DB'ye eklendi
- [x] 8 PT senaryo paketi üretildi ve DB'ye eklendi
- [x] Study sayfasına ChatBot CTA butonu eklendi
- [x] /scenarios senaryo seçim ekranı oluşturuldu
- [x] AppRouter güncellendi
- [x] Tam akış test edildi: Study → Scenarios → ChatBot

---

## 🔄 HAFTA 7 — Polish & Android Build Hazırlığı

### Dashboard
- [ ] Chat Practice kartı → /scenarios bağlantısı

### UI/UX
- [ ] Genel polish ve iyileştirmeler
- [ ] Hata mesajları düzenleme

### İçerik Genişletme
- [ ] ES senaryo paketi artırımı (8 → 16)
- [ ] PT senaryo paketi artırımı (8 → 16)
- [ ] A2 seviyesi senaryo paketleri

### Capacitor Android Build
- [ ] Capacitor config güncelle
- [ ] npx cap add android
- [ ] npx cap sync
- [ ] Android Studio'da build
- [ ] APK test (fiziksel cihaz)

---

## 📱 SATIŞ
- [ ] Gumroad → APK direkt satış
- [ ] Hotmart → Latam pazarı (ES/PT)
- [ ] Kendi domain (aguilangevo.com)
- [ ] Google Play Store
- [ ] App ikonu (tüm boyutlar)
- [ ] Screenshot (EN/ES/PT)
- [ ] Açıklama metni (EN/ES/PT)
- [ ] Fiyatlandırma stratejisi
- [ ] Privacy Policy sayfası

---

## 🌱 v2 — AguiLangEvoTR
**Hedef:** Türkiye pazarı
**Dil çiftleri:** TR→EN, TR→ES
**Plan:**
- [ ] AguiLangEvo v1.0 tamamlandıktan sonra fork
- [ ] TR kelime seti (Tencent ile üret)
- [ ] TR ses dosyaları (edge-tts)
- [ ] TR senaryo paketleri
- [ ] i18n TR anahtarları
- [ ] Türkiye App Store + Google Play TR lansmanı

---

## 🤖 AI ARAÇ STRATEJİSİ

| Araç | Görev | Maliyet |
|------|-------|---------|
| Claude (bu sohbet) | Strateji + mimari | Pro plan |
| Claude Code | Kritik geliştirme | Pro plan |
| Cline + Llama | Rutin kod | Ücretsiz |
| Tencent | İçerik + çeviri + JSON | Ücretsiz |
| edge-tts | TTS/ses üretimi | Ücretsiz |
| Web Speech API | STT | Ücretsiz |
| Fuse.js | Fuzzy match | Ücretsiz |

### Kural
- Tencent → JSON/metin/çeviri üretimi (içerik)
- Claude Code → Script yazma + DB işlemleri
- Cline → Rutin dosya ekleme/güncelleme
- Git push → Her zaman manuel terminal

---

## 📊 PROJE METRİKLERİ (Mayıs 2026)

Kelimeler           : 130 (EN/ES/PT tam)
Conversation Pack   : 505 (451 ES + 101 PT)
Exchange            : 1611+
Kelime Sesi MP3     : 1412
Bot Sesi MP3        : 1601
i18n Anahtar        : 222+
Migration           : 006
Dil Çifti           : 4 aktif
ChatBot Senaryo     : 16 (8 ES + 8 PT)
Session Takip       : ✅ localStorage

---

## 🔧 TEKNİK STACK
Frontend  : React + Vite + Tailwind
Mobile    : Capacitor
Backend   : Python (scripts)
DB        : SQLite (better-sqlite3) + localStorage
TTS       : edge-tts (offline)
STT       : Web Speech API
Fuzzy     : Fuse.js
i18n      : Custom hook (translations.js)
Audio     : HTML5 Audio API

---

*Sorumluluk: Ata + Claude (Anthropic)*
*Repo: https://github.com/ataeyvaz/aguilangevo*