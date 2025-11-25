// Basic interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Simple signup button handler
    const signupButtons = document.querySelectorAll('.signup-btn, .cta-button');
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Sign up functionality coming soon!');
            // Will link to signup page
        });
    });

    // Login button handler
    const loginButton = document.querySelector('.login-btn');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            alert('Login functionality coming soon!');
        });
    }
});
// Add to existing script.js
function initializeApp() {
    // Check if user is logged in and update UI
    if (localStorage.getItem('userLoggedIn')) {
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        if (loginBtn) loginBtn.textContent = 'Dashboard';
        if (signupBtn) signupBtn.style.display = 'none';
    }
}

// Simple signup simulation
function quickSignup() {
    const email = prompt('Enter your email to sign up:');
    if (email) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userBalance', '0');
        localStorage.setItem('totalEarned', '0');
        localStorage.setItem('surveysCompleted', '0');
        alert('Welcome to OpinionPay! You can now take surveys.');
        window.location.href = 'surveys.html';
    }
}

// Update all signup buttons to use quick signup
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    const signupButtons = document.querySelectorAll('.signup-btn, .cta-button');
    signupButtons.forEach(button => {
        button.addEventListener('click', quickSignup);
    });

    const loginButton = document.querySelector('.login-btn');
    if (loginButton && !localStorage.getItem('userLoggedIn')) {
        loginButton.addEventListener('click', quickSignup);
    } else if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
});