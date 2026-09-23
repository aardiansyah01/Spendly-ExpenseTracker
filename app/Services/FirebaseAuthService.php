<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseAuthService
{
    private $auth;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(
                storage_path('app/firebase/service-account.json')
            );
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