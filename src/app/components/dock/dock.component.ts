import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-dock',
    templateUrl: './dock.component.html',
    styleUrls: ['./dock.component.sass']
})
export class DockComponent implements OnInit {
    @Input() isTimerActive: boolean = true;
    @Input() isTimerRunning: boolean = false;
    @Input() isTasksActive: boolean = false;
    @Input() isMuted: boolean = false;
    @Output() toggleTimer = new EventEmitter<void>();
    @Output() toggleMute = new EventEmitter<void>();
    @Output() toggleTasks = new EventEmitter<void>();

    currentTime: string = '';
    currentDate: string = '';

    constructor() { }

    ngOnInit(): void {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime(): void {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.currentDate = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }

    onTimerClick(): void {
        this.toggleTimer.emit();
    }

    onMuteClick(): void {
        this.toggleMute.emit();
    }

    onTasksClick(): void {
        this.toggleTasks.emit();
    }
}
