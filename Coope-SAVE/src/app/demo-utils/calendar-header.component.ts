import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
@Component({
  selector: 'mwl-demo-utils-calendar-header',
  templateUrl: './calendar-header.html',
  styleUrls: ['./styles.css']
})
export class CalendarHeaderComponent {
  @Input() view: string;

  @Input() viewDate: Date;

  //@Input() locale= 'es';
  locale: string = 'es';
  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}
