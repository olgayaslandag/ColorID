<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Image Storage Disk
    |--------------------------------------------------------------------------
    |
    | This option controls the default filesystem disk used for storing
    | original and generated images. Supported: "public", "s3", "local".
    |
    */

    'disk' => env('IMAGE_STORAGE_DISK', env('FILESYSTEM_DISK', 'public')),

];
