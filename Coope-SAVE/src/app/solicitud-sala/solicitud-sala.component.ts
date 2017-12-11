
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,
  getSeconds, getMinutes, getHours, getDate, getMonth, getYear, setSeconds, setMinutes, setHours, setDate, setMonth, setYear
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
import { NgbDateStruct, NgbTimeStruct, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgStyle } from '@angular/common';
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
  @ViewChild('modalDeleteSolicitudSala') modalDeleteSolicitudSala: TemplateRef<any>;
  @ViewChild('modalAgregarSolicitudSala') modalAgregarSolicitudSala: TemplateRef<any>;
  view = 'month';
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];//Array de eventos
  locale: string = 'es';
  activeDayIsOpen = true;

  //*********************************************AGREGADOS***************************** */
  ngOnInit() {
    this.verificarCredenciales();
    this.estiloBotones();

  }

  abrir(modal) {
    this.mr = this.modal.open(modal, { backdrop: 'static', keyboard: false, size: 'lg' });
  }

  cerrar() {
    this.mr.close();
    this.solicSala = true;
    this.activeDayIsOpen = true;
  }

  solicitudSala: SolicitudSala;
  solicitudSalaEdit: SolicitudSala;
  departamentos = [];
  usuarios = [];
  salas = [];
  recursos = [];
  tempRecursos = [];
  tempRecursosEdit = [];
  currentDate;
  solicSala = true;
  solicitudesdia = [];
  cupoMaximo;
  cupoMaximoEdit;
  horarioValido = true;//cambiar a false
  formAgregarValido = true; //cambiar a false
  mensajeSolicitudInvalida = "";
  mensajeSolicitudInvalidaEdit = "";
  tempHorarioSala = [];
  minDate: NgbDateStruct;
  tempNombreSala = "";
  listaSolicitudes = [];
  timeI = { hour: null, minute: null, second: 0 };
  timeF = { hour: null, minute: null, second: 0 };
  dateUpdate = { day: null, month: null, year: null };
  token;
  identity;
  tempArrayChecked = [];
  tempArrayCheckedEdit = [];
  esMayor = false;
  tempEvent: any;
  tempTitleModal = "";
  tempSolicitud = { usuario: null, departamento: null, fecha: null, motivo: null, inicio: null, fin: null, sala: null };
  tempColor: any = {
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
      usuario: null,
      sala: null,
      recursos: [],
      id: null
    }
  };
  tempEnable = false;

  @Input() placeholder: string;
  date: Date;
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct;
  datePicker: any;
  model: NgbDateStruct;
  public mr: NgbModalRef;

  private onChangeCallback: (date: Date) => void = () => { };

  //método constructor
  constructor(
    private modal: NgbModal,
    private _servSala: ServicioSala,
    private _servRecurso: ServicioRecursos,
    private _servSolicitud: ServicioSolicitudSala,
    private _servDepartamento: ServicioDepartamento,
    private _servUsuario: ServicioUsuario,
    private _route: ActivatedRoute,
    private _router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    this.solicitudSalaEdit = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    this.obtenerRecursos();
    this.obtenerSalas();
    // this.estiloBotones();
    this.minDate = { day: null, month: null, year: null };

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
    $('#btn-lista').css('background', '#0069d9');
    $('#btn-solicitud').css('background', '#eee');

    $('#btn-lista').click(function () {
      $('#btn-lista').css('background', '#0069d9');
      $('#btn-solicitud').css('background', '#eee');
    });

    $('#btn-vehiculo').click(function () {
      $('#btn-solicitud').css('background', '#0069d9');
      $('#btn-lista').css('background', '#eee');
    });
  }
  // obtiene todas las solicitudes solicitudes realizadas
  obtenerSolicitudSalas() {
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this._servSolicitud.fechaActual().subscribe(
        response => {

          if (response.currentDate) {
            this.currentDate = response.currentDate;
            var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
            var serverDate = momentDate.toDate();

          } else {
          }
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
                                    if (this.usuarios[i].departamento == this.departamentos[c]._id) {
                                      this.tempColor = {
                                        color: {
                                          primary: this.departamentos[c].color + '',
                                          secondary: '#FAE3E3',
                                          usuario: listaSolicitudes[index].usuario,
                                          sala: listaSolicitudes[index].sala,
                                          recursos: listaSolicitudes[index].recursos,
                                          id: listaSolicitudes[index]._id
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
                                      //  this.events = this.events.filter(iEvent => iEvent !== event);
                                      this.handleEvent('Eliminar', event);
                                    }
                                  }
                                ];

                              } else {
                                this.tempEnable = false;
                                this.actions = [];
                              }
                              let userSumDate = ((listaSolicitudes[index].fecha.year * 365) + (listaSolicitudes[index].fecha.month * 30) + listaSolicitudes[index].fecha.day);
                              let serverSumDate = ((serverDate.getFullYear() * 365) + ((serverDate.getMonth() + 1) * 30) + serverDate.getDate());

                              if (userSumDate < serverSumDate) {
                                this.tempEvent = [];
                                this.actions = [];

                              } else {
                                // alert('entra aqui 2');
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
        }, error => {
          //ocurrió un error
        }
      );

    } else {
      this._router.navigate(['/principal']);
      // this.msjError('Debe Verificar sus credenciales');
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
    this.verificarRecursosAgregar();

    this.cupoMaximo = parseInt(cup);
  }


  setCupoMaximoSalaEdit(sala) {
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
    this.verificarRecursosModificar();
    this.cupoMaximoEdit = parseInt(cup);
  }
  //eliminar los números negativos en un input
  elimininarNegativos(inputId) {
    $(inputId).on('keypress', function (e) {
      if (e.keyCode == 101 || e.keyCode == 45 || e.keyCode == 46 || e.keyCode == 43 || e.keyCode == 44 || e.keyCode == 47) {
        return false;
      }
      var key = window.event ? e.which : e.keyCode
      return (key >= 48 && key <= 57)
    });
  }
  //mostrar modal de solicitar sala a hacer click en un día del calendario
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    this.solicitudSala.fecha = date;
    this.solicitudSala.horaInicio = { hour: 8, minute: 0 };
    this.solicitudSala.horaFin = { hour: 11, minute: 0 };
    this.activeDayIsOpen = false;

    this._servSolicitud.fechaActual().subscribe(
      response => {
        if (response.currentDate) {
          this.currentDate = response.currentDate;
          var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
          let serverDate = momentDate.toDate();

          this.minDate.year = serverDate.getFullYear();
          this.minDate.month = (serverDate.getMonth() + 1);
          this.minDate.day = serverDate.getDate();

          let userSumDate = ((date.getFullYear() * 365) + (date.getMonth() * 30) + date.getDate());
          let serverSumDate = ((serverDate.getFullYear() * 365) + (serverDate.getMonth() * 30) + serverDate.getDate());

          if (userSumDate < serverSumDate) {
            this.msInfo('La fecha de solicitud debe ser igual o mayor a la fecha actual');
          }
          else {
            this.obtenerSolicitudes(date, true);
            this.writeValue(date);
          }
        } else {
        }
      }, error => {
        //ocurrió un error
      }
    );
  }

  //obtener las solicitudes según fecha seleccionada 
  recursosOcupados = [];
  obtenerSolicitudes(userDate, abrirMod: boolean) {
    let array;
    this.solicitudSala.fecha = userDate;
    this._servSolicitud.obtenerSolicitudes(this.solicitudSala).subscribe(
      response => {
        if (!response.message) {//no hay registros
        } else {//no hay Salas registradas
          array = response.message;
          let tempRecurSolici = [];
          this.solicitudesdia = array;
          if (abrirMod) {
            this.abrir(this.modalAgregarSolicitudSala);
          }
        }
      }, error => {
        // alert('erro');
      }
    );
  }
  ///obtiene el nombre departamento, partiendo de su _id
  obtenerNombreDep(id_Dep: any) {
    for (var index = 0; index < this.departamentos.length; index++) {
      if (this.departamentos[index]._id == id_Dep) {
        return this.departamentos[index].nombre;
      }

    }
    return "";
  }

  //administra el evento de cambio de hora en las solicitudes
  eventTimesChanged({ event, newStart, newEnd
    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.solicitudSala.horaInicio = event.start;//
    this.solicitudSala.horaFin = event.end;//

    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  //manejador de eventos
  contador=0;
  handleEvent(action: string, event: CalendarEvent): void {
    this.contador=0;
    this.tempColor = event.color;
    this.solicitudSalaEdit._id = this.tempColor.id;
    this.activeDayIsOpen = false;
    if (action == "Eliminar") {
      this.eliminarSolicitud();
    }
    else {
      this.tempArrayChecked = []
      this.tempRecursos = [];
      this.tempEvent = [];
      let fecha = new Date(event.start);
      this.model = { year: fecha.getFullYear(), month: fecha.getMonth() + 1, day: fecha.getDate() }

      this.mensajeSolicitudInvalida = "";
      this.mensajeSolicitudInvalidaEdit = "";
      this.tempColor = event.color;
      this._servUsuario.obtenerUsuario(this.tempColor.usuario).subscribe(
        response => {
          if (response.message[0]._id) {
            this.tempSolicitud.usuario = response.message[0].nombre + ' ' + response.message[0].apellidos;
            this.tempSolicitud.departamento = response.message[0].departamento;
            this.tempSolicitud.sala = this.tempColor.sala;
            this._servSolicitud.obtenerSolicitudSala(this.tempColor.id).subscribe(
              response => {
                if (response.message) {
                  let solicit = response.message;
                  this.solicitudSalaEdit = solicit;

                  this.solicitudSalaEdit.fecha.year = this.model.year;
                  this.solicitudSalaEdit.fecha.month = this.model.month;
                  this.solicitudSalaEdit.fecha.day = this.model.day;

                  this.timeI.hour = solicit.horaInicio.hour;
                  this.timeI.minute = solicit.horaInicio.minute;
                  this.timeI.second = solicit.horaInicio.second;

                  this.timeF.hour = solicit.horaFin.hour;
                  this.timeF.minute = solicit.horaFin.minute;
                  this.timeF.second = solicit.horaFin.second;

                  this.solicitudSalaEdit.horaInicio = this.timeI;
                  this.solicitudSalaEdit.horaFin = this.timeF;

                  this.solicitudSalaEdit.recursos = solicit.recursos;

                  for (var index = 0; index < this.recursos.length; index++) {
                    this.tempArrayCheckedEdit[index] = false;

                    for (var i = 0; i < solicit.recursos.length; i++) {
                      if (this.recursos[index]._id == solicit.recursos[i]) {
                        this.tempArrayCheckedEdit[index] = true;
                      }
                      else {

                      }
                    }
                  }

                  this.setCupoMaximoSalaEdit(this.solicitudSalaEdit.sala);
                  this.tempEvent = event.actions;
                  if (this.tempEvent.length > 0) {
                    this.tempTitleModal = "Editar";
                  } else {
                    this.tempTitleModal = "Detalles de la ";
                  }
                  let date = new Date();
                  date.setFullYear(solicit.fecha.year);
                  date.setMonth(solicit.fecha.month - 1);
                  date.setDate(solicit.fecha.day);

                  this._servSolicitud.fechaActual().subscribe(
                    response => {

                      if (response.currentDate) {
                        this.currentDate = response.currentDate;
                        var momentDate = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
                        let serverDate = momentDate.toDate();

                        this.minDate.year = serverDate.getFullYear();
                        this.minDate.month = (serverDate.getMonth() + 1);
                        this.minDate.day = serverDate.getDate();

                        let userSumDate = ((date.getFullYear() * 365) + (date.getMonth() * 30) + date.getDate());
                        let serverSumDate = ((serverDate.getFullYear() * 365) + (serverDate.getMonth() * 30) + serverDate.getDate());

                        if (userSumDate < serverSumDate) {
                          this.tempEvent = [];
                        } else {
                        }
                        
                       // this.mr = this.modal.open(this.modalContent, { size: 'lg', backdrop: 'static', keyboard: false });
                      } else {
                      }
                      this.contador++;
                     // if(this.contador==2){
                      this.mr = this.modal.open(this.modalContent, { size: 'lg', backdrop: 'static', keyboard: false });

                     // }

                     /// this.modalData = { event, action };
                      //this.mr = this.modal.open(this.modalContent, { size: 'lg', backdrop: 'static', keyboard: false });
                    }, error => {
                      //ocurrió un error
                    }
                  );
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
  }

  horaFormato12Horas(horario){
    let meridianoInit;
    let meridianoFin;
    let meridNumIni;
    let meridNumFin;
    let minutos= horario.minute;
    
    if(parseInt(minutos) < 10){
      
       minutos= '0'+horario.minute;
    }

    if (parseInt(horario.hour) < 12) {
      meridianoInit = "AM";
      meridNumIni = parseInt(horario.hour);
    } else if (parseInt(horario.hour) >= 12) {
      meridianoInit = "PM";
      meridNumIni = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) == 24) {
      meridianoFin = "AM";
      meridNumFin = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) > 12 && parseInt(horario.hour) < 24) {
      meridianoFin = "PM";
      meridNumFin = (parseInt(horario.hour) - 12);
    } else if (parseInt(horario.hour) < 12) {
      meridianoFin = "AM";
      meridNumFin = parseInt(horario.hour);
    }
    if (meridNumIni == 0) {
      meridNumIni = meridNumIni + 12;
    }
    return meridNumIni+':'+minutos+' '+ meridianoInit;
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
      title: solicitud.descripcion + '.       ' + this.horaFormato12Horas(solicitud.horaInicio)+ ' - ' + this.horaFormato12Horas(solicitud.horaFin)+ '  ',
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
                    if (sumatoriaInicial <= (horaEntradaDigit * 60) && (horaEntradaDigit * 60) < sumatoriaFinal) {
                      tempArrayVerificacion.push(minFinal);
                      break;
                    }
                    if (sumatoriaFinal > (horaEntradaDigit * 60) && (horaSalidaDigit * 60) > sumatoriaInicial) {
                      tempArrayVerificacion.push(minFinal);
                      break;
                    }
                  }

                  // verificar si se encontraron
                  if (tempArrayVerificacion.length > 0) {
                    agregar = false;
                  } else {
                    agregar = true;
                  }
                }

              }
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
                        let solicitud = response.message;
                        this.msjExitoso("Solicitud agregada exitosamente");
                        this.enviarEmail(solicitud);
                        this.cerrar();
                        this.solicitudSala = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
                        this.obtenerSolicitudes(this.date, false);
                        this.obtenerSolicitudSalas();
                        this.obtenerRecursos();

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

  modificarSolicitud() {

    this.solicitudSalaEdit.fecha = { year: null, month: null, day: null };
    this.solicitudSalaEdit.horaInicio = this.timeI;
    this.solicitudSalaEdit.horaFin = this.timeF;

    let dat = new Date();
    dat.setFullYear(this.model.year);
    dat.setMonth(this.model.month - 1);
    dat.setDate(this.model.day);

    this.solicitudSalaEdit.fecha.year = dat.getFullYear();
    this.solicitudSalaEdit.fecha.month = dat.getMonth() + 1;
    this.solicitudSalaEdit.fecha.day = dat.getDate();

    let array;
    this.setCupoMaximoSalaEdit(this.solicitudSalaEdit.sala);
    this.solicitudSala.fecha = dat;
    //alert(dat);
    this._servSolicitud.obtenerSolicitudes(this.solicitudSala).subscribe(
      response => {
        if (!response.message) {//no hay registros
        } else {//no hay Salas registradas

          array = response.message;
          this.solicitudesdia = array;
          var minInicial = ((this.solicitudSalaEdit.horaInicio.hour * 60) + this.solicitudSalaEdit.horaInicio.minute);
          var minFinal = ((this.solicitudSalaEdit.horaFin.hour * 60) + this.solicitudSalaEdit.horaFin.minute);
          if (minFinal - minInicial <= 0) {
            this.mensajeSolicitudInvalidaEdit = "La hora final no debe ser igual o menor a la hora de inicio";
          } else {
            if (minFinal - minInicial > 0 && minFinal - minInicial < 30) {
              this.mensajeSolicitudInvalidaEdit = "El tiempo mínimo que se puede pedir una sala es de 30 minutos";
            }
            else {// validar el horario de la sala
              if (dat == null) {
                this.mensajeSolicitudInvalidaEdit = 'Favor seleccione una fecha';
              } else {
                let dia;
                if (dat.getDay() == 0) {
                  dia = "Domingo";
                } else if (dat.getDay() == 1) {
                  dia = "Lunes";

                } else if (dat.getDay() == 2) {
                  dia = "Martes";

                } else if (dat.getDay() == 3) {
                  dia = "Miercoles";

                } else if (dat.getDay() == 4) {
                  dia = "Jueves";

                } else if (dat.getDay() == 5) {
                  dia = "Viernes";

                } else if (dat.getDay() == 6) {
                  dia = "Sabado";

                }
                //alert(dia);
                let horarioDiaSala = { dia: null, desde: null, hasta: null };
                for (let index = 0; index < this.tempHorarioSala.length; index++) {
                  if (this.tempHorarioSala[index].dia == dia) {
                    horarioDiaSala = this.tempHorarioSala[index];
                    break;
                  }
                }

                if (horarioDiaSala.desde == null || horarioDiaSala.desde == undefined || horarioDiaSala.desde == "" || horarioDiaSala.desde == "null") {
                  this.mensajeSolicitudInvalidaEdit = "El día " + dia + " para la sala seleccinada no cuenta con un horario establecido , favor comuniquese con el administrador.";
                } else { // validar el horario del dia selecciona con respecto al horario de la sala
                  this.mensajeSolicitudInvalidaEdit = "";
                  let agregarValid = false;
                  let agregar = false;
                  let horaEntradaDigit = (parseInt(this.solicitudSalaEdit.horaInicio.hour) + ((parseInt(this.solicitudSalaEdit.horaInicio.minute) / 60)));
                  let horaSalidaDigit = (parseInt(this.solicitudSalaEdit.horaFin.hour) + ((parseInt(this.solicitudSalaEdit.horaFin.minute) / 60)));
          
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
                    this.mensajeSolicitudInvalidaEdit = "El horario habilitado el día " + dia + " para la sala selecionada, es desde  " + meridNumIni + " " + meridianoInit + " hasta " + meridNumFin + " " + meridianoFin;
                    //alert('horamal');
                  }
                  else {// validar la disponibilidad de horario

                    if (this.solicitudesdia.length == 0) {//no hay solicitudes del día y el hora escogido es válido
                      agregarValid = true;
                    } else {
                      agregarValid = false;
                      if (this.tempNombreSala == "") {
                        this.mensajeSolicitudInvalidaEdit = "Seleccione una Sala";
                      } else {

                        //buscar la solicitud seleccionada y eleminarla dela lista de solicitudes del día,
                        // para poder realizar su respectiva modificación en caso de ser el mismos día y se pretenda camibiar solo las horas
                        for (let conta = 0; conta < this.solicitudesdia.length; conta++) {
                          if (this.solicitudesdia[conta]._id === this.solicitudSalaEdit._id) {
                            this.solicitudesdia.splice(conta, 1);
                            break;
                          }
                        }
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

                          if (sumatoriaInicial <= (horaEntradaDigit * 60) && (horaEntradaDigit * 60) < sumatoriaFinal) {
                            tempArrayVerificacion.push(minFinal);
                            break;
                          }
                          if (sumatoriaFinal > (horaEntradaDigit * 60) && (horaSalidaDigit * 60) > sumatoriaInicial) {
                            tempArrayVerificacion.push(minFinal);
                            break;
                          }
                        }

                        // verificar si se encontraron
                        if (tempArrayVerificacion.length > 0) {
                          agregar = false;
                        } else {
                          agregar = true;
                        }
                      }

                    }
                    if (!agregar && !agregarValid) {
                      this.mensajeSolicitudInvalidaEdit = "Ya existe una solicitud para esta sala, con el mismo horario ingresado";
                    }

                    if (agregar || agregarValid) {// todo correcto , puede agregar la solicitud
                      this.dateUpdate.year = this.solicitudSalaEdit.fecha.year;
                      this.dateUpdate.month = this.solicitudSalaEdit.fecha.month;
                      this.dateUpdate.day = this.solicitudSalaEdit.fecha.day;
                      this.solicitudSalaEdit.fecha = this.dateUpdate;

                      this.tempRecursosEdit = [];
                      for (var j = 0; j < this.recursos.length; j++) {
                        if (this.tempArrayCheckedEdit[j]) {
                          this.tempRecursosEdit.push(this.recursos[j]._id);
                        }

                      }
                      this.solicitudSalaEdit.recursos = this.tempRecursosEdit;
                      this._servSolicitud.modificarSolicitudSala(this.solicitudSalaEdit).subscribe(
                        response => {
                          if (!response.message) {
                            this.msjError(response.message);
                          } else {
                            let solicitud = response.message;
                            this.msjExitoso("Solicitud de sala modificada exitosamente");
                             this.enviarEmail(solicitud);
                            this.solicitudSalaEdit = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
                            // this.cupoMaximo="";
                            this.mr.close();
                            this.obtenerSolicitudes(new Date(), false);
                            this.obtenerSolicitudSalas();

                          }
                        }, error => {
                          var alertMessage = <any>error;
                          if (alertMessage != null) {
                            var body = JSON.parse(error._body);
                            this.msjError('Solicitud no registrada');
                          }
                        }
                      );
                    }

                  }
                }
              }
            }

          }
        }
      }, error => {
        // alert('erro');
      }
    );

  }
  // verificaciones previa antes de eliminar
  eliminarSolicitud() {
    if (this.solicitudSalaEdit._id == null || this.solicitudSalaEdit._id == "" || this.solicitudSalaEdit._id == undefined) {
      this.msjError('La solicitud no puede ser eliminada');

    } else {
      if (this.mr) {
        this.mr.close();
      }

      this.mr = this.modal.open(this.modalDeleteSolicitudSala);
    }

  }
  //llamado al servicio que eliminar solicitud de sala
  confirmEliminar() {
    this._servSolicitud.eliminarSolicitudSala(this.solicitudSalaEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Solicitud no pudo ser eliminada");
        } else {
          this.msjExitoso("Solicitud eliminada exitosamente");
          this.mr.close();
          this.obtenerSolicitudSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Solicitud no pudo ser eliminada");
        }
      }
    );
  }

  // encargado de cargar todas las sooicitudes y cerrar el modal cuando se cancela una acción
  cancelarAccion() {
    this.obtenerSolicitudes(new Date(), false);
    this.obtenerSolicitudSalas();
    this.mr.close();
    this.activeDayIsOpen = true;
  }

  //encargado de enviar correo cuando se realiza una nueva solicitud
  enviarEmail(solicitud) {
    for (let i = 0; i < this.usuarios.length; i++) {

      if (solicitud.usuario == this.usuarios[i]._id) {
        solicitud.usuario = this.usuarios[i].nombre + ' ' + this.usuarios[i].apellidos;
        break;
      }
    }
    let nombreRecursos = [];
    for (let z = 0; z < solicitud.recursos.length; z++) {
      for (let e = 0; e < this.recursos.length; e++) {
        if (solicitud.recursos[z] == this.recursos[e]._id) {
          nombreRecursos.push(this.recursos[e].codigoActivo + ' ' + this.recursos[e].nombre);
        }

      }
    }
    solicitud.recursos = nombreRecursos;
    this._servSolicitud.enviarCorreo(solicitud).subscribe(
      response => {
        console.log('Respuesta:' + response);
        if (!response) {
          console.log('Fallo el envio de correo');
        } else {
          console.log('Exito envio de correo');
        }
        console.log('Pruebas de enviar correo');
      }, error => {
        console.log('Fallo el envio de correo 3234234');
      }
    );
  }

  getUsuario(id: any) {
    for (let index = 0; index < this.usuarios.length; index++) {
      if (this.usuarios[index]._id == id) {
        return this.usuarios[index].nombre + ' ' + this.usuarios[index].apellidos;
      }
    }
    return '-';
  }
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

  //cambia el valor de los check de recursos
  changeRecursosEdit(event: any, _id: any, i: any) {
    if (event.target.checked) {
      this.tempRecursosEdit.push(_id);
      this.tempArrayCheckedEdit[i] = true;
    } else {
      this.tempRecursosEdit = this.tempRecursosEdit.filter(item => item !== _id);
      this.tempArrayCheckedEdit[i] = false;
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

  // validar el dataPicker de hora de inicio en el modal de actualizar solicitudes
  timeUpdate = new FormControl('', (control: FormControl) => {
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
  timeUpdateF = new FormControl('', (control: FormControl) => {
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
  }
  updateFinishDateOnInput(): void {
  }
  updateDate(): void {
    this.mensajeSolicitudInvalida = "";
    const newDate: Date = setYear(
      setMonth(
        setDate(this.date, this.dateStruct.day),
        this.dateStruct.month - 1
      ),
      this.dateStruct.year
    );
    this.onChangeCallback(newDate);
    this.verificarRecursosAgregar();
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
    this.onChangeCallback(newDate);
    this.verificarRecursosAgregar();


  }

  verificarCredenciales() {
    this.identity = this._servUsuario.getIndentity();
    this.token = this._servUsuario.getToken();
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    if (user != null) {
      let usuarioTemp = new Usuario('', '', '', '', '', '', '', '', '', '');
      usuarioTemp.correo = user.correo;
      usuarioTemp.contrasena = user.contrasena;
      // obtener datos de usuario identificado
      this._servUsuario.verificarCredenciales(usuarioTemp).subscribe(response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          $('#nav-user').text(' ');
          this._router.navigate(['/principal']);
        } else {
          //conseguir el token para enviarselo a cada petición

          this._servUsuario.verificarCredenciales(usuarioTemp, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                $('#nav-user').text(' ');
                this._router.navigate(['/principal']);
              } else {
                // crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  if (user.rol == "SUPERADMIN" || user.rol == "ADMINISTRADOR") {
                    $('#menuAdmin').css('display', 'block');
                    $('#menuReport').css('display', 'block');
                  } else {
                    $('#menuAdmin').css('display', 'none');
                    if (user.rol == "REPORTES") {

                    } else {
                      $('#menuReport').css('display', 'none');
                    }
                  }
                  this.obtenerSalas();
                  this.estiloBotones();
                  this.obtenerSolicitudSalas();
                  this.obtenerRecursos();
                } else {
                  $('#nav-user').text('');
                  this._router.navigate(['/principal']);
                }
              }
            }, error => {
              $('#nav-user').text(' ');
              this._router.navigate(['/principal']);
            }
          );
        }
      }, error => {
        $('#nav-user').text(' ');
        this._router.navigate(['/principal']);
      }
      );
    } else {
      $('#nav-user').text(' ');
      this._router.navigate(['/principal']);
      //this.abrirModal('#loginModal');
    }
  }

  verificarRecursosAgregar() {
    let fecha = new Date();
    fecha.setFullYear(this.dateStruct.year);
    fecha.setMonth(this.dateStruct.month - 1);
    fecha.setDate(this.dateStruct.day);
    this.solicitudSala.fecha = fecha;
    let array;
    this._servRecurso.obtenerRecursosHabilitados().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
          this._servSolicitud.obtenerSolicitudes(this.solicitudSala).subscribe(
            response => {
              if (!response.message) {//no hay registros
              } else {//no hay Salas registradas
                array = response.message;
                let tempRecurSolici = [];
                this.solicitudesdia = array;
                let horaEntradaDigit = (parseInt(this.solicitudSala.horaInicio.hour) + ((parseInt(this.solicitudSala.horaInicio.minute) / 60)));
                let horaSalidaDigit = (parseInt(this.solicitudSala.horaFin.hour) + ((parseInt(this.solicitudSala.horaFin.minute) / 60)));

                //extraer el horario de la solicitudes de la sala seleccionda 
                let tempRecurSoli = [];
                let tempRecursos = this.recursos;
                for (let indice = 0; indice < this.solicitudesdia.length; indice++) {
                  let sumatoriaFinal = ((this.solicitudesdia[indice].horaFin.hour * 60) + (this.solicitudesdia[indice].horaFin.minute));
                  let sumatoriaInicial = ((this.solicitudesdia[indice].horaInicio.hour * 60) + (this.solicitudesdia[indice].horaInicio.minute));
                  tempRecurSoli = this.solicitudesdia[indice].recursos;

                  if (sumatoriaInicial <= (horaEntradaDigit * 60) && (horaEntradaDigit * 60) < sumatoriaFinal) {

                    for (let j = 0; j < tempRecurSoli.length; j++) {

                      for (let i = 0; i < tempRecursos.length; i++) {
                        if (tempRecurSoli[j] == tempRecursos[i]._id) {
                          this.recursos.splice(i, 1);
                        }

                      }
                    }

                  }
                  if (sumatoriaFinal > (horaEntradaDigit * 60) && (horaSalidaDigit * 60) > sumatoriaInicial) {
                    for (let j = 0; j < tempRecurSoli.length; j++) {

                      for (let i = 0; i < tempRecursos.length; i++) {
                        if (tempRecurSoli[j] == tempRecursos[i]._id) {
                          this.recursos.splice(i, 1);
                        }

                      }
                    }
                  }
                }
              }
            }, error => {
              // alert('erro');
            }
          );

        } else {//no hay recursos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }
  verificarRecursosModificar() {
    let fecha = new Date();
    fecha.setFullYear(this.model.year);
    fecha.setMonth(this.model.month - 1);
    fecha.setDate(this.model.day);
    let solicitud = new SolicitudSala('', '', '', null, null, null, '', '', '', null, '', '');
    solicitud.fecha = fecha;
    this.solicitudSala.fecha = fecha;
    let array;
    this._servRecurso.obtenerRecursosHabilitados().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
          this._servSolicitud.obtenerSolicitudes(solicitud).subscribe(
            response => {
              if (!response.message) {//no hay registros
              } else {//no hay Salas registradas
                array = response.message;
                let tempRecurSolici = [];
                this.solicitudesdia = array;
                let horaEntradaDigit = (parseInt(this.solicitudSalaEdit.horaInicio.hour) + ((parseInt(this.solicitudSalaEdit.horaInicio.minute) / 60)));
                let horaSalidaDigit = (parseInt(this.solicitudSalaEdit.horaFin.hour) + ((parseInt(this.solicitudSalaEdit.horaFin.minute) / 60)));

                //extraer el horario de la solicitudes de la sala seleccionda 
                let tempRecurSoli = [];
                let t = [];
                let tempRecursos = this.recursos;
                for (let indice = 0; indice < this.solicitudesdia.length; indice++) {
                  if (this.solicitudesdia[indice]._id === this.solicitudSalaEdit._id) {

                    let recur = this.solicitudesdia[indice].recursos;
                    for (var index = 0; index < this.recursos.length; index++) {
                      this.tempArrayCheckedEdit[index] = false;
                      for (var i = 0; i < recur.length; i++) {
                        if (this.recursos[index]._id == recur[i]) {
                          this.tempArrayCheckedEdit[index] = true;
                        }
                        else {

                        }
                      }


                    }


                  }
                  else {
                    t.push(this.solicitudesdia[indice]);
                    let sumatoriaFinal = ((this.solicitudesdia[indice].horaFin.hour * 60) + (this.solicitudesdia[indice].horaFin.minute));
                    let sumatoriaInicial = ((this.solicitudesdia[indice].horaInicio.hour * 60) + (this.solicitudesdia[indice].horaInicio.minute));
                    tempRecurSoli = this.solicitudesdia[indice].recursos;

                    if (sumatoriaInicial <= (horaEntradaDigit * 60) && (horaEntradaDigit * 60) < sumatoriaFinal) {

                      for (let j = 0; j < tempRecurSoli.length; j++) {

                        for (let i = 0; i < tempRecursos.length; i++) {
                          if (tempRecurSoli[j] == tempRecursos[i]._id) {
                            this.recursos.splice(i, 1);
                          }

                        }
                      }

                    }
                    if (sumatoriaFinal > (horaEntradaDigit * 60) && (horaSalidaDigit * 60) > sumatoriaInicial) {
                      for (let j = 0; j < tempRecurSoli.length; j++) {

                        for (let i = 0; i < tempRecursos.length; i++) {
                          if (tempRecurSoli[j] == tempRecursos[i]._id) {
                            this.recursos.splice(i, 1);
                          }

                        }
                      }
                    }
                  }

                }
              }
            }, error => {
              // alert('erro');
            }
          );

        } else {//no hay recursos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }

}


