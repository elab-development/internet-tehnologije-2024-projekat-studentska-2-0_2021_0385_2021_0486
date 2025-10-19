import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serbianDate',
  standalone: true
})
export class SerbianDatePipe implements PipeTransform {
  
  private readonly months = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    let date: Date;

    if (typeof value === 'string') {
      date = new Date(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return '';
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}. ${this.months[month]} ${year}.`;
  }
}