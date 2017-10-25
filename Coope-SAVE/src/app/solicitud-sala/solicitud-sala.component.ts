
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent
} from 'angular-calendar';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { SolicitudSala } from '../modelos/solicitudSala';

import { ServicioSala } from '../servicios/sala';
import { ServicioRecursos } from '../servicios/recurso';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import swal from 'sweetalert2';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-solicitud-sala',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-sala.component.html',
  styleUrls: ['./solicitud-sala.component.css'],
  providers: [ServicioSala, ServicioRecursos, ServicioSolicitudSala]
})

export class SolicitudSalaComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Editar', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Eliminar', event);
      }
    }
  ];


  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];
  locale: string = 'es';
  activeDayIsOpen = true;


  //*********************************************AGREGADOS***************************** */
  solicitudSala: SolicitudSala;
  title;//
  start;//
  end;//
  salas = [];
  recursos = [];
  tempRecursos =[];

  constructor(
    private modal: NgbModal,
    private _servSala: ServicioSala,
    private _servRecurso: ServicioRecursos,
    private _servSolicitud: ServicioSolicitudSala
  ) {
    this.solicitudSala = new SolicitudSala('', '', '', null, null,null, '', '', '', null, '', '');
    this.obtenerSalas();
    this.obtenerRecursos();
  }



  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // this.title = date;//
    // this.start = date;;//
    // this.end = date;//
    this.solicitudSala.horaInicio = date;//
    this.solicitudSala.horaFin = date;//
    this.solicitudSala.fecha = date;

    this.activeDayIsOpen = false;
    this.obtenerSalas();
    this.obtenerRecursos();
    this.abrirModal('#modal-add-new-request');
    // alert(date);
    // if (isSameMonth(date, this.viewDate)) {
    //   if (
    //     (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //     events.length === 0
    //   ) {
    //     this.activeDayIsOpen = false;
    //   } else {
    //     this.activeDayIsOpen = true;
    //     this.viewDate = date;
    //   }
    // }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd

  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.solicitudSala.horaInicio = event.start;//
    this.solicitudSala.horaFin = event.end;//

    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'Nuevo Evento',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  ///***************************************************METODOS AGREGADOS***********************************
  click(event: any) {
    // alert(event.target.ViewChild);
    // console.log(event);
  }

  obtenerSalas() {
    this._servSala.obtenerSalasHabilitadas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerRecursos() {
    this._servRecurso.obtenerRecursosHabilitados().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
  
  agregarSolicitud() {
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    let recursos = JSON.parse(identity);
    if (user != null) {
      this.solicitudSala.usuario=user._id;
      this.solicitudSala.recursos=this.tempRecursos;
      this._servSolicitud.registrarSolicitud(this.solicitudSala).subscribe(
        response => {
          if (!response.message._id) {
            this.msjError("La Solicitud no pudo ser agregada");
          } else {
            this.msjExitoso("Solicitud Agregada Exitosamente");
            this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
            this.cerrarModal('#modal-add-new-request');
           // this.obtenerSalas();
          }
        }, error => {
          var alertMessage = <any>error;
          if (alertMessage != null) {
            var body = JSON.parse(error._body);
            this.msjError('Solicitud no registrada');
          }
        }
      );
    }else{
      this.msjError('Debe validar sus credenciales');
    }

  }

  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
  }

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

  msjExitoso(texto: string) {
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }

  msjError(texto: string) {
    swal(
      'Oops...',
      texto,
      'error'
    )
  }

  changeRecursos(event:any, _id:any){
   if(event.target.checked){
     this.tempRecursos.push(_id);
   }else{
    this.tempRecursos= this.tempRecursos.filter(item => item !== _id);
   }
  }
}


