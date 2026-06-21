# Kıdemli Geliştiriciler İçin Backend Kuralları

## API Geliştirme
- Uygun HTTP yöntemleri ve durum kodları ile RESTful prensipleri takip edin
- Kapsamlı istek doğrulama ve kimlik doğrulama uygulayın
- Geriye uyumluluğu korumak için API sürümlerini tasarlayın
- OpenAPI/Swagger kullanarak kapsamlı API dokümantasyonu sağlayın

## İş Mantığı Organizasyonu
- Saf fonksiyonları yan etkileri olan fonksiyonlardan ayırın
- Veritabanı işlemleri ve soyutlama için repository kalıbını takip edin
- Bağlamsal istisna mesajları ile uygun hata yönetimi uygulayın
- Karmaşık iş alanları için domain-driven design uygulayın

## Servis Katmanı Mimarisi
- İş yetenekleri ve sınırlı bağlamlar etrafında servisleri organize edin
- Uygun izolasyon ile uygun servis düzenlemesi uygulayın
- Farklı işlem türleri için komut/sorgu ayrımı uygulayın
- Servisleri durum bilgisi olmadan ve yatay olarak ölçeklenebilir şekilde tasarlayın

## Önbellekleme Stratejileri
- Çok Seviyeli Önbellekleme Stratejisi Uygulayın:
  * L1 Önbellek (Yöntem seviyesi, Aynı istek için Bellek İçi)
  * L2 Önbellek (Uygulama Seviyesi: Sık erişilen veriler için Redis/Memcached)
  * HTTP Önbellek (İstemci/Tarayıcı veya Ağ Geçidi seviyesi için statik içerik)
- Farklı veri türleri için önbellek geçersizleştirme stratejileri tanımlayın
- Pahalı işlemler için tembel yüklenen önbelleklenmiş hesaplamalar uygulayın

## Arka Plan İşleme
- Ağır işlemler için kuyruk sistemleri (Redis/SQS/RabbitMQ) kullanın
- Üstel geri çekme ile uygun yeniden deneme mekanizmaları uygulayın
- Yinelenenleri güvenli şekilde işlemek için idempotent kuyruk işleri tasarlayın
- Kuyruk uzunluğunu ve işleme metriklerini sürekli izleyin

## İzleme ve Gözlemlenebilirlik
- Korelasyon ID'leri ile yapılandırılmış günlükleme uygulayın
- Altyapı izleme için sağlık kontrolü uç noktaları sağlayın
- Uygun APM çözümleri kullanarak performans metriklerini takip edin
- Hata oranları ve gecikme için uyarı eşikleri belirleyin

## Repository Pattern

### BaseInterface ve BaseRepository
- Tüm repository interface'leri `BaseInterface`'e extend etmelidir
- Tüm repository sınıfları `BaseRepository`'den extend etmelidir
- **Aşırı ihtiyaç olmadıkça yeni method eklemeyin** - Base metodlar yeterliyse ek metod açmayın
- Domain-specific metodlar sadece business logic gerektiriyorsa ekleyin

### Yapı
```php
// Interface
interface IEmployeeRepository extends BaseInterface
{
    // Sadece domain-specific metodlar
    public function getByDepartment(int $departmentId): Collection;
}

// Repository
class EmployeeRepository extends BaseRepository implements IEmployeeRepository
{
    public function __construct(Employee $model)
    {
        $this->model = $model;
    }

    // Sadece yeni metodlar ekleyin, base metodları override etmeyin
    public function getByDepartment(int $departmentId): Collection
    {
        return $this->model->where('department_id', $departmentId)->get();
    }
}
```

### Service Binding
```php
// AppServiceProvider.php
$this->app->bind(IEmployeeRepository::class, EmployeeRepository::class);
```
