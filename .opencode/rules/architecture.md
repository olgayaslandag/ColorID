# Kıdemli Geliştiriciler İçin Mimari Kuralları

## Sistem Tasarımı
- Temiz sorumluluk ayrımı ile katmanlı mimariyi takip edin
- Karmaşık iş alanları için domain-driven design (DDD) prensiplerini uygulayın
- Yazma/okuma işlemleri için CQRS (Command Query Responsibility Segregation) uygulayın
- Önemli tasarım kararları için mimari karar kayıtları (ADR) uygulayın

## Katman Yapısı
- Sunum katmanı UI, yönlendirme ve istemci tarafı doğrulamayı yönetir
- Uygulama katmanı kullanım durumlarını içerir ve bağımlılıkları düzenler
- Domain katmanı iş mantığını ve zengin domain modelleri ile varlıkları barındırır
- Kalıcılık katmanı veri depolama soyutlamalarını ve altyapıyı yönetir

## Bağımlılık Yönetimi
- Bağımlılık tersine çevirme prensibini kullanın - soyutlamalara bağımlı olun
- Uygun ömürlerle (singleton/scoped/transient) tüm servisleri konteynere kaydedin
- Repository arayüzleri aracılığıyla domain kavramlarını sızdırmayın
- Polimorfik davranış için kompozisyonu kalıtıma tercih edin

## Ölçeklenebilirlik Düşünceleri
- API'leri kolayca sürümlenebilir şekilde tasarlayın
- Başlangıçtan yatay ölçeklendirme planlayın - sunucu yakınlığını önleyin
- Harici servis çağrıları için devre kesici kalıbını uygulayın
- Mümkün olduğunca idempotent işlemler tasarlayın, daha iyi dayanıklılık için
