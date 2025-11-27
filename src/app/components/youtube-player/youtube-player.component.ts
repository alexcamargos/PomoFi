import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.sass'],
})
export class YoutubePlayerComponent implements OnInit {
  apiLoaded = false;
  isRestricted = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  player: any;

  ngOnInit() {
    // This code loads the IFrame Player API code asynchronously.
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  onReady(event: any) {
    console.info('YouTube Player Ready!');
    this.player = event.target;
  }

  playVideo() {
    console.info('Play video!');
    this.player?.playVideo();
  }

  pauseVideo() {
    console.info('Pause video!');
    this.player?.pauseVideo();
  }
}
