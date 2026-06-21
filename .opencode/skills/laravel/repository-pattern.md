# Repository Pattern Rehberi

## Tanım
Repository Pattern, veri erişim mantığını business logic'ten ayırarak kullanılan bir tasarım desenidir. Bu desen sayesinde kodun test edilebilirliği artar ve veri erişim katmanı ile iş katmanı arasında soyutlama sağlanır.

## Amacı
- Model sınıflarını doğrudan kullanmaktan kurtarmak
- Tekrar kullanılabilir veri erişim katmanı oluşturmak
- Test edilebilirlik arttırmak
- ORM/Framework bağımlılığını azaltmak

## BaseInterface

Tüm repository interface'leri `BaseInterface`'e extend etmelidir.

**Konum:** `app/Interfaces/BaseInterface.php`

```php
interface BaseInterface
{
    public function all(array $filters = [], array $with = []): Collection;
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator;
    public function find(int $id, array $with = []): ?object;
    public function findOrFail(int $id, array $with = []): object;
    public function findBy(string $column, mixed $value, array $with = []): ?object;
    public function findByOrFail(string $column, mixed $value, array $with = []): object;
    public function create(array $data): object;
    public function update(int $id, array $data): object;
    public function delete(int $id): bool;
}
```

## BaseRepository

Tüm repository sınıfları `BaseRepository`'den extend etmelidir.

**Konum:** `app/Repositories/BaseRepository.php`

```php
abstract class BaseRepository
{
    protected Model $model;

    public function all(array $filters = [], array $with = []): Collection { }
    public function paginate(array $filters = [], array $with = [], int $perPage = 15): LengthAwarePaginator { }
    public function find(int $id, array $with = []): ?Model { }
    public function findOrFail(int $id, array $with = []): Model { }
    public function findBy(string $column, mixed $value, array $with = []): ?Model { }
    public function findByOrFail(string $column, mixed $value, array $with = []): Model { }
    public function create(array $data): Model { }
    public function update(int $id, array $data): Model { }
    public function delete(int $id): bool { }
}
```

## Temel Yapı

```php
// Interface
interface IEmployeeRepository extends BaseInterface
{
    // Sadece domain-specific metodlar
    public function getByDepartment(int $departmentId): Collection;
    public function getActiveEmployees(): Collection;
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

    public function getActiveEmployees(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }
}
```

## Service Binding

```php
// AppServiceProvider.php
public function register(): void
{
    $this->app->bind(IEmployeeRepository::class, EmployeeRepository::class);
}
```

## Kullanım

```php
class EmployeeService
{
    public function __construct(
        private IEmployeeRepository $employeeRepository
    ) {}

    public function getEmployee(int $id): Employee
    {
        return $this->employeeRepository->findOrFail($id);
    }

    public function getDepartmentEmployees(int $deptId): Collection
    {
        return $this->employeeRepository->getByDepartment($deptId);
    }
}
```

## Kurallar

### Metod Eklemesi
- **Aşırı ihtiyaç olmadıkça yeni metod eklemeyin**
- Base metodlar (all, find, create, update, delete) yeterliyse ek metod açmayın
- Yeni metod sadece business logic gerektiriyorsa ekleyin

### Interface Yapısı
- Her interface `BaseInterface`'e extend etmeli
- Sadece domain-specific metodlar tanımlanmalı

### Repository Yapısı
- Her repository `BaseRepository`'den extend etmeli
- Base metodları override edilmemeli (DRY)
- Constructor'da model enjekte edilmeli

## En İyi Uygulamalar

- Her entity için spesifik repositoryler oluşturmak
- Query scope'ları repository içinde gruplamak
- Transaction yönetimi service katmanında yapılmalı
- **Her repository için 10+ metod eklemekten kaçının**

## Yasaklar

❌ Base metodları repository içinde tekrar yazmayın (DRY)
❌ Interface olmadan repository kullanmayın
❌ Controller'da doğrudan model kullanmayın
❌ Her entity için 10+ metod eklemeyin
