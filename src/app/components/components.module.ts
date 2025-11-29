import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HeaderComponent } from './header/header.component';
import { TimerComponent } from './timer/timer.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { FooterComponent } from './footer/footer.component';
import { DockComponent } from './dock/dock.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DockComponent,
    TasksComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    YouTubePlayerModule,
    MatIconModule,
    DragDropModule,
    TimerComponent,
    YoutubePlayerComponent,
    TopBarComponent
  ],
  exports: [
    HeaderComponent,
    TimerComponent,
    YoutubePlayerComponent,
    FooterComponent,
    DockComponent,
    TopBarComponent,
    TasksComponent,
  ],
})
export class ComponentsModule { }
