import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cats } from "./components/cats/cats";
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [Cats,MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Alphanome.AI');
}
