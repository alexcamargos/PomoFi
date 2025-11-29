import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PomodoroDescriptionDialog } from '../pomodoro-description-dialog/dialog.component';
import { AboutDialogComponent } from '../about-dialog/about-dialog.component';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.sass'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent implements OnInit {
    @Input() isPlayerActive: boolean = false;
    @Output() togglePlayer = new EventEmitter<void>();

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
    }

    openAbout() {
        this.dialog.open(AboutDialogComponent, {
            panelClass: 'custom-dialog-container',
            backdropClass: 'glass-backdrop'
        });
    }

    openHelp() {
        this.dialog.open(PomodoroDescriptionDialog, {
            panelClass: 'custom-dialog-container',
            backdropClass: 'glass-backdrop'
        });
    }

    toggleFullscreen() {
        const elem = this.document.documentElement;

        if (!this.document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (this.document.exitFullscreen) {
                this.document.exitFullscreen();
            }
        }
    }
}
