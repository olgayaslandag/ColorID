<?php

declare(strict_types=1);

namespace App\Http\Controllers\Img;

use App\Http\Controllers\Controller;
use App\Models\SubmissionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImageController extends Controller
{
    public function show(Request $request, SubmissionImage $image): StreamedResponse
    {
        $variant = $request->query('variant', 'generated');
        $path = $variant === 'original' ? $image->original_image : $image->generated_image;

        if ($path === null || ! Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $mime = Storage::disk('public')->mimeType($path) ?? 'image/png';

        return Storage::disk('public')->response($path, null, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
