# 💎 Profesyonel Adlandırma ve Dosya Düzeni Standartları (v2.2)

## 1. Genel İlkeler (Niyet ve Netlik)
- **Kodun Mesajı:** Kod, yorum satırına ihtiyaç duymadan niyetini belli etmelidir. Kısa veya belirsiz isimler yerine (`$u`, `$tmp`), uzun ve açıklayıcı isimleri (`$authenticatedUser`, `$temporaryDiskPath`) tercih edin.
- **Deyimsel Tutarlılık:** PHP 8.2+ standartlarını ve Laravel deyimlerini (idioms) takip edin. Proje genelinde yerleşmiş bir isimlendirme kalıbını (Örn: `fetch` vs `get`) asla bozmayın.
- **Kısa Kısaltma Yasağı:** Anlamı bozan veya evrensel olmayan kısaltmalardan kaçının. Açık yazım, her zaman kısa yazımdan üstündür.

---

## 2. 📂 Özellik Odaklı (Domain-Based) Dosya Yapısı
Dosyalar teknik türlerine göre değil, ait oldukları **İş Alanına (Domain)** göre gruplandırılmalıdır. Her teknik klasörün altında, ilgili varlık (Entity) adına sahip bir alt klasör bulunmalıdır.

> **Kritik Kural:** `Interfaces` klasörü, teknik uygulama klasörlerinin (Repositories/Services) içinde **oluşturulamaz**. Domain kökünde, tüm katmanlara hizmet edecek şekilde bağımsız bir klasör olarak konumlandırılmalıdır.

**Hiyerarşi Örneği:** 
- `Controllers/{Name}/{Name}Controller.php`
- `Interfaces/{Name}/I{Name}Repository.php`, `I{Name}Service.php` (Üst Seviye Kontratlar)
- `Services/{Name}/{Name}Service.php` (İş mantığı implementasyonu)
- `Repositories/{Name}/{Name}Repository.php` (Veri erişim implementasyonu)
- `Models/{Name}/{Name}.php` (Örn: `User/User.php`, `User/UserRank.php`)
- `Enums/{Name}/{Name}Status.php`
- `DTOs/{Name}/{Name}StoreDTO.php`
- `Requests/{Name}/{Name}StoreRequest.php`

---

## 3. 🏷️ Adlandırma Protokolleri

### 1. Değişkenler ve Metotlar
- **CamelCase:** Değişken ve metotlar için standarttır (`$userData`, `processPayment()`).
- **Boolean Değerler:** Daima olumlu ve onaylayıcı formatta olmalıdır (`isActive`, `hasPermission`, `isEmailVerified`).
- **Olay İşleyiciler (Handlers):** Görevine göre `handle` veya `on` ile ön eklenmelidir (`handleOrderCreated`, `onUserLogin`).
- **Eylem Odaklılık:** Fonksiyon isimleri mutlaka bir fiil ile başlamalıdır (`getUserProfile`, `validateSchema`, `calculateTotalTax`).

### 2. Sınıflar, Arayüzler ve Soyutlamalar
- **PascalCase:** Tüm sınıf tanımlayıcıları için zorunludur.
- **Interfaces (Arayüzler):** Mutlaka **I** ön eki ile kontrat olduğu belirtilmelidir (`IUserRepository`).
- **Abstract (Soyut) Sınıflar:** `Abstract` ön eki veya `Base` son eki kullanılmalıdır (`AbstractGateway` veya `BaseRepository`).
- **DTOs:** Veri taşıma nesneleri `DTO` son eki almalıdır (`ProfileUpdateDTO`).

### 3. Dosya ve Dizin Kuralları
- **Modeller/Varlıklar:** Daima **tekil** isimler kullanılır (`User`, `Product`).
- **Koleksiyonlar/Kontrolörler:** Daima **çoğul** isimler tercih edilir (`UsersController`, `Products/`).
- **Bileşen Eşleşmesi:** Frontend dosyaları (Vue/React), dışa aktarılan bileşen ismiyle birebir eşleşmelidir (`OrderSummary.tsx`).
- **Yapılandırma:** Config dosyalarında bileşik kelimeler kısa çizgi (`kebab-case`) ile ayrılır (`auth-config.php`).

---

## 4. 🗄️ Veritabanı Nesneleri (SQL)
- **Snake_Case:** Tablo ve sütun isimleri için zorunludur (`user_meta`, `shipping_address`).
- **Alfabetik Pivot:** Çoktan çoğa (Many-to-Many) tablolar alfabetik sırayla adlandırılır (`permission_role` değil, `role_permission`).
- **Yabancı Anahtarlar:** İlişkili tablo ismi + `_id` şeklinde adlandırılır (`account_id`).
- **Sabitler:** `UPPER_SNAKE_CASE` formatında, belirsizlikten uzak olmalıdır.
