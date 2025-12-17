# Kullanım Örnekleri

Bu dosya Twitter Tweet Temizleme Aracı'nın farklı kullanım senaryolarını gösterir.

## 🚀 Temel Kullanım

### 1. Güvenli Analiz (Dry Run)
```bash
# Tüm tweetlerinizi analiz edin, hiçbir şey silinmez
node index.js --dry-run
```

**Çıktı:**
```
🧹 Twitter Tweet Temizleme Aracı
========================================
🔐 Twitter API bağlantısı kuruluyor...
✅ Bağlantı başarılı! Kullanıcı: @kullaniciadi
📊 Tweetler çekiliyor...
📝 100 tweet çekildi...
📊 Toplam 2500 tweet bulundu
🎯 Filtreler sonrası 2500 tweet hedeflendi

🔍 DRY RUN MODU - Silme yapılmayacak, sadece analiz

📊 DRY RUN RAPORU:
==================================================
📝 Toplam tweet sayısı: 2500
💬 Reply sayısı: 800
📢 Normal tweet sayısı: 1700
🗑️ Silinecek tweet sayısı: 2500
```

### 2. Gerçek Silme (Dikkatli Kullanın!)
```bash
# TÜM tweetlerinizi siler - ÇOK TEHLİKELİ!
node index.js
```

## 🎯 Filtreleme Örnekleri

### 3. Sadece Reply'leri Sil
```bash
# Yanıt olan tweetleri siler, normal tweetleri korur
node index.js --replies-only
```

### 4. Tarihe Göre Filtrele
```bash
# 2022'den önceki tüm tweetleri siler
node index.js --before=2022-01-01

# 2020 yılından önceki tweetleri siler
node index.js --before=2020-06-15

# 2019'dan önceki tweetleri siler
node index.js --before=2019-12-31
```

### 5. Kombine Filtreler
```bash
# 2021'den önceki sadece reply'leri sil
node index.js --replies-only --before=2021-01-01

# 2020'den önceki tweetleri analiz et (silme)
node index.js --dry-run --before=2020-01-01

# Belirli bir tarihten önceki tüm içerikleri sil
node index.js --before=2018-01-01
```

## 📊 Senaryo Bazlı Örnekler

### Senaryo 1: "Hesabımı Temizlemek İstiyorum"
```bash
# 1. Önce analiz yap
node index.js --dry-run

# 2. Sonuçları gözden geçir

# 3. Karar ver ve sil
# Sadece eski tweetler için:
node index.js --before=2022-01-01

# Veya sadece reply'ler için:
node index.js --replies-only
```

### Senaryo 2: "Çok Fazla Reply Var, Onları Temizlemek İstiyorum"
```bash
# 1. Reply'leri analiz et
node index.js --dry-run --replies-only

# 2. Sadece eski reply'leri sil
node index.js --replies-only --before=2021-01-01

# 3. Veya tüm reply'leri sil (dikkatli!)
node index.js --replies-only
```

### Senaryo 3: "Belirli Bir Dönemden Önceki Her Şeyi Silmek İstiyorum"
```bash
# 2020'den önceki her şeyi sil
node index.js --before=2020-01-01

# Daha güvenli: önce analiz et
node index.js --dry-run --before=2020-01-01
```

### Senaryo 4: "Hesabımı Sıfırdan Başlatmak İstiyorum"
```bash
# ⚠️ TEHLİKELİ: Tüm tweetleri siler
node index.js

# Daha kontrollü yaklaşım:
node index.js --dry-run  # Önce analiz
# Sonra karar ver ve çalıştır
```

## 🔍 Loglama Örnekleri

### İşlem Loglarını Kaydet
```bash
# Terminal'e yazdırma + dosyaya kaydetme
node index.js --replies-only --before=2021-01-01 | tee cleanup-log.txt

# Sadece dosyaya kaydetme
node index.js --before=2020-01-01 > cleanup-log.txt 2>&1
```

### Arka Planda Çalıştırma
```bash
# Linux/Mac'te arka planda çalıştır
nohup node index.js --before=2020-01-01 > cleanup.log 2>&1 &

# İşlemi izlemek için
tail -f cleanup.log
```

## ⚡ Hızlı Komutlar

### NPM Scripts (package.json'dan)
```bash
npm run dry-run              # Analiz modu
npm run delete-replies       # Sadece reply'leri sil
npm run delete-old           # 2022'den önceki tweetleri sil
```

### Sık Kullanılan Kombinasyonlar
```bash
# Analiz için kısayol
node index.js --dry-run

# Güvenli silme (eski reply'ler)
node index.js --replies-only --before=2021-01-01

# Çok eski içerikleri temizle
node index.js --before=2019-01-01
```

## ⚠️ Önemli Uyarılar

1. **Her zaman dry-run ile başlayın!**
   ```bash
   node index.js --dry-run
   ```

2. **Tweetler geri alınamaz!**
   - Silmeden önce mutlaka analiz yapın
   - Önemli tweetlerinizi yedekleyin

3. **Rate limit'e dikkat edin**
   - Script otomatik bekler, sabırlı olun
   - İnternet bağlantınızın stabil olduğundan emin olun

4. **Küçük adımlarla ilerleyin**
   ```bash
   # Önce küçük bir tarih aralığı deneyin
   node index.js --dry-run --before=2023-01-01
   ```

## 🆘 Acil Durum Durdurma

Script çalışırken durdurmak için:
```bash
# Terminal'de Ctrl+C basın
# Veya yeni bir terminal'de:
pkill -f "node index.js"
```

**Not**: Script durdurulduğunda, henüz silinmemiş tweetler korunur. Kaldığınız yerden devam etmek için script'i tekrar çalıştırabilirsiniz.