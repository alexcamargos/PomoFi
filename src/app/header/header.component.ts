import { Component } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  constructor(public dialog: Dialog) {}
}

@Component({
  selector: 'app-header-dialog',
  templateUrl: './pomodoro-description-dialog/dialog.html',
  styleUrls: ['./pomodoro-description-dialog/dialog.sass'],
})
export class DialogPomodoroDescription {
  constructor(public dialogRef: DialogRef) {}
}
 