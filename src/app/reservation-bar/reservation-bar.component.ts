import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { MobileReservationModalComponent } from '../mobile-reservation-modal/mobile-reservation-modal.component';

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
  standalone: true,
  imports:[CommonModule, MatIcon,MatFormFieldModule, MatInputModule, MatIconModule,MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatIconModule, TimePickerComponent, MobileReservationModalComponent],
  templateUrl: './reservation-bar.component.html',
  styleUrls: ['./reservation-bar.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReservationBarComponent {
  @ViewChild('timePicker') timePicker!: TimePickerComponent;
  @ViewChild('returnTimePicker') returnTimePicker!: TimePickerComponent;
  @ViewChild('departurePicker') departurePicker: any;
  @ViewChild('returnPicker') returnPicker: any;
  
  departureDate: Date | undefined ;
  departureTime = '';
  returnDate: Date | undefined ;
  returnTime = '';
  selectedTime = '';
  selectedReturnTime = '';
  showMobileModal = false;

  openMobileModal() {
    //console.log('Opening mobile modal');
    this.showMobileModal = true;
  }

  closeMobileModal() {
    this.showMobileModal = false;
  }

  confirmMobileModal(data: { departureDate: Date | null; returnDate: Date | null; departureTime: string; returnTime: string; location: string; }) {
    this.departureDate = data.departureDate || undefined;
    this.returnDate = data.returnDate || undefined;
    this.selectedTime = data.departureTime;
    this.selectedReturnTime = data.returnTime;
    // Optionnel: gérer location si besoin
    this.showMobileModal = false;
  }

  onDepartureChange() {
    console.log('Départ:', this.departureDate, this.departureTime);
  }

  onReturnChange() {
    console.log('Retour:', this.returnDate, this.returnTime);
  }

  onTimeSelected(time: string) {
    this.selectedTime = time;
  }

  onReturnTimeSelected(time: string) {
    this.selectedReturnTime = time;
  }

  openDepartureTimePicker() {
    this.timePicker.modalTitle = 'Sélectionnez l\'heure de départ';
    this.timePicker.open();
  }

  openReturnTimePicker() {
    this.returnTimePicker.modalTitle = 'Sélectionnez l\'heure de retour';
    this.returnTimePicker.open();
  }

  openDepartureDatePicker() {
    this.departurePicker.open();
  }

  openReturnDatePicker() {
    this.returnPicker.open();
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

