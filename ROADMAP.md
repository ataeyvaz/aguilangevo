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
- [x] i18n sistemi (222 anahtar)
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
- [x] Input field + fuzzy match
- [x] Puan: Speak=15, Type=12, Pick=10
- [x] "runing" → "run" eşleştirme

## ~~HAFTA 3 — Konuşma Modu + Session Takip~~ ✅ TAMAMLANDI
- [x] Web Speech API entegrasyonu
- [x] Speak modu aktif
- [x] Desteklenmiyorsa → Pick moduna düş
- [x] Mikrofon izin yönetimi
- [x] Telaffuz skoru (getPronunciationScore, 0-100)
- [x] Threshold: Fuse.js 0.5
- [x] Migration 006 → conversation_sessions + session_exchanges tabloları
- [x] saveSession() → localStorage (aguilang_conv_sessions)
- [x] Her practice session otomatik kayıt
- [x] Pick/Type/Speak ayrı skor kaydı
- [x] Pronunciation skoru kaydı
- [x] StatsPage → 💬 Conversation Practice kartı
- [x] getConvStats() → sessions/exchanges/totalScore/avgPron/byMode

## HAFTA 4 — Konuşma Geçmişi + Progress 🔄
**Araç:** Cline + Claude Code  
**Görev:**
- [ ] StatsPage → son 5 session listesi (tarih, skor, kelime)
- [ ] Dashboard → haftalık conversation aktivite
- [ ] Word bazlı başarı takibi (hangi kelimede kaç session)
- [ ] Streak sistemi (günlük practice)
- [ ] Profile sayfası → toplam istatistik özeti

## HAFTA 5 — Polish & Test
**Araç:** Manuel test + Cline  
**Görev:**
- [ ] Çocuk modu TTS yavaşlatma
- [ ] Emoji/animasyon feedback (child)
- [ ] Tüm 4 dil çifti test
- [ ] Türkçe kalıntı son tarama
- [ ] UI/UX iyileştirmeleri
- [ ] useWordStore çoklu render fix
- [ ] Practice_original.jsx temizliği

## HAFTA 6 — ChatBot (Sesli + Yazılı + Seçmeli)
**Araç:** Ling-2.6-1T (JSON üretim) + Cline + Claude Code  
**Mimari:** Lokal, offline, ücretsiz — API yok  
**Görev:**

### Altyapı
- [ ] ChatBot UI (baloncuk/mesajlaşma arayüzü)
- [ ] Her turda mod seçimi: 🎤 Sesli / ⌨️ Yazı / 👆 Seçmeli
- [ ] Bot sesi otomatik çalar (mevcut MP3 sistemi)
- [ ] Sohbet geçmişi (baloncuk akışı)
- [ ] Yanlış cevaplar → SRS'ye beslenir

### İçerik — Kelime Bazlı
- [ ] Öğrenilen kelime → ilgili pack otomatik eşleme
- [ ] Study bittikten sonra "Chat Practice!" CTA butonu
- [ ] Quiz içinde chat baloncuğu formatı

### İçerik — Senaryo Paketleri (Ling ile üret)
- [ ] 👋 Tanışma & Selamlama (8 exchange)
- [ ] ☕ Kafe & Restoran (8 exchange)
- [ ] 🛒 Alışveriş (8 exchange)
- [ ] ✈️ Seyahat & Havalimanı (8 exchange)
- [ ] 🏙️ Turistik & Yol Sorma (8 exchange)
- [ ] 🏫 Okul & İş Tanışma (8 exchange)
- [ ] 📱 Günlük Rutin (8 exchange)
- [ ] 🏥 Acil & Sağlık (8 exchange)
- [ ] Her senaryo: ES + PT versiyonu
- [ ] Toplam: ~128 yeni exchange

### Kullanım Modları
- [ ] MOD 1: Study sonu → otomatik teklif
- [ ] MOD 2: Quiz → chat baloncuğu formatı  
- [ ] MOD 3: Serbest egzersiz → menüden senaryo seç

## HAFTA 7 — Dinamik ChatBot (v2.0, İleride)
**Araç:** OpenRouter API  
**Görev:**
- [ ] OpenRouter entegrasyonu (Ling-2.6-1T)
- [ ] Öğrenilen kelimeler context'e eklenir
- [ ] Serbest konuşma modu (sınırsız)
- [ ] Internet gerektirir
- [ ] Premium özellik olarak konumlandır

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

## 🛒 SATIŞ

### Platform (Öncelik Sırasına)
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

| Araç | Görev | Maliyet |
|------|-------|---------|
| Claude (bu sohbet) | Strateji + mimari | Pro plan |
| Claude Code | Kritik geliştirme | Pro plan |
| Cline + Llama 3.3 | Rutin kod | Ücretsiz |
| Tencent HY3 | İçerik + çeviri | Ücretsiz |
| edge-tts | TTS/ses üretimi | Ücretsiz |
| Web Speech API | STT | Ücretsiz |
| Fuse.js | Fuzzy match | Ücretsiz |

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
i18n Anahtar        : 222
Migration           : 006
Fuse.js             : kurulu ✅
Speak Modu          : aktif ✅
Session Takip       : aktif ✅ (localStorage)
Dil Çifti           : 4 (EN↔ES, EN↔PT)

### Hedef (v1.0)
Conversation Pack   : 537+
Bot Ses MP3         : 1601+
STT                 : Web Speech API ✅
Yazma Modu          : Fuse.js ✅
Session Takip       : localStorage ✅
Platformlar         : Gumroad + Hotmart

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