# Kıdemli Geliştiriciler İçin Genel Kurallar

## Temel İlkeler
- SOLID prensiplerini ve temiz mimari kalıplarını tutarlı bir şekilde takip edin
- Büyük sürüm güncellemeleri yapmadığınız sürece geriye uyumluluğu koruyun
- Tüm kod test edilebilir olmalı - bağımlılık enjeksiyonu ve gevşek bağlantıyı tercih edin
- Önemli kararlar için mimari kararları ADR'lerde belgelendirin

## Teknik Standartlar
- Anlamlı değişken/fonksiyon isimleri ile kendi kendini açıklayan kod yazın
- İzci kuralını uygulayın - kodu bulduğunuzdan daha temiz bırakın
- Yapılandırılmış günlükleme ile uygun hata yönetimi uygulayın
- DRY prensibini akıllıca uygulayın - erken soyutlamadan kaçının

## Kalite Güvence
- Tüm kod değişiklikleri kapsamlı birim ve entegrasyon testleri gerektirir (minimum %80 kapsam)
- Kritik kullanıcı akışları için manuel test gerçekleştirin
- Statik analiz araçlarını kullanın ve linter yapılandırmalarını sıkı bir şekilde takip edin
- İş mantığı, güvenlik ve sürdürülebilirlik üzerine odaklanan eş kod incelemeleri gerçekleştirin

## Performans
- Ağır işlemler için bellek tüketimi ve yürütme süresini profilleyin
- Uygulanabilir yerlerde uygun önbellekleme stratejileri uygulayın
- Veritabanı sorgularını optimize edin ve uygun yüklemeyi kullanın
- Üçüncü taraf servis entegrasyonlarını gecikme etkileri için izleyin
