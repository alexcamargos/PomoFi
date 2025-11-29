import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
    let service: TaskService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaskService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should manage active task', () => {
        const task: any = { id: '1', title: 'Test Task' };
        service.setActiveTask(task);

        service.activeTask$.subscribe(active => {
            if (active) {
                expect(active.id).toBe('1');
            }
        });
    });

    it('should add session to task', () => {
        const task: any = { id: '1', title: 'Test Task', sessions: [] };
        service.addTask(task);

        const session: any = { id: 's1', durationMinutes: 25 };
        service.addSessionToTask('1', session);

        service.tasks$.subscribe(tasks => {
            const updatedTask = tasks.find(t => t.id === '1');
            if (updatedTask && updatedTask.sessions && updatedTask.sessions.length > 0) {
                expect(updatedTask.sessions.length).toBe(1);
                expect(updatedTask.sessions[0].id).toBe('s1');
            }
        });
    });
});
