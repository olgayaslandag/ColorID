# Unit Test Pattern Rehberi

## Tanım
Unit Test, bir yazılım uygulamasındaki en küçük kod birimlerinin (fonksiyonlar, metodlar, sınıflar) beklenen şekilde çalıştığını doğrulayan otomatik testlerdir. Amacı, her bir bileşenin izole olarak doğru çalıştığını garanti etmektir.

## Laravel'de Test Altyapısı
Laravel PHPUnit test framework'ünü varsayılan olarak kullanır. Test sınıfları `tests/` dizininde yer alır ve aşağıdaki yapıya sahiptir:

```
tests/
├── Unit/           # Unit testler
├── Feature/        # Feature testler
├── CreatesApplication.php
└── TestCase.php
```

## Unit Test Yapısı
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CalculatorService;

class CalculatorServiceTest extends TestCase
{
    private $calculator;
    
    protected function setUp(): void {
        parent::setUp();
        $this->calculator = new CalculatorService();
    }
    
    /** @test */
    public function it_should_add_two_numbers() {
        // Arrange
        $num1 = 5;
        $num2 = 3;
        $expected = 8;
        
        // Act
        $result = $this->calculator->add($num1, $num2);
        
        // Assert
        $this->assertEquals($expected, $result);
    }
}
```

## AAA Prensibi (Arrange-Act-Assert)
- **Arrange**: Test edilecek objenin set edilmesi ve ihtiyaç duyulan bağımlılıkların tanımlanması
- **Act**: Test edilecek metot çağrılır
- **Assert**: Sonuçların beklentilerle karşılaştırılması

## Mock ve Stub Kullanımı
```php
// Mock example
/** @test */
public function it_calls_external_apis_correctly() {
    $service = $this->createMock(ExternalServiceInterface::class);
    
    $service->expects($this->once())
            ->method('callApi')
            ->willReturn(['result' => 'success']);
    
    $handler = new DataHandler($service);
    $result = $handler->processData();
    
    $this->assertEquals('success', $result['result']);
}

// Stub example
/** @test */
public function it_returns_default_value_when_dependency_fails() {
    $repository = $this->createStub(DataRepositoryInterface::class);
    $repository->method('getData')->willReturn(null);
    
    $service = new BusinessService($repository);
    $result = $service->getProcessedData();
    
    $this->assertNull($result);
}
```

## Laravel Özel Test Özellikleri

### 1. Database Transactions
```php
class UserUnitTest extends TestCase
{
    use DatabaseTransactions; // Otomatik rollback
    
    /** @test */
    public function it_creates_user_in_database() {
        // Bu testin yaptığı değişiklikler otomatik rollback edilir
        User::factory()->create(['name' => 'John']);
        
        $this->assertTrue(User::whereName('John')->exists());
    }
}
```

### 2. Test Double Laravel Services
```php
/** @test */
public function it_sends_notification() {
    Mail::fake(); // Mail servisini sahte yap
    
    // Test kodu
    $user = User::factory()->create();
    NotificationService::sendWelcomeMail($user);
    
    // Gönderildiğini doğrula
    Mail::assertSent(WelcomeMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
}
```

## En İyi Uygulamalar

### 1. Test Adlandırma
- Anlamlı ve açıklayıcı test isimlerı seçin
- 'should_' veya 'it_' ile başlayan isimler kullanın
- `function it_handles_valid_input_correctly()` gibi

### 2. Veri Hazırlığı (Fixtures)
- beforeEach/setUp metotlarını veri hazırlığı için kullanın
- TestFactory'lerden test verilerini oluşturun
- Shared fixtures ortak olarak kullanılabilir

### 3. Izolasyon
- Her test diğer testlerden bağımsız olmalı
- Testlerin sırası önemli olmamalı
- Database transactions ve mocking ile izolasyon desteklemek

### 4. Test Coverage
- %100 coverage hedefi gerçekçi olmayabilir
- Critical path'leri test etmek önemlidir
- Code coverage araçlarını kullanmak önerilir

### 5. Okunabilirlik
- Girdi/çktı değerlerini açıkça belirtin
- Assertion mesajlarını detaylı yazın
- Test etki alanlarını dar tutun (tek bir amaca hizmet)

## XCTestCase Metotları
- `setUp()`: Her testten önce çalışır
- `tearDown()`: Her testten sonra çalışır
- `setUpBeforeClass()`: Test sınıfından önce bir defa çalışır
- `tearDownAfterClass()`: Test sınıfından sonra bir defa çalışır

## Örnek Complex Unit Test
```php
/** @test */
public function it_calculates_discounted_price_correctly() {
    // Arrange
    $product = new Product(['price' => 100, 'discount_percentage' => 20]);
    $expectedPrice = 80; // 100 - (100*0.20)
    
    // Act
    $actualPrice = $product->getDiscountedPrice();
    
    // Assert
    $this->assertEquals($expectedPrice, $actualPrice);
    $this->assertNotEquals(100, $actualPrice); // Additional assertion
    $this->assertIsNumeric($actualPrice); // Type assertion
}
```

## Sonuç
- Unit testler, uygulamanın temel işlevlerini doğrulamak için kritik öneme sahiptir
- DRY (Don't Repeat Yourself) prensibini testlerde de uygulayın
- Code coverage değerlerinden çok test quality değerine önem verin
- TDD (Test Driven Development) yaklaşımı geliştirme kalitesini artırır