# Kıdemli Geliştiriciler İçin API Kuralları

## API Tasarım Standartları
- Kaynak odaklı URL'ler ve tutarlı yapı ile API uç noktalarını tasarlayın
- Uygun HTTP yöntemlerini (GET, POST, PUT, PATCH, DELETE) doğru şekilde kullanın
- Tüm yanıt durumları için uygun HTTP durum kodlarını uygulayın
- Sayfalama, sıralama ve filtreleme için standart sorgu parametrelerini destekleyin

## İstek ve Yanıt Biçimlendirme
- Tutarlı alan adlandırma ile istek/yanıt yükü yapılarını standartlaştırın
- Tutarlı tarih/saat işleme ile tüm API iletişimleri için JSON formatını uygulayın
- Açık hata mesajları ile kapsamlı istek doğrulama sağlayın
- Uygun içerik müzakere ve sürümleme stratejileri uygulayın

## Güvenlik Uygulaması
- Uygun kimlik doğrulama ve yetkilendirme katmanları ile API uç noktalarını güvence altına alın
- Kötüye kullanım ve DDoS saldırılarını önlemek için hız sınırlaması uygulayın
- Uygun yerlerde durum bilgisi olmayan kimlik doğrulama için JWT standartlarını uygulayın
- Tüm giriş parametrelerini ve başlıklarını doğrulayın ve temizleyin

## Dokümantasyon Standartları
- OpenAPI/Swagger spesifikasyonlarını kullanarak güncel API dokümantasyonu sağlayın
- Tüm API uç noktaları için örnek istek/yanıtlar ekleyin
- Kimlik doğrulama yöntemlerini, sınırlamaları ve hata kodlarını belgelendirin
- Yaygın entegrasyon senaryoları için pratik kod örnekleri sağlayın

## Performans Gereksinimleri
- Standart işlemler için minimum yanıt süreleri (200ms altında) için API uç noktalarını optimize edin
- Uygun veritabanı sorguları ve önbellekleme ile verimli veri alma uygulayın
- Uygun yük doğrulama ve işleme ile toplu işlemleri destekleyin
- Büyük veri kümeleri ve dosya aktarımları için akış yanıtları sağlayın
