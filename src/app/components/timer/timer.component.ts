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
    private ngZone: NgZone
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
        this.resetTimer();
      });
    }
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
    this.cdr.markForCheck();
  }

  resetTimer() {
    console.info('Timer stopped!');

    if (this.isAlive) {
      this.timerPause.emit();
      this.clearTimer();
      this.isAlive = false;
    }

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
