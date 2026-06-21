# Kıdemli Geliştiriciler İçin Çapraz Ajan Koordinasyon Kuralları

## İletişim Protokolleri
- Farklı geliştirme ajanları arasında standartlaştırılmış iletişim kanalları kurun
- Paylaşılan dokümantasyon aracılığıyla mimari kararları senkronize edin
- İletişim uyumsuzluklarını önlemek için paylaşılan terimler sözlüğü koruyun
- Ekipler arasında sürüm döngülerini ve dağıtım programlarını koordine edin

## Arayüz Tanımları
- Farklı sistem bileşenleri arasındaki API sözleşmelerini açıkça belgelendirin
- Servisler arasındaki entegrasyon noktalarını doğrulamak için sözleşme testi kullanın
- Sürümlü arayüz tanımlarını (OpenAPI, JSON Schema) koruyun
- Geriye uyumlu arayüz değişiklikleri için protokoller belirleyin

## Bilgi Paylaşımı
- Güvenlik açıklıkları bulgularını tüm geliştirme akışlarında paylaşın
- Uygulama sırasında keşfedilen performans darboğazlarını iletin
- Mimari karar kayıtlarını (ADR) ajanlar arasında dolaştırın
- Önceliklendirilmiş görevlerle paylaşılan teknik borç kaydı koruyun

## Tutarlılık Standartları
- Ön uç, arka uç ve veritabanı uygulamalarında adlandırma kurallarını hizalayın
- Ön uç, arka uç ve altyapı arasında güvenlik uygulama standartlarını hizalayın
- Tüm katmanlarda tutarlı hata yönetimi ve günlükleme yaklaşımları koruyun
- Farklı uygulama bileşenlerinde tutarlı test stratejileri koruyun

## Değişiklik Yönetimi
- Birden fazla ajanı etkileyen veritabanı şeması değişikliklerini koordinate edin
- Kurulmuş bildirim kanalları aracılığıyla kırıcı API değişikliklerini iletin
- Birden fazla bileşeni etkileyen kullanımdan kaldırılan işlevsellik için geçiş yolları planlayın
- Uygulama dağıtım programlarıyla altyapı güncellemelerini hizalayın
