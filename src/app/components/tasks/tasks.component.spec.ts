import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from '../../services/task.service';
import { BehaviorSubject, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('TasksComponent', () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;
    let mockTaskService: any;
    let tasksSubject: BehaviorSubject<any[]>;

    beforeEach(async () => {
        tasksSubject = new BehaviorSubject<any[]>([]);
        mockTaskService = {
            tasks$: tasksSubject.asObservable(),
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

    it('should sort tasks with pending first and completed last', () => {
        const tasks: any[] = [
            { id: '1', title: 'Task 1', status: 'completed' },
            { id: '2', title: 'Task 2', status: 'pending' },
            { id: '3', title: 'Task 3', status: 'completed' },
            { id: '4', title: 'Task 4', status: 'pending' }
        ];

        // Emit tasks through the subject
        tasksSubject.next(tasks);

        // Re-trigger ngOnInit or just check tasks because subscription is active
        // But we need to ensure the subscription logic ran.
        // Since we are using BehaviorSubject and subscribing in ngOnInit, 
        // and ngOnInit runs in the second beforeEach (fixture.detectChanges calls it implicitly if autoDetectChanges is on, or we need to call it),
        // actually fixture.detectChanges() in beforeEach calls ngOnInit.
        // So the initial value [] was used.
        // Now we emit new value.

        expect(component.tasks.length).toBe(4);
        expect(component.tasks[0].id).toBe('2'); // pending
        expect(component.tasks[1].id).toBe('4'); // pending
        expect(component.tasks[2].id).toBe('1'); // completed
        expect(component.tasks[3].id).toBe('3'); // completed
    });
});
