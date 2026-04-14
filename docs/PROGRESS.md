# AguiLang2 — Proje İlerleme Durumu

_Son güncelleme: 2026-04-14_

---

## Genel Durum

Proje aktif geliştirme aşamasında. Temel iskelet, tüm öğrenme akışı ve ebeveyn kontrol sistemi tamamlandı. Build temiz çıkıyor, bilinen hata yok.

**Stack:** React 19 · Vite 8 · React Router v7 · TailwindCSS 3 · localStorage (backend yok)

---

## Tamamlanan Sayfalar

### Öğrenci Akışı
| Sayfa | Route | Durum | Notlar |
|---|---|---|---|
| Profil Seçimi | `/` | ✅ Tamamlandı | Çocuk / yetişkin profil tipi |
| Dil Seçimi | `/language` | ✅ Tamamlandı | Ebeveyn kısıtlaması aktif |
| Kategori Seçimi | `/categories` | ✅ Tamamlandı | Ebeveyn izin filtresi aktif |
| Flash Kartlar | `/learn` | ✅ Tamamlandı | Günlük stat kaydı, kategori guard |
| Quiz Ekranı | `/quiz` | ✅ Tamamlandı | Yanlış-retry, çapraz kategori karışımı, manuel geçiş |
| Dashboard | `/dashboard` | ✅ Tamamlandı | Gerçek veriler, 7 günlük chart, zorlanılan kelimeler |
| Öğrendiklerim | `/learned` | ✅ Tamamlandı | Tüm 20 kategori yükleme, seviye grupları, arama |
| İstatistikler | `/stats` | ✅ Tamamlandı | Bar chart, kategori ilerleme, en uzun seri |
| Oyna | `/play` | 🔲 Placeholder | "Yakında eklenecek" |
| Profil | `/profile` | 🔲 Placeholder | "Yakında eklenecek" |

### Ebeveyn Sistemi
| Sayfa | Route | Durum | Notlar |
|---|---|---|---|
| Ebeveyn Kapısı | `/parent` | ✅ Tamamlandı | PIN ekranı, shake animasyonu, default "1234" |
| Ebeveyn Paneli | `/parent/panel` | ✅ Tamamlandı | 5 sekme (aşağıya bak) |

**ParentPanel sekmeleri:**
- **İstatistik (1)** — Çocuğun genel quiz ve kelime istatistikleri
- **Kontrol (2)** — Kategori açma/kapama, dil kısıtlaması
- **Plan (3)** — Günlük hedef, oturum süresi planlaması
- **Oturum (4)** — Aktif oturum bilgisi
- **Sıfırla (5)** — Quiz stats, günlük stats, kategori bazlı veya tam sıfırlama

### Layout / Navigasyon
| Bileşen | Durum | Notlar |
|---|---|---|
| AppLayout | ✅ Tamamlandı | Sidebar (web) + BottomNav (mobil) |
| Sidebar | ✅ Tamamlandı | 6 nav linki, profil özeti, ebeveyn paneli linki, aktif vurgu |
| BottomNav | ✅ Tamamlandı | 4 tab, aktif çizgi göstergesi |
| AppRouter | ✅ Tamamlandı | Standalone + AppLayout rotaları ayrımı |

---

## Tamamlanan Hook'lar

| Hook | Dosya | Açıklama |
|---|---|---|
| `useSession` | `hooks/useSession.js` | Quiz oturumu, `aguilang_word_stats` yazımı |
| `useDailyStats` | `hooks/useDailyStats.js` | `recordDaily`, `getTodayStats`, `getDailyStats(n)` |
| `useParentControls` | `hooks/useParentControls.js` | Ebeveyn ayarları okuma |
| `useDailyPlan` | `hooks/useDailyPlan.js` | Günlük plan |
| `useProfile` | `hooks/useProfile.js` | Profil yönetimi |
| `useProgress` | `hooks/useProgress.js` | İlerleme takibi |
| `useSettings` | `hooks/useSettings.js` | Genel ayarlar |
| `useSpeech` | `hooks/useSpeech.js` | TTS |

---

## localStorage Şeması

| Anahtar | Tip | İçerik |
|---|---|---|
| `aguilang_active_profile` | object | `{name, type, points, level, streak, initial}` |
| `aguilang_active_lang` | object | `{id, name}` |
| `aguilang_active_category` | object | `{id, name, emoji}` |
| `aguilang_active_categories` | string[] | Ebeveyn kategori izin listesi (null = hepsi açık) |
| `aguilang_word_stats` | object | `{wordId: {correct, wrong, seen}}` |
| `aguilang_daily_stats` | object | `{"2026-04-14": {seen, correct, wrong}}` |
| `aguilang_parent_pin` | string | PIN kodu (default: "1234") |
| `aguilang_parent_controls` | object | Dil ayarları, oturum limiti vb. |
| `aguilang_last_reset` | string | Son sıfırlama kaydı |

---

## Veri Dosyaları

- **20 kelime kategorisi:** `src/data/{cat}-a1.json` (animals, colors, numbers, fruits, vegetables, body, family, school, food, greetings, questions, clothing, home, transport, time, jobs, sports, places, adjectives, verbs)
- **6 diyalog seti:** `src/data/dialogues/{scene}-a1.json` (home, market, park, restaurant, school, travel)
- Her JSON: `translations.{langId}.words[]` şemasında, çoklu dil desteğiyle

---

## Alınan Mimari Kararlar

| Karar | Gerekçe |
|---|---|
| Backend yok, sadece localStorage | Çocuk hedef kitlesi için kurulum kolaylığı, offline kullanım |
| Modal yerine ayrı sayfalar (`/learned`, `/stats`) | URL paylaşılabilirliği, back button davranışı, Sidebar entegrasyonu |
| `window` custom event (`wordStatsUpdated`) | Bileşenler arası reaktivite için, context/global state olmadan |
| `useRef` ile veri yükleme kilidi | Strict Mode çift mount'unda çift yüklemeyi önlemek için |
| Quiz: `startSession` useEffect deps'ten çıkarıldı | `startSession` her render'da yeniden oluşturulduğundan sonsuz döngüyü önler |
| Çapraz kategori karışımı: rastgele 2 kategori | `wordStats` kategori metadatası içermediğinden, `phase1` için random JSON yükle |
| ESLint `// eslint-disable-line` | `wordStats` closure bağımlılığı intentionally omitted (deps eklemek sonsuz döngü yapar) |
| `getLevel` fonksiyonu silindi | Modal kaldırıldıktan sonra Dashboard'da kullanılmaz hale geldi |

---

## Bekleyen Görevler

### Yüksek Öncelik
- [ ] `/play` — Oyun sayfası gerçek içerikle doldurulacak
- [ ] `/profile` — Profil sayfası (rozet, başarım, ayarlar)
- [ ] BottomNav'a `/learned` veya `/stats` tab'ı eklenecek mi? (şu an sadece 4 tab)
- [ ] Zorlanılan kelimeler için "Tekrar Et" butonu doğrudan quiz'e yönlendirilecek (filtreli)

### Orta Öncelik
- [ ] Diyalog verileri (`dialogues/`) henüz hiçbir sayfada kullanılmıyor
- [ ] `useSpeech` ve `audioManager` entegrasyonu (TTS flash kartlarda çalışıyor mu?)
- [ ] Profil puanlama / level-up sistemi gerçek mantıkla (şu an statik)
- [ ] Quiz sonuç ekranı (oturum özeti, doğru/yanlış özeti)

### Düşük Öncelik
- [ ] `useProgress.js` ve `useSettings.js` hook'larının hangi sayfada kullanıldığı netleştirilecek
- [ ] ParentPanel İstatistik sekmesi verilerinin gerçek `aguilang_word_stats`'a bağlanması
- [ ] Streak (günlük seri) sayacının gerçek güne göre sıfırlanma mantığı

---

## Git Geçmişi

```
ea7405d  Günlük istatistik + öğrenilen kelimeler + quiz iyileştirmeleri
2c9eb75  Ebeveyn kategori kontrolu + ParentPanel tamamlandi
fc29696  Sidebar ve BottomNav aktif rota vurgusu eklendi
9ce4188  Quiz wordStats kaydı + Dashboard zorlanılan kelimeler
7976567  Cümle verileri eklendi - EN/DE/ES
76e167b  QuizScreen + profil ekleme tamamlandi
9083478  Büyük veri dosyaları gitignore eklendi
67cac4c  AguiLang v2 - temel sayfalar tamamlandi
```

> **Not:** `ea7405d` sonrası yapılan değişiklikler (modal→sayfa, Sıfırla sekmesi, AppRouter güncellemesi, `getLevel` temizliği) henüz commit edilmedi.
