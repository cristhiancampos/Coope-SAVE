
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,
  getSeconds, getMinutes, getHours, getDate, getMonth, getYear, setSeconds, setMinutes, setHours, setDate, setMonth, setYear
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { SolicitudSala } from '../modelos/solicitudSala';
import { Departamento } from '../modelos/departamento';

import { ServicioSala } from '../servicios/sala';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import { ServicioRecursos } from '../servicios/recurso';
import { ServicioDepartamento } from '../servicios/departamento';
import { ServicioUsuario } from '../servicios/usuario';

import swal from 'sweetalert2';
import * as moment from 'moment';
import { ChangeDetectorRef, forwardRef, Input, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
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
  providers: [ServicioSolicitudSala, ServicioSala, ServicioRecursos, ServicioDepartamento]
})

export class SolicitudSalaComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view = 'month';
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fa fa-fw fa-pencil"></i>',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent('Editar', event);
    //   }
    // },
    // {
    //   label: '<i class="fa fa-fw fa-times"></i>',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter(iEvent => iEvent !== event);
    //     this.handleEvent('Eliminar', event);
    //   }
    // }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [

    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'Reunión semanal',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'Junta Administrativa',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'Reunión de TI',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
    // ,
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'Reunión de TI',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];
  locale: string = 'es';
  activeDayIsOpen = true;

  //*********************************************AGREGADOS***************************** */
  ngOnInit() {
    this.estiloBotones();
    console.log('cargó el calendario');
    this.obtenerSolicitudSalas();
    // this.obtenerDepartamentos();


  }
  solicitudSala: SolicitudSala;
  //title;//
  //start;//
  //end;//
  //departamento: Departamento;
  private departamentos = [];
  private usuarios = [];
  salas = [];
  recursos = [];
  tempRecursos = [];
  currentDate;
  private solicSala = true;
  public solicitudesdia = [];
  cupoMaximo;
  horarioValido = true;//cambiar a false
  formAgregarValido = true; //cambiar a false
  mensajeSolicitudInvalida = "";
  tempHorarioSala = [];
  minDate: NgbDateStruct;
  tempNombreSala = "";
  listaSolicitudes = [];

  @Input() placeholder: string;
  date: Date;
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct;
  datePicker: any;

  private onChangeCallback: (date: Date) => void = () => { };

  //método constructor
  constructor(
    private modal: NgbModal,
    private _servSala: ServicioSala,
    private _servRecurso: ServicioRecursos,
    private _servSolicitud: ServicioSolicitudSala,
    private _servDepartamento: ServicioDepartamento,
    private _servUsuario: ServicioUsuario,
    private cdr: ChangeDetectorRef
  ) {
    this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    this.obtenerRecursos();
    this.obtenerSalas();
    this.estiloBotones();
    this.minDate = { year: null, month: null, day: null };

  }
  //cambia el tab de solicitar salas a lista de solitudes, según día seleccionado, y vicebersa, en el modal de solicitar sala
  solicitud(num: any) {
    if (num === 1) {
      this.solicSala = true;
    } else {
      this.solicSala = false;
      this.mensajeSolicitudInvalida = "";
    }
  }
  //fijar el estilos delos botones, solicitar sala y solicitudes del día en el modal de agregar solicitud
  estiloBotones() {
    $('#bnt-lista').css('background', '#0069d9');
    $('#bnt-solicitud').css('background', '#eee');

    $('#bnt-lista').click(function () {
      $('#bnt-lista').css('background', '#0069d9');
      $('#bnt-solicitud').css('background', '#eee');
    });

    $('#bnt-vehiculo').click(function () {
      $('#bnt-solicitud').css('background', '#0069d9');
      $('#bnt-lista').css('background', '#eee');
    });
  }
  // obtiene todas las solicitudes solicitudes realizadas
  tempColor: any = {
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
      usuario: null,
      sala: null,
      recursos: [],
      id:null
    }
  };
  tempEnable = false;
  obtenerSolicitudSalas() {
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this._servSolicitud.obtenerTodasSolicitudes().subscribe(
        response => {
          if (response.message) {
            let listaSolicitudes = response.message;
            this.listaSolicitudes = listaSolicitudes;
            this.events = [];
            this._servDepartamento.obtenerDepartamentos().subscribe(
              response => {
                if (response.message) {
                  this.departamentos = response.message;
                  this._servUsuario.obtenerUsuarios().subscribe(
                    response => {
                      if (response.message) {
                        this.usuarios = response.message;
                        for (var index = 0; index < listaSolicitudes.length; index++) {
                          for (var i = 0; i < this.usuarios.length; i++) {
                            if (listaSolicitudes[index].usuario == this.usuarios[i]._id) {
                              for (var c = 0; c < this.departamentos.length; c++) {
                                if (this.usuarios[i].departamento == this.departamentos[c].nombre) {
                                  this.tempColor = {
                                    color: {
                                      primary: this.departamentos[c].color + '',
                                      secondary: '#FAE3E3',
                                      usuario: listaSolicitudes[index].usuario,
                                      sala: listaSolicitudes[index].sala,
                                      recursos: listaSolicitudes[index].recursos,
                                      id:listaSolicitudes[index]._id
                                    }
                                  };
                                }
                              }
                            }
                          }
                          if (user._id == listaSolicitudes[index].usuario) {
                            this.tempEnable = true;
                            this.actions = [
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

                          } else {
                            this.tempEnable = false;
                            this.actions = [];
                          }
                          this.addEvent(listaSolicitudes[index], this.tempEnable);
                        }
                      } else {//no hay Usuarios registradas
                      }
                    }, error => {
                      var errorMensaje = <any>error;
                      if (errorMensaje != null) {
                        var body = JSON.parse(error._body);
                      }
                    }
                  );
                } else {//ho hay departamentos registrados
                }
              }, error => {
                var errorMensaje = <any>error;
                if (errorMensaje != null) {
                  var body = JSON.parse(error._body);
                }
              }
            );

          } else {//no hay Salas registradas
          }
        }, error => {
          var errorMensaje = <any>error;
          if (errorMensaje != null) {
            var body = JSON.parse(error._body);
          }
        }
      );
    } else {
      this.msjError('Debe Verificar sus credenciales');
    }

  }
  //establece el cupo máximo de personas según sala seleccionada
  setCupoMaximoSala(sala) {
    this.mensajeSolicitudInvalida = "";
    this.tempHorarioSala = [];
    //let cup=  this.salas.filter(item => nombre =="ANFITEATRO" );
    for (let index = 0; index < this.salas.length; index++) {
      if (this.salas[index].nombre == sala) {
        var cup = this.salas[index].cupo;
        this.tempHorarioSala = this.salas[index].horario;
        this.tempNombreSala = sala;
        break;
      }

    }
    this.cupoMaximo = cup;
  }
  //eliminar los números negativos en un input
  elimininarNegativos(inputId) {
    $(inputId).on('keypress', function (e) {
      //console.log(e.keyCode);
      if (e.keyCode == 101 || e.keyCode == 45 || e.keyCode == 46 || e.keyCode == 43 || e.keyCode == 44 || e.keyCode == 47) {
        return false;
      }
      var key = window.event ? e.which : e.keyCode
      return (key >= 48 && key <= 57)
    });
  }
  //mostrar modal de solicitar sala a hacer click en un día del calendario
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    this.solicitudSala.fecha = date;
    this.solicitudSala.horaInicio = { hour: 7, minute: 0 };
    this.solicitudSala.horaFin = { hour: 11, minute: 0 };
    this.activeDayIsOpen = false;

    //this.dateStruct ={year: date.getFullYear(), 
    // month:date.getMonth()+1, day: date.getDate()} ;
    // this.da
    this._servSolicitud.fechaActual().subscribe(
      response => {

        if (response.currentDate) {
          this.currentDate = response.currentDate;
          var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
          let serverDate = momentDate.toDate();

          this.minDate.year = serverDate.getFullYear();
          this.minDate.month = (serverDate.getMonth() + 1);
          this.minDate.day = serverDate.getDate();

          if (date.getFullYear() < serverDate.getFullYear()) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
          } else if (((date.getMonth() + 1) < (serverDate.getMonth() + 1))) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
          } else if (((date.getMonth() + 1) == (serverDate.getMonth() + 1))) {
            if (date.getDate() < serverDate.getDate()) {
              this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
            } else {
              // alert('entra aqui 1');
              this.obtenerSolicitudes(date, true);
              this.writeValue(date);
            }
          } else {
            // alert('entra aqui 2');
            this.obtenerSolicitudes(date, true);
            this.writeValue(date);
          }
        } else {
        }
      }, error => {
        //ocurrió un error
      }
    );



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

  //obtener las solicitudes según fecha seleccionada 
  obtenerSolicitudes(userDate, abrirMod: boolean) {
    let array;
    this.solicitudSala.fecha = userDate;
    this._servSolicitud.obtenerSolicitudes(this.solicitudSala).subscribe(
      response => {
        if (!response.message) {//no hay registros
        } else {//no hay Salas registradas
          //console.log('solicitudes salas');
          array = response.message;
          this.solicitudesdia = array;
          console.log(array);
          if (abrirMod) {
            this.abrirModal('#modal-add-new-request');
          }
        }
      }, error => {
        // alert('erro');
      }
    );
  }
  //este método verificaque la fecha seleccionada sea mayor o igual a la fecha del servidor, para poder realizar la solicitud correctamente.
  verificarFechaSeleccionada(userDate: Date) {
    this._servSolicitud.fechaActual().subscribe(
      response => {
        if (response.currentDate) {
          this.currentDate = response.currentDate;
          var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
          let serverDate = momentDate.toDate();

          if (userDate.getFullYear() < serverDate.getFullYear()) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
          } else if (((userDate.getMonth() + 1) < (serverDate.getMonth() + 1))) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
          } else if (((userDate.getMonth() + 1) == (serverDate.getMonth() + 1))) {
            if (userDate.getDate() < serverDate.getDate()) {
              this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
            } else {
              this.writeValue(userDate);
              this.obtenerSolicitudes(userDate, true);
            }
          } else {
            this.writeValue(userDate);
            this.obtenerSolicitudes(userDate, true);
          }
        } else {
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }

  //administra el evento de cambio de hora en las solicitudes
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

  tempEvent: any;
  tempTitleModal = "";
  tempSolicitud = { usuario: null, departamento: null, fecha: null, motivo: null, inicio: null, fin: null, sala: null }
  //administrador de eventos
  handleEvent(action: string, event: CalendarEvent): void {
    this.tempColor = event.color;
    this._servUsuario.obtenerUsuario(this.tempColor.usuario).subscribe(
      response => {
        if (response.message[0]._id) {
          this.tempSolicitud.usuario=response.message[0].nombre+' '+response.message[0].apellidos;
          this.tempSolicitud.departamento=response.message[0].departamento;
          this.tempSolicitud.sala=this.tempColor.sala;
          this._servSolicitud.obtenerSolicitudSala(this.tempColor.id).subscribe(
            response => {
              if (response.message) {
                let solicit=response.message;
                this.tempSolicitud.fecha= solicit.fecha.day+'/'+solicit.fecha.month+'/'+solicit.fecha.year;
                this.tempSolicitud.motivo=solicit.descripcion;  
                this.tempSolicitud.inicio=solicit.horaInicio.hour+':'+solicit.horaInicio.minute;  
                this.tempSolicitud.fin=solicit.horaFin.hour+':'+solicit.horaFin.minute;               
                this.tempEvent = event.actions;
                if (this.tempEvent.length > 0) {
                  this.tempTitleModal = "Editar";
                } else {
                  this.tempTitleModal = "Detalles de la ";
                }
                this.modalData = { event, action };
                this.modal.open(this.modalContent, { size: 'lg' });
              } else {//No se ha encontrado la Sala
              }
            }, error => {
              var errorMensaje = <any>error;
              if (errorMensaje != null) {
                var body = JSON.parse(error._body);
              }
            }
          );
         }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  //inserta los eventos del en el calendario
  addEvent(solicitud, isDragable): void {
    ///////////////////////////////////////////////////////////////
    let fechaInicio = new Date();
    fechaInicio.setFullYear(solicitud.fecha.year);
    fechaInicio.setMonth(solicitud.fecha.month - 1);
    fechaInicio.setDate(solicitud.fecha.day);
    fechaInicio.setHours(solicitud.horaInicio.hour);
    fechaInicio.setMinutes(solicitud.horaInicio.minute);

    let fechaFin = new Date();
    fechaFin.setFullYear(solicitud.fecha.year);
    fechaFin.setMonth(solicitud.fecha.month - 1);
    fechaFin.setDate(solicitud.fecha.day);
    fechaFin.setHours(solicitud.horaFin.hour);
    fechaFin.setMinutes(solicitud.horaFin.minute);

    this.events.push({
      title: solicitud.descripcion + '.       ' + solicitud.horaInicio.hour + ':' + solicitud.horaInicio.minute + ' - ' + solicitud.horaFin.hour + ':' + solicitud.horaFin.minute + '  ',
      start: startOfDay(fechaInicio),
      end: endOfDay(fechaFin),
      color: this.tempColor.color,
      actions: this.actions,
      draggable: isDragable,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    });
    this.refresh.next();
    this.activeDayIsOpen = true;
    ////////////////////////////////////////////////////////////////
  }

  ///***************************************************METODOS AGREGADOS***********************************
  // obtener la lista de salas disponibles
  obtenerSalas() {
    this._servSala.obtenerSalasHabilitadas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
          //console.log(this.salas);
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
  //obtener la lista de recursos disponibles
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
  //se agregan solicitudes en la base de datos después de sus debidas validadaciones
  agregarSolicitud() {
    var minInicial = ((this.solicitudSala.horaInicio.hour * 60) + this.solicitudSala.horaInicio.minute);
    var minFinal = ((this.solicitudSala.horaFin.hour * 60) + this.solicitudSala.horaFin.minute);
    if (minFinal - minInicial <= 0) {
      this.mensajeSolicitudInvalida = "La hora final no debe ser igual o menor a la hora de inicio";
    } else {
      if (minFinal - minInicial > 0 && minFinal - minInicial < 30) {
        this.mensajeSolicitudInvalida = "El tiempo mínimo que se puede pedir una sala es de 30 minutos";
      }
      else {// validar el horario de la sala
        if (this.date == null) {
          this.mensajeSolicitudInvalida = 'Favor seleccione una fecha';
        } else {
          let dia;
          if (this.date.getDay() == 0) {
            dia = "Domingo";
          } else if (this.date.getDay() == 1) {
            dia = "Lunes";

          } else if (this.date.getDay() == 2) {
            dia = "Martes";

          } else if (this.date.getDay() == 3) {
            dia = "Miercoles";

          } else if (this.date.getDay() == 4) {
            dia = "Jueves";

          } else if (this.date.getDay() == 5) {
            dia = "Viernes";

          } else if (this.date.getDay() == 6) {
            dia = "Sabado";

          }

          let horarioDiaSala = { dia: null, desde: null, hasta: null };
          for (let index = 0; index < this.tempHorarioSala.length; index++) {
            if (this.tempHorarioSala[index].dia == dia) {
              horarioDiaSala = this.tempHorarioSala[index];
              break;
            }
          }

          if (horarioDiaSala.desde == null || horarioDiaSala.desde == undefined || horarioDiaSala.desde == "" || horarioDiaSala.desde == "null") {
            this.mensajeSolicitudInvalida = "El día " + dia + " para la sala seleccinada no cuenta con un horario establecido , favor comuniquese con el administrador.";
          } else { // validar el horario del dia selecciona con respecto al horario de la sala
            let agregarValid = false;
            let agregar = false;
            let horaEntradaDigit = (parseInt(this.solicitudSala.horaInicio.hour) + ((parseInt(this.solicitudSala.horaInicio.minute) / 60)));
            let horaSalidaDigit = (parseInt(this.solicitudSala.horaFin.hour) + ((parseInt(this.solicitudSala.horaFin.minute) / 60)));
            // console.log('Inicio pantalla '+horaEntradaDigit+'<  Inicio Solicitud'+horarioDiaSala.desde);
            //console.log('Fin pantalla '+horaSalidaDigit +'> Hasta  Solicitud'+horarioDiaSala.hasta);

            if (horaEntradaDigit < parseInt(horarioDiaSala.desde) ||
              (horaSalidaDigit > parseInt(horarioDiaSala.hasta))) {
              let meridianoInit;
              let meridianoFin;
              let meridNumIni;
              let meridNumFin;
              if (parseInt(horarioDiaSala.desde) < 12) {
                meridianoInit = "AM";
                meridNumIni = parseInt(horarioDiaSala.desde);
              } else if (parseInt(horarioDiaSala.desde) >= 12) {
                meridianoInit = "PM";
                meridNumIni = (parseInt(horarioDiaSala.desde) - 12);
              }
              if (parseInt(horarioDiaSala.hasta) == 24) {
                meridianoFin = "AM";
                meridNumFin = (parseInt(horarioDiaSala.hasta) - 12);
              }
              if (parseInt(horarioDiaSala.hasta) > 12 && parseInt(horarioDiaSala.hasta) < 24) {
                meridianoFin = "PM";
                meridNumFin = (parseInt(horarioDiaSala.hasta) - 12);
              } else if (parseInt(horarioDiaSala.hasta) < 12) {
                meridianoFin = "AM";
                meridNumFin = parseInt(horarioDiaSala.hasta);
              }
              if (meridNumIni == 0) {
                meridNumIni = meridNumIni + 12;
              }
              agregarValid = false;
              this.mensajeSolicitudInvalida = "El horario habilitado el día " + dia + " para la sala selecionada, es desde  " + meridNumIni + " " + meridianoInit + " hasta " + meridNumFin + " " + meridianoFin;
              //alert('horamal');
            }
            else {// validar la disponibilidad de horario
              //alert('horabien'+this.solicitudesdia.length);
              if (this.solicitudesdia.length == 0) {//no hay solicitudes del día y el hora escogido es válido
                agregarValid = true;
              } else {
                // alert('entró aqui  valid' +agregarValid);
                agregarValid = false;
                if (this.tempNombreSala == "") {
                  this.mensajeSolicitudInvalida = "Seleccione una Sala";
                } else {
                  //método burbuja para ordenar las solicitudes de menor a mayor
                  let k = [];
                  for (let i = 1; i < this.solicitudesdia.length; i++) {
                    for (var j = 0; j < (this.solicitudesdia.length - i); j++) {
                      if (this.solicitudesdia[j].horaInicio.hour > this.solicitudesdia[j + 1].horaInicio.hour) {
                        k = this.solicitudesdia[j + 1];
                        this.solicitudesdia[j + 1] = this.solicitudesdia[j];
                        this.solicitudesdia[j] = k;
                      }
                    }
                  }
                  //extraer el horario de la solicitudes de la sala seleccionda 
                  let tempArrayHoraInicio = [];
                  let tempArrayHoraFinal = [];
                  for (let indice = 0; indice < this.solicitudesdia.length; indice++) {
                    if (this.solicitudesdia[indice].sala == this.tempNombreSala) {
                      tempArrayHoraInicio.push(this.solicitudesdia[indice].horaInicio);
                      tempArrayHoraFinal.push(this.solicitudesdia[indice].horaFin);
                    }
                  }

                  //buscar solicitudes entre el rango de horas escojido por el usuario y deteriminar si existen solicitudes
                  let tempArrayVerificacion = [];
                  for (let contador = 0; contador < tempArrayHoraFinal.length; contador++) {
                    let sumatoriaFinal = ((tempArrayHoraFinal[contador].hour * 60) + (tempArrayHoraFinal[contador].minute));
                    let sumatoriaInicial = ((tempArrayHoraInicio[contador].hour * 60) + (tempArrayHoraInicio[contador].minute));
                    console.log('Min inicial ' + minFinal + ">=" + sumatoriaFinal + 'minFinal' + minInicial + '<=' + sumatoriaInicial);
                    if (minFinal >= sumatoriaFinal && minInicial <= sumatoriaFinal) {
                      tempArrayVerificacion.push(minFinal);
                    }
                  }

                  console.log(tempArrayVerificacion);
                  // verificar si se encontraron
                  if (tempArrayVerificacion.length > 0) {
                    agregar = false;
                  } else {
                    agregar = true;
                  }
                }

              }

              //alert('agregar'+agregar+'agregar valid'+agregarValid);
              if (!agregar && !agregarValid) {
                this.mensajeSolicitudInvalida = "Ya existe una solicitud para esta sala, con el horario ingresado";
              }

              if (agregar || agregarValid) {// todo correcto , puede agregar la solicitud

                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                let recursos = JSON.parse(identity);
                if (user != null) {
                  this.solicitudSala.fecha = this.dateStruct;
                  this.solicitudSala.usuario = user._id;
                  this.solicitudSala.recursos = this.tempRecursos;
                  this._servSolicitud.registrarSolicitud(this.solicitudSala).subscribe(
                    response => {
                      if (!response.message._id) {
                        this.msjError(response.message);
                      } else {
                        this.msjExitoso("Solicitud Agregada Exitosamente");
                        this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
                        this.obtenerSolicitudes(this.date, false);
                        this.obtenerSolicitudSalas();
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
                } else {
                  this.msjError('Debe validar sus credenciales');
                }

              }

            }
          }
        }
      }

    }

  }

  getUsuario(id: any) {
    for (let index = 0; index < this.usuarios.length; index++) {
      if (this.usuarios[index]._id == id) {
        return this.usuarios[index].nombre;
      }
    }
    return '-';
  }
  //Obtener departamentos, No está en uso por el momento
  // obtenerDepartamentos() {
  //   this._servDepartamento.obtenerDepartamentos().subscribe(
  //     response => {
  //       if (response.message) {
  //         this.departamentos = response.message;
  //         // console.log('departamentos---');
  //         // console.log(this.departamentos);
  //       } else {//ho hay departamentos registrados
  //       }
  //     }, error => {
  //       var errorMensaje = <any>error;
  //       if (errorMensaje != null) {
  //         var body = JSON.parse(error._body);
  //       }
  //     }
  //   );

  // }


  //encargado de cerrar los modales
  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
    this.solicSala = true;
  }
  // encargado de abrir los modales
  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }
  //muestra mensaje existoso
  msjExitoso(texto: string) {
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }
  //muestra mensaje error
  msjError(texto: string) {
    swal(
      'Oops...',
      texto,
      'error'
    )
  }
  //muestra mensaje informátivo
  msInfo(texto: String) {
    swal({
      title: '',
      type: 'info',
      html: texto + '',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'OK'
    })
  }
  //cambia el valor de los check de recursos
  changeRecursos(event: any, _id: any) {
    if (event.target.checked) {
      this.tempRecursos.push(_id);
    } else {
      this.tempRecursos = this.tempRecursos.filter(item => item !== _id);
    }
  }
  //sobreescribe el valor dela fecha selecionada
  writeValue(date: Date): void {
    this.date = date;
    this.dateStruct = {
      day: getDate(date),
      month: getMonth(date) + 1,
      year: getYear(date)
    };
    this.timeStruct = {
      second: getSeconds(date),
      minute: getMinutes(date),
      hour: getHours(date)
    };
    this.cdr.detectChanges();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void { }
  // validar el dataPicker de hora de inicio en el modal de agregar solicitudes
  ctrlInitDate = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }

    return null;
  });
  // validar el dataPicker de hora de fin en el modal de agregar solicitudes
  ctrlFinishDate = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }
    return null;
  });
  //actualiza la hora de inicio al escribir
  updateInitDateOnInput(): void {

    //     console.log('value');
    //     console.log(this.solicitudSala.horaInicio.hour=='');
    // else{

    // }    

    // if (this.solicitudSala.horaInicio == null || this.solicitudSala.horaInicio == undefined) {
    //   this.solicitudSala.horaInicio = { hour: 0, minute: 0 };
    // } else {

    //   if (!parseInt(this.solicitudSala.horaInicio.hour) ) {
    //     console.log('fomato de hora incorrecto'+this.solicitudSala.horaInicio.hour);

    //   // } else if (isNaN(parseInt(this.solicitudSala.horaInicio.minute))) {
    //   //   console.log('fomato de minuto incorrecto');
    //   }
    //   else {
    //     console.log('hora inicio' + this.solicitudSala.horaInicio);
    //   }
    // }

  }
  updateFinishDateOnInput(): void {

    // if (this.solicitudSala.horaFin == null || this.solicitudSala.horaFin == undefined) {
    //   // alert('la fecha de fin no tiene  formato correcto');
    //   this.solicitudSala.horaFin = { hour: 0, minute: 0 };
    // } else {
    //   //alert('hora inicio'+this.solicitudSala.horaFin);
    // }
  }
  updateDate(): void {
    this.mensajeSolicitudInvalida = "";
    console.log(this.dateStruct);
    const newDate: Date = setYear(
      setMonth(
        setDate(this.date, this.dateStruct.day),
        this.dateStruct.month - 1
      ),
      this.dateStruct.year
    );
    this.onChangeCallback(newDate);
  }
  updateTime(): void {
    this.mensajeSolicitudInvalida = "";
    const newDate: Date = setHours(
      setMinutes(
        setSeconds(this.date, this.timeStruct.second),
        this.solicitudSala.horaFin.minute
      ),
      this.solicitudSala.horaFin.hour
    );
    console.log(newDate);
    this.onChangeCallback(newDate);
  }

}


