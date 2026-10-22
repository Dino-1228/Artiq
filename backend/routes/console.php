<?php

use Illuminate\Foundation\Inspiring;
use App\Models\ArtworkImage;
use App\Support\ImageFingerprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('artwork-images:backfill-hashes', function () {
    if (!function_exists('imagecreatefromstring')) {
        $this->error('PHP GD is required to fingerprint artwork images.');
        return 1;
    }

    $images = ArtworkImage::whereNull('hash')->get();
    $this->info("Fingerprinting {$images->count()} artwork images...");

    foreach ($images as $image) {
        $response = Http::timeout(30)->get($image->path);
        if ($response->failed()) {
            $this->warn("Could not fetch image {$image->id}.");
            continue;
        }

        $hash = ImageFingerprint::fromBytes($response->body());
        if ($hash === null) {
            $this->warn("Could not fingerprint image {$image->id}.");
            continue;
        }

        $image->hash = $hash;
        $image->save();
    }

    $this->info('Image fingerprint backfill complete.');
})->purpose('Add duplicate-detection fingerprints to existing artwork images');
