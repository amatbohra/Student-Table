import { Component } from '@angular/core';
import { StudentTableComponent } from './student-table/student-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentTableComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}



