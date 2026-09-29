<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseAuthService
{
    private $auth;

    public function __construct()
    {
        $credentialsBase64 = env('FIREBASE_CREDENTIALS_BASE64');

        if ($credentialsBase64) {
            $credentialsJson = base64_decode($credentialsBase64, true);

            if ($credentialsJson === false) {
                throw new \RuntimeException('Invalid Firebase credentials encoding.');
            }

            $credentials = json_decode($credentialsJson, true);

            if (!is_array($credentials)) {
                throw new \RuntimeException('Invalid Firebase credentials JSON.');
            }
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