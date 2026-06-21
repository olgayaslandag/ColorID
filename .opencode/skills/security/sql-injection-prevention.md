# SQL Injection Engelleme Rehberi

## Tanım
SQL Injection, kötü niyetli kullanıcıların uygulama veritabanına karşı doğrudan SQL komutları göndererek sistemlere zarar vermeye çalıştığı bir güvenlik açıklamasıdır. Bu saldırı türü, giriş yapılan verilerin filtrelenmeden doğrudan SQL sorgularına dahil edilmesiyle oluşur.

## Laravel'de Korunma Yöntemleri

### 1. Eloquent ORM Kullanımı
```php
// Yanlış kullanım
DB::select("SELECT * FROM users WHERE id = " . $id);

// Doğru kullanım
User::where('id', $id)->get();
```

### 2. Prepared Statements (Parameter Binding)
```php
// Doğru: Placeholder ve binding kullanımı
DB::select("SELECT * FROM users WHERE id = ?", [$id]);

// Doğru: Named binding
DB::select("SELECT * FROM users WHERE id = :id", ['id' => $id]);

// Yanlış: String concatenation
DB::select("SELECT * FROM users WHERE id = $id");
```

### 3. Form Request Validasyonu
```php
class UserFormRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ];
    }
}
```

### 4. Input Sanitization
```php
// Gelen verileri temizleme
$input = filter_var($request->input('data'), FILTER_SANITIZE_STRING);

// Ya da Laravel yardımcı fonksiyonları ile
$safe_data = e($request->input('data'));
```

## En İyi Uygulamalar

### 1. Never Trust User Input
- Kullanıcıdan gelen hiçbir veriye güvenmeyin
- Her zaman validation ve sanitization uygulayın
- Whitelist yaklaşımı kullanın (izin verilenleri belirtin)

### 2. Escape and Quote
- Direct queries kullanılan durumlarda escape fonksiyonlarını kullanın
- Dynamic portion'ları string concatenation ile kullanmayın
- Placeholder ile bind etme yaklaşımını tercih edin

### 3. Least Privilege
- Uygulamanın kullandığı database user'ının minimum yetkilerle tanımlanması
- Sadece gerekli tablolara insert/update/delete yetkisi verin
- Sistem tablolarına erişim engellensin

### 4. Error Handling
- Ayrıntılı hata mesajlarını asla kullanıcıya göstermeyin
- Internal server error gibi genel hata mesajları gösterin
- Gerçek hata bilgisini log dosyasında tutun

## Ortak Güvenlik Açıkları ve Çözümleri

### 1. LIKE Queries
```php
// Güvenli LIKE sorgusu
$term = '%' . $request->input('search') . '%';
User::where('name', 'LIKE', DB::raw('?'), [$term])->get();

// Ya da Eloquent ile
User::where('name', 'LIKE', "%{$request->input('search')}%")->get();
```

### 2. Raw Queries
```php
// Eğer raw query şartsa mutlaka escaping uygulayın
DB::select(DB::raw("SELECT * FROM users WHERE name = :name"), ['name' => $name]);
```

### 3. Mass Assignment Protection
```php
// Model'de fillable/guarded tanımlaması yapın
protected $fillable = ['name', 'email'];
// ya da
protected $guarded = ['id', 'password'];
```

## Laravel Özel Fonksiyonları

### 1. Query Builder Güvenliği
```php
// Query Builder kullanırken otomatik escaping uygulanır
User::where('id', $id)->where('status', $status)->get();
```

### 2. Scope Kullanımı
```php
// Custom scope ile безопасное filtreleme
public function scopeActive($query) {
    return $query->where('status', 'active');
}
```

### 3. Accessor ve Mutator
```php
// Veri çekilirken veya yazılırken manipülasyon
public function setEmailAttribute($value) {
    $this->attributes['email'] = encrypt($value);
}
```

## Sonuç
- SQL Injection saldırılarını önlemek için Eloquent ya da parameter binding kullanın
- Kullanıcıdan gelen verileri asla doğrudan sorguda kullanmayın
- Validation ve sanitization her zaman uygulanmalıdır
- Production ortamında ayrıntılı hata mesajlarını gizleyin