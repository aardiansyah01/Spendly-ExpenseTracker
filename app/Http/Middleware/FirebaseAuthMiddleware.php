<?php

namespace App\Http\Middleware;

use App\Services\FirebaseAuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FirebaseAuthMiddleware
{
    private FirebaseAuthService $firebaseAuth;

    public function __construct(FirebaseAuthService $firebaseAuth)
    {
        $this->firebaseAuth = $firebaseAuth;
    }

    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $idToken = $request->bearerToken();

        if (!$idToken) {
            return response()->json([
                'message' => 'Authentication token is required.'
            ], 401);
        }

        $verifiedToken = $this->firebaseAuth->verifyToken($idToken);

        if (!$verifiedToken) {
            return response()->json([
                'message' => 'Invalid or expired Firebase token.'
            ], 401);
        }

        $uid = $verifiedToken->claims()->get('sub');

        $request->attributes->set('firebase_uid', $uid);

        return $next($request);
    }
}