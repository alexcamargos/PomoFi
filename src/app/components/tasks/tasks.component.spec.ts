import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('TasksComponent', () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;
    let mockTaskService: any;

    beforeEach(async () => {
        mockTaskService = {
            tasks$: of([]),
            addTask: jasmine.createSpy('addTask'),
            updateTask: jasmine.createSpy('updateTask'),
            deleteTask: jasmine.createSpy('deleteTask')
        };

        await TestBed.configureTestingModule({
            declarations: [TasksComponent],
            imports: [FormsModule],
            providers: [
                { provide: TaskService, useValue: mockTaskService }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set createdAt when adding a new task', () => {
        component.newTaskTitle = 'New Task';
        component.saveTask();

        expect(mockTaskService.addTask).toHaveBeenCalled();
        const addedTask = mockTaskService.addTask.calls.mostRecent().args[0];
        expect(addedTask.createdAt).toBeDefined();
        expect(addedTask.createdAt instanceof Date).toBeTrue();
    });

    it('should set completedAt when marking task as completed', () => {
        const task: any = {
            id: '1',
            title: 'Test Task',
            status: 'pending',
            createdAt: new Date()
        };

        component.toggleStatus(task);

        expect(mockTaskService.updateTask).toHaveBeenCalled();
        const updatedTask = mockTaskService.updateTask.calls.mostRecent().args[0];
        expect(updatedTask.status).toBe('completed');
        expect(updatedTask.completedAt).toBeDefined();
        expect(updatedTask.completedAt instanceof Date).toBeTrue();
    });

    it('should clear completedAt when marking task as pending', () => {
        const task: any = {
            id: '1',
            title: 'Test Task',
            status: 'completed',
            createdAt: new Date(),
            completedAt: new Date()
        };

        component.toggleStatus(task);

        expect(mockTaskService.updateTask).toHaveBeenCalled();
        const updatedTask = mockTaskService.updateTask.calls.mostRecent().args[0];
        expect(updatedTask.status).toBe('pending');
        expect(updatedTask.completedAt).toBeUndefined();
    });
});
