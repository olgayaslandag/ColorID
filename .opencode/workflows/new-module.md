# Yeni Modül Oluşturma İş Akışı - Laravel

## 1. Gereksinim Analizi ve Planlama
- Modülün işlevselliği ve user story'lerinin belirlenmesi
- Gerekli entity'lerin tanımlanması (Eloquent models)
- Entity arasındaki ilişkilerin belirlenmesi (hasMany, belongsTo, manyToMany)
- Kullanıcı rolleri ve izinlerinin tanımlanması (Spatie Permission, Gates/Policies)
- API gereksinimleri belirlenmesi (RESTful, GraphQL)
- Acceptance criteria ve success metrics tanımlanması

## 2. Database Tasarımı ve Migration
- Migration dosyaları oluşturulması (php artisan make:migration)
- Foreign key tanımlamaları ve cascade rules
- Index ve constraint'lerin tanımlanması (unique, check constraints)
- Seeder ve Factory dosyalarının hazırlanması (php artisan make:seeder, make:factory)
- Database normalization kontrolü (1NF, 2NF, 3NF)

## 3. Katmanlı Mimari Oluşumu (Domain Bazlı)

### A. Model Katmanı
- Klasör: `app/Models/{Domain}/`
- Örnek: `app/Models/Survey/Survey.php`
- İçerik: Eloquent relationships, accessors, mutators, scopes, casts
- API Resource tanımları (php artisan make:resource)

### B. Repository Katmanı (Opsiyonel ama Önerilen)
- Klasör: `app/Repositories/{Domain}/`
- Interface: `app/Repositories/Survey/SurveyRepositoryInterface.php`
- Class: `app/Repositories/Survey/SurveyRepository.php`
- İçerik: Data access abstraction, query methods

### C. Service Katmanı
- Klasör: `app/Services/{Domain}/`
- Dosya: `app/Services/Survey/SurveyService.php`
- İçerik: Business logic, transaction yönetimi, complex operations

### D. Controller Katmanı
- Klasör: `app/Http/Controllers/{Domain}/` (Web) veya `app/Http/Controllers/Api/{Domain}/` (API)
- Dosya: `app/Http/Controllers/Survey/SurveyController.php`
- İçerik: HTTP request/response handling, validation, authorization

## 4. Form Doğrulama ve İstek İşleme
- Form Request sınıflarının oluşturulması (php artisan make:request)
- Validation kurallarının yazılması (rules(), messages(), attributes())
- Sanitization işlemlerinin tanımlanması (prepareForValidation())
- API Resource sınıflarının hazırlanması (data transformation)

## 5. Route ve Middleware Tanımları
- routes/web.php veya routes/api.php dosyaları güncellenir
- Resourceful routes tanımlanması (Route::resource)
- Yetkilendirme kuralları belirlenmesi (middleware, Gates, Policies)
- Rate limiting ihtiyaç duyulan endpointlere eklenir (Throttle middleware)
- CORS ve authentication middleware tanımlamaları

## 6. UI Katmanı ve Frontend Entegrasyonu
- Blade template'ler (resources/views/) veya Inertia/React component'ler
- Form handler ve validation hata yönetimi (old() helper, error bags)
- Client-side interaction tanımlamaları (Alpine.js, Vue.js)
- Responsive tasarım uyumlu yapılar (Tailwind CSS, Bootstrap)
- Accessibility standartları (ARIA attributes, semantic HTML)

## 7. Test Aşaması ve Kalite Güvence
- Unit test: Service/Repository katmanları (PHPUnit, Pest)
- Feature test: Controller katmanı ve HTTP interactions
- Integration test: Tam akış ve database operations
- Browser test: Laravel Dusk ile E2E testing
- API test: HTTP tests ile endpoint validation
- Database seeding testleri ve data integrity

## 8. Güvenlik Tetkikası ve Audit
- SQL Injection kontrolleri (parameter binding, Eloquent)
- XSS ve CSRF koruma mekanizmaları (Blade directives, CSRF tokens)
- Authentication/Authorization kontrolleri (Middleware, Policies)
- Input validation ve sanitization kontrolleri (Form Requests)
- Mass assignment koruması (fillable/guarded)
- API security (Sanctum, Passport, API keys)

## 9. Deployment Hazırlığı ve Dokümantasyon
- Environment değişkenleri kontrolü (.env.example)
- Cache ve config dosyalarının publish edilmesi (php artisan vendor:publish)
- Queue worker tanımlamaları (supervisor config)
- Database seed komutlarının güncellenmesi
- API documentation (Laravel API Resource, OpenAPI)
- README ve usage examples güncellemeleri
- Performance optimization (caching strategies, query optimization)
