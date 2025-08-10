import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-calendar-modal',
  imports: [CommonModule, MatIconModule],
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss'
})
export class CalendarModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Sélectionner une date';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() filterDate: ((date: Date) => boolean) | null = null;
  
  @Output() closed = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<Date>();

  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  calendarDays: CalendarDay[] = [];
  
  weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.generateCalendar();
    }
  }

  getMonthYearLabel(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier jour de la semaine à afficher
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Dernier jour de la semaine à afficher
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    this.calendarDays = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const day: CalendarDay = {
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        isSelected: this.isSelected(currentDate),
        isDisabled: this.isDisabled(currentDate)
      };
      
      this.calendarDays.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  isDisabled(date: Date): boolean {
    // Vérifier la date minimum
    if (this.minDate && date < this.minDate) {
      return true;
    }
    
    // Vérifier la date maximum
    if (this.maxDate && date > this.maxDate) {
      return true;
    }
    
    // Vérifier le filtre personnalisé
    if (this.filterDate && !this.filterDate(date)) {
      return true;
    }
    
    return false;
  }

  selectDate(day: CalendarDay) {
    if (day.isDisabled) return;
    
    this.selectedDate = day.date;
    this.generateCalendar(); // Pour mettre à jour l'affichage
  }

  confirmSelection() {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
      this.close();
    }
  }

  close() {
    this.closed.emit();
  }
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;

}
