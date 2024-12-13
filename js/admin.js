import { checkAuth, logout } from './utils/auth.js';
import { getSubmissions, getScores, saveScore } from './utils/storage.js';
import { viewSubmission } from './utils/submissions.js';
import { tasks } from './data/tasks.js';

checkAuth();

function initializeAdminDashboard() {
    const submissions = getSubmissions();
    const scores = getScores();
    const container = document.getElementById('submissionsContainer');
    
    Object.entries(submissions).forEach(([groupName, groupSubmissions]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-submissions';
        
        groupDiv.innerHTML = `
            <div class="group-header">
                <h2>Group: ${groupName}</h2>
            </div>
            <div class="submissions-grid"></div>
        `;
        
        const submissionsGrid = groupDiv.querySelector('.submissions-grid');
        const allTasks = Object.values(tasks).flat();
        
        allTasks.forEach(task => {
            const submission = groupSubmissions[task.id];
            const score = scores[groupName]?.[task.id] || '';
            const submissionDiv = document.createElement('div');
            submissionDiv.className = 'submission-card';
            
            submissionDiv.innerHTML = `
                <h3>${task.title}</h3>
                <p>Status: ${submission ? 'Submitted' : 'Pending'}</p>
                ${submission ? `
                    <div class="admin-actions">
                        <button onclick="window.viewSubmission('${groupName}', ${task.id})" class="btn btn-primary btn-sm">
                            View Submission
                        </button>
                        <div class="score-input-group">
                            <label>Score:</label>
                            <input 
                                type="number" 
                                class="score-input"
                                min="0" 
                                max="100" 
                                value="${score}"
                                onchange="window.updateScore('${groupName}', ${task.id}, this.value)"
                            >
                            <span>/100</span>
                        </div>
                    </div>
                ` : ''}
            `;
            
            submissionsGrid.appendChild(submissionDiv);
        });
        
        container.appendChild(groupDiv);
    });
}

function updateScore(groupName, taskId, score) {
    score = Math.min(Math.max(0, parseInt(score) || 0), 100);
    saveScore(groupName, taskId, score);
}

// Make functions available globally
window.logout = logout;
window.viewSubmission = viewSubmission;
window.updateScore = updateScore;

initializeAdminDashboard();