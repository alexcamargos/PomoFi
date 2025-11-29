import { Component, ViewChild } from '@angular/core';
import { YoutubePlayerComponent } from './components/youtube-player/youtube-player.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  @ViewChild('youtubePlayer') youtubePlayer!: YoutubePlayerComponent;
  title = 'pomofi';

  isPlayerVisible: boolean = false;
  isPlayerPlaying: boolean = false;
  isTimerVisible: boolean = true;
  isTimerRunning: boolean = false;

  togglePlayerVisibility() {
    this.isPlayerVisible = !this.isPlayerVisible;
  }

  toggleTimerVisibility() {
    this.isTimerVisible = !this.isTimerVisible;
  }

  onTimerStart() {
    this.isTimerRunning = true;
    this.youtubePlayer.playVideo();
  }

  onTimerPause() {
    this.isTimerRunning = false;
    this.youtubePlayer.pauseVideo();
  }

  isMuted: boolean = false;

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  onPlayerStateChange(isPlaying: boolean) {
    this.isPlayerPlaying = isPlaying;
    // If it starts playing, ensure it's visible (optional, but good UX)
    if (isPlaying) {
      this.isPlayerVisible = true;
    }
  }
}
