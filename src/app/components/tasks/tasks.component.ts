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
    newTaskType: 'short' | 'long' | 'standard' = 'standard';
    newTaskTag: string = '';

    editingTask: Task | null = null;

    constructor(private taskService: TaskService) { }

    ngOnInit(): void {
        this.taskService.tasks$.subscribe(tasks => {
            this.tasks = tasks;
        });
    }

    saveTask(): void {
        if (this.newTaskTitle.trim()) {
            if (this.editingTask) {
                const updatedTask: Task = {
                    ...this.editingTask,
                    title: this.newTaskTitle,
                    pomodoros: this.newTaskPomodoros,
                    type: this.newTaskType,
                    tag: this.newTaskTag
                };
                this.taskService.updateTask(updatedTask);
            } else {
                const newTask: Task = {
                    id: uuidv4(),
                    title: this.newTaskTitle,
                    pomodoros: this.newTaskPomodoros,
                    type: this.newTaskType,
                    tag: this.newTaskTag,
                    status: 'pending'
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
            this.newTaskTag = task.tag;
        }
    }

    cancelEdit(): void {
        this.resetForm();
    }

    toggleStatus(task: Task): void {
        const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' } as Task;
        this.taskService.updateTask(updatedTask);
    }

    deleteTask(id: string): void {
        this.taskService.deleteTask(id);
    }

    resetForm(): void {
        this.editingTask = null;
        this.newTaskTitle = '';
        this.newTaskPomodoros = 1;
        this.newTaskType = 'standard';
        this.newTaskTag = '';
    }
}
