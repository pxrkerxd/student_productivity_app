# ⚡ FocusFlow: Gamified Study Tracker
https://pxrkerxd.github.io/student_productivity_app/

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e08cbb6d-84e6-4644-9c9a-fda034ef6f77" />


A sleek, gamified productivity dashboard built to make long study sessions engaging. FocusFlow combines the psychology of the Pomodoro technique with an Elo-style ranking system and rich data visualization, running entirely in the browser with zero backend dependencies.

## ✨ Key Features

* **Gamified Progression (XP & Ranks):** Treats studying like a competitive game. Every focused minute earns XP, allowing you to rank up from *Iron* all the way to *Global Elite*.
* **GitHub-Style Activity Heatmap:** A dynamically generated 365-day contribution graph that visually tracks your daily study streaks and intensity levels.
* **Subject Analytics:** Integrated with `Chart.js` to provide a real-time, interactive doughnut chart breaking down exactly where your time is being spent.
* **Dual-Mode Time Tracking:** Includes both a custom-duration countdown Timer (Pomodoro) and an open-ended Stopwatch for flexible study tracking.
* **Dynamic Subject Manager:** Easily add, track, and remove specific subjects or projects (like DSA, OS, or C Programming) on the fly.
* **Zero-Dependency Audio:** Synthesizes a custom completion chime entirely from scratch using the browser's native Web Audio API—no `.mp3` files needed.
* **100% Offline & Private:** Built entirely with Vanilla JavaScript and Web Storage API (`localStorage`). All data stays securely on your local machine.
* **Premium UI/UX:** Features a modern dark-mode aesthetic with frosted glassmorphism panels, CSS grid layouts, and animated ambient background orbs.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox/Grid, Glassmorphism)
* **Logic:** Vanilla JavaScript (ES6+)
* **Data Storage:** Web Storage API (`localStorage`)
* **Data Visualization:** Chart.js

## 🚀 Getting Started

Because FocusFlow is a pure frontend application, getting it running is instant. There are no build steps, packages to install, or servers to configure.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pxrkerxd/focusflow.git
2. Navigate to the directory:
    cd focusflow
3. Run the app:
Simply double-click index.html to open it in your default web browser, or use an extension like VS Code's "Live Server" for hot-reloading.


📁 File Structurefocusflow/
```
├── index.html       # Main application layout and UI structure
├── style.css        # Glassmorphism styling, animations, and responsive design
├── script.js        # Core logic, gamification engine, and LocalStorage management
└── README.md        # Project documentation
```
🧠 Why I Built This
Balancing a demanding engineering curriculum requires serious time management. I needed a tool that didn't just passively track time, but actively motivated me to sit down and grind through complex subjects. By combining data visualization (to see my effort) with gamification (to reward my effort), FocusFlow turns daily exam prep into a game that rewards consistency.

🔮 Future Roadmap
PDF Export: Generate and download weekly performance reports for study groups.

Built-in Lo-Fi: Integrated ambient audio player for deep focus sessions.

Smart Breaks: Automatic routing between 5-minute short breaks and 15-minute long breaks based on Pomodoro cycle counts.

Designed & Developed by [Parijat/pxrkerxd]
