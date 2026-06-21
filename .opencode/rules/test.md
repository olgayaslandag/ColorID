# Kıdemli Geliştiriciler İçin Test Kuralları

## Test Organizasyonu
- Testleri hiyerarşik olarak organize edin: Birim → Entegrasyon → Özellik → Uçtan uca
- AAA kalıbını (Düzenle, Eyle, Onayla) tutarlı olarak takip edin
- İnsan tarafından okunabilir test beklentileri için BDD tarzı onaylamalar kullanın
- Kaynak dosyalarla aynı adlandırma kuralını kullanarak test dosyalarını ayırın

## Birim Test Standartları
- Kritik iş mantığı birimlerinde %90+ kod kapsamı hedefleyin
- Bileşenleri izolasyonda test etmek için bağımlılıkları mock edin
- Kolay ikame için bağımlılık enjeksiyonu kullanın
- Tek bir davranışı doğrulamak için odaklanmış testler yazın

## Entegrasyon Testi
- Birden fazla birimin birlikte çalışmasının beklenen şekilde davranıp davranmadığını doğrulayın
- Veritabanı işlemleri, harici servis çağrıları ve olayları dahil edin
- Kritik iş akışları için performans regresyon testleri dahil edin
- Ortak güvenlik açığı türlerini kapsayan güvenlik testleri dahil edin

## Test Uygulama Yönergeleri
- `should_do_something_when_situation` formatında açıklayıcı test metodu isimleri kullanın
- Açık davranış dokümantasyonu için Verilen/Ne Zaman/O zaman yapısını takip edin
- setUp/tearDown prosedürlerinde paylaşılan test armatürlerini başlatın
- Testlerin rastgele sırayla yürütülebileceğinden emin olun - test bağımlılıklarından kaçının

## Test Boru Hattı
- Anında geri bildirim için sürekli entegrasyon boru hattında testleri yürütün
- Daha yavaş entegrasyon testlerinden hızlı çalışan birim testlerini ayırın
- Otomatik kapsam raporları uygulayın ve minimum kapsam eşiklerini zorunlu kılın
- Gece çalıştırmaları için kapsamlı uçtan uca test paketleri planlayın
