import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.sass'],
})
export class YoutubePlayerComponent implements OnInit {
  apiLoaded = false;
  player: any;

  isMinimized = false;
  isMaximized = false;

  constructor() { }

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  pendingPlay = false;

  onReady(event: any) {
    console.info('YouTube Player Ready!', event);
    this.player = event.target;
    if (this.pendingPlay) {
      console.info('Executing pending play request...');
      this.player.playVideo();
      this.pendingPlay = false;
    }
  }

  playVideo() {
    console.info('Attempting to play video...');
    if (this.player) {
      console.info('Player found, playing video.');
      this.player.playVideo();
    } else {
      console.warn('Player not ready yet! Queueing play request.');
      this.pendingPlay = true;
    }
  }

  pauseVideo() {
    console.info('Attempting to pause video...');
    if (this.player) {
      this.player.pauseVideo();
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.isMaximized = false; // Cannot be maximized if minimized
    }
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    if (this.isMaximized) {
      this.isMinimized = false; // Cannot be minimized if maximized
    }
  }
}
