# Kıdemli Geliştiriciler İçin Güvenlik Kuralları

## Kimlik Doğrulama ve Yetkilendirme
- Çok faktörlü kimlik doğrulama desteği ile uygun kullanıcı kimlik doğrulaması uygulayın
- En az ayrıcalık prensibi ile rol tabanlı erişim kontrolü (RBAC) uygulayın
- BCrypt/PBKDF2/Argon2 ile uygun parola politikaları ve karma kullanın
- Güvenli çerezler ve oturum zaman aşımları ile uygun oturum yönetimi uygulayın

## Veri Koruması
- İletim sırasında ve beklemede güçlü algoritmalarla hassas verileri şifreleyin
- SQLi, XSS gibi enjeksiyon saldırılarını önlemek için tüm kullanıcı girdilerini doğrulayın ve temizleyin
- Parametreli sorgular ve hazırlanan ifadeleri münhasıran kullanın
- XSS'i önlemek için içerik güvenlik politikası (CSP) başlıkları uygulayın

## Giriş Doğrulama ve Temizleme
- İstemci ve sunucu tarafında tutarlı olarak girdileri doğrulayın
- Sağlam doğrulama kütüphaneleri ile katı şemalar tanımlayın ve uygulayın
- Dosya yüklemelerini, tip/boyut kısıtlamaları uygulayın ve virüs taraması yapın
- API uç noktalarında kötüye kullanımı önlemek için hız sınırlaması uygulayın

## Güvenli İletişim
- Tüm sayfalarda HTTPS'yi zorunlu kılın ve HSTS başlıkları uygulayın
- Uygun şekilde yapılandırılmış TLS sertifikaları kullanın
- CSRF saldırılarını önlemek için token doğrulaması uygulayın
- Kaynakları açıkça kısıtlayan uygun CORS yapılandırması uygulayın

## Oturum Yönetimi
- Kriptografik olarak güvenli oturum ID'leri oluşturun
- Hareketizlik döneminden sonra otomatik oturum kapatması uygulayın
- Sunucu tarafında süre sonları ile oturumları güvenli şekilde depolayın
- Başarılı kimlik doğrulamalardan sonra oturum ID'lerini yeniden oluşturun

## Hata Yönetimi
- Sistem bilgilerini açığa çıkarmadan güvenlik olaylarını günlüğe kaydedin
- Bilgi ifşasını önlemek için özel hata sayfaları uygulayın
- Şüpheli faaliyetleri ve başarısız girişimleri izleyin ve uyarın
- Düzenleyici denetim için günlükleri güvenli şekilde koruyun
