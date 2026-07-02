<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = ProductCategory::query()
            ->withCount('products')
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (ProductCategory $cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'products_count' => $cat->products_count,
                'created_at' => $cat->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ], [
            'name.required' => 'Kategori adı zorunludur.',
            'name.string' => 'Kategori adı metin olmalıdır.',
            'name.max' => 'Kategori adı en fazla :max karakter olabilir.',
        ]);

        ProductCategory::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori başarıyla oluşturuldu.');
    }

    public function update(Request $request, ProductCategory $productCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
        ], [
            'name.string' => 'Kategori adı metin olmalıdır.',
            'name.max' => 'Kategori adı en fazla :max karakter olabilir.',
        ]);

        $productCategory->update($validated);

        return back()->with('success', 'Kategori başarıyla güncellendi.');
    }

    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        $productCategory->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori başarıyla silindi.');
    }
}
