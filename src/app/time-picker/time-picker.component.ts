import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent {
  @Output() timeSelected = new EventEmitter<string>();
  
  isOpen = false;
  selectedTime = '';
  
  morningTimes = ['07:00', '07:30'];
  afternoonTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
                   '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'];

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  selectTime(time: string) {
    this.selectedTime = time;
    this.timeSelected.emit(time);
    this.close();
  }
}
