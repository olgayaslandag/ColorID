<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class ImageStorageManager
{
    private const ORIGINALS_PATH = 'uploads/originals';

    private const GENERATED_PATH = 'tenant/%s/generated';

    /**
     * Create a new ImageStorageManager instance.
     */
    public function __construct(
        protected TenantManager $tenantManager,
    ) {}

    /**
     * Store an uploaded original image.
     *
     * @param  UploadedFile  $file  The uploaded file instance.
     * @return string The relative storage path of the stored file.
     */
    public function storeOriginal(UploadedFile $file): string
    {
        $path = $file->store(self::ORIGINALS_PATH, $this->getDisk());

        if ($path === false) {
            throw new RuntimeException('Failed to store original image.');
        }

        return $path;
    }

    /**
     * Store a generated image to the tenant-specific directory.
     *
     * The source file must already exist on the configured disk.
     *
     * @param  string  $sourcePath  The relative path of the source file on the disk.
     * @param  string  $tenantId  The tenant identifier.
     * @return string The relative storage path of the generated image.
     */
    public function storeGenerated(string $sourcePath, string $tenantId): string
    {
        $disk = $this->getDisk();
        $storage = Storage::disk($disk);

        if (! $storage->exists($sourcePath)) {
            throw new RuntimeException("Source image not found at path: {$sourcePath}");
        }

        $tenantId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $tenantId);
        $filename = basename($sourcePath);
        $destinationPath = sprintf(self::GENERATED_PATH, $tenantId) . '/' . $filename;

        // Copy the file to the tenant-specific directory
        $storage->copy($sourcePath, $destinationPath);

        // Remove the original source file
        $storage->delete($sourcePath);

        return $destinationPath;
    }

    /**
     * Get the public URL for a stored image.
     *
     * @param  string  $path  The relative storage path.
     * @return string The full public URL.
     */
    public function getUrl(string $path): string
    {
        return Storage::disk($this->getDisk())->url($path);
    }

    /**
     * Delete an image from storage.
     *
     * @param  string  $path  The relative storage path.
     * @return bool Whether the deletion was successful.
     */
    public function delete(string $path): bool
    {
        return Storage::disk($this->getDisk())->delete($path);
    }

    /**
     * Get the configured storage disk name.
     *
     * Resolves from config('image_storage.disk') with fallback to
     * the default filesystem disk configured in the application.
     *
     * @return string The disk name (e.g., 'public', 's3', 'r2').
     */
    public function getDisk(): string
    {
        return config('image_storage.disk', config('filesystems.default', 'public'));
    }
}
