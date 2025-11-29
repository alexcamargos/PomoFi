import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HeaderComponent } from './header/header.component';
import { TimerComponent } from './timer/timer.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    TimerComponent,
    YoutubePlayerComponent,
    FooterComponent,
  ],
  imports: [CommonModule, YouTubePlayerModule, MatIconModule, DragDropModule],
  exports: [
    HeaderComponent,
    TimerComponent,
    YoutubePlayerComponent,
    FooterComponent,
  ],
})
export class ComponentsModule { }
