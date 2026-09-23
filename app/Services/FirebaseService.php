<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FirebaseService
{
    private string $databaseUrl;

    public function __construct()
    {
        $this->databaseUrl = rtrim(
            config('services.firebase.database_url'),
            '/'
        );
    }

    // Build Firebase Realtime Database URL.
    private function url(string $path, string $idToken): string
    {
        return $this->databaseUrl
            . '/'
            . trim($path, '/')
            . '.json?auth='
            . urlencode($idToken);
    }

    // Get data
    public function get(string $path, string $idToken)
    {
        return Http::get(
            $this->url($path, $idToken)
        );
    }

    // Create data with Firebase generated key
    public function post(
        string $path,
        array $data,
        string $idToken
    ) {
        return Http::post(
            $this->url($path, $idToken),
            $data
        );
    }

    // Replace data
    public function put(
        string $path,
        array $data,
        string $idToken
    ) {
        return Http::put(
            $this->url($path, $idToken),
            $data
        );
    }

    // Update part of data
    public function patch(
        string $path,
        array $data,
        string $idToken
    ) {
        return Http::patch(
            $this->url($path, $idToken),
            $data
        );
    }

    // Delete data
    public function delete(
        string $path,
        string $idToken
    ) {
        return Http::delete(
            $this->url($path, $idToken)
        );
    }
}