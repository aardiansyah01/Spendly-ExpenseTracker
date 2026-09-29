<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseAuthService
{
    private $auth;

    public function __construct()
    {
        $credentials = env('FIREBASE_CREDENTIALS');

        if ($credentials) {
            $credentials = json_decode($credentials, true);
        } else {
            $credentials = storage_path('app/firebase/service-account.json');
        }

        $factory = (new Factory)
            ->withServiceAccount($credentials);

        $this->auth = $factory->createAuth();
    }

    public function verifyToken(string $idToken)
    {
        try {
            return $this->auth->verifyIdToken($idToken);
        } catch (\Throwable $e) {
            return null;
        }
    }
}