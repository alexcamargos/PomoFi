import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.sass']
})
export class TasksComponent implements OnInit {
    tasks: Task[] = [];
    newTaskTitle: string = '';
    newTaskPomodoros: number = 1;
    newTaskType: 'Pomodoro 25' | 'Pomodoro 40' | 'Pomodoro 55' = 'Pomodoro 25';
    newTaskCategory: 'Studying' | 'Coding' | 'Working' | 'Other' = 'Other';
    categories: string[] = ['Studying', 'Coding', 'Working', 'Other'];

    editingTask: Task | null = null;

    activeTask: Task | null = null;

    constructor(private taskService: TaskService) { }

    ngOnInit(): void {
        this.taskService.tasks$.subscribe(tasks => {
            this.tasks = [...tasks].sort((a, b) => {
                if (a.status === b.status) return 0;
                return a.status === 'pending' ? -1 : 1;
            });
        });

        this.taskService.activeTask$.subscribe(task => {
            this.activeTask = task;
        });
    }

    setActiveTask(task: Task): void {
        if (this.activeTask?.id === task.id) {
            this.taskService.setActiveTask(null);
        } else {
            this.taskService.setActiveTask(task);
        }
    }

    saveTask(): void {
        if (this.newTaskTitle.trim()) {
            if (this.editingTask) {
                const updatedTask: Task = {
                    ...this.editingTask,
                    title: this.newTaskTitle,
                    pomodoros: this.newTaskPomodoros,
                    type: this.newTaskType,
                    category: this.newTaskCategory
                };
                this.taskService.updateTask(updatedTask);
            } else {
                const newTask: Task = {
                    id: uuidv4(),
                    title: this.newTaskTitle,
                    pomodoros: this.newTaskPomodoros,
                    type: this.newTaskType,
                    category: this.newTaskCategory,
                    status: 'pending',
                    createdAt: new Date()
                };
                this.taskService.addTask(newTask);
            }
            this.resetForm();
        }
    }

    editTask(task: Task): void {
        if (task.status !== 'completed') {
            this.editingTask = task;
            this.newTaskTitle = task.title;
            this.newTaskPomodoros = task.pomodoros;
            this.newTaskType = task.type;
            this.newTaskCategory = task.category;
        }
    }

    cancelEdit(): void {
        this.resetForm();
    }

    toggleStatus(task: Task): void {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        const updatedTask = {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined
        } as Task;
        this.taskService.updateTask(updatedTask);
    }

    deleteTask(id: string): void {
        this.taskService.deleteTask(id);
    }

    resetForm(): void {
        this.editingTask = null;
        this.newTaskTitle = '';
        this.newTaskPomodoros = 1;
        this.newTaskType = 'Pomodoro 25';
        this.newTaskCategory = 'Other';
    }
}
