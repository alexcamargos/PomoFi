export interface PomodoroSession {
    id: string;
    taskId?: string;
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    type: string; // 'Pomodoro 25', 'Short Break', etc.
}
