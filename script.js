// ==========================================
// 1. Variables & DOM Elements
// ==========================================
let timerId = null;
let isStopwatchMode = false;
let timerSeconds = 25 * 60; 
let stopwatchSeconds = 0;   

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const secondaryBtn = document.getElementById('secondary-btn');
const heatmapContainer = document.getElementById('heatmap');

const customMinutesInput = document.getElementById('custom-minutes');
const modeTimerBtn = document.getElementById('mode-timer');
const modeStopwatchBtn = document.getElementById('mode-stopwatch');
const customTimeWrapper = document.getElementById('custom-time-wrapper');

// Subject Management Elements
const subjectInput = document.getElementById('subject-input');
const newSubjectInput = document.getElementById('new-subject-input');
const addSubjectBtn = document.getElementById('add-subject-btn');
const deleteSubjectBtn = document.getElementById('delete-subject-btn');

function getLocalDateString(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
}

// ==========================================
// 2. Dynamic Subject Management
// ==========================================
function loadSubjects() {
    const defaultSubjects = ['Data Structures', 'Operating Systems', 'C Programming', 'Mathematics', 'Digital Electronics'];
    let subjects = JSON.parse(localStorage.getItem('studySubjects')) || defaultSubjects;
    
    subjectInput.innerHTML = ''; 
    
    subjects.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub;
        option.textContent = sub;
        subjectInput.appendChild(option);
    });
}

function addSubject() {
    const newSub = newSubjectInput.value.trim();
    if (!newSub) return;
    
    let subjects = JSON.parse(localStorage.getItem('studySubjects')) || [];
    if (!subjects.includes(newSub)) {
        subjects.push(newSub);
        localStorage.setItem('studySubjects', JSON.stringify(subjects));
        loadSubjects();
        subjectInput.value = newSub; 
    }
    newSubjectInput.value = ''; 
}

function deleteSubject() {
    const selectedSub = subjectInput.value;
    if (!selectedSub) return;

    if(confirm(`Remove "${selectedSub}" from your subjects?`)) {
        let subjects = JSON.parse(localStorage.getItem('studySubjects')) || [];
        subjects = subjects.filter(s => s !== selectedSub);
        localStorage.setItem('studySubjects', JSON.stringify(subjects));
        loadSubjects();
    }
}

// ==========================================
// 3. Audio Chime
// ==========================================
function playChime() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

// ==========================================
// 4. Core Timer/Stopwatch Logic
// ==========================================
function updateDisplay() {
    const totalSeconds = isStopwatchMode ? stopwatchSeconds : timerSeconds;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    let timeString = '';
    if (mins >= 60) {
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        timeString = `${hrs}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    display.textContent = timeString;
    document.title = `${timeString} | FocusFlow`;
}

function resetUI() {
    if (isStopwatchMode) {
        stopwatchSeconds = 0;
        startBtn.textContent = 'Start Stopwatch';
        secondaryBtn.textContent = 'End & Save';
    } else {
        const customMins = parseInt(customMinutesInput.value) || 25;
        timerSeconds = customMins * 60;
        startBtn.textContent = 'Start Focus';
        secondaryBtn.textContent = 'Reset';
    }
    updateDisplay();
}

function startTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Resume';
    } else {
        startBtn.textContent = 'Pause';
        
        timerId = setInterval(() => {
            if (isStopwatchMode) {
                stopwatchSeconds++;
                updateDisplay();
            } else {
                timerSeconds--;
                updateDisplay();
                
                if (timerSeconds <= 0) {
                    clearInterval(timerId);
                    timerId = null;
                    playChime();
                    
                    const customMins = parseInt(customMinutesInput.value) || 25;
                    saveSession(customMins);
                    
                    setTimeout(() => alert("Session Complete! Great focus."), 100);
                    resetUI();
                }
            }
        }, 1000);
    }
}

// ==========================================
// 5. Data Storage & UI Rendering
// ==========================================
function saveSession(minutesToSave) {
    if (minutesToSave <= 0) return; 
    
    const today = getLocalDateString(new Date());
    const subject = subjectInput.value || "General";
    let history = JSON.parse(localStorage.getItem('studyHistory')) || {};
    
    if (!history[today]) history[today] = { total: 0, subjects: {} };
    history[today].total += minutesToSave;
    history[today].subjects[subject] = (history[today].subjects[subject] || 0) + minutesToSave;
    
    localStorage.setItem('studyHistory', JSON.stringify(history));
    
    renderHeatmap();
    updateStats();
    updateRank(); 
    updateChart(); // Update chart on save!
}

function renderHeatmap() {
    if (!heatmapContainer) return;
    heatmapContainer.innerHTML = ''; 
    const history = JSON.parse(localStorage.getItem('studyHistory')) || {};
    
    for (let i = 364; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = getLocalDateString(date);
        const dayData = history[dateString];
        const minutesStudied = dayData ? dayData.total : 0;
        
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        if (minutesStudied > 0 && minutesStudied <= 30) cell.classList.add('level-1');
        else if (minutesStudied > 30 && minutesStudied <= 90) cell.classList.add('level-2');
        else if (minutesStudied > 90 && minutesStudied <= 180) cell.classList.add('level-3');
        else if (minutesStudied > 180) cell.classList.add('level-4');
        
        cell.title = `${dateString}: ${minutesStudied} mins`;
        heatmapContainer.appendChild(cell);
    }
}

function updateStats() {
    const history = JSON.parse(localStorage.getItem('studyHistory')) || {};
    const todayStr = getLocalDateString(new Date());
    
    const todayData = history[todayStr];
    document.getElementById('today-minutes').textContent = `⏱️ ${todayData ? todayData.total : 0} Mins`;

    let streak = 0;
    let checkDate = new Date();
    
    if (!history[todayStr] || history[todayStr].total === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateString = getLocalDateString(checkDate);
        if (history[dateString] && history[dateString].total > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    document.getElementById('streak-count').textContent = `🔥 ${streak} Days`;
}

// ==========================================
// 6. Gamification System (XP & Ranks)
// ==========================================
const ranks = [
    { name: "Iron", minXp: 0, color: "rank-iron" },           
    { name: "Bronze", minXp: 500, color: "rank-bronze" },     
    { name: "Silver", minXp: 1500, color: "rank-silver" },    
    { name: "Gold", minXp: 3000, color: "rank-gold" },        
    { name: "Platinum", minXp: 6000, color: "rank-platinum" },
    { name: "Diamond", minXp: 10000, color: "rank-diamond" }, 
    { name: "Ascendant", minXp: 15000, color: "rank-ascendant" }, 
    { name: "Immortal", minXp: 25000, color: "rank-immortal" }, 
    { name: "Global Elite", minXp: 40000, color: "rank-global" } 
];

function updateRank() {
    const history = JSON.parse(localStorage.getItem('studyHistory')) || {};
    let totalMinutes = 0;
    
    for (let date in history) {
        totalMinutes += history[date].total;
    }
    
    const currentXP = totalMinutes * 10;
    
    let currentRank = ranks[0];
    let nextRank = ranks[1];
    
    for (let i = 0; i < ranks.length; i++) {
        if (currentXP >= ranks[i].minXp) {
            currentRank = ranks[i];
            nextRank = ranks[i + 1] || ranks[i];
        }
    }
    
    let progressPercent = 100;
    if (currentRank !== nextRank) {
        const xpIntoCurrentRank = currentXP - currentRank.minXp;
        const xpNeededForNext = nextRank.minXp - currentRank.minXp;
        progressPercent = (xpIntoCurrentRank / xpNeededForNext) * 100;
    }
    
    const rankDisplay = document.getElementById('current-rank');
    if (rankDisplay) {
        rankDisplay.textContent = currentRank.name;
        rankDisplay.className = `rank-text ${currentRank.color}`;
    }
    
    const xpBarFill = document.getElementById('xp-bar-fill');
    if (xpBarFill) xpBarFill.style.width = `${progressPercent}%`;
    
    const xpText = document.getElementById('xp-text');
    if (xpText) {
        if (currentRank === nextRank) {
            xpText.textContent = `${currentXP} XP (MAX RANK)`;
        } else {
            xpText.textContent = `${currentXP} / ${nextRank.minXp} XP to ${nextRank.name}`;
        }
    }
}

// ==========================================
// 7. Subject Analytics Pie Chart (Chart.js)
// ==========================================
let subjectChartInstance = null; 

function updateChart() {
    const history = JSON.parse(localStorage.getItem('studyHistory')) || {};
    const subjectTotals = {};

    for (let date in history) {
        const subjects = history[date].subjects;
        for (let sub in subjects) {
            subjectTotals[sub] = (subjectTotals[sub] || 0) + subjects[sub];
        }
    }

    const labels = Object.keys(subjectTotals);
    const data = Object.values(subjectTotals);

    if (labels.length === 0) return;

    const ctx = document.getElementById('subject-chart').getContext('2d');

    if (subjectChartInstance) {
        subjectChartInstance.destroy();
    }

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444'];

    subjectChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0, 
                hoverOffset: 10 
            }]
        },
        options: {
            responsive: true,
            cutout: '75%', 
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 13 }, padding: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) { return ` ${context.label}: ${context.raw} Mins`; }
                    }
                }
            }
        }
    });
}

// ==========================================
// 8. Event Listeners 
// ==========================================
startBtn.addEventListener('click', startTimer);
addSubjectBtn.addEventListener('click', addSubject);
deleteSubjectBtn.addEventListener('click', deleteSubject);

secondaryBtn.addEventListener('click', () => {
    if (isStopwatchMode) {
        clearInterval(timerId);
        timerId = null;
        const minsStudied = Math.floor(stopwatchSeconds / 60);
        
        if (minsStudied > 0) {
            saveSession(minsStudied);
            alert(`Awesome! Saved ${minsStudied} minutes to your heatmap.`);
        } else {
            alert("Session too short to save (under 1 minute).");
        }
        resetUI();
    } else {
        clearInterval(timerId);
        timerId = null;
        resetUI();
    }
});

modeTimerBtn.addEventListener('click', () => {
    isStopwatchMode = false;
    modeTimerBtn.classList.add('active');
    modeStopwatchBtn.classList.remove('active');
    customTimeWrapper.classList.remove('hidden');
    clearInterval(timerId);
    timerId = null;
    resetUI();
});

modeStopwatchBtn.addEventListener('click', () => {
    isStopwatchMode = true;
    modeStopwatchBtn.classList.add('active');
    modeTimerBtn.classList.remove('active');
    customTimeWrapper.classList.add('hidden'); 
    clearInterval(timerId);
    timerId = null;
    resetUI();
});

customMinutesInput.addEventListener('change', () => {
    if (!isStopwatchMode && !timerId) {
        resetUI();
    }
});

// ==========================================
// 9. Initialization (Run on page load)
// ==========================================
loadSubjects();
resetUI();
renderHeatmap();
updateStats();
updateRank(); 
updateChart();