<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Swatch;
use App\Models\Media;
use App\Models\Product;
use App\Services\MediaManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SwatchController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Swatch::query()
            ->with('product:id,name,tenant_id')
            ->orderBy('position')
            ->orderBy('id');

        if ($productId = $request->input('product_id')) {
            $query->where('product_id', $productId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('product', fn ($p) => $p->where('name', 'like', "%{$search}%"));
            });
        }

        $swatches = $query->clone()
            ->take(20)
            ->get()
            ->map(fn (Swatch $swatch) => [
                'id' => $swatch->id,
                'name' => $swatch->name,
                'type' => $swatch->type,
                'value' => $swatch->value,
                'product_id' => $swatch->product_id,
                'product_name' => $swatch->product?->name,
                'image_url' => $swatch->image_url,
                'created_at' => $swatch->created_at?->toISOString(),
            ]);

        $total = $query->count();
        $products = Product::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Swatches/Index', [
            'swatches' => $swatches,
            'products' => $products,
            'totalSwatches' => $total,
            'filters' => $request->only(['product_id', 'type', 'search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:hex,image',
        ];

        $messages = [
            'name.required' => 'Kartela adı zorunludur.',
            'name.string' => 'Kartela adı metin olmalıdır.',
            'name.max' => 'Kartela adı en fazla :max karakter olabilir.',
            'product_id.required' => 'Ürün seçimi zorunludur.',
            'product_id.exists' => 'Seçilen ürün geçerli değil.',
            'type.required' => 'Tür alanı zorunludur.',
            'type.in' => 'Geçersiz tür seçimi. Geçerli değerler: hex, image.',
            'value.required' => 'Değer alanı zorunludur.',
            'value.max' => 'Değer en fazla :max karakter olabilir.',
        ];

        if ($request->input('type') === 'image') {
            $rules['value'] = 'required|image|mimes:jpeg,png,jpg,webp|max:5120';
        } else {
            $rules['value'] = [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    if (!preg_match('/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/', $value)) {
                        $fail('Geçersiz hex renk kodu. (#RRGGBB veya #RGB formatında olmalıdır)');
                    }
                },
            ];

            $messages['value.string'] = 'Değer metin olmalıdır.';
        }

        $validated = $request->validate($rules, $messages);

        if ($request->input('type') === 'image') {
            $media = app(MediaManager::class)->store($request->file('value'));
            $validated['value'] = $media->id;
        }

        $validated['position'] = (Swatch::withoutGlobalScope('position')->max('position') ?? 0) + 1;

        Swatch::create($validated);

        return redirect()->route('admin.swatches.index')
            ->with('success', 'Kartela başarıyla oluşturuldu.');
    }

    public function update(Request $request, Swatch $swatch): RedirectResponse
    {
        $rules = [
            'name' => 'sometimes|string|max:255',
            'product_id' => 'sometimes|exists:products,id',
            'type' => 'sometimes|in:hex,image',
        ];

        $messages = [
            'name.string' => 'Kartela adı metin olmalıdır.',
            'name.max' => 'Kartela adı en fazla :max karakter olabilir.',
            'product_id.exists' => 'Seçilen ürün geçerli değil.',
            'type.in' => 'Geçersiz tür seçimi. Geçerli değerler: hex, image.',
            'value.max' => 'Değer en fazla :max karakter olabilir.',
        ];

        $type = $request->input('type', $swatch->type);

        if ($type === 'image') {
            $rules['value'] = 'sometimes|image|mimes:jpeg,png,jpg,webp|max:5120';
        } else {
            $rules['value'] = [
                'sometimes',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    if (!preg_match('/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/', $value)) {
                        $fail('Geçersiz hex renk kodu. (#RRGGBB veya #RGB formatında olmalıdır)');
                    }
                },
            ];

            $messages['value.string'] = 'Değer metin olmalıdır.';
        }

        $validated = $request->validate($rules, $messages);

        if ($type === 'image' && $request->hasFile('value')) {
            if ($swatch->type === 'image' && $swatch->value) {
                $oldMedia = Media::find($swatch->value);
                if ($oldMedia) {
                    app(MediaManager::class)->delete($oldMedia);
                }
            }

            $media = app(MediaManager::class)->store($request->file('value'));
            $validated['value'] = $media->id;
        } elseif ($type === 'hex') {
            if ($swatch->type === 'image' && $swatch->value) {
                $oldMedia = Media::find($swatch->value);
                if ($oldMedia) {
                    app(MediaManager::class)->delete($oldMedia);
                }
            }
        }

        $swatch->update($validated);

        return back()->with('success', 'Kartela başarıyla güncellendi.');
    }

    public function loadMore(Request $request): JsonResponse
    {
        $offset = $request->integer('offset', 0);
        $limit = 20;

        $query = Swatch::query()
            ->with('product:id,name,tenant_id')
            ->orderBy('position')
            ->orderBy('id');

        if ($productId = $request->input('product_id')) {
            $query->where('product_id', $productId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('product', fn ($p) => $p->where('name', 'like', "%{$search}%"));
            });
        }

        $swatches = $query->clone()
            ->skip($offset)
            ->take($limit)
            ->get()
            ->map(fn (Swatch $swatch) => [
                'id' => $swatch->id,
                'name' => $swatch->name,
                'type' => $swatch->type,
                'value' => $swatch->value,
                'product_id' => $swatch->product_id,
                'product_name' => $swatch->product?->name,
                'image_url' => $swatch->image_url,
                'created_at' => $swatch->created_at?->toISOString(),
            ]);

        $totalSwatches = $query->count();
        $newOffset = $offset + $swatches->count();

        return response()->json([
            'swatches' => $swatches,
            'hasMore' => $newOffset < $totalSwatches,
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:swatches,id',
            'order.*.position' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->order as $item) {
                Swatch::where('id', $item['id'])->update(['position' => $item['position']]);
            }
        });

        return back()->with('success', 'Kartela sıralaması güncellendi.');
    }

    public function destroy(Swatch $swatch): RedirectResponse
    {
        if ($swatch->type === 'image' && $swatch->value) {
            $media = Media::find($swatch->value);
            if ($media) {
                app(MediaManager::class)->delete($media);
            }
        }

        $swatch->delete();

        return redirect()->route('admin.swatches.index')
            ->with('success', 'Kartela başarıyla silindi.');
    }
}
