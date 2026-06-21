# Kıdemli Geliştiriciler İçin Frontend Blade Kuralları

## Şablon Yapısı
- Hiyerarşik olarak organize edilmiş Blade şablonları ile uygun ana düzenler uygulayın
- Yeniden kullanılabilir UI öğeleri ve bölümler için bileşenler ve yuvalar kullanın
- Yinelenen işaretlemeyi en aza indirmek için şablon kalıtımı uygulayın
- Bileşen dosyaları için uygun ad alanı organizasyonu kullanın

## Blade Söz Dizimi En İyi Uygulamaları
- Kontrol yapıları için ham PHP yerine Blade yönergelerini tercih edin
- Karmaşık mantık için @php bloklarını az kullanın, bileşenleri tercih edin
- Ortak işlemler için Blade'in yerleşik yönergelerini (if, foreach, isset) kullanın
- Dizi söz dizimi ile Blade'in koşullu sınıf bağlamasını kullanın

## Düzen ve Bileşen Tasarımı
- Kurulan CSS çerçevelerini (Tailwind, Bootstrap) kullanarak duyarlı tasarım uygulayın
- Uygun erişilebilirlik öznitelikleri ile anlamsal HTML5 öğeleri kullanın
- Açık prop sözleşmeleri ile modüler, birleştirilebilir bileşenler oluşturun
- Tutarlı adlandırma ile CSS yardımcı sınıflarını sistemli olarak uygulayın

## Entegrasyon Düşünceleri
- Görünümlere kontrolörlerden minimal, belirli veri geçirin
- Şablonlarda uygun hata yönetimi ve görüntüleme uygulayın
- Statik içerik ve kısmi için Blade önbelleklemesini kullanın
- Gerektiğinde hafif etkileşim için x-data ve AlpineJS'yi kullanın

## Performans Optimizasyonu
- Kritik olmayan JavaScript için satır içi JavaScript'i en aza indirin; değerleri geçirmek için veri özniteliklerini kullanın
- Kritik olmayan JavaScript için ertelenmiş komut dosyası yüklemesi kullanın
- Uygun parçalama ile Blade bileşen oluşturmayı optimize edin
- Uygun önbellek başlıkları ile tarayıcı önbelleklemesini kullanın
