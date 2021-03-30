import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Injectable,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {CalendarEvent, CalendarEventTitleFormatter, CalendarUtils} from 'angular-calendar';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Game, Games} from "../../../shared/interfaces/game";
import { map } from 'rxjs/operators';
import {CalendarView } from 'angular-calendar';
import {isSameMonth, isSameDay, endOfDay} from 'date-fns';
import {Observable, Subject} from 'rxjs';
import { subWeeks, startOfMonth, endOfMonth, addWeeks } from 'date-fns';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import {DatePipe} from "@angular/common";
import {Title} from "@angular/platform-browser";



const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Injectable()
export class MyCalendarUtils extends CalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = subWeeks(startOfMonth(args.viewDate), 1);
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 1);

    return super.getMonthView(args);
  }
}


@Component({
  selector: 'app-game-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-schedule.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils,
    },
  ],
  encapsulation: ViewEncapsulation.None
})

export class GameScheduleComponent  {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  games: Games
  events$: CalendarEvent<{ game: Game }>[];
  activeDayIsOpen: boolean = false;
  locale: string = 'ru';
  viewChange = new EventEmitter<CalendarView>();
  viewDateChange = new EventEmitter<Date>();
  refresh: Subject<any> = new Subject();


  constructor(public changeDetector: ChangeDetectorRef,
              public  firebaseService: FirebaseService,
              private titleService: Title,) {
    titleService.setTitle('DQuiz | Admin | Расписание игр')
    this.firebaseService.getGames().subscribe(games => {

      this.events$ = games.map(game=>{

        return  {
            title: game.name,
            start: new Date( game.dateTime),
            color: colors.blue,
            allDay: true,
            meta: { game },
            actions: [
              {
                label: '<span class="btn-sm btn-success m-1">Проведение</span>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openGameHolding(event.meta.game.id)
                },
              },
              {
                label: '<span class="btn-sm btn-primary m-1">Изменить</span> ',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.openGameEditor(event.meta.game.id)
                },
              },
            ],
          }
      })

      setTimeout(()=>{
        this.changeDetector.detectChanges()
        this.refresh.next()

      })
    })
  }

  dayClicked({date,events,}: {date: Date; events: CalendarEvent<{ game: Game }>[];}): void {
    this.activeDayIsOpen = true
    this.viewDate = date

    this.events$ = this.events$.filter(event => event.title!='Добавить игру')

    setTimeout(()=>{
      this.events$ = [
        ...this.events$,
        {
          title: 'Добавить игру',
          color: colors.yellow,
          start: new Date(date),
          allDay: true,
          actions: [
            {
              label: '<span class="btn-sm btn-success m-1">Создать</span>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                this.createGame(event.start)
              },
            }
          ],
        }
      ]
      setTimeout(()=>{
        this.refresh.next()
      })
    })
  }

  createGame(dateTime){
    let game: Game  = {}
    // @ts-ignore
    game.dateTime = new DatePipe('en-US').transform(dateTime, 'yyyy-MM-ddT00:00');
    this.firebaseService.createGame(game).then(res => {
      game.id = res.id
      game.name = 'Новая игра | id ' + res.id
      this.firebaseService.updateGame(game, res.id).then( () => {
        this.openGameEditor(game.id)
      })
    })
  }

  eventClicked(event: CalendarEvent<{ game: Game }>): void {
    window.open('admin/game-holding/'+event.meta.game.id, '_blanc')
  }

  openGameEditor(id: string) {
    window.open('/admin/game-editing/'+id, '_blanc')
    this.refresh.next()
  }

  openGameHolding(id: string) {
    window.open('/admin/game-holding/'+id, '_blank')
    this.refresh.next()
  }

  monthEvents() {
    return this.events$.filter(event=>{
      if( this.viewDate.getMonth() == event.start.getMonth()
        && this.viewDate.getFullYear() == event.start.getFullYear() ){
        return true
      }
    })
  }
}
