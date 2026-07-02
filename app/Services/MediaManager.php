<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MediaManager
{
    /**
     * Store an uploaded file as a Media record.
     *
     * @param  UploadedFile  $file   The uploaded file instance.
     * @param  Model|null    $model  Optional parent model for polymorphic association.
     * @param  string|null   $disk   Storage disk name. Falls back to image_storage.disk,
     *                               then filesystems.default, then 'public'.
     * @return Media The newly created Media record.
     */
    public function store(UploadedFile $file, ?Model $model = null, ?string $disk = null): Media
    {
        $uuid = (string) Str::uuid();
        $extension = $file->getClientOriginalExtension();
        $filename = $uuid . '.' . $extension;
        $path = 'uploads/media/' . $filename;

        $disk = $disk ?? config('image_storage.disk', config('filesystems.default', 'public'));

        $file->storeAs('uploads/media', $filename, $disk);

        return Media::create([
            'id'            => $uuid,
            'disk'          => $disk,
            'path'          => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type'     => $file->getMimeType(),
            'size'          => $file->getSize(),
            'model_type'    => $model ? get_class($model) : null,
            'model_id'      => $model ? $model->getKey() : null,
        ]);
    }

    /**
     * Delete a Media record. The model's deleting event will clean up the file.
     */
    public function delete(Media $media): void
    {
        $media->delete();
    }

    /**
     * Get the public URL for a given Media record.
     *
     * @return string The full public URL.
     */
    public function getUrl(Media $media): string
    {
        return $media->url;
    }

    /**
     * Return a StreamedResponse for serving the media file directly.
     *
     * @param  Media  $media  The Media record to serve.
     * @return StreamedResponse
     */
    public function response(Media $media): StreamedResponse
    {
        $disk = Storage::disk($media->disk);

        if (! $disk->exists($media->path)) {
            throw new NotFoundHttpException('Media file not found in storage.');
        }

        return $disk->response($media->path, null, [
            'Content-Type'  => $media->mime_type ?? 'image/png',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
