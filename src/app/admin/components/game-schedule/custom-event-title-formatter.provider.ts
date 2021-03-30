import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  month(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</b> ${event.title}`;
  }

}
