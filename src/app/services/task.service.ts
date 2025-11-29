import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

import { PomodoroSession } from '../models/pomodoro-session.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly STORAGE_KEY = 'pomofi_tasks';
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public tasks$ = this.tasksSubject.asObservable();

    private activeTaskSubject = new BehaviorSubject<Task | null>(null);
    public activeTask$ = this.activeTaskSubject.asObservable();

    constructor() {
        this.loadTasks();
    }

    getTasks(): Observable<Task[]> {
        return this.tasks$;
    }

    setActiveTask(task: Task | null): void {
        this.activeTaskSubject.next(task);
    }

    addSessionToTask(taskId: string, session: PomodoroSession): void {
        const currentTasks = this.tasksSubject.value;
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);

        if (taskIndex !== -1) {
            const task = currentTasks[taskIndex];
            const updatedSessions = task.sessions ? [...task.sessions, session] : [session];
            const updatedTask = { ...task, sessions: updatedSessions };

            const updatedTasks = [...currentTasks];
            updatedTasks[taskIndex] = updatedTask;

            this.tasksSubject.next(updatedTasks);
            this.saveTasks(updatedTasks);

            // If the updated task is the active one, update that too
            if (this.activeTaskSubject.value?.id === taskId) {
                this.activeTaskSubject.next(updatedTask);
            }
        }
    }

    addTask(task: Task): void {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = [...currentTasks, task];
        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);
    }

    updateTask(updatedTask: Task): void {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);

        if (this.activeTaskSubject.value?.id === updatedTask.id) {
            this.activeTaskSubject.next(updatedTask);
        }
    }

    deleteTask(id: string): void {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.filter(t => t.id !== id);
        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);

        if (this.activeTaskSubject.value?.id === id) {
            this.activeTaskSubject.next(null);
        }
    }

    private saveTasks(tasks: Task[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    private loadTasks(): void {
        const storedTasks = localStorage.getItem(this.STORAGE_KEY);
        if (storedTasks) {
            try {
                const tasks = JSON.parse(storedTasks);
                const parsedTasks = tasks.map((t: any) => ({
                    ...t,
                    createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
                    completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
                    sessions: t.sessions ? t.sessions.map((s: any) => ({
                        ...s,
                        startTime: new Date(s.startTime),
                        endTime: new Date(s.endTime)
                    })) : []
                }));
                this.tasksSubject.next(parsedTasks);
            } catch (e) {
                console.error('Error parsing tasks from local storage', e);
                this.tasksSubject.next([]);
            }
        }
    }
}
