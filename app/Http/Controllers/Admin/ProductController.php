<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with('tenant:id,name')
            ->with('categories:id,name')
            ->withCount('swatches');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('tenant', fn ($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('categories', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($tenantId = $request->input('tenant_id')) {
            $query->where('tenant_id', $tenantId);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->whereHas('categories', fn ($c) => $c->where('categories.id', $categoryId));
        }

        $products = $query->orderBy('name')
            ->paginate(15)
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'tenant_id' => $product->tenant_id,
                'tenant_name' => $product->tenant?->name,
                'categories' => $product->categories->map(fn ($cat) => [
                    'id' => $cat->id,
                    'name' => $cat->name,
                ]),
                'swatches_count' => $product->swatches_count,
                'created_at' => $product->created_at?->toISOString(),
            ]);

        $tenants = Tenant::select('id', 'name')->orderBy('name')->get();
        $categories = ProductCategory::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'tenants' => $tenants,
            'categories' => $categories,
            'filters' => $request->only(['search', 'tenant_id', 'category_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tenant_id' => 'required|exists:tenants,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:product_categories,id',
        ], [
            'name.required' => 'Ürün adı zorunludur.',
            'name.string' => 'Ürün adı metin olmalıdır.',
            'name.max' => 'Ürün adı en fazla :max karakter olabilir.',
            'tenant_id.required' => 'Hesap seçimi zorunludur.',
            'tenant_id.exists' => 'Seçilen hesap geçerli değil.',
            'category_ids.*.exists' => 'Seçilen kategori geçerli değil.',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'tenant_id' => $validated['tenant_id'],
        ]);

        if (!empty($validated['category_ids'])) {
            $product->categories()->attach($validated['category_ids']);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Ürün başarıyla oluşturuldu.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'tenant_id' => 'sometimes|exists:tenants,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:product_categories,id',
        ], [
            'name.string' => 'Ürün adı metin olmalıdır.',
            'name.max' => 'Ürün adı en fazla :max karakter olabilir.',
            'tenant_id.exists' => 'Seçilen hesap geçerli değil.',
            'category_ids.*.exists' => 'Seçilen kategori geçerli değil.',
        ]);

        $product->update([
            'name' => $validated['name'] ?? $product->name,
            'tenant_id' => $validated['tenant_id'] ?? $product->tenant_id,
        ]);

        if (array_key_exists('category_ids', $validated)) {
            $product->categories()->sync($validated['category_ids'] ?? []);
        }

        return back()->with('success', 'Ürün başarıyla güncellendi.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Ürün başarıyla silindi.');
    }
}
