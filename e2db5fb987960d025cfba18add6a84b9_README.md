# Twitter (X) Tweet Temizleme Aracı

Kişisel Twitter hesabınızdaki binlerce tweeti güvenli şekilde temizlemek için geliştirilmiş Node.js scripti.

## ⚠️ ÖNEMLİ UYARILAR

- Bu script **sadece kendi hesabınız için** kullanılmalıdır
- Twitter API v2 kullanır, browser automation içermez
- Rate limit koruması ile güvenli çalışır
- Tweetler geri alınamaz - dikkatli kullanın!

## 🚀 Hızlı Başlangıç

### 1. Gerekli Yazılımlar

```bash
# Node.js 14+ gerekli
node --version
npm --version
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Twitter API Anahtarları Al

1. [developer.twitter.com](https://developer.twitter.com) adresine gidin
2. Yeni bir proje/uygulama oluşturun
3. API v2 erişimi sağlayın
4. OAuth 1.0a kimlik doğrulaması etkinleştirin
5. API anahtarlarınızı not alın

### 4. Ortam Değişkenlerini Ayarla

```bash
cp .env.example .env
```

`.env` dosyasını açın ve Twitter API anahtarlarınızı girin:

```env
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
ACCESS_TOKEN=your_access_token_here
ACCESS_SECRET=your_access_token_secret_here
```

### 5. İlk Çalıştırma (Dry Run)

```bash
# Tweetleri analiz et, silme
npm run dry-run
# veya
node index.js --dry-run
```

## 📖 Kullanım Örnekleri

### Dry Run (Güvenli Analiz)
```bash
node index.js --dry-run
```
- Tweetleri sayar ve listeler
- Gerçek silme yapmaz
- Hangi tweetlerin silineceğini gösterir

### Sadece Reply'leri Sil
```bash
node index.js --replies-only
```
- Sadece yanıt olan tweetleri siler
- Normal tweetler korunur

### Belirli Tarihten Öncekileri Sil
```bash
node index.js --before=2022-01-01
# veya
node index.js --before=2020-06-15
```

### Kombine Filtreler
```bash
# 2021'den önceki reply'leri sil
node index.js --replies-only --before=2021-01-01

# Sadece analiz yap, silme
node index.js --dry-run --replies-only --before=2020-01-01
```

## ⚙️ Parametreler

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `--dry-run` | Tweetleri analiz et, silme | `--dry-run` |
| `--replies-only` | Sadece reply'leri hedefle | `--replies-only` |
| `--before=YYYY-MM-DD` | Belirtilen tarihten önceki tweetleri hedefle | `--before=2022-01-01` |

## 🔧 Çalışma Prensipleri

### Güvenlik Özellikleri
- ✅ OAuth 1.0a kimlik doğrulama
- ✅ Tek tek tweet silme
- ✅ Random delay (2-4 saniye)
- ✅ Rate limit koruması
- ✅ Hata yakalama ve kurtarma

### İşlem Akışı
1. `.env` dosyasını okur
2. Twitter API'ye bağlanır
3. Kullanıcı bilgilerini alır
4. Timeline'dan tüm tweetleri çeker (pagination)
5. Filtreleri uygular
6. Dry run ise rapor yazar
7. Değilse sırayla siler
8. Progress log gösterir

### Rate Limit Yönetimi
- Her tweet silme arasında 2-4 saniye random bekleme
- 429 hatası alınca 2 dakika otomatik bekleme
- Devam eden işlemler için progress tracking

## 📊 Örnek Çıktılar

### Dry Run Çıktısı
```
🧹 Twitter Tweet Temizleme Aracı
========================================
🔐 Twitter API bağlantısı kuruluyor...
✅ Bağlantı başarılı! Kullanıcı: @kullaniciadi
📊 Tweetler çekiliyor...
📝 100 tweet çekildi...
📝 500 tweet çekildi...
📊 Toplam 2500 tweet bulundu
🎯 Filtreler sonrası 1200 tweet hedeflendi

🔍 DRY RUN MODU - Silme yapılmayacak, sadece analiz

📊 DRY RUN RAPORU:
==================================================
📝 Toplam tweet sayısı: 2500
💬 Reply sayısı: 800
📢 Normal tweet sayısı: 1700
🗑️ Silinecek tweet sayısı: 1200

⚠️  Gerçek silme için --dry-run parametresini kaldırın
```

### Gerçek Silme Çıktısı
```
🗑️ 1200 tweet silinecek...

✅ Silindi [1/1200]: 1234567890123456789 - 2020-05-15
✅ Silindi [2/1200]: 1234567890123456790 - 2020-05-16
✅ Silindi [3/1200]: 1234567890123456791 - 2020-05-17
...

📊 İŞLEM TAMAMLANDI:
==================================================
✅ Silinen tweet sayısı: 1200
⏱️  Toplam süre: Yaklaşık 60 dakika
```

## 🛠️ Sorun Giderme

### Yaygın Hatalar

**1. "Unauthorized" Hatası**
- API anahtarlarınızı kontrol edin
- OAuth 1.0a'nın etkin olduğundan emin olun

**2. "Rate Limit" Hatası**
- Script otomatik bekler, sabırla bekleyin
- Çok fazla API çağrısı yapmayın

**3. "Tweet Not Found" Hatası**
- Zaten silinmiş tweetler için normal
- Script devam eder

### Performans İpuçları

- Binlerce tweet için işlem 1-2 saat sürebilir
- İnternet bağlantınızın stabil olduğundan emin olun
- Script çalışırken bilgisayarınızı uykuya almayın

## 📝 Log Dosyası

İşlem loglarını kaydetmek için:
```bash
node index.js --replies-only --before=2020-01-01 > cleanup-log.txt 2>&1
```

## 🔒 Güvenlik

- API anahtarlarınızı asla paylaşmayın
- `.env` dosyasını git'e commit etmeyin
- Sadece kendi hesabınız için kullanın
- Tweetler geri alınamaz!

## 📄 Lisans

MIT License - Kişisel kullanım için serbest

## 🤝 Katkıda Bulunma

Bu script kişisel kullanım için geliştirilmiştir. İyileştirme önerileriniz için issue açabilirsiniz.

---

**⚠️ Son Uyarı**: Bu script tweetleri kalıcı olarak siler. Kullanmadan önce mutlaka `--dry-run` ile analiz yapın!