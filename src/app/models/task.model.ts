export interface Task {
    id: string;
    title: string;
    pomodoros: number;
    type: 'short' | 'long' | 'standard';
    tag: string;
    status: 'pending' | 'completed';
}
