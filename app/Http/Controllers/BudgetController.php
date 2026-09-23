<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    // Get budget for a specific month
    public function show(
        Request $request,
        FirebaseService $firebase
    ) {
        $idToken = $request->bearerToken();

        if (!$idToken) {
            return response()->json([
                'message' => 'Authentication token is required.'
            ], 401);
        }

        $uid = $request->attributes->get('firebase_uid');

        if (!$uid) {
            return response()->json([
                'message' => 'Firebase user is not authenticated.'
            ], 401);
        }

        $month = $request->query(
            'month',
            now()->format('Y-m')
        );

        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            return response()->json([
                'message' => 'Invalid month format. Use YYYY-MM.'
            ], 422);
        }

        $response = $firebase->get(
            "users/{$uid}/budgets/{$month}",
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to get budget.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        $budget = $response->json();

        // Default budget
        if (!$budget) {
            return response()->json([
                'month' => $month,
                'amount' => 1500000,
            ]);
        }

        return response()->json([
            'month' => $month,
            'amount' => (float) ($budget['amount'] ?? 0),
        ]);
    }

    // Create or update budget for a specific month.
    public function update(
        Request $request,
        FirebaseService $firebase
    ) {
        $request->validate([
            'month' => [
                'required',
                'regex:/^\d{4}-\d{2}$/',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
        ]);

        $idToken = $request->bearerToken();

        if (!$idToken) {
            return response()->json([
                'message' => 'Authentication token is required.'
            ], 401);
        }

        $uid = $request->attributes->get('firebase_uid');

        if (!$uid) {
            return response()->json([
                'message' => 'Firebase user is not authenticated.'
            ], 401);
        }

        $month = $request->month;

        $budget = [
            'amount' => (float) $request->amount,
            'month' => $month,
            'updated_at' => now()->toISOString(),
        ];

        $response = $firebase->put(
            "users/{$uid}/budgets/{$month}",
            $budget,
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to save budget.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        return response()->json([
            'message' => 'Budget saved successfully.',
            'data' => $response->json(),
        ]);
    }
}