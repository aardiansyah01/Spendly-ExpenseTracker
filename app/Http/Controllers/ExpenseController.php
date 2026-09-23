<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{

    public function index(
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

        $response = $firebase->get(
            "users/{$uid}/expenses",
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to get expenses.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        return response()->json([
            'data' => $response->json() ?? [],
        ]);
    }

    public function store(
        Request $request,
        FirebaseService $firebase
    ) {
        $request->validate([
            'name' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:50',
            'date' => 'required|date',
            'note' => 'nullable|string|max:500',
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

        $expense = [
            'name' => $request->name,
            'amount' => (float) $request->amount,
            'category' => $request->category,
            'date' => $request->date,
            'note' => $request->note ?? '',
            'created_at' => now()->toISOString(),
        ];

        $response = $firebase->post(
            "users/{$uid}/expenses",
            $expense,
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to save expense.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        return response()->json([
            'message' => 'Expense created successfully.',
            'data' => $response->json(),
        ], 201);
    }

    public function update(
        Request $request,
        FirebaseService $firebase,
        string $id
    ) {
        $request->validate([
            'name' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:50',
            'date' => 'required|date',
            'note' => 'nullable|string|max:500',
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

        $expense = [
            'name' => $request->name,
            'amount' => (float) $request->amount,
            'category' => $request->category,
            'date' => $request->date,
            'note' => $request->note ?? '',
        ];

        $response = $firebase->patch(
            "users/{$uid}/expenses/{$id}",
            $expense,
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to update expense.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        return response()->json([
            'message' => 'Expense updated successfully.',
            'data' => $response->json(),
        ]);
    }

    public function destroy(
        Request $request,
        FirebaseService $firebase,
        string $id
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

        $response = $firebase->delete(
            "users/{$uid}/expenses/{$id}",
            $idToken
        );

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to delete expense.',
                'firebase_response' => $response->json(),
            ], $response->status());
        }

        return response()->json([
            'message' => 'Expense deleted successfully.',
        ]);
    }
}
