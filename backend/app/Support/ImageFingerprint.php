<?php

namespace App\Support;

class ImageFingerprint
{
    public static function fromBytes(string $bytes): ?string
    {
        $source = @imagecreatefromstring($bytes);
        if ($source === false) {
            return null;
        }

        $sample = imagecreatetruecolor(9, 8);
        imagecopyresampled($sample, $source, 0, 0, 0, 0, 9, 8, imagesx($source), imagesy($source));
        imagedestroy($source);

        $bits = '';
        for ($y = 0; $y < 8; $y++) {
            for ($x = 0; $x < 8; $x++) {
                $left = self::luminance(imagecolorat($sample, $x, $y));
                $right = self::luminance(imagecolorat($sample, $x + 1, $y));
                $bits .= $left > $right ? '1' : '0';
            }
        }
        imagedestroy($sample);

        $fingerprint = '';
        for ($index = 0; $index < 64; $index += 4) {
            $fingerprint .= dechex(bindec(substr($bits, $index, 4)));
        }

        return $fingerprint;
    }

    public static function distance(string $left, string $right): int
    {
        if (strlen($left) !== 16 || strlen($right) !== 16) {
            return PHP_INT_MAX;
        }

        $distance = 0;
        for ($index = 0; $index < 16; $index++) {
            $distance += substr_count(decbin(hexdec($left[$index]) ^ hexdec($right[$index])), '1');
        }

        return $distance;
    }

    private static function luminance(int $color): int
    {
        $red = ($color >> 16) & 0xFF;
        $green = ($color >> 8) & 0xFF;
        $blue = $color & 0xFF;

        return (299 * $red + 587 * $green + 114 * $blue) / 1000;
    }
}
