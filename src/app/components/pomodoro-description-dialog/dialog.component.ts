import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-pomodoro-description-dialog',
    templateUrl: './dialog.html',
    styleUrls: ['./dialog.sass'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PomodoroDescriptionDialog { }
