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
} from '@angular/core';

// Default values for timer.
const DEFAULT_MINUTES: number = 25; // Default minutes value.
const DEFAULT_SECONDS: number = 0; // Default seconds value.

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass'],
})
export class TimerComponent implements OnInit, OnDestroy {
  isAlive: boolean;
  contentEditable: boolean;

  totalTime: any;
  timer: any;

  @Input() minutes: number;
  @Input() seconds: number;

  @ViewChild('countdownAudio') countdownAudio:
    | ElementRef<HTMLAudioElement>
    | undefined;
  @ViewChild('pomodoroCompleteAudio') pomodoroCompleteAudio:
    | ElementRef<HTMLAudioElement>
    | undefined;

  @ViewChild('inputMinutes') inputMinutes: ElementRef<HTMLSpanElement> | undefined;
  @ViewChild('inputSeconds') inputSeconds: ElementRef<HTMLSpanElement> | undefined;

  @Output() timerStart = new EventEmitter<void>();
  @Output() timerPause = new EventEmitter<void>();

  constructor() {
    console.info('TimerComponent constructor!');

    // Defaults timer properties.
    this.minutes = DEFAULT_MINUTES;
    this.seconds = DEFAULT_SECONDS;

    // Defaults timer control properties.
    this.isAlive = false; // Timer is not alive.
    this.contentEditable = false; // Span element is not editable.
  }

  ngOnInit(): void {
    console.info('TimerComponent initialized!');

    this.totalTime = this.__totalTimeCalculation();

    this.countdownAudio?.nativeElement.load();
    this.pomodoroCompleteAudio?.nativeElement.load();
  }

  ngOnDestroy() {
    console.info('TimerComponent destroyed!');

    clearInterval(this.timer);
  }

  private __totalTimeCalculation(): number {
    return this.minutes * 60 + this.seconds;
  }

  private __doCountdown() {
    if (this.totalTime > 0) {
      this.totalTime--;
      this.minutes = Math.floor(this.totalTime / 60);
      this.seconds = this.totalTime % 60;

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
    } else {
      this.pomodoroCompleteAudio?.nativeElement.play();
      this.resetTimer();
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
  }

  toggleContentEditable() {
    console.info('Toggle content editable!');

    this.contentEditable = !this.contentEditable;

    if (!this.contentEditable) {
      this.saveValues();
    }

    this.pauseTimer();
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
      this.totalTime = this.__totalTimeCalculation();
    }
  }

  startTimer() {
    if (this.totalTime > 0) {
      console.info('Timer started!');

      if (this.contentEditable) {
        this.toggleContentEditable();
      }

      this.isAlive = true;

      if (this.countdownAudio?.nativeElement) {
        this.countdownAudio.nativeElement.onended = () => {
          this.timerStart.emit();
          this.timer = setInterval(() => {
            this.__doCountdown();
          }, 1000); // Each seconds.
        };
        this.countdownAudio.nativeElement.play();
      }
    }
  }

  pauseTimer() {
    console.info('Timer paused!');
    this.timerPause.emit();

    clearInterval(this.timer);
    this.isAlive = false;
  }

  resetTimer() {
    if (this.isAlive) {
      console.info('Timer stopped!');

      this.timerPause.emit();

      clearInterval(this.timer);

      this.isAlive = false;
      this.minutes = DEFAULT_MINUTES;
      this.seconds = DEFAULT_SECONDS;
      this.totalTime = this.__totalTimeCalculation();
    }
  }
}
