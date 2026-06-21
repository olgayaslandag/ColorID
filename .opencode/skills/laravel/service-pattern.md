# Service Pattern Rehberi

## Tanım
Service Pattern, business logic işlemlerini controller katmanından soyutlayarak uygulama mantığının merkezi bir yerde toplanmasını sağlayan tasarım desenidir. Bu desen sayesinde kod tekrarları azalır ve iş süreçleri daha yönetilebilir hale gelir.

## Amacı
- Controller'ların sorumluluklarını azaltmak
- İş mantığını merkezileştirmek
- Tekrar kullanılabilir iş süreçleri oluşturmak
- Unit test kolaylığı sağlamak

## Temel Yapı
```
class UserService {
    private $userRepository;
    private $emailService;
    
    public function __construct(IUserRepository $userRepository, IEmailService $emailService) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser(array $data) {
        DB::beginTransaction();
        
        try {
            $user = $this->userRepository->create($data);
            
            $this->sendWelcomeEmail($user);
            
            DB::commit();
            
            return $user;
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }
}
```

## Laravel'de Uygulama
1. `app/Services/{Domain}/{Ad}Service.php` dosyası oluşturulur
2. Dependency injection ile bağımlılıklar enjekte edilir
3. Business logic sadece service classta yer alır
4. Transaction yönetimi service sınıfında gerçekleştirilir

## En İyi Uygulamalar
- Her domaine özgü service sınıfları oluşturmak
- Constructor injection kullanmak
- Transaction gerektiren işler için try-catch kullanımı
- Complex business logic yerine 작은 metodlar tercih etmek
- Service sınıflarında dependency chain uzunluğunu kısaltmak

## Avantajları
- Test edilebilirlik artırılır
- Loose coupling sağlanır
- Koddaki tekrarlar azalır
- Controller boyutları küçülür
- İş süreçleri daha iyi izole edilir