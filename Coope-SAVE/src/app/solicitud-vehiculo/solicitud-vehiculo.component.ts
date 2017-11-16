import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,
  getSeconds, getMinutes, getHours, getDate, getMonth, getYear, setSeconds, setMinutes, setHours, setDate, setMonth, setYear
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { SolicitudVehiculo } from '../modelos/solicitudVehiculo';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { ServicioSolicitudVehiculo } from '../servicios/solicitudVehiculo';
import { ServicioUsuario } from '../servicios/usuario';
//import { ServicioRecursos } from '../servicios/recurso';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { ChangeDetectorRef, forwardRef, Input, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { filtrarUsuario } from './filtroUsuarios';
import { ServicioDepartamento } from '../servicios/departamento';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as jsPDF from 'jspdf';

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
  selector: 'app-solicitud-vehiculo',
  templateUrl: './solicitud-vehiculo.component.html',
  styleUrls: ['./solicitud-vehiculo.component.css'],
  providers: [ServicioSolicitudVehiculo, ServicioVehiculo, ServicioUsuario, filtrarUsuario, ServicioDepartamento],





})
export class SolicitudVehiculoComponent implements OnInit {

  @ViewChild('modalContent2') modalContent2: TemplateRef<any>;
  @ViewChild('modalDeleteSolicitudVehiculo') modalDeleteSolicitudVehiculo: TemplateRef<any>;
  @ViewChild('modalAgregarSolicitudVehiculo') modalAgregarSolicitudVehiculo: TemplateRef<any>;
  
  
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


  ];
  locale: string = 'es';
  activeDayIsOpen = true;

  //*********************************************AGREGADOS***************************** */
  ngOnInit() {
    this.estiloBotones();
    this.obtenerVehiculos();

    this.obtenerUsuarios();
    this.obtenerSolicitudVehiculos();
    console.log('cargó el calendario de vehiculo');
  }
  private departamentos = [];
  private usuarios = [];
  solicitudVehiculo: SolicitudVehiculo;
  solicitudVehiculoEdit: SolicitudVehiculo;
  filtroUsuario;
  title;//
  start;//
  end;//
  vehiculos = [];
  recursos = [];
  tempAcompanantes = [];
  listaUsuarios = [];
  nombreUsuarios = [];
  idUsuarios = [];
  usuariosAgregados = [];
  currentDate;
  private solicSala = true;
  public solicitudesdia = [];
  minDate: NgbDateStruct;
  mensajeSolicitudInvalida = "";
  mensajeSolicitudInvalidaEdit = "";
  tempHorarioVehiculo = [];
  tempNombreVehiculo = "";
  listaSolicitudes = [];
  public p = 1;
  nuevoVehiculo = "";
  tempEvent: any;
  timeI = { hour: null, minute: null, second: 0 };
  timeF = { hour: null, minute: null, second: 0 };
  tempPlacaVehiculo = "";
  dateUpdate = { day: null, month: null, year: null };
  


  @Input() placeholder: string;
  date: Date;
  dateStruct: NgbDateStruct;
  timeStruct: NgbTimeStruct;
  datePicker: any;
  public mr: NgbModalRef;
  model: NgbDateStruct;

  private onChangeCallback: (date: Date) => void = () => { };

  constructor(
    private modal: NgbModal,
    private _servVehiculo: ServicioVehiculo,
    private _servUsuario: ServicioUsuario,
    private _servSolicitud: ServicioSolicitudVehiculo,
    private _servDepartamento: ServicioDepartamento,
    private cdr: ChangeDetectorRef,
    private _router: Router,
  ) {
    this.solicitudVehiculo = new SolicitudVehiculo('', '', '', null, null, null, '', '', '', null, '', '');
    this.solicitudVehiculoEdit = new SolicitudVehiculo('', '', '', null, null, null, '', '', '', null, '', '');

    this.minDate = { year: null, month: null, day: null };
    this.filtroUsuario = "";

  }
  solicitud(num: any) {
    if (num === 1) {
      this.solicSala = true;
    } else {
      this.solicSala = false;
    }
  }

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

  crearPDF(){

    const pdf = new jsPDF();
    const imgLogo = "assets/img/logo.png";
    const html= "<h1> Probando htmlPDF</h1>"
    pdf.text('Probando PDF',10,10);
    pdf.addImage(imgLogo, 'PNG', 10, 40, 180, 180);  
    pdf.fromHTML($('#areaText').get(0),20,20,{'width':800} );


   

    pdf.save('prueba.pdf');
  
  }
  cancelarAccion() {
    this.crearPDF();
    this.obtenerSolicitudes(new Date(), false);
    this.obtenerSolicitudVehiculos();
    this.mr.close();
    this.activeDayIsOpen = true;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {

    this.obtenerUsuarios();
    this.usuariosAgregados = [];
    this.solicitudVehiculo.fecha = date;
    this.solicitudVehiculo.horaSalida = { hour: 7, minute: 0 };
    this.solicitudVehiculo.horaRegreso = { hour: 11, minute: 0 };
    this.activeDayIsOpen = false;

    this._servSolicitud.fechaActualVehiculo().subscribe(
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
              this.eliminarUsuarioActual();
              this.writeValue(date);
            }
          } else {
            // alert('entra aqui 2');
            this.obtenerSolicitudes(date, true);
            this.eliminarUsuarioActual();
            this.writeValue(date);
          }
        } else {
        }
      }, error => {
        //ocurrió un error
      }
    );
  }
  temid;

  listaNombres() {
    for (let w = 0; w < this.listaUsuarios.length; w++) {
      this.nombreUsuarios[w] = this.listaUsuarios[w].nombre + ' ' + this.listaUsuarios[w].apellidos;
    }
  }

  getItems(ev: any) {
    this.listaNombres();
    let val = ev.target.value;
    if (val && val.trim() != '') {

      this.nombreUsuarios = this.nombreUsuarios.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }
  agregarAcompanates(usuario: any) {
    console.log(usuario);
    this.usuariosAgregados.push(usuario);
    this.filtroUsuario = "";
    for (let i = 0; i < this.listaUsuarios.length; i++) {
      if (this.listaUsuarios[i]._id == usuario._id) {
        this.listaUsuarios.splice(i, 1);
        break
      }
    }

  }
  eliminarAcompanante(usuario: any) {
    this.listaUsuarios.push(usuario);
    for (let i = 0; i < this.usuariosAgregados.length; i++) {
      if (this.usuariosAgregados[i]._id == usuario._id) {
        this.usuariosAgregados.splice(i, 1);
        break
      }
    }
  }

  agregarSolicitud() {


    var minInicial = ((this.solicitudVehiculo.horaSalida.hour * 60) + this.solicitudVehiculo.horaSalida.minute);
    var minFinal = ((this.solicitudVehiculo.horaRegreso.hour * 60) + this.solicitudVehiculo.horaRegreso.minute);
    if (minFinal - minInicial <= 0) {
      this.mensajeSolicitudInvalida = "La hora final no debe ser igual o menor a la hora de inicio";
    } else {
      if (minFinal - minInicial > 0 && minFinal - minInicial < 30) {
        this.mensajeSolicitudInvalida = "El tiempo mínimo que se puede pedir una vehiculo es de 30 minutos";
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

          let horarioDiaVehiculo = { dia: null, desde: null, hasta: null };
          for (let index = 0; index < this.tempHorarioVehiculo.length; index++) {
            if (this.tempHorarioVehiculo[index].dia == dia) {
              horarioDiaVehiculo = this.tempHorarioVehiculo[index];
              break;
            }
          }


          if (horarioDiaVehiculo.desde == null || horarioDiaVehiculo.desde == undefined || horarioDiaVehiculo.desde == "" || horarioDiaVehiculo.desde == "null") {

            this.mensajeSolicitudInvalida = "El día " + dia + " para el vehiculo seleccinado no cuenta con un horario establecido , favor comuniquese con el administrador.";

          } else { // validar el horario del dia selecciona con respecto al horario de la sala
            let agregarValid = false;
            let agregar = false;
            let horaSalidaDigit = (parseInt(this.solicitudVehiculo.horaSalida.hour) + ((parseInt(this.solicitudVehiculo.horaSalida.minute) / 60)));
            let horaRegresoDigit = (parseInt(this.solicitudVehiculo.horaRegreso.hour) + ((parseInt(this.solicitudVehiculo.horaRegreso.minute) / 60)));
            // console.log('Inicio pantalla '+horaSalidaDigit+'<  Inicio Solicitud'+horarioDiaVehiculo.desde);
            //console.log('Fin pantalla '+horaSalidaDigit +'> Hasta  Solicitud'+horarioDiaVehiculo.hasta);

            if (horaSalidaDigit < parseInt(horarioDiaVehiculo.desde) ||
              (horaSalidaDigit > parseInt(horarioDiaVehiculo.hasta))) {
              let meridianoInit;
              let meridianoFin;
              let meridNumIni;
              let meridNumFin;
              if (parseInt(horarioDiaVehiculo.desde) < 12) {
                meridianoInit = "AM";
                meridNumIni = parseInt(horarioDiaVehiculo.desde);
              } else if (parseInt(horarioDiaVehiculo.desde) >= 12) {
                meridianoInit = "PM";
                meridNumIni = (parseInt(horarioDiaVehiculo.desde) - 12);
              }
              if (parseInt(horarioDiaVehiculo.hasta) == 24) {
                meridianoFin = "AM";
                meridNumFin = (parseInt(horarioDiaVehiculo.hasta) - 12);
              }
              if (parseInt(horarioDiaVehiculo.hasta) > 12 && parseInt(horarioDiaVehiculo.hasta) < 24) {
                meridianoFin = "PM";
                meridNumFin = (parseInt(horarioDiaVehiculo.hasta) - 12);
              } else if (parseInt(horarioDiaVehiculo.hasta) < 12) {
                meridianoFin = "AM";
                meridNumFin = parseInt(horarioDiaVehiculo.hasta);
              }
              if (meridNumIni == 0) {
                meridNumIni = meridNumIni + 12;
              }
              agregarValid = false;
              this.mensajeSolicitudInvalida = "El horario habilitado el día " + dia + " para el vehiculo selecionado, es desde  " + meridNumIni + " " + meridianoInit + " hasta " + meridNumFin + " " + meridianoFin;
              //alert('horamal');
            }
            else {// validar la disponibilidad de horario
              //alert('horabien'+this.solicitudesdia.length);

              if (this.solicitudesdia.length == 0) {//no hay solicitudes del día y el hora escogido es válido
                agregarValid = true;

              } else {
                // alert('entró aqui  valid' +agregarValid);

                agregarValid = false;
                this.tempNombreVehiculo = this.solicitudVehiculo.vehiculo;
                if (this.tempNombreVehiculo == "") {
                  this.mensajeSolicitudInvalida = "Seleccione un Vehiculo";

                } else {

                  //método burbuja para ordenar las solicitudes de menor a mayor
                  let k = [];
                  for (let i = 1; i < this.solicitudesdia.length; i++) {
                    for (var j = 0; j < (this.solicitudesdia.length - i); j++) {
                      if (this.solicitudesdia[j].horaSalida.hour > this.solicitudesdia[j + 1].horaSalida.hour) {
                        k = this.solicitudesdia[j + 1];
                        this.solicitudesdia[j + 1] = this.solicitudesdia[j];
                        this.solicitudesdia[j] = k;
                      }
                    }
                  }
                  console.log('vector. solicitud del dia');
                  console.log(this.solicitudesdia);
                  //extraer el horario de la solicitudes del vehiculo seleccionado
                  let tempArrayHoraInicio = [];
                  let tempArrayHoraFinal = [];
                  for (let indice = 0; indice < this.solicitudesdia.length; indice++) {
                    if (this.solicitudesdia[indice].vehiculo == this.tempNombreVehiculo) {
                      tempArrayHoraInicio.push(this.solicitudesdia[indice].horaSalida);
                      tempArrayHoraFinal.push(this.solicitudesdia[indice].horaRegreso);
                    }
                  }


                  //buscar solicitudes entre el rango de horas escojido por el usuario y deteriminar si existen solicitudes
                  let tempArrayVerificacion = [];
                  for (let contador = 0; contador < tempArrayHoraFinal.length; contador++) {
                    let sumatoriaFinal = ((tempArrayHoraFinal[contador].hour * 60) + (tempArrayHoraFinal[contador].minute));
                    let sumatoriaInicial = ((tempArrayHoraInicio[contador].hour * 60) + (tempArrayHoraInicio[contador].minute));
                    if (sumatoriaInicial <= (horaSalidaDigit * 60) && (horaSalidaDigit * 60) < sumatoriaFinal) {
                      tempArrayVerificacion.push(minFinal);
                      break;
                    }
                    if (sumatoriaFinal > (horaSalidaDigit * 60) && (horaSalidaDigit * 60) > sumatoriaInicial) {
                      tempArrayVerificacion.push(minFinal);
                      console.log('Array de verificacion');
                      console.log(tempArrayVerificacion);
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
                  this.solicitudVehiculo.fecha = this.dateStruct;
                  this.solicitudVehiculo.usuario = user._id;
                  this.solicitudVehiculo.acompanantes = this.usuariosAgregados;
                  //let regreso= {minute: this.solicitudVehiculo.horaRegreso.minute, hour: this.solicitudVehiculo.horaRegreso.hour   };
                  //this.solicitudVehiculo.horaRegreso= regreso;
                  console.log(SolicitudVehiculo);
                  this._servSolicitud.registrarSolicitud(this.solicitudVehiculo).subscribe(
                    response => {
                      if (!response.message._id) {
                        this.msjError(response.message);
                      } else {
                        let solicitud = response.message;
                        this.msjExitoso("Solicitud agregada exitosamente");
                        //this.enviarEmail(solicitud);
                        this.solicitudVehiculo = new SolicitudVehiculo('', '', '', null, null, null, '', '', '', null, '', '');
                        this.obtenerSolicitudes(this.date, false);
                        this.obtenerSolicitudVehiculos();
                        this.cerrar();
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

  modificarSolicitud(solicitudparaEditar: any) {
    console.log('probando datos');
    console.log(solicitudparaEditar);
    this.tempPlacaVehiculo = solicitudparaEditar.placa;
    this.solicitudVehiculoEdit.fecha = { year: null, month: null, day: null };
    this.solicitudVehiculoEdit.horaSalida = this.timeI;
    this.solicitudVehiculoEdit.horaRegreso = this.timeF;

    let dat = new Date();
    dat.setFullYear(this.model.year);
    dat.setMonth(this.model.month - 1);
    dat.setDate(this.model.day);

    this.solicitudVehiculoEdit.fecha.year = dat.getFullYear();
    this.solicitudVehiculoEdit.fecha.month = dat.getMonth() + 1;
    this.solicitudVehiculoEdit.fecha.day = dat.getDate();

    let array;
    //console.log('fecha enviada');
    //console.log(this.solicitudSalaEdit.fecha );
    //  this.solicitudSala.fecha.year = dat;


    this.solicitudVehiculo.fecha = dat;
    console.log(this.solicitudVehiculo);
    this._servSolicitud.obtenerSolicitudes(this.solicitudVehiculo).subscribe(
      response => {
        if (!response.message) {//no hay registros
        } else {//no hay vehiculo registrados

          array = response.message;
          this.solicitudesdia = array;
          console.log(this.solicitudesdia);
          var minInicial = ((this.solicitudVehiculoEdit.horaSalida.hour * 60) + this.solicitudVehiculoEdit.horaSalida.minute);
          var minFinal = ((this.solicitudVehiculoEdit.horaRegreso.hour * 60) + this.solicitudVehiculoEdit.horaRegreso.minute);
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
                let horarioDiaVehiculo = { dia: null, desde: null, hasta: null };
                for (let index = 0; index < this.tempHorarioVehiculo.length; index++) {
                  if (this.tempHorarioVehiculo[index].dia == dia) {
                    horarioDiaVehiculo = this.tempHorarioVehiculo[index];
                    break;
                  }
                }

                if (horarioDiaVehiculo.desde == null || horarioDiaVehiculo.desde == undefined || horarioDiaVehiculo.desde == "" || horarioDiaVehiculo.desde == "null") {
                  this.mensajeSolicitudInvalidaEdit = "El día " + dia + " para la sala seleccinada no cuenta con un horario establecido , favor comuniquese con el administrador.";
                } else { // validar el horario del dia selecciona con respecto al horario de la sala
                  this.mensajeSolicitudInvalidaEdit = "";
                  let agregarValid = false;
                  let agregar = false;
                  let horaEntradaDigit = (parseInt(this.solicitudVehiculoEdit.horaSalida.hour) + ((parseInt(this.solicitudVehiculoEdit.horaSalida.minute) / 60)));
                  let horaSalidaDigit = (parseInt(this.solicitudVehiculoEdit.horaRegreso.hour) + ((parseInt(this.solicitudVehiculoEdit.horaRegreso.minute) / 60)));
                  // console.log('Inicio pantalla '+horaEntradaDigit+'<  Inicio Solicitud'+horarioDiaVehiculo.desde);
                  //console.log('Fin pantalla '+horaSalidaDigit +'> Hasta  Solicitud'+horarioDiaVehiculo.hasta);

                  if (horaEntradaDigit < parseInt(horarioDiaVehiculo.desde) ||
                    (horaSalidaDigit > parseInt(horarioDiaVehiculo.hasta))) {
                    let meridianoInit;
                    let meridianoFin;
                    let meridNumIni;
                    let meridNumFin;
                    if (parseInt(horarioDiaVehiculo.desde) < 12) {
                      meridianoInit = "AM";
                      meridNumIni = parseInt(horarioDiaVehiculo.desde);
                    } else if (parseInt(horarioDiaVehiculo.desde) >= 12) {
                      meridianoInit = "PM";
                      meridNumIni = (parseInt(horarioDiaVehiculo.desde) - 12);
                    }
                    if (parseInt(horarioDiaVehiculo.hasta) == 24) {
                      meridianoFin = "AM";
                      meridNumFin = (parseInt(horarioDiaVehiculo.hasta) - 12);
                    }
                    if (parseInt(horarioDiaVehiculo.hasta) > 12 && parseInt(horarioDiaVehiculo.hasta) < 24) {
                      meridianoFin = "PM";
                      meridNumFin = (parseInt(horarioDiaVehiculo.hasta) - 12);
                    } else if (parseInt(horarioDiaVehiculo.hasta) < 12) {
                      meridianoFin = "AM";
                      meridNumFin = parseInt(horarioDiaVehiculo.hasta);
                    }
                    if (meridNumIni == 0) {
                      meridNumIni = meridNumIni + 12;
                    }
                    agregarValid = false;
                    this.mensajeSolicitudInvalidaEdit = "El horario habilitado el día " + dia + " para la sala selecionada, es desde  " + meridNumIni + " " + meridianoInit + " hasta " + meridNumFin + " " + meridianoFin;
                    //alert('horamal');
                  }
                  else {// validar la disponibilidad de horario

                    //   alert('horabien'+this.solicitudesdia.length);
                    if (this.solicitudesdia.length == 0) {//no hay solicitudes del día y el hora escogido es válido
                      agregarValid = true;
                    } else {
                      // alert('entró aqui  valid' +agregarValid);
                      console.log('AgregarValidEn false');
                      agregarValid = false;
                      if (this.tempPlacaVehiculo == "") {
                        this.mensajeSolicitudInvalidaEdit = "Seleccione una Sala";
                      } else {
                        //     console.log('solicitudes dia');
                        //   console.log(this.solicitudesdia);
                        //buscar la solicitud seleccionada y eleminarla dela lista de solicitudes del día,
                        // para poder realizar su respectiva modificación en caso de ser el mismos día y se pretenda camibiar solo las horas
                        for (let conta = 0; conta < this.solicitudesdia.length; conta++) {
                          console.log('dentro del for que va a aleliminar el evento de hoy');
                          if (this.solicitudesdia[conta]._id === this.solicitudVehiculoEdit._id) {
                            console.log('la econtró');
                            this.solicitudesdia.splice(conta, 1);
                            break;
                          }
                        }
                        //método burbuja para ordenar las solicitudes de menor a mayor
                        // console.log(this.solicitudSalaEdit._id);
                        //console.log(this.solicitudesdia);
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
                          if (this.solicitudesdia[indice].vehiculo == this.tempPlacaVehiculo) {
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
                          console.log('agregar en false');
                        } else {
                          agregar = true;
                        }
                      }

                    }
                    if (!agregar && !agregarValid) {
                      this.mensajeSolicitudInvalidaEdit = "Ya existe una solicitud para esta sala, con el mismo horario ingresado";
                    }

                    if (agregar || agregarValid) {// todo correcto , puede agregar la solicitud
                      //alert('puede modificar ');
                      this.dateUpdate.year = this.solicitudVehiculoEdit.fecha.year;
                      this.dateUpdate.month = this.solicitudVehiculoEdit.fecha.month;
                      this.dateUpdate.day = this.solicitudVehiculoEdit.fecha.day;
                      this.solicitudVehiculoEdit.fecha = this.dateUpdate;
                      this.solicitudVehiculoEdit.acompanantes = this.usuariosAgregados;
                      console.log(this.solicitudVehiculoEdit);
                      this._servSolicitud.modificarSolicitudVehiculo(this.solicitudVehiculoEdit).subscribe(
                        response => {
                          if (!response.message) {
                            this.msjError(response.message);
                          } else {
                            let solicitud = response.message;
                            this.msjExitoso("Solicitud de sala modificada exitosamente");
                            console.log(solicitud);
                            // this.enviarEmail(solicitud);
                            this.solicitudVehiculoEdit = new SolicitudVehiculo('', '', '', null, null, null, '', '', '', null, '', '');
                            // this.cupoMaximo="";
                            this.obtenerSolicitudes(new Date(), false);
                            this.obtenerSolicitudVehiculos();
                            this.mr.close();
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





  tempColor: any = {
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
      usuario: null,
      vehiculo: null,
      id: null
    }
  };

  tempEnable = false;
  obtenerSolicitudVehiculos() {
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
                                    if (this.usuarios[i].departamento == this.departamentos[c].nombre) {
                                      this.tempColor = {
                                        color: {
                                          primary: this.departamentos[c].color + '',
                                          secondary: '#FAE3E3',
                                          usuario: listaSolicitudes[index].usuario,
                                          vehiculo: listaSolicitudes[index].vehiculo,
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
                                      this.events = this.events.filter(iEvent => iEvent !== event);
                                      this.handleEvent('Eliminar', event);
                                    }
                                  }
                                ];

                              } else {
                                this.tempEnable = false;
                                this.actions = [];
                              }
                              if (listaSolicitudes[index].fecha.year < serverDate.getFullYear()) {
                                console.log('primer control');
                                this.tempEvent = [];
                                this.actions = [];
                                this.tempEnable = false;
                              } else if (listaSolicitudes[index].fecha.month < (serverDate.getMonth() + 1)) {
                                console.log('Segundo control');
                                this.tempEvent = [];
                                this.actions = [];
                                this.tempEnable = false;
                              } else if (listaSolicitudes[index].fecha.month == (serverDate.getMonth() + 1)) {
                                if (listaSolicitudes[index].fecha.day < serverDate.getDate()) {
                                  console.log('Tercer control');
                                  this.tempEvent = [];
                                  this.actions = [];
                                  this.tempEnable = false;
                                } else {
                                  // this.tempEnable = true;
                                }
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

  setHorarioVehiculo(placa) {

    this.mensajeSolicitudInvalida = "";
    this.tempHorarioVehiculo = []
    for (let index = 0; index < this.vehiculos.length; index++) {
      if (this.vehiculos[index].placa == placa) {
        this.tempHorarioVehiculo = this.vehiculos[index].horario;
        break;
      }

    }
  }
  getUsuario(id: any) {
    for (let index = 0; index < this.usuarios.length; index++) {
      if (this.usuarios[index]._id == id) {
        return this.usuarios[index].nombre + ' ' + this.usuarios[index].apellidos;
      }
    }
    return '-';
  }

  vehiculoSeleccionado(p: any) {
    this.p = p;
    this.setHorarioVehiculo(this.vehiculos[p - 1].placa)
    this.solicitudVehiculo.vehiculo = this.vehiculos[p - 1].placa;
  }

  obtenerSolicitudes(userDate, abrirMod: boolean) {
    let array;
    this.solicitudVehiculo.fecha = userDate;
    console.log(this.solicitudVehiculo);
    this._servSolicitud.obtenerSolicitudes(this.solicitudVehiculo).subscribe(
      response => {
        if (!response.message) {//no hay registros
        } else {//no hay Salas registradas
          //console.log('solicitudes salas');
          array = response.message;
          this.solicitudesdia = array;
          if (abrirMod) {
            this.abrir(this.modalAgregarSolicitudVehiculo);
          }
        }
      }, error => {
        // alert('erro');
      }
    );
  }
  obtenerUsuarios() {

    
    this._servUsuario.obtenerUsuarios().subscribe(
      response => {
        if (response.message) {
          this.listaUsuarios = response.message;
          this.listaNombres();
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
  obtenerVehiculos() {
    this._servVehiculo.obtenerVehiculos().subscribe(
      response => {
        if (response.message) {
          this.vehiculos = response.message;
          this.setHorarioVehiculo(this.vehiculos[0].placa);
          this.solicitudVehiculo.vehiculo = this.vehiculos[0].placa;
          console.log(this.vehiculos);
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
  //este método verificaque la fecha seleccionada sea mayor o igual a la fecha del servidor, para poder realizar la solicitud correctamente.
  verificarFechaSeleccionada(userDate: Date) {
  }

  eliminarUsuarioActual(){// Eliminar el usuario actual de la lista de usuarios disponibles, para el la seccion de acompanantes

    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    console.log(user);
    if(!user){
      this._router.navigate(['/principal']);
    } else {
      for( let i= 0; i<this.listaUsuarios.length; i++){
          if(user._id == this.listaUsuarios[i]._id){
            this.listaUsuarios.splice(i,1);
            
            break;
          }
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd

  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  vehiculoSeleccionadoEditar(nuevoVehiculo: any) {
    this.nuevoVehiculo = nuevoVehiculo;
    console.log(nuevoVehiculo);
  }

  vehiculoActual = {};
  tempArrayChecked = [];
  esMayor = false;
  tempTitleModal = "";
  tempSolicitud = { usuario: null, departamento: null, fecha: null, motivo: null, inicio: null, fin: null, vehiculo: { placa: null, tipo: null, marca: null } }
  eliminar = false;

  handleEvent(action: string, event: CalendarEvent): void {

    this.obtenerUsuarios();
    this.tempColor = event.color;
    this.solicitudVehiculoEdit._id = this.tempColor.id;
    this.activeDayIsOpen=false;

    if (action == "Eliminar") {
      this.eliminarSolicitud();
    }
    else {
      this.tempArrayChecked = []
      this.tempAcompanantes = [];
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


            this.usuariosAgregados = [];

            for (let i = 0; i < this.listaSolicitudes.length; i++) {// Agregar los usuarios que ya la solocitud tiene

              if (this.tempColor.id == this.listaSolicitudes[i]._id) {

                for (var u = 0; u < this.listaSolicitudes[i].acompanantes.length; u++) {
                  this.usuariosAgregados.push(this.listaSolicitudes[i].acompanantes[u]);
                }
              }
            }

            for (let u = 0; u < this.usuariosAgregados.length; u++) { //Eliminar de la lista de usuariosdisponibles, los usuarios que ya la solocitud tiene.
              for (let i = 0; i < this.listaUsuarios.length; i++) {
                if (this.usuariosAgregados[u]._id == this.listaUsuarios[i]._id) {
                  this.listaUsuarios.splice(i, 1);
                }
              }
            }

            for (let i = 0; i < this.vehiculos.length; i++) {// Ordena el vector de vehiculos, poniendo el vehiculo de la solicitud selecionadad de primero.
              if (this.tempColor.vehiculo == this.vehiculos[i].placa) {
                let posicion = this.vehiculos[0];
                this.vehiculos[0] = this.vehiculos[i];
                this.vehiculos[i] = posicion;
                break;
              }
            }

            

            this.eliminarUsuarioActual();
            this._servSolicitud.obtenerSolicitudVehiculo(this.tempColor.id).subscribe(
              response => {
                if (response.message) {
                  let solicit = response.message;
                  this.solicitudVehiculoEdit = solicit;
                  //  this.model = { year: solicit.fecha.year, month: solicit.fecha.month, day: solicit.fecha.day };

                  this.solicitudVehiculoEdit.fecha.year = this.model.year;
                  this.solicitudVehiculoEdit.fecha.month = this.model.month;
                  this.solicitudVehiculoEdit.fecha.day = this.model.day;

                  this.timeI.hour = solicit.horaSalida.hour;
                  this.timeI.minute = solicit.horaSalida.minute;
                  this.timeI.second = solicit.horaSalida.second;

                  this.timeF.hour = solicit.horaRegreso.hour;
                  this.timeF.minute = solicit.horaRegreso.minute;
                  this.timeF.second = solicit.horaRegreso.second;

                  this.solicitudVehiculoEdit.horaSalida = this.timeI;
                  this.solicitudVehiculoEdit.horaRegreso = this.timeF;

                  this.solicitudVehiculoEdit.acompanantes = solicit.acompanantes;           

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
                        // console.log('cliente');
                        // console.log(date);
                        // console.log('servidor')
                        // console.log(serverDate);
                        if (date.getFullYear() < serverDate.getFullYear()) {
                          this.tempEvent = [];
                        } else if (((date.getMonth() + 1) < (serverDate.getMonth() + 1))) {
                          this.tempEvent = [];
                        } else if (((date.getMonth() + 1) == (serverDate.getMonth() + 1))) {
                          if (date.getDate() < serverDate.getDate() || this.minDate.day < serverDate.getDate()) {
                            this.tempEvent = [];
                          } else {

                            this.tempEvent = event.actions;
                          }
                        } else {

                          this.tempEvent = event.actions;

                        }
                      } else {
                      }

                      this.modalData = { event, action };
                      this.mr = this.modal.open(this.modalContent2, { size: 'lg' });
                    }, error => {
                      //ocurrió un error
                    }
                  );
                  //   this.modalData = { event, action };
                  // this.mr=  this.modal.open(this.modalContent, { size: 'lg' });
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

  addEvent(solicitud, isDragable): void {
    ///////////////////////////////////////////////////////////////
    let fechaInicio = new Date();
    fechaInicio.setFullYear(solicitud.fecha.year);
    fechaInicio.setMonth(solicitud.fecha.month - 1);
    fechaInicio.setDate(solicitud.fecha.day);
    fechaInicio.setHours(solicitud.horaSalida.hour);
    fechaInicio.setMinutes(solicitud.horaSalida.minute);

    let fechaFin = new Date();
    fechaFin.setFullYear(solicitud.fecha.year);
    fechaFin.setMonth(solicitud.fecha.month - 1);
    fechaFin.setDate(solicitud.fecha.day);
    fechaFin.setHours(solicitud.horaRegreso.hour);
    fechaFin.setMinutes(solicitud.horaRegreso.minute);

    this.events.push({
      title: solicitud.descripcion + '.       ' + solicitud.horaSalida.hour + ':' + solicitud.horaSalida.minute + ' - ' + solicitud.horaRegreso.hour + ':' + solicitud.horaRegreso.minute + '  ',
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

  eliminarSolicitud() {
    if (this.solicitudVehiculoEdit._id == null || this.solicitudVehiculoEdit._id == "" || this.solicitudVehiculoEdit._id == undefined) {
      this.msjError('La solicitud no puede ser eliminada');

    } else {
      if (this.mr) {
        this.mr.close();
      }

      this.mr = this.modal.open(this.modalDeleteSolicitudVehiculo);
    }

  }

  //llamado al servicio que eliminar solicitud de sala
  confirmEliminar() {
    this._servSolicitud.eliminarSolicitudVehiculo(this.solicitudVehiculoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Solicitud no pudo ser eliminada");
        } else {
          this.msjExitoso("Solicitud eliminada exitosamente");
          this.mr.close();
          this.obtenerSolicitudVehiculos();
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

  cerrar(){
    this.mr.close();
    this.solicSala=true;
    this.activeDayIsOpen=true;
  
  }

  abrir(modal){
    this.mr = this.modal.open(modal,{ backdrop: 'static', keyboard: false,size: 'lg'});
  }


  ///***************************************************METODOS AGREGADOS***********************************

  // cerrarModal(modalId: any) {
  //   $(".modal-backdrop").remove();
  //   $('body').removeClass('modal-open');
  //   $(modalId).removeClass('show');
  //   $(modalId).css('display', 'none');
  //   this.solicSala = true;
  // }

  // abrirModal(modalId: any) {
  //   $('body').append('<div class="modal-backdrop fade show" ></div>');
  //   $('body').addClass('modal-open');
  //   $(modalId).addClass('show');
  //   $(modalId).css('display', 'block');
  // }

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

  ///////////////////////////////////////////////////TIMPE PICKER///////////////////////////////////////////////////////////////////
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
  }

  updateFinishDateOnInput(): void {
  }

  updateDate(): void {
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
        this.solicitudVehiculo.horaRegreso.minute
      ),
      this.solicitudVehiculo.horaRegreso.hour
    );
    console.log(newDate);
    this.onChangeCallback(newDate);
  }
}
