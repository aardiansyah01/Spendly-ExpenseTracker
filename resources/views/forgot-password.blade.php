<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Forgot Password - Spendly</title>

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

            <h2>Forgot Password?</h2>

            <p class="auth-description">
                Enter your email and we will send you a password reset link.
            </p>

            <div id="authMessage" class="auth-message"></div>

            <form id="forgotPasswordForm">

                <div class="form-group">
                    <label for="resetEmail">
                        Email
                    </label>

                    <input
                        type="email"
                        id="resetEmail"
                        name="email"
                        placeholder="Enter your email"
                        required
                    >
                </div>

                <button
                    type="submit"
                    class="auth-button"
                    id="resetPasswordButton"
                >
                    Send Reset Link
                </button>

            </form>

            <div class="auth-switch">
                Remember your password?
                <a href="{{ route('login') }}">Back to Login</a>
            </div>

        </div>

    </div>

</div>

@vite(['resources/js/app.js'])

</body>
</html>