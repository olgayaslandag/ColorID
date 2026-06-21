# Repository Pattern Kuralları

## BaseInterface

**Dosya:** `app/Interfaces/BaseInterface.php`

Tüm repository interface'leri `BaseInterface`'e extend etmelidir.

```php
namespace App\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

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

**Dosya:** `app/Repositories/BaseRepository.php`

Tüm repository sınıfları `BaseRepository`'den extend etmelidir.

### BaseRepository
Tüm repository sınıfları `BaseRepository`'den extend etmelidir.

**Konum:** `app/Repositories/BaseRepository.php`

**Mevcut metodlar:**
- `all()`, `paginate()`, `find()`, `findOrFail()`
- `findBy()`, `findByOrFail()`
- `create()`, `update()`, `delete()`
- `applyFilters()` (override edilebilir)

## Kurallar

### 1. Interface Yapısı
```php
interface IEmployeeRepository extends BaseInterface
{
    // Sadece domain-specific metodlar ekleyin
    public function getByDepartment(int $departmentId): Collection;
    public function getActiveEmployees(): Collection;
}
```

### 2. Repository Yapısı
```php
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

### 3. Metod Eklemesi
- **Aşırı ihtiyaç olmadıkça yeni metod eklemeyin**
- Base metodlar yeterliyse ek metod açmayın
- Yeni metod sadece business logic gerektiriyorsa ekleyin

### 4. Service Binding
```php
// AppServiceProvider.php
$this->app->bind(IEmployeeRepository::class, EmployeeRepository::class);
```

## Örnek Kullanım

```php
class EmployeeService
{
    public function __construct(
        private IEmployeeRepository $employeeRepository
    ) {}

    public function getEmployee(int $id): Employee
    {
        // Base metod kullanın
        return $this->employeeRepository->findOrFail($id);
    }

    public function getDepartmentEmployees(int $deptId): Collection
    {
        // Custom metod kullanın
        return $this->employeeRepository->getByDepartment($deptId);
    }
}
```

## Yasaklar

❌ Base metodları repository içinde tekrar yazmayın (DRY)
❌ Her entity için 10+ metod eklemeyin
❌ Interface olmadan repository kullanmayın
❌ Controller'da doğrudan model kullanmayın
