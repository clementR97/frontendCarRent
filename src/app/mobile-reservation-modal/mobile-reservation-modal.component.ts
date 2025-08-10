import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,DateAdapter,MAT_DATE_FORMATS } from '@angular/material/core';
import { TimePickerComponent } from '../time-picker/time-picker.component';

import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';

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
  selector: 'app-mobile-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, TimePickerComponent, CalendarModalComponent],
  templateUrl: './mobile-reservation-modal.component.html',
  styleUrls: ['./mobile-reservation-modal.component.scss']
  
})

// export class MobileReservationModalComponent {
  
  
//   @Output() closed = new EventEmitter<void>();
//   @Output() confirm = new EventEmitter<{
//     departureDate: Date | null;
//     returnDate: Date | null;
//     departureTime: string;
//     returnTime: string;
//     location: string;
//   }>();

//   location = '';
//   departureDate: Date | null = null;
//   returnDate: Date | null = null;
//   departureTime = '';
//   returnTime = '';

//   dateFilter = (date: Date | null): boolean => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date ? date >= today : true;
//   };

//   returnDateFilter = (date: Date | null): boolean => {
//     if (!this.departureDate) return this.dateFilter(date);
//     if (!date) return true;
//     const dep = new Date(this.departureDate);
//     dep.setHours(0, 0, 0, 0);
//     const ret = new Date(date);
//     ret.setHours(0, 0, 0, 0);
//     return ret > dep;
//   };

//   onDepartureTimeSelected(time: string) {
//     this.departureTime = time;
//   }

//   onReturnTimeSelected(time: string) {
//     this.returnTime = time;
//   }

//   close() {
//     this.closed.emit();
//   }

//   submit() {
//     this.confirm.emit({
//       departureDate: this.departureDate,
//       returnDate: this.returnDate,
//       departureTime: this.departureTime,
//       returnTime: this.returnTime,
//       location: this.location,
//     });
//   }
// }

export class MobileReservationModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{
    departureDate: Date | null;
    returnDate: Date | null;
    departureTime: string;
    returnTime: string;
    location: string;
  }>();

  location = '';
  departureDate: Date | null = null;
  returnDate: Date | null = null;
  departureTime = '';
  returnTime = '';
  
  showDepartureDatePicker = false;
  showReturnDatePicker = false;

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  getMinDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  getReturnMinDate(): Date {
    if (this.departureDate) {
      const minReturn = new Date(this.departureDate);
      minReturn.setDate(minReturn.getDate() + 1);
      return minReturn;
    }
    return this.getMinDate();
  }

  dateFilter = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  returnDateFilter = (date: Date): boolean => {
    if (!this.departureDate) return this.dateFilter(date);
    const dep = new Date(this.departureDate);
    dep.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > dep;
  };

  openDepartureDatePicker() {
    this.showDepartureDatePicker = true;
  }

  closeDepartureDatePicker() {
    this.showDepartureDatePicker = false;
  }

  onDepartureDateSelected(date: Date) {
    this.departureDate = date;
    // Si la date de retour est antérieure à la nouvelle date de départ, la réinitialiser
    if (this.returnDate && this.returnDate <= date) {
      this.returnDate = null;
    }
  }

  openReturnDatePicker() {
    this.showReturnDatePicker = true;
  }

  closeReturnDatePicker() {
    this.showReturnDatePicker = false;
  }

  onReturnDateSelected(date: Date) {
    this.returnDate = date;
  }

  onDepartureTimeSelected(time: string) {
    this.departureTime = time;
  }

  onReturnTimeSelected(time: string) {
    this.returnTime = time;
  }

  close() {
    this.closed.emit();
  }

  submit() {
    this.confirm.emit({
      departureDate: this.departureDate,
      returnDate: this.returnDate,
      departureTime: this.departureTime,
      returnTime: this.returnTime,
      location: this.location,
    });
  }
}