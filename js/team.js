import { checkAuth, logout } from './utils/auth.js';
import { getTeamMembers, saveTeamMembers } from './utils/storage.js';
import { isDuplicateEmail } from './utils/validation.js';

// Check authentication
checkAuth();

let teamMembers = getTeamMembers();
const MAX_TEAM_MEMBERS = 20;

function addTeamMember(event) {
    event.preventDefault();

    if (teamMembers.length >= MAX_TEAM_MEMBERS) {
        alert('Maximum team size reached (20 members)');
        return false;
    }

    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;

    // Check for duplicate email
    if (isDuplicateEmail(email, teamMembers)) {
        alert('A team member with this email already exists');
        return false;
    }

    teamMembers.push({ name, email });
    saveTeamMembers(teamMembers);
    
    updateTeamList();
    document.getElementById('teamMemberForm').reset();

    // Enable proceed button if at least one member is added
    document.getElementById('proceedBtn').disabled = false;

    return false;
}

function updateTeamList() {
    const list = document.getElementById('membersList');
    list.innerHTML = '';

    teamMembers.forEach((member, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${member.name} (${member.email})
            <button onclick="removeMember(${index})" class="remove-btn">Remove</button>
        `;
        list.appendChild(li);
    });
}

function removeMember(index) {
    teamMembers.splice(index, 1);
    saveTeamMembers(teamMembers);
    updateTeamList();

    // Disable proceed button if no members
    document.getElementById('proceedBtn').disabled = teamMembers.length === 0;
}

function proceedToTasks() {
    if (teamMembers.length > 0) {
        window.location.href = 'tasks.html';
    }
}

// Make functions available globally
window.addTeamMember = addTeamMember;
window.removeMember = removeMember;
window.proceedToTasks = proceedToTasks;
window.logout = logout;

// Initialize team list
updateTeamList();
document.getElementById('proceedBtn').disabled = teamMembers.length === 0;