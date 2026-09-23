<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login - Spendly</title>

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

            <h2>Welcome back</h2>

            <p class="auth-description">
                Login to your Spendly account.
            </p>

            <div id="authMessage" class="auth-message"></div>

            <form id="loginForm">

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
                        required
                    >
                </div>

                <button
                    type="submit"
                    class="auth-button"
                    id="loginButton"
                >
                    Login
                </button>

            </form>

            <div class="auth-switch">
                Don't have an account?
                <a href="{{ route('register') }}">Create an account</a>
            </div>

        </div>

    </div>

</div>

@vite(['resources/js/app.js'])

</body>
</html>