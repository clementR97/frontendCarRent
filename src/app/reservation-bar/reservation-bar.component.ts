import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { TimePickerComponent } from '../time-picker/time-picker.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM',
  },
  display: {
    dateInput: 'DD/MM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reservation-bar',
  imports:[MatIcon,MatFormFieldModule, MatInputModule, MatIconModule,MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatIconModule, TimePickerComponent],
  templateUrl: './reservation-bar.component.html',
  styleUrls: ['./reservation-bar.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReservationBarComponent {
  departureDate: Date | null = null;
  departureTime = '';
  returnDate: Date | null = null;
  returnTime = '';
  selectedTime = '';

  onDepartureChange() {
    console.log('Départ:', this.departureDate, this.departureTime);
  }

  onReturnChange() {
    console.log('Retour:', this.returnDate, this.returnTime);
  }

  onTimeSelected(time: string) {
    this.selectedTime = time;
  }

  // Empêcher les dates passées
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date >= today : true;
  };

  // Empêcher les dates de retour avant la date de départ
  returnDateFilter = (date: Date | null): boolean => {
    if (!this.departureDate) return true;
    return date ? date > this.departureDate : true;
  };
}

