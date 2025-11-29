import { PomodoroSession } from './pomodoro-session.model';

export interface Task {
    id: string;
    title: string;
    pomodoros: number;
    type: 'Pomodoro 25' | 'Pomodoro 40' | 'Pomodoro 55';
    category: 'Studying' | 'Coding' | 'Working' | 'Other';
    status: 'pending' | 'completed';
    createdAt: Date;
    completedAt?: Date;
    sessions?: PomodoroSession[];
}
