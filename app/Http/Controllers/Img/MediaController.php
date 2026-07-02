<?php

declare(strict_types=1);

namespace App\Http\Controllers\Img;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaManager;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends Controller
{
    public function __construct(
        protected MediaManager $mediaManager,
    ) {}

    public function show(Media $media): StreamedResponse
    {
        return $this->mediaManager->response($media);
    }
}
