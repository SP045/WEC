import { checkAuth, logout } from './utils/auth.js';
import { tasks } from './data/tasks.js';
import { getSubmissions, saveSubmission, getScores } from './utils/storage.js';
import { viewSubmission, handleSubmission } from './utils/submissions.js';
import { taskDescriptions } from './data/taskDescriptions.js';

function initializeTasks() {
    const submissions = getSubmissions();
    const scores = getScores();
    const groupName = localStorage.getItem('groupName');
    const groupSubmissions = submissions[groupName] || {};
    const groupScores = scores[groupName] || {};

    Object.keys(tasks).forEach(round => {
        const roundElement = document.querySelector(`#${round} .tasks`);
        tasks[round].forEach(task => {
            const submission = groupSubmissions[task.id];
            const score = groupScores[task.id];
            const taskElement = document.createElement('div');
            taskElement.className = 'task-card';
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <button onclick="window.showTaskDetails(${task.id})" class="btn btn-secondary btn-sm">View Details</button>
                </div>
                <div class="task-status">
                    ${submission ? `
                        <span class="badge badge-success">Submitted</span>
                        <button onclick="window.viewSubmission(${task.id})" class="btn btn-primary btn-sm">
                            View Submission
                        </button>
                        ${score !== undefined ? `
                            <div class="score-display">
                                Score: <span class="score-value">${score}/100</span>
                            </div>
                        ` : ''}
                    ` : '<span class="badge badge-warning">Pending</span>'}
                </div>
            `;
            roundElement.appendChild(taskElement);
        });
    });

    // Populate task selection dropdown
    const taskSelect = document.getElementById('taskSelect');
    Object.values(tasks).flat().forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        taskSelect.appendChild(option);
    });
}

function showTaskDetails(taskId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${tasks.round1.concat(tasks.round2, tasks.round3).find(t => t.id === taskId).title}</h2>
            <p class="task-description">${taskDescriptions[taskId]}</p>
        </div>
    `;
    document.body.appendChild(modal);
}

// Make functions available globally
window.showTaskDetails = showTaskDetails;
window.handleSubmission = handleSubmission;
window.viewSubmission = viewSubmission;
window.logout = logout;

initializeTasks();