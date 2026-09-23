<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Register - Spendly</title>

    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>

<body>

<div class="auth-page">

    <div class="auth-container">

        <div class="auth-logo">
            <h1>Spendly</h1>
            <p>Track your expenses, manage your budget.</p>
        </div>

        <div class="auth-card">

            <h2>Create an account</h2>

            <p class="auth-description">
                Create your Spendly account to start tracking your expenses.
            </p>

            <div id="authMessage" class="auth-message"></div>

            <form id="registerForm">

                <div class="form-group">
                    <label for="name">
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="email">
                        Email
                    </label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="password">
                        Password
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        minlength="6"
                        required
                    >

                    <p class="password-note">
                        Password must contain at least 6 characters.
                    </p>
                </div>

                <div class="form-group">
                    <label for="confirmPassword">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        minlength="6"
                        required
                    >
                </div>

                <button
                    type="submit"
                    class="auth-button"
                    id="registerButton"
                >
                    Create Account
                </button>

            </form>

            <div class="auth-switch">
                Already have an account?
                <a href="{{ route('login') }}">Login</a>
            </div>

        </div>

    </div>

</div>

@vite(['resources/js/app.js'])

</body>
</html>