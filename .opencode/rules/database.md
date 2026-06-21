# Kıdemli Geliştiriciler İçin Veritabanı Kuralları

## Şema Tasarımı
- Performans için stratejik olarak denormalize ederken şemayı 3NF'ye normalleştirin
- Tutarlı adlandırma kurallarını takip eden anlamlı kısıtlama isimleri kullanın
- Sık sorgulanan alanlar için uygun indeksleme stratejileri uygulayın
- 1M satırı aşan büyük tablolar için bölümleme stratejileri uygulayın

## Göç Uygulamaları
- Açıklamalı isimlerle şema değişikliklerini sürümlemek için göç dosyalarını kullanın
- Mümkün olduğunda tüm göçleri geriye uyumlu hale getirin
- Göç geri dönüşlerini hazırlama ortamlarında kapsamlı şekilde test edin
- Göçleri uygulamadan önce üretim veritabanını yedekleyin

## Sorgu Optimizasyonu
- Pahalı sorguları düzenli olarak profillemek için EXPLAIN ANALYZE kullanın
- N+1 sorgu sorunlarını önlemek için istekli yükleme uygulayın
- İndeksleri etkili şekilde kullanın ve WHERE yan tümcelerinde fonksiyonlardan kaçının
- Karmaşık toplamalar ve raporlama için materyalize edilmiş görünümleri düşünün

## Veri Bütünlüğü
- Veritabanı seviyesinde uygun yabancı anahtar kısıtlamaları uygulayın
- Çoklu tablo işlemleri için atomikliği sağlamak üzere işlemleri kullanın
- Tarihsel veri gerekli olduğunda yumuşak silmeleri uygulayın
- Domain geçerliliği doğrulaması için kontrol kısıtlamaları uygulayın

## Bağlantı Yönetimi
- Uygulama yüküne göre uygun bağlantı havuzlama yapılandırın
- Yeniden denemelerle veritabanı bağlantı kesintilerini zarif şekilde yönetin
- Kritik veritabanı işlemleri için devre kesici kalıbını uygulayın
- Bağlantı havuzu kullanımını izleyin ve uygun sınırlar belirleyin

## Seeder Kuralları
- **Model interface kullanmayın** - Doğrudan DB facade veya Eloquent model kullanın
- **Enum kullanabilirsiniz** - Tip güvenliği için enum'ları tercih edin
- Örnek: `DB::table('users')->insert([...])` veya `User::create([...])`
- Bulk insert için `insert()` kullanın, N+1 sorgularından kaçının
- Veri bütünlüğü için foreign key değerlerini kontrol edin
