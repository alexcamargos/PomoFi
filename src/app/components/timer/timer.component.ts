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
    this.pauseTimer();
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
      console.info('Timer started!');
      // this.timerStart.emit(); // Removed immediate emit

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
