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
});
