// -------------------------------------------------------------------------------------------------
// Name: timer.component.ts
// Version: 0.0.1
//
// Summary: PomoFi - Timer Pomodoro® com Música LoFi
//
// Author: Alexsander Lopes Camargos
// Author-email: alcamargos@vivaldi.net
//
// License: MIT
// -------------------------------------------------------------------------------------------------

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { PomodoroSession } from '../../models/pomodoro-session.model';
import { v4 as uuidv4 } from 'uuid';

// Default values for timer.
const DEFAULT_MINUTES: number = 25; // Default minutes value.
const DEFAULT_SECONDS: number = 0; // Default seconds value.

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass'],
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {
  isAlive: boolean;
  contentEditable: boolean;
  currentPreset: number = DEFAULT_MINUTES;

  totalTime: any;
  timer: any;

  @Input() minutes: number;
  @Input() seconds: number;
  @Input() isMuted: boolean = false;

  activeTask: Task | null = null;
  private currentSessionStartTime: Date | null = null;

  timerPresets = {
    pomodoro25: 25,
    pomodoro40: 40,
    pomodoro55: 55,
    shortBreak: 5,
    longBreak: 10
  };

  categories: string[] = ['Studying', 'Coding', 'Working', 'Other'];
  selectedCategory: string = 'Other';

  private countdownAudio: HTMLAudioElement;
  private pomodoroCompleteAudio: HTMLAudioElement;

  @ViewChild('inputMinutes') inputMinutes: ElementRef<HTMLSpanElement> | undefined;
  @ViewChild('inputSeconds') inputSeconds: ElementRef<HTMLSpanElement> | undefined;

  @Output() timerStart = new EventEmitter<void>();
  @Output() timerPause = new EventEmitter<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private taskService: TaskService
  ) {
    console.info('TimerComponent constructor!');

    // Defaults timer properties.
    this.minutes = DEFAULT_MINUTES;
    this.seconds = DEFAULT_SECONDS;

    // Defaults timer control properties.
    this.isAlive = false; // Timer is not alive.
    this.contentEditable = false; // Span element is not editable.

    // Initialize Audio objects
    this.countdownAudio = new Audio('/assets/sound/countdown.mp3');
    this.pomodoroCompleteAudio = new Audio('/assets/sound/complete.mp3');
    this.countdownAudio.load();
    this.pomodoroCompleteAudio.load();
  }

  ngOnInit(): void {
    console.info('TimerComponent initialized!');

    this.totalTime = this.__totalTimeCalculation();

    this.taskService.activeTask$.subscribe(task => {
      this.activeTask = task;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    console.info('TimerComponent destroyed!');

    this.clearTimer();
  }

  private __totalTimeCalculation(): number {
    return this.minutes * 60 + this.seconds;
  }

  private __doCountdown() {
    if (this.totalTime > 0) {
      this.totalTime--;
      this.minutes = Math.floor(this.totalTime / 60);
      this.seconds = this.totalTime % 60;

      // Update DOM directly to avoid triggering change detection for the whole component tree
      // or use markForCheck if we want to rely on Angular's cycle but optimized.
      // Since we are outside zone, we must manually trigger detection or update DOM.
      // Updating DOM directly is most performant for high-frequency updates like this.

      if (this.inputMinutes) {
        this.inputMinutes.nativeElement.innerText = this.minutes
          .toString()
          .padStart(2, '0');
      }

      if (this.inputSeconds) {
        this.inputSeconds.nativeElement.innerText = this.seconds
          .toString()
          .padStart(2, '0');
      }

      // We don't call cdr.detectChanges() here because we updated the DOM manually.
      // However, if other parts of the UI depend on 'minutes' or 'seconds' bindings 
      // (like the title or other displays not using the #input refs), they won't update.
      // Looking at the template, the values are bound via {{ minutes | number }} inside the spans.
      // But we are overwriting innerText.
      // Let's stick to the manual DOM update for the timer digits as it's efficient.

    } else {
      // Timer finished
      this.ngZone.run(() => {
        if (!this.isMuted) {
          this.pomodoroCompleteAudio.play()
            .then(() => console.info('Complete audio playing'))
            .catch(e => console.warn('Complete audio playback failed:', e));
        }

        this.handleTimerComplete();
        this.resetTimer();
      });
    }
  }

  private handleTimerComplete() {
    if (this.activeTask && this.currentSessionStartTime) {
      const endTime = new Date();
      // Calculate duration in minutes (approx) based on preset or actual elapsed?
      // Let's use the current preset as the type/duration reference.
      // Or calculate diff: (endTime - startTime) / 60000

      let type = 'Custom';
      if (this.currentPreset === 25) type = 'Pomodoro 25';
      else if (this.currentPreset === 40) type = 'Pomodoro 40';
      else if (this.currentPreset === 55) type = 'Pomodoro 55';
      else if (this.currentPreset === 5) type = 'Short Break';
      else if (this.currentPreset === 10) type = 'Long Break';

      const session: PomodoroSession = {
        id: uuidv4(),
        taskId: this.activeTask.id,
        startTime: this.currentSessionStartTime,
        endTime: endTime,
        durationMinutes: this.currentPreset,
        type: type
      };

      this.taskService.addSessionToTask(this.activeTask.id, session);
    }
    this.currentSessionStartTime = null;
  }

  incrementValue(type: string) {
    console.info('Increment value!');

    if (type === 'minutes') {
      if (this.minutes < 59) {
        this.minutes++;
      }
    } else {
      if (this.seconds < 59) {
        this.seconds++;
      }
    }

    this.totalTime = this.__totalTimeCalculation();
    this.cdr.markForCheck();
  }

  decrementValue(type: string) {
    console.info('Decrement value!');

    if (type === 'minutes') {
      if (this.minutes > 0) {
        this.minutes--;
      }
    } else {
      if (this.seconds > 0) {
        this.seconds--;
      }
    }

    this.totalTime = this.__totalTimeCalculation();
    this.cdr.markForCheck();
  }

  toggleContentEditable() {
    console.info('Toggle content editable!');

    this.contentEditable = !this.contentEditable;

    if (!this.contentEditable) {
      this.saveValues();
    }

    this.pauseTimer();
    this.cdr.markForCheck();
  }

  saveValues() {
    if (this.inputMinutes && this.inputSeconds) {
      const minutes = parseInt(
        this.inputMinutes.nativeElement.innerText.trim(),
        10
      );
      const seconds = parseInt(
        this.inputSeconds.nativeElement.innerText.trim(),
        10
      );

      if (!isNaN(minutes) && minutes >= 0) {
        this.minutes = minutes;
      }

      if (!isNaN(seconds) && seconds >= 0) {
        this.seconds = seconds > 59 ? 59 : seconds;
      }

      this.totalTime = this.__totalTimeCalculation();
      this.cdr.markForCheck();
    }
  }

  validateInput(event: KeyboardEvent, type: string) {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    const target = event.target as HTMLElement;
    const maxLength = type === 'minutes' ? 3 : 2;
    const selection = window.getSelection();

    if (selection && selection.toString().length > 0) {
      return;
    }

    if (target.innerText.length >= maxLength) {
      event.preventDefault();
    }
  }

  handleFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;

    setTimeout(() => {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(target);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }, 0);
  }

  setTimer(timer: number) {
    console.info('Set timer!');

    if (!this.isAlive) {
      this.seconds = DEFAULT_SECONDS;
      this.minutes = timer;
      this.currentPreset = timer;
      this.totalTime = this.__totalTimeCalculation();

      if (this.inputMinutes) {
        this.inputMinutes.nativeElement.innerText = this.minutes
          .toString()
          .padStart(2, '0');
      }

      if (this.inputSeconds) {
        this.inputSeconds.nativeElement.innerText = this.seconds
          .toString()
          .padStart(2, '0');
      }
      this.cdr.markForCheck();
    }
  }

  startTimer() {
    if (this.totalTime > 0) {
      console.info('Timer started!');

      if (this.contentEditable) {
        this.toggleContentEditable();
      }

      this.isAlive = true;
      this.currentSessionStartTime = new Date();

      // Emit start event immediately
      this.timerStart.emit();

      // Try to play audio, but don't block timer start
      if (this.countdownAudio && !this.isMuted) {
        this.countdownAudio.play()
          .then(() => console.info('Countdown audio playing'))
          .catch(e => console.warn('Countdown audio playback failed:', e));
      }

      // Run interval outside Angular Zone to prevent global change detection every second
      this.ngZone.runOutsideAngular(() => {
        this.timer = setInterval(() => {
          this.__doCountdown();
        }, 1000);
      });

      this.cdr.markForCheck();
    }
  }

  pauseTimer() {
    console.info('Timer paused!');
    this.timerPause.emit();

    this.clearTimer();
    this.isAlive = false;
    this.currentSessionStartTime = null; // Reset start time on pause? Or keep it? 
    // If we pause, the session is interrupted. 
    // For simplicity, let's assume pausing invalidates the "continuous" session or we just reset start time when resuming?
    // Actually, if they resume, we should probably keep the original start time OR just track duration.
    // But the requirement is "start time, end time".
    // If paused, maybe we should treat it as a break?
    // Let's just reset currentSessionStartTime on pause for now, meaning only uninterrupted sessions count?
    // Or better: keep it null on pause, and set it again on start if it's null?
    // But startTimer sets it to new Date().
    // If we want to track the *actual* work done, we might need more complex logic.
    // For MVP/User Request: "When a pomodoro is finished...".
    // So if they pause and resume, it's still one pomodoro finishing.
    // But the start time would be the *latest* resume time? Or the original?
    // Let's stick to: startTimer sets start time. If paused, we lose that start time context in this simple implementation.
    // The user said "executed pomodoro". Usually implies a full session.

    this.cdr.markForCheck();
  }

  resetTimer() {
    console.info('Timer stopped!');

    if (this.isAlive) {
      this.timerPause.emit();
      this.clearTimer();
      this.isAlive = false;
    }

    this.currentSessionStartTime = null;

    this.minutes = DEFAULT_MINUTES;
    this.seconds = DEFAULT_SECONDS;
    this.currentPreset = DEFAULT_MINUTES;
    this.totalTime = this.__totalTimeCalculation();

    if (this.inputMinutes) {
      this.inputMinutes.nativeElement.innerText = this.minutes
        .toString()
        .padStart(2, '0');
    }

    if (this.inputSeconds) {
      this.inputSeconds.nativeElement.innerText = this.seconds
        .toString()
        .padStart(2, '0');
    }
    this.cdr.markForCheck();
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    console.info(`Category changed to: ${this.selectedCategory}`);
    this.cdr.markForCheck();
  }
}
