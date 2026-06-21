# Kod İnceleme (Code Review) İş Akışı - Laravel

## 1. Başlangıç Kontrolleri ve Hazırlık
- PR/MR açıklamasının eksiksiz, anlaşılır olması ve acceptance criteria içermesi
- İlgili issue'ların referans verilmiş olması (GitHub Issues, Jira)
- Kodun temiz ve okunabilir olmasının kontrolü (PSR-12 standardı)
- Test coverage yeterliliğinin değerlendirilmesi (%80+ hedef)
- CI/CD pipeline'ının başarılı geçmiş olması

## 2. Mimari ve Tasarım Uyumluluk
- Laravel mimarisine uygunluğun değerlendirilmesi (MVC, Service Layer)
- SOLID prensiplerine uygunluk kontrolü
- DRY ve KISS prensiplerinin yerine getirilmesi
- Laravel conventions'a uygunluk (naming, structure)
- Domain-driven design prensiplerinin uygulanması

## 3. Güvenlik İncelemesi
- Mass assignment koruması (fillable/guarded properties)
- Input validation kontrolü (Form Request classes)
- SQL Injection/XSS açığı olasılığı (parameter binding, escaping)
- Authentication/Authorization kontrolleri (Middleware, Gates, Policies)
- Session/Cookie güvenliği (secure, httpOnly, sameSite)
- API security (Sanctum, Passport, rate limiting)

## 4. Performans Değerlendirmesi
- N+1 query problemi kontrolü (eager loading, lazy loading)
- Query optimizasyonu (indexes, select statements)
- Memory usage değerlendirme (collections, chunking)
- Cache kullanımı (Redis, file cache)
- API response süreleri (pagination, compression)
- Asset optimization (mix, vite)

## 5. Kod Kalitesi ve Best Practices
- Laravel helper functions kullanımı
- Eloquent best practices (relationships, scopes, mutators)
- Exception handling (try-catch, custom exceptions)
- Logging implementation (Laravel Log facade)
- Configuration management (.env, config files)
- Dependency injection (service container)

## 6. Test ve Kalite Kontrol
- Yeni eklenen kodun test edilmesi (unit, feature, integration)
- Var olan testlerin çalışıp çalışmadığı (regression)
- Code coverage oranları (PHPUnit, Pest)
- Edge case senaryosu testlerinin varlığı
- Database testleri (factories, seeders)
- API testing (Laravel HTTP tests)

## 7. Dokümantasyon ve Bakım
- Inline documentation (PHPDoc comments)
- README güncellemeleri
- API documentation (OpenAPI, Swagger)
- Migration rollback planları
- Breaking changes documentation

## 8. İnceleme Sonrası ve Onay
- PR'ye constructif, actionable yorumların yapılması
- Gerekli değişikliklerin net şekilde belirtilmesi
- Approve/Reject kararı (code owners, senior devs)
- Merge öncesi son kontroller (squash commits, clean history)
- Post-merge monitoring (error tracking, performance)
