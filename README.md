# PomoFi - Focus & Lofi

[![Netlify Status](https://api.netlify.com/api/v1/badges/fc9f3b29-0f4a-4df7-960c-51c867de5684/deploy-status)](https://app.netlify.com/sites/pomofi/deploys)

## Overview (STAR Methodology)

### **S**ituation (Situação)
In today's fast-paced digital environment, maintaining deep focus is increasingly difficult. Distractions are everywhere, and professionals and students alike struggle to balance productivity with mental well-being. The need for a tool that not only manages time but also cultivates a conducive environment for concentration was evident.

### **T**ask (Tarefa)
The goal was to create a modern, web-based application that seamlessly integrates the **Pomodoro Technique**—a proven time management method—with a calming auditory atmosphere provided by **Lofi music**. The application needed to be:
- **Distraction-free**: Minimalist UI.
- **Flexible**: Customizable timer presets.
- **Performant**: Smooth animations and low resource usage.
- **Accessible**: Easy to use with global controls.

### **A**ction (Ação)
We engineered **PomoFi** using **Angular** (v15+), leveraging the latest architectural patterns and best practices:
- **Architecture**: Migrated to **Standalone Components** for a modular and lightweight codebase.
- **Performance**: Implemented `ChangeDetectionStrategy.OnPush` and optimized timer logic by running intervals outside Angular's Zone (`ngZone.runOutsideAngular`) to eliminate unnecessary re-renders.
- **UI/UX Design**:
    - Designed a **Glassmorphism-inspired interface** with a dark theme for reduced eye strain.
    - Created a **Draggable UI** using Angular CDK, allowing users to arrange their workspace.
    - Integrated a **Dock** for quick access to essential tools (Timer toggle, Mute, Fullscreen).
    - Implemented **Global Mute** functionality that synchronizes audio across the Timer and YouTube Player.
    - Developed a comprehensive **Task Management System** with Local Storage persistence.
    - Implemented **Task-Timer Linking**, allowing users to associate Pomodoro sessions with specific tasks.
- **Features**:
    - **Custom Timer Presets**: 25, 40, 55 minutes for focus; 5, 10 minutes for breaks.
    - **Integrated Media**: Embedded YouTube Player streaming "Lofi Girl" for continuous background music.
    - **Visual Feedback**: Custom animations (oscillating icons) and active state indicators.

### **R**esult (Resultado)
The result is **PomoFi**: a polished, high-performance productivity tool.
- **Enhanced Focus**: Users can easily enter "flow state" with one-click timer starts and instant background music.
- **User Satisfaction**: The intuitive "Dock" and draggable components provide a personalized experience.
- **Technical Excellence**: The application runs smoothly with minimal CPU footprint, thanks to the targeted performance optimizations.
- **Better Tracking**: Users can now track exactly how much time they spend on each task with the new session history.

---

## Features

- **Smart Timer**: Presets for Pomodoro (25/40/55m) and Breaks (5/10m).
- **Task Tracking**: Create, edit, and manage tasks with ease.
- **Session History**: View detailed history of Pomodoro sessions linked to each task.
- **Lofi Radio**: Integrated YouTube player with Lofi beats.
- **Global Mute**: One-click silence for all app audio.
- **Fullscreen Mode**: Immersive focus experience.
- **Draggable Interface**: Customize your layout.
- **High Performance**: Optimized for low battery and CPU usage.

## Tech Stack

- **Framework**: Angular (Standalone Components)
- **Language**: TypeScript
- **Styling**: SASS (SCSS)
- **Icons**: Material Symbols Rounded
- **State Management**: Input/Output & Signals (Partial)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexcamargos/PomoFi.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

---

*Built with ❤️ for productivity enthusiasts.*
