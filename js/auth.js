// Simulated user database (in a real application, this would be server-side)
const users = {
    'admin': 'admin123',
    'leader1': 'pass123',
    'leader2': 'pass123'
};

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redirect to team management page
        window.location.href = 'team.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('teamMembers');
    window.location.href = 'index.html';
}