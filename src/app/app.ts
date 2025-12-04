import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalrServiceTs } from './services/signalr.service.ts';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private signalrService:SignalrServiceTs){}
  protected readonly title = signal('Wasalnyy-Frontend');
    @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event) {
    this.runOnExit();
  }

  runOnExit() {
    console.log('Page is being closed or refreshed...');
    this.signalrService.endConnection();
  }
}
