import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [AppComponent, TimerComponent, YoutubePlayerComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, YouTubePlayerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
