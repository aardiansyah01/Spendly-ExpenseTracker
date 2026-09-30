import { auth, database } from "./firebase";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import { ref, set } from "firebase/database";

// HELPER
function showMessage(message, type = "error") {
    const messageElement = document.getElementById("authMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
}

function setButtonLoading(button, loading, normalText) {
    if (!button) {
        return;
    }

    button.disabled = loading;
    button.textContent = loading ? "Please wait..." : normalText;
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const registerButton = document.getElementById("registerButton");

        // Check password
        if (password !== confirmPassword) {
            showMessage("Password dan confirm password tidak sama.");

            return;
        }

        if (password.length < 6) {
            showMessage("Password minimal 6 karakter.");

            return;
        }

        try {
            setButtonLoading(registerButton, true, "Create Account");

            showMessage("");

            // Create Firebase account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name,
            });

            console.log("Current origin:", window.location.origin);
            console.log("Verification URL:", `${window.location.origin}/login`);

            const actionCodeSettings = {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false,
            };

            await sendEmailVerification(user, actionCodeSettings);

            // Save to Realtime Database
            await set(ref(database, `users/${user.uid}`), {
                name: name,
                email: user.email,
                created_at: new Date().toISOString(),
            });

            console.log("User registered:", user.uid);

            showMessage(
                "Account berhasil dibuat. Silakan cek email Anda untuk melakukan verifikasi agar dapat melanjutkan ke halaman login.",
                "success",
            );

            await signOut(auth);
        } catch (error) {
            console.error(error);

            showMessage(getFirebaseErrorMessage(error.code));

            setButtonLoading(registerButton, false, "Create Account");
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const loginButton = document.getElementById("loginButton");

        try {
            setButtonLoading(loginButton, true, "Login");

            showMessage("");

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = userCredential.user;

            await user.reload();

            if (!user.emailVerified) {
                await signOut(auth);

                showMessage(
                    "Email Anda belum diverifikasi. Silakan cek email dan klik link verifikasi terlebih dahulu.",
                );

                setButtonLoading(loginButton, false, "Login");
                return;
            }

            console.log("User logged in:", user.uid);

            showMessage(
                "Login berhasil. Mengarahkan ke dashboard...",
                "success",
            );

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } catch (error) {
            console.error(error);

            showMessage(getFirebaseErrorMessage(error.code));

            setButtonLoading(loginButton, false, "Login");
        }
    });
}

// FORGOT PASSWORD
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("resetEmail").value.trim();

        const resetPasswordButton = document.getElementById(
            "resetPasswordButton",
        );

        try {
            setButtonLoading(resetPasswordButton, true, "Send Reset Link");

            showMessage("");

            await sendPasswordResetEmail(auth, email);

            console.log("Password reset email berhasil dikirim untuk:", email);

            showMessage(
                "Password reset link telah dikirim ke email Anda.",
                "success",
            );

            forgotPasswordForm.reset();

            setButtonLoading(resetPasswordButton, false, "Send Reset Link");
        } catch (error) {
            console.error(error);

            showMessage(getFirebaseErrorMessage(error.code));

            setButtonLoading(resetPasswordButton, false, "Send Reset Link");
        }
    });
}

// FIREBASE ERROR MESSAGE
function getFirebaseErrorMessage(errorCode) {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "Email sudah digunakan.";

        case "auth/invalid-email":
            return "Format email tidak valid.";

        case "auth/weak-password":
            return "Password terlalu lemah.";

        case "auth/invalid-credential":
            return "Email atau password salah.";

        case "auth/user-not-found":
            return "User tidak ditemukan.";

        case "auth/wrong-password":
            return "Password salah.";

        case "auth/user-disabled":
            return "Akun ini telah dinonaktifkan.";

        case "auth/too-many-requests":
            return "Terlalu banyak percobaan. Coba lagi nanti.";

        case "auth/missing-email":
            return "Email wajib diisi.";

        default:
            return "Terjadi kesalahan. Silakan coba lagi.";
    }
}

// SIDEBAR PROFILE
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const sidebarAuthAction = document.getElementById("sidebarAuthAction");

onAuthStateChanged(auth, (user) => {
    if (!profileAvatar || !profileName || !profileEmail || !sidebarAuthAction) {
        return;
    }

    // USER HAS LOGIN
    if (user) {
        const name = user.displayName || "User";
        const email = user.email || "";

        profileName.textContent = name;
        profileEmail.textContent = email;

        profileAvatar.textContent = name.charAt(0).toUpperCase();

        sidebarAuthAction.innerHTML = `
            <button
                type="button"
                class="sidebar-logout-button"
                id="sidebarLogoutButton"
            >
                Logout
            </button>
        `;

        const logoutButton = document.getElementById("sidebarLogoutButton");

        logoutButton.addEventListener("click", async () => {
            try {
                await signOut(auth);

                window.location.href = "/";
            } catch (error) {
                console.error("Logout error:", error);

                alert("Failed to logout. Please try again.");
            }
        });

        return;
    }

    // USER NOT LOGIN
    profileAvatar.textContent = "?";

    profileName.textContent = "Guest";

    profileEmail.textContent = "Not logged in";

    sidebarAuthAction.innerHTML = `
        <a
            href="/login"
            class="sidebar-login-button"
        >
            Register / Login
        </a>
    `;
});
