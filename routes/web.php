<?php

use App\Http\Controllers\ExpenseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BudgetController;

Route::get('/', function () {
    return view('dashboard');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::get('/transactions', function () {
    return view('transactions');
});

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/register', function () {
    return view('register');
})->name('register');

Route::get('/forgot-password', function () {
    return view('forgot-password');
})->name('forgot-password');

Route::post('/api/expenses', [
    ExpenseController::class,
    'store'
])->middleware('firebase.auth');

Route::get('/api/expenses', [
    ExpenseController::class,
    'index'
])->middleware('firebase.auth');

Route::patch('/api/expenses/{id}', [
    ExpenseController::class,
    'update'
])->middleware('firebase.auth');

Route::delete('/api/expenses/{id}', [
    ExpenseController::class,
    'destroy'
])->middleware('firebase.auth');

Route::get('/api/budget', [
    BudgetController::class,
    'show'
])->middleware('firebase.auth');

Route::put('/api/budget', [
    BudgetController::class,
    'update'
])->middleware('firebase.auth');