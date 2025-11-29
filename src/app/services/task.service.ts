import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly STORAGE_KEY = 'pomofi_tasks';
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public tasks$ = this.tasksSubject.asObservable();

    constructor() {
        this.loadTasks();
    }

    getTasks(): Observable<Task[]> {
        return this.tasks$;
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
    }

    deleteTask(id: string): void {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.filter(t => t.id !== id);
        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);
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
                    completedAt: t.completedAt ? new Date(t.completedAt) : undefined
                }));
                this.tasksSubject.next(parsedTasks);
            } catch (e) {
                console.error('Error parsing tasks from local storage', e);
                this.tasksSubject.next([]);
            }
        }
    }
}
