<?php

namespace Database\Seeders;

use App\Models\Swatch;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BrandProductSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $tenant = Tenant::first();

        if (! $tenant) {
            return;
        }

        if (Product::where('tenant_id', $tenant->id)->exists()) {
            return;
        }

        $categories = collect([
            ProductCategory::create(['name' => 'İç Cephe Boyaları']),
            ProductCategory::create(['name' => 'Dış Cephe Boyaları']),
            ProductCategory::create(['name' => 'Ahşap ve Metal Boyaları']),
            ProductCategory::create(['name' => 'Doğal Boyalar']),
            ProductCategory::create(['name' => 'Endüstriyel Boyalar']),
        ]);

        $products = [
            ['name' => 'Silikon Mat Boya', 'tenant_id' => $tenant->id, 'categories' => [0]],
            ['name' => 'Silikon İpek Mat Boya', 'tenant_id' => $tenant->id, 'categories' => [0]],
            ['name' => 'Tavan Boyası', 'tenant_id' => $tenant->id, 'categories' => [0]],
            ['name' => 'Silikon Dış Cephe Boyası', 'tenant_id' => $tenant->id, 'categories' => [1]],
            ['name' => 'Akrilik Dış Cephe Boyası', 'tenant_id' => $tenant->id, 'categories' => [1]],
            ['name' => 'Sentetik Parlak Boya', 'tenant_id' => $tenant->id, 'categories' => [2]],
            ['name' => 'Sentetik Mat Boya', 'tenant_id' => $tenant->id, 'categories' => [2]],
            ['name' => 'Premium Mat Boya', 'tenant_id' => $tenant->id, 'categories' => [0]],
            ['name' => 'Eko Mat Boya', 'tenant_id' => $tenant->id, 'categories' => [0]],
            ['name' => 'Ultra Dış Cephe Boyası', 'tenant_id' => $tenant->id, 'categories' => [1]],
            ['name' => 'Endüstriyel Astar', 'tenant_id' => $tenant->id, 'categories' => [4]],
            ['name' => 'Kireç Boyası', 'tenant_id' => $tenant->id, 'categories' => [3]],
            ['name' => 'Toprak Boya', 'tenant_id' => $tenant->id, 'categories' => [3]],
        ];

        foreach ($products as $productData) {
            $product = Product::create([
                'tenant_id' => $productData['tenant_id'],
                'name' => $productData['name'],
            ]);

            $product->categories()->attach(
                collect($productData['categories'])->map(fn ($i) => $categories[$i]->id)
            );

            foreach ($this->makeSwatches($productData['name']) as $swatchData) {
                Swatch::create([
                    'product_id' => $product->id,
                    'name' => $swatchData['name'],
                    'type' => $swatchData['type'],
                    'value' => $swatchData['value'],
                ]);
            }
        }
    }

    private function makeSwatches(string $productName): array
    {
        $colorNames = [
            'Beyaz', 'Krem', 'Açık Gri', 'Koyu Gri', 'Siyah',
            'Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Kahverengi',
            'Lacivert', 'Bordo', 'Turkuaz', 'Pembe', 'Mor',
            'Gri', 'Bej', 'Hardal', 'Zeytin', 'Ten',
        ];

        $swatches = [];
        $count = rand(5, 10);

        for ($i = 0; $i < $count; $i++) {
            $name = $colorNames[$i % count($colorNames)];
            $swatches[] = [
                'name' => $name . ' - ' . $productName,
                'type' => 'hex',
                'value' => sprintf('#%06X', rand(0, 0xFFFFFF)),
            ];
        }

        return $swatches;
    }
}
