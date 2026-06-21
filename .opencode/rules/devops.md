# Kıdemli Geliştiriciler İçin DevOps Kuralları

## Altyapı Standartları
- Terraform/Ansible kullanarak altyapıyı kod olarak yönetin
- Ölçeklenebilirlik ve %99.9 kullanılabilirlik prensipleri ile bulut altyapısını tasarlayın
- Sıfır kesinti dağıtımları için mavi-yeşil dağıtım stratejileri uygulayın
- En az ayrıcalık prensibi ile altyapı güvenliği uygulayın

## Dağıtım Stratejileri
- Geliştirme, hazırlama, üretim arasında özdeş yapılandırmaları koruyun
- Onay kapıları ile otomatik dağıtım boru hatları uygulayın
- İzlenebilirlik için uygulama eserlerini benzersiz şekilde sürümleyin
- Açık geri dönüş prosedürleri ile geri dönüş yetenekleri sağlayın

## Konteyner ve Orkestrasyon
- Docker ile uygulamaları minimal görüntülere paketleyin
- Konteyner orkestratörlerinde uygun sağlık kontrolleri ve hazır olma probu uygulayın
- Konteyner orkestratörlerinde kaynak sınırları ve istekleri uygulayın
- Gizli yönetim için sırları kullanın

## İzleme ve Gözlemlenebilirlik
- Standartlaştırılmış formatlar ve alanlarla yapılandırılmış günlükleme uygulayın
- Tüm servisler için performans izleme ve uyarı kurun
- Altyapı genelinde operasyonel metrikleri toplayın ve görselleştirin
- Dağıtılmış servis işlemleri için dağıtılmış izleme yapılandırın

## Güvenlik Entegrasyonu
- CI/CD'nin bir parçası olarak konteyner görüntülerini güvenlik açıkları için tarayın
- Altyapı yapılandırmalarının düzenli otomatik güvenlik taramalarını gerçekleştirin
- Yedekleme ve felaket kurtarma prosedürleri uygulayın
- Düzenleyici denetim için uyumluluk otomasyonu sağlayın

## Ölçeklendirme ve Kaynak Yönetimi
- Kaynak kullanımını izleyin ve otomatik ölçeklendirme politikaları kurun
- Uygun önbellekleme stratejileri uygulayın (uygulama, DNS, CDN)
- Farklı başarısızlık senaryoları için başarısızlık stratejileri tasarlayın
- Ayrılmış örnekler ve spot kaynaklar kullanarak maliyetleri optimize edin
